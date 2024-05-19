from fastapi.testclient import TestClient
from .main import app, process_json_file
import json
import time

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
    response = process_json_file(json_bytes)
    assert response == json_data

def wait_job_result(response):
    # waiting the job result
    content = response.content.decode()
    job_id, = json.loads(content).values()
    # waiting the content to be loaded
    time.sleep(1)
    return client.get(f"/job/{str(job_id)}")

def test_upload_fails_malformed():
    # Create a sample JSON file
    json_data = "not a JSON"
    
    json_bytes = json_data.encode()
    response = client.post("/upload", files={"file": ("tasks.json", json_bytes, "application/json")})
    print(response)
    assert response.status_code == 200
    response = wait_job_result(response)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["status"] == "error"
    assert json_response["result"]["status_code"] == 400
    assert json_response["result"]["type"] == "ijson.common.IncompleteJSONError"

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
    assert response.status_code == 200
    response = wait_job_result(response)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["status"] == "error"
    assert json_response["result"]["status_code"] == 400
    assert json_response["result"]["type"] == "AssertionError"


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
    assert response.status_code == 200
    response = wait_job_result(response)
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["status"] == "error"
    assert json_response["result"]["status_code"] == 400
    assert json_response["result"]["type"] == "ValueError"