from fastapi import APIRouter
from backend.services.knowledge_service import KnowledgeService
from backend.schemas.knowledge_schema import KnowledgeIn


router = APIRouter(prefix="/knowledge", tags=["Knownledge"])


@router.get("/")
async def get_knowledges():
    data = KnowledgeService.get_knowledges_service()
    return data

@router.get("/{id}")
async def get_knowledge_by_id(id: str):
    data = KnowledgeService.get_knowledge_by_id_service(id)
    return data

@router.post("/")
async def create_knowledge(kl: KnowledgeIn):
    data = KnowledgeService.create_knowledge_service(kl)
    return data


@router.put("/{id}")
async def update_knowledge():
    return {"message": "Knowledge API"}


@router.post("/{id}/file/add")
async def add_file_to_knowledge(id: str, data: dict):
    """添加文件到知识库"""
    data = KnowledgeService.add_file_to_knowledge_service(id, data["id"])
    return data


@router.delete("/{id}")
async def delete_knowledge(id: str):
    """删除知识库"""
    data = KnowledgeService.delete_knowledge_by_id_service(id)
    return data
