from fastapi import FastAPI, UploadFile, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import ijson
import json
import os
from pydantic import BaseModel, ValidationError
import queue
import random
import string
import time
from typing import BinaryIO, List, Optional
from uuid import uuid4


data_dir = os.environ.get('PYTHON_DATA_DIR', '/tmp/data')

input_queue = queue.Queue()

task_tree = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: str
    name: str
    isDone: bool
    tasks: Optional[List['Task']] = []
    def to_dict(self): 
        return {
            'name': self.name,
            'id': self.id,
            'isDone': self.isDone,
            'tasks': [task.to_dict() for task in self.tasks]
        }

class TaskList(BaseModel):
    tasks: List['Task'] = []

    def to_dict(self): 
        return {
            'tasks': [task.to_dict() for task in self.tasks]
        }

class TaskBuilder:
    def __init__(self):
        self.parsed_id: str = None
        self.parsed_name:str = None
        self.parsed_isDone:bool = None
        self.tasks: List[TaskBuilder] = []

    def __str__(self):
        return f"id={self.parsed_id}(name={ self.parsed_name}, isDone={self.parsed_isDone})"

    def buildTask(self) -> dict:
        try:
            # validate constraints
            task = Task(id=self.parsed_id, name=self.parsed_name, isDone=self.parsed_isDone)
            return task.to_dict()
        except ValidationError as e:
            raise  AssertionError(f"Task validation error: {str(self)}, {e}")

        
##### Job management
# In-memory store to track job progress
class Job(BaseModel):
    result:dict = None
    status:str = "pending"
    progress:int = 0

    def update_progress(self, progress: int):
        self.progress = progress

    def set_is_done(self):
        self.status = "success"

    def set_error(self, result: dict):
        self.result = result
        self.status = "error"

# FIXME not poping done Job, use a real broker + task queue
jobs: dict[str, Job] = {}

@app.get("/job/{job_id}")
async def get_job(job_id: str) -> Job:
    global jobs
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return jobs[job_id]

def queue_upload(job_id, input_queue):
    global jobs
    if job_id in jobs:
        raise HTTPException(status_code=404, detail=f"Job id {job_id} already in process")
    if input_queue.empty():
        raise HTTPException(status_code=404, detail=f"No file to process")
    file = input_queue.get()
    jobs[job_id] = Job()
    with open(file.name, "rb") as file_content:
        try:
            jobs[job_id].result = process_json_file(file_content)
            jobs[job_id].set_is_done()
        except ijson.common.IncompleteJSONError:
            jobs[job_id].set_error(result={"status_code":400, "type": "ijson.common.IncompleteJSONError", "detail":f"Uploaded file is not a valid JSON"})
        except (ValueError, IndexError) as e:
            jobs[job_id].set_error(result={"status_code":400, "type": "ValueError","detail":f"Error parsing task: {str(e)}"})
        except AssertionError as e:
            jobs[job_id].set_error(result={"status_code":400, "type": "AssertionError","detail":f"{e}"})
           
    os.remove(file.name)

def process_json_file(file_content: BinaryIO):
    global task_tree
    task_tree = TaskList()
    root_tasks = []
    tasks_stack: list[TaskBuilder] = []
    childs_dicts: list[dict[str,Task]] = []
    objects = ijson.parse(file_content)
    for prefix, event, value in objects:
        if event == "start_map" and prefix.endswith("tasks.item"):
            # for now we just know we have a TaskList container to fulfill
            task_builder = TaskBuilder()
            tasks_stack.append(task_builder)
        elif event == "boolean" and prefix.endswith("isDone"):
            tasks_stack[-1].parsed_isDone = value
        elif event == "string" and prefix.endswith("name"):
            tasks_stack[-1].parsed_name = value
        elif event == "string" and prefix.endswith("id"):
            tasks_stack[-1].parsed_id = value
        elif event == "end_map" and tasks_stack:
            task = tasks_stack[-1].buildTask()
            # links task childs
            task["tasks"] = [x["child"] for x in childs_dicts if x["parent"] == task["id"]]
            childs_dicts = [x for x in childs_dicts if x["parent"] != task["id"]]
            # if has a parent, add it to known childs
            if len(tasks_stack) >= 2:
                # TODO implement id unicity check to avoid messing with tree
                childs_dicts.append(dict(parent=tasks_stack[-2].parsed_id,child=task))
            else:
                root_tasks.append(task)
            tasks_stack.pop()
    task_tree.tasks = root_tasks
    limited_tree = load_first_levels()
    return limited_tree 

@app.post("/upload")
async def upload_task_tree(background_tasks: BackgroundTasks, file: UploadFile = None):
    global input_queue
    if not file:
        raise HTTPException(status_code=400, detail=f"No file provided")
    job_id = str(uuid4())
    # write in file system because UploadFile will be flushed soon enough
    with open(f'{data_dir}/upload-tasklist{time.strftime("%Y%m%d-%H%M%S")}.json', "wb") as f:
        upload_content = file.file.read()
        f.write(upload_content)
    input_queue.put(f)
    background_tasks.add_task(queue_upload,job_id, input_queue)
    return {"job_id": job_id}
    

@app.get("/task/{task_id}/load", response_model=Task)
def load_childs(task_id:str):
    return JSONResponse(status_code=status.HTTP_501_NOT_IMPLEMENTED,content="Method to implement")


def load_tasks_chunk(task: Task,max_depth:int) -> Task:
    if max_depth == 0:
        leaf = dict(task)
        leaf["tasks"] = []
        return leaf
    task["tasks"] = [load_tasks_chunk(dict(subtask), max_depth - 1) for subtask in task["tasks"]]
    return task

def load_first_levels():
    global task_tree
    task_tree_limited = dict()
    task_tree_limited["tasks"] = [load_tasks_chunk(dict(task),2) for task in task_tree.tasks]
    return task_tree_limited

@app.get("/generate")
async def generate_tree(background_tasks: BackgroundTasks):
    background_tasks.add_task(write_file)
    return JSONResponse(status_code=status.HTTP_202_ACCEPTED,content="Generation in process")

        
def write_file():
    MAX_DEPTH = 5
    MAX_CHILD_TASKS = 10
    MAX_NAME_LENGTH = 10
    NUM_TASKS = 2
    def generateTask(tasks:list[Task] = []):
        return Task(
            id=str(uuid4()),
            name="".join(random.choices(string.ascii_lowercase, k=MAX_NAME_LENGTH)), 
            isDone=random.choice([True, False]),
            tasks=tasks)
    
    def generate_tasklist(depth=0):
        if depth == MAX_DEPTH:
            return generateTask()
        else:
            return generateTask([generate_tasklist(depth+1) for _ in range(random.randint(1, MAX_CHILD_TASKS))])
    
    tasks = [generate_tasklist() for _ in range(NUM_TASKS)]
    tasklist = TaskList(tasks=tasks)
    json_str = json.dumps(tasklist.to_dict())
    with open(f'{data_dir}/tasklist{time.strftime("%Y%m%d-%H%M%S")}.json', "w") as f:
        f.write(json_str)



    