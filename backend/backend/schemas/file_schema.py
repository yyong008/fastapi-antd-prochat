from typing import Optional
from pydantic import BaseModel, ConfigDict

class FileModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    # user_id: str
    # hash: Optional[str] = None

    filename: str
    path: Optional[str] = None

    data: Optional[dict] = None
    meta: Optional[dict] = None

    created_at: Optional[int]  # timestamp in epoch
    updated_at: Optional[int]  # timestamp in epoch
