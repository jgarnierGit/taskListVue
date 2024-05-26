from fastapi.testclient import TestClient
import unittest
from ..main import app
import json
import time
from src.structs.task_validator import LazyLoadedNode

client = TestClient(app)

def wait_job_result(response):
    # waiting the job result
    content = response.content.decode()
    job_id, = json.loads(content).values()
    # waiting the content to be loaded
    time.sleep(1)
    return client.get(f"/job/{str(job_id)}")

class TestTaskTree(unittest.TestCase):
    def test_upload_correct(self):
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
        response = wait_job_result(response)
        assert response.status_code == 200
        json_response = response.json()
        assert json_response["status"] == "success"
        validated_struct = LazyLoadedNode(**json_response["result"])
        assert validated_struct.to_dict() == json_response["result"]

    def test_upload_fails_malformed(self):
        # Create a sample JSON file
        json_data = "not a JSON"

        json_bytes = json_data.encode()
        response = client.post("/upload", files={"file": ("tasks.json", json_bytes, "application/json")})
        assert response.status_code == 200
        response = wait_job_result(response)
        assert response.status_code == 200
        json_response = response.json()
        assert json_response["status"] == "error"
        assert json_response["result"]["status_code"] == 400
        assert json_response["result"]["type"] == "ijson.common.IncompleteJSONError"

    def test_upload_fails_required(self):
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


    def test_upload_fails_root_malformed(self):
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
        assert json_response["result"]["type"] == "IndexError"

    def test_lazy_load_leaf(self):
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
                  "tasks": [
                      {
                      "id": "7c8ecb61-54ba-43a8-8f95-dab0296f4481",
                      "name": "subs",
                      "tasks": [
                        {
                          "id": "aebe9b58-e30e-4e4b-a034-9e78ba72d1ac",
                          "name": "subs",
                          "tasks": [
                              
                          ],
                          "isDone": False
                        }
                      ],
                      "isDone": False
                    }
                  ],
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
        assert json_response["status"] == "success"
        validated_struct = LazyLoadedNode(**json_response["result"])
        assert validated_struct.lazyLoadedIds == ["dbeb1072-1d13-461d-80e8-5686260188a9"]
        # should has leaf
        response = client.get("/task/dbeb1072-1d13-461d-80e8-5686260188a9/load")
        assert response.status_code == 200
        json_child_response = response.json()
        validated_child_struct = LazyLoadedNode(**json_child_response)
        assert validated_child_struct.lazyLoadedIds == ["7c8ecb61-54ba-43a8-8f95-dab0296f4481"]
        #should be leaf
        response = client.get("/task/7c8ecb61-54ba-43a8-8f95-dab0296f4481/load")
        assert response.status_code == 200
        json_child_response = response.json()
        validated_child_struct = LazyLoadedNode(**json_child_response)
        assert validated_child_struct.lazyLoadedIds == []