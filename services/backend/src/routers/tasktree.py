from fastapi import APIRouter, Body, HTTPException, UploadFile, HTTPException
from typing import Annotated
import time

from src.structs.task_validator import LazyLoadedNode
from src.constants import DATA_DIR
from src.tasks.tasktree import run_upload_task, run_load_task_childs, run_generate_tree
router = APIRouter()

@router.post("/upload", summary="Upload JSON file")
async def upload_task_tree( file: UploadFile = None):
    if not file:
        raise HTTPException(status_code=400, detail=f"No file provided")

    # write in file system because UploadFile will be flushed soon enough
    with open(f'{DATA_DIR}/upload-tasklist{time.strftime("%Y%m%d-%H%M%S")}.json', "wb") as f:
        upload_content = file.file.read()
        f.write(upload_content)
    result = run_upload_task.delay(f.name)
    return {"job_id": result.task_id}

@router.get("/task/{task_id}/load", response_model=LazyLoadedNode, summary="Fetch task childs")
def load_childs(task_id:str):
    time.sleep(1) # just to enjoy the vue skeleton
    job_result = run_load_task_childs.delay(task_id)
    data = job_result.get()
    return data

@router.post("/generate", summary="Generate JSON task tree with random data")
async def generate_tree(max_depth: Annotated[int, Body()] = 5, max_child_per_task: Annotated[int, Body()] = 10, max_name_length: Annotated[int, Body()] = 10, total_root_task: Annotated[int, Body()] = 5):
    result = run_generate_tree.delay(max_depth, max_child_per_task, max_name_length, total_root_task)
    return {"job_id": result.task_id}