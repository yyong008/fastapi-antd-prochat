from fastapi import APIRouter

router = APIRouter("/upload")


@router.post("/file")
async def upload_file():
    pass
