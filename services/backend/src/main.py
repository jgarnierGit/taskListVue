from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.endpoints.jobs_service import router as job_router
from src.endpoints.tasktree_service import router as task_tree_service

app = FastAPI()
app.include_router(job_router, prefix="")
app.include_router(task_tree_service, prefix="")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



    