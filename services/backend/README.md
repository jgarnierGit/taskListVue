# Installation

If you don't want to run via [Docker compose configuration](/README.md), please follow steps bellow

## Requirements 

python 3.9
pip

```bash
RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt # run deps
RUN pip install --no-cache-dir --upgrade -r /app/requirements_dev.txt # run this line to install dev deps
```

# Run application

```bash
python3 -m uvicorn src.main:app --host 0.0.0.0 --port 5000
```

# Run application in dev mode

```bash
python3 -m uvicorn src.main:app --reload --host 0.0.0.0 --port 5000
```

# Run in debug mode

```bash
python3 -m debugpy --listen 0.0.0.0:5678 -m uvicorn src.main:app --reload --host 0.0.0.0 --port 5000
```