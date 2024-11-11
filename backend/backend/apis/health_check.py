from fastapi import APIRouter


router = APIRouter()

@router.get("/health")
async def healthcheck():
    return {"status": True}


# @router.get("/health/db")
# async def healthcheck_with_db():
#     return {"status": True}
