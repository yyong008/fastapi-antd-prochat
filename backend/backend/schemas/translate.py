from pydantic import BaseModel
from typing import List

class TanslateIn(BaseModel):
    content: str
    content_t: str
    lang_from: str
    lang_to: str
