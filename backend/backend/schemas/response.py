from typing import Optional, Any
from pydantic import BaseModel


class RM(BaseModel):
    code: Optional[int] = None
    data: Optional[Any] = None
    message: Optional[str] = None


class RMS(RM):
    code: Optional[int] = 0
    data: Optional[Any] = {}
    message: Optional[str] = "success"
