from pydantic import BaseModel, ConfigDict
from typing import Optional

class KnowledgeModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    # user_id: str

    name: str
    description: str

    data: Optional[dict] = None
    meta: Optional[dict] = None

    created_at: int  # timestamp in epoch
    updated_at: int  # timestamp in epoch


class KnowledgeIn(BaseModel):
    name: str
    description: str
