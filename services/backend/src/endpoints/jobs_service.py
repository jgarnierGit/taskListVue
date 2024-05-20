from fastapi import APIRouter, HTTPException
from src.models.job_scheduler import Job
import ijson
import os

router = APIRouter()

# FIXME not poping done Job, use a real broker + task queue
jobs: dict[str, Job] = {}

@router.get("/job/{job_id}", summary="Get job for job_id")
async def get_job(job_id: str) -> Job:
    global jobs
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
    return jobs[job_id]

def queue_upload_file(job_id, input_queue, callback):
    """
        Add upload file callback to the job queue.
        Expecting to find one file to process in input_queue
    """
    global jobs
    if job_id in jobs:
        raise HTTPException(status_code=404, detail=f"Job id {job_id} already in process")
    if input_queue.empty():
        raise HTTPException(status_code=404, detail=f"No file to process")
    file = input_queue.get()
    jobs[job_id] = Job()
    with open(file.name, "rb") as file_content:
        try:
            jobs[job_id].result = callback(file_content)
            jobs[job_id].set_is_done()
        except ijson.common.IncompleteJSONError:
            jobs[job_id].set_error(result={"status_code":400, "type": "ijson.common.IncompleteJSONError", "detail":f"Uploaded file is not a valid JSON"})
        except ValueError as e:
            jobs[job_id].set_error(result={"status_code":400, "type": "ValueError","detail":f"Error parsing task: {str(e)}"})
        except IndexError as e:
            jobs[job_id].set_error(result={"status_code":400, "type": "IndexError","detail":f"Error parsing task: {str(e)}"})
        except AssertionError as e:
            jobs[job_id].set_error(result={"status_code":400, "type": "AssertionError","detail":f"{e}"})
           
    os.remove(file.name)