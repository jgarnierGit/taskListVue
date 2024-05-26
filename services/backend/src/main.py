from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers.jobs import router as job
from src.routers.tasktree import router as task_tree

app = FastAPI()
app.include_router(job, prefix="")
app.include_router(task_tree, prefix="")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
