from pydantic import BaseModel

class Job(BaseModel):
    """
        In-memory store to track job progress
    """
    result:dict = None
    status:str = "pending"
    progress:int = 0

    def update_progress(self, progress: int):
        self.progress = progress

    def set_is_done(self):
        self.status = "success"

    def set_error(self, result: dict):
        self.result = result
        self.status = "error"
