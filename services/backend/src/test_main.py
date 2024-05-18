from fastapi.testclient import TestClient
from .main import app, TaskList, Task
import json

client = TestClient(app)

def test_upload():
    # Create a sample JSON file
    json_data = {
      "tasks": [
        {
          "id": "4dbe9968-93dd-4e67-8625-c575ed6a8412",
          "name": "toto",
          "tasks": [
            {
              "id": "dbeb1072-1d13-461d-80e8-5686260188a9",
              "name": "yes",
              "tasks": [],
              "isDone": False
            }
          ],
          "isDone": False
        },
        {
          "id": "1d6a5d3d-cd61-4b6c-8e79-2fb3f1d3d3df",
          "name": "New task",
          "tasks": [],
          "isDone": True
        }
      ]
    }
    
    json_bytes = json.dumps(json_data).encode()
    response = client.post("/upload", files={"file": ("tasks.json", json_bytes, "application/json")})
    assert response.status_code == 200
    assert response.json() == json_data

def test_upload_fails_malformed():
    # Create a sample JSON file
    json_data = "not a JSON"
    
    json_bytes = json_data.encode()
    response = client.post("/upload", files={"file": ("tasks.json", json_bytes, "application/json")})
    assert response.status_code == 400

def test_upload_fails_required():
    # Create a sample JSON file
    json_data = {
      "tasks": [
        {
          # missing id
          "name": "toto",
          "tasks": [
            {
              "id": "dbeb1072-1d13-461d-80e8-5686260188a9",
              "name": "yes",
              "tasks": [],
              "isDone": False
            }
          ],
          "isDone": False
        },
        {
          "id": "1d6a5d3d-cd61-4b6c-8e79-2fb3f1d3d3df",
          "name": "New task",
          "tasks": [],
          "isDone": True
        }
      ]
    }
    
    json_bytes = json.dumps(json_data).encode()
    response = client.post("/upload", files={"file": ("tasks.json", json_bytes, "application/json")})
    assert response.status_code == 400

def test_upload_fails_root_malformed():
    # Create a sample JSON file
    json_data = {
        # should be "tasks"
      "tas": [
        {
          "id": "4dbe9968-93dd-4e67-8625-c575ed6a8412",
          "name": "toto",
          "tasks": [
            {
              "id": "dbeb1072-1d13-461d-80e8-5686260188a9",
              "name": "yes",
              "tasks": [],
              "isDone": False
            }
          ],
          "isDone": False
        },
        {
          "id": "1d6a5d3d-cd61-4b6c-8e79-2fb3f1d3d3df",
          "name": "New task",
          "tasks": [],
          "isDone": True
        }
      ]
    }
    
    json_bytes = json.dumps(json_data).encode()
    response = client.post("/upload", files={"file": ("tasks.json", json_bytes, "application/json")})
    assert response.status_code == 400