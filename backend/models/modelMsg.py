from pydantic import BaseModel

class MessageRequest(BaseModel):
    to: str
    message: str