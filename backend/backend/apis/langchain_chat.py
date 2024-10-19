from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse
from backend.services.langchain.langchain_service import create_chat_service, update_chat_service

from backend.schemas.chat import ChatIn
router = APIRouter(prefix="/langchain-chat")



@router.post("/chat")
def chat(chatIn: ChatIn, background_tasks: BackgroundTasks):
    gen = create_chat_service(chatIn, background_tasks)
    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
    )

@router.put("/chat/{id}")
def chat_update(id: str, chatIn: ChatIn, background_tasks: BackgroundTasks):
    gsn = update_chat_service(id, chatIn, background_tasks)
    return StreamingResponse(
        gsn,
        media_type="text/event-stream",
        status_code=200
    )
