from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import List, Optional
import ijson

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
            raise HTTPException(status_code=400, detail=f"Task validation error: {str(self)}, {e}")


@app.post("/upload", response_model=TaskList)
def upload_task_tree(file: UploadFile = None):
    global task_tree
    if not file:
        raise HTTPException(status_code=400, detail=f"No file provided")
    task_tree = TaskList()
    try:
        root_tasks = []
        tasks_stack: list[TaskBuilder] = []
        childs_dicts: list[dict[str,Task]] = []

        objects = ijson.parse(file.file)
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
    except ijson.common.IncompleteJSONError:
        raise HTTPException(status_code=400, detail=f"Uploaded file is not a valid JSON: {str(objects)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Error parsing task: {str(e)}")

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
 