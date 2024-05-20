from pydantic import BaseModel, ValidationError
from typing import List, Optional, Union

class Task(BaseModel):
    id: str
    name: str
    isDone: bool
    tasks: Optional[List['Task']] = []
    def to_dict(self): 
        return {
            'name': self.name,
            'id': self.id,
            'isDone': self.isDone,
            'tasks': [task.to_dict() for task in self.tasks]
        }

class TaskList(BaseModel):
    tasks: List['Task'] = []

    def to_dict(self): 
        return {
            'tasks': [task.to_dict() for task in self.tasks]
        }
    
class LazyLoadedNode(BaseModel):
   tree:TaskList
   lazyLoadedIds: List[str]
   def to_dict(self): 
        return {
            'tree': self.tree.to_dict(),
            'lazyLoadedIds': self.lazyLoadedIds
        }

class TaskBuilder:
    def __init__(self):
        self.parsed_id: str = None
        self.parsed_name:str = None
        self.parsed_isDone:bool = None
        self.tasks: List[TaskBuilder] = []

    def __str__(self):
        return f"id={self.parsed_id}(name={ self.parsed_name}, isDone={self.parsed_isDone})"

    def buildTask(self) -> dict:
        try:
            # validate constraints
            task = Task(id=self.parsed_id, name=self.parsed_name, isDone=self.parsed_isDone)
            return task.to_dict()
        except ValidationError as e:
            raise  AssertionError(f"Task validation error: {str(self)}, {e}")

        