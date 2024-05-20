from fastapi import APIRouter, HTTPException, UploadFile, HTTPException, BackgroundTasks, status
from fastapi.responses import JSONResponse
import queue
import time
from uuid import uuid4

from src.models.task_validator import LazyLoadedNode
from src.endpoints.jobs_service import queue_upload_file
from src.constants import DATA_DIR
from src.controllers.tasktree_ctr import load_task_childs, process_json_file, write_file

router = APIRouter()

input_queue = queue.Queue()

@router.post("/upload", summary="Upload JSON file")
async def upload_task_tree(background_tasks: BackgroundTasks, file: UploadFile = None):
    global input_queue
    if not file:
        raise HTTPException(status_code=400, detail=f"No file provided")
    job_id = str(uuid4())
    # write in file system because UploadFile will be flushed soon enough
    with open(f'{DATA_DIR}/upload-tasklist{time.strftime("%Y%m%d-%H%M%S")}.json', "wb") as f:
        upload_content = file.file.read()
        f.write(upload_content)
    input_queue.put(f)
    background_tasks.add_task(queue_upload_file,job_id, input_queue, process_json_file)
    return {"job_id": job_id}
    

@router.get("/task/{task_id}/load", response_model=LazyLoadedNode, summary="Fetch task childs")
def load_childs(task_id:str):
    time.sleep(1) # just to enjoy the vue skeleton
    return load_task_childs(task_id) 

@router.get("/generate", summary="Generate JSON task tree with random data")
async def generate_tree(background_tasks: BackgroundTasks):
    background_tasks.add_task(write_file)
    return JSONResponse(status_code=status.HTTP_202_ACCEPTED,content="Generation in process")

        

