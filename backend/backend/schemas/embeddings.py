from pydantic import BaseModel
from typing import List

class EmbeddingsIn(BaseModel):
    question: str
