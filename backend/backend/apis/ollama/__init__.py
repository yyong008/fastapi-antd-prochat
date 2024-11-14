from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse
from backend.services.ollama.ollama_service import (
    create_chat_service,
    update_chat_service,
)

from backend.schemas.chat import ChatIn

import ollama

router = APIRouter(prefix="/ollama-chat", tags=["ollama-chat"])


@router.post("/chat")
def chat(model_name: str, chatIn: ChatIn, background_tasks: BackgroundTasks):
    gen = create_chat_service(
        model_name=model_name, chatIn=chatIn, background_tasks=background_tasks
    )
    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
    )


@router.put("/chat/{id}")
def chat_update(
    id: str, model_name: str, chatIn: ChatIn, background_tasks: BackgroundTasks
):
    gsn = update_chat_service(
        id=id, model_name=model_name, chatIn=chatIn, background_tasks=background_tasks
    )
    return StreamingResponse(gsn(), media_type="text/event-stream", status_code=200)


@router.get("/models")
def ollama_list():
    return ollama.list()
