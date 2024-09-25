from pydantic import BaseModel
from typing import List

class ChatInOld(BaseModel):
    content: str

class MessageItem(BaseModel):
    id: str
    role: str
    content: str

class ChatIn(BaseModel):
    messages: List[MessageItem]

class ChatInTitle(BaseModel):
    title: str
