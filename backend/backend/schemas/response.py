from typing import Optional, Any
from pydantic import BaseModel


class ResponseModel(BaseModel):
    code: Optional[int] = None
    data: Optional[Any] = None
    message: Optional[str] = None


class ResponseSuccessModel(ResponseModel):
    code: Optional[int] = 0
    data: Optional[Any] = {}
    message: Optional[str] = "success"
