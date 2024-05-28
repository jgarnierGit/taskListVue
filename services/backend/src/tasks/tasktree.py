from src.config.celery import celeryapp
from src.controllers.tasktree_ctr import process_json_file, load_task_childs
from celery.signals import task_postrun

import os

@celeryapp.task
def run_upload_task(fileName):
    """
        Add upload file callback to the job queue.
        Expecting to find one file to process in input_queue
    """
    try:
        with open(fileName, "rb") as file_content:
            return process_json_file(file_content)
    finally:
        os.remove(fileName)

@task_postrun.connect(sender=run_upload_task)
def task_postrun_notifier(sender=None, **kwargs):
    print("From task_postrun_notifier ==> Ok, done!")

@celeryapp.task
def run_load_task_childs(task_id: str):
    return load_task_childs(task_id)