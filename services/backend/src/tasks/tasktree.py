from src.config.celery import celeryapp
from celery.signals import task_postrun

@celeryapp.task
def divide(x, y):
    import time
    time.sleep(5)
    return x / y

@task_postrun.connect(sender=divide)
def task_postrun_notifier(sender=None, **kwargs):
    print("From task_postrun_notifier ==> Ok, done!")