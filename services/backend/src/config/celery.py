
from celery import Celery
from celery.result import AsyncResult
import os

CELERY_BROKER_URL: str = os.environ.get("CELERY_BROKER_URL", "amqp://guest:guest@rabbitmq:5672//")# RabbitMq broker config
CELERY_RESULT_BACKEND: str = os.environ.get("CELERY_RESULT_BACKEND", "rpc://") # TODO redis to make tasks persistent

celeryapp =  Celery('tasktree',
                broker="amqp://guest:guest@rabbitmq:5672//",
                backend=CELERY_RESULT_BACKEND,
                include=['src.tasks.tasktree'])

def get_task_info(task_id):
    """
    return task info for the given task_id
    """
    task_result = celeryapp.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "task_status": task_result.status, # PENDING means also "UNKNOWN"
        "task_result": task_result.get() if  task_result.ready() else None
    }

if __name__ == '__main__':
    celeryapp.start()

