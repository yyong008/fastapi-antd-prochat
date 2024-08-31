from pydantic import BaseModel

class ChatIn(BaseModel):
    content: str
