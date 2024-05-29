from fastapi import APIRouter
from src.config.celery import get_task_info, revoke


router = APIRouter()

@router.get("/job/{job_id}", summary="Get job for job_id")
async def get_job(job_id: str):
    print(f"retreiving job{job_id}")
    return get_task_info(job_id)

@router.delete("/job/{job_id}")
async def cancel_job(job_id: str):
    """
    Cancel a Celery task given its task ID.
    """
    return revoke(job_id)
