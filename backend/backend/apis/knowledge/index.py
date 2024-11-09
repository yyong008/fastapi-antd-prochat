from fastapi import APIRouter

router = APIRouter("/knowledge")


@router.get("/")
async def get_knowledges():
    return {"message": "Knowledge API"}


@router.post("/")
async def create_knowledge():
    return {"message": "Knowledge API"}


@router.put("/{id}")
async def update_knowledge():
    return {"message": "Knowledge API"}


@router.get("/{id}/file/add")
async def add_file():
    """添加文件到知识库"""
    return {"message": "Knowledge API"}


@router.delete("/")
async def delete_knowledge():
    return {"message": "Knowledge API"}
