#!/bin/bash

# turn on bash's job control
set -m

# start server
python3 -m debugpy --listen 0.0.0.0:5678 -m uvicorn src.main:app --reload --host 0.0.0.0 --port 5000 &
# # start Celery worker
python3 -m debugpy --listen 0.0.0.0:6900 -m celery -A src.config.celery worker --loglevel=INFO 2>&1 &
# # start monitoring Celery with flower
celery -A src.config.celery flower --loglevel=INFO 2>&1 &
# bring the primary process back into the foreground
fg %1
