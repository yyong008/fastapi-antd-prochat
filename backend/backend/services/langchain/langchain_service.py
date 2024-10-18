from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse

from backend.schemas.chat import ChatIn, ChatInTitle
from backend.schemas.response import ResponseModel, ResponseSuccessModel
from backend.services.langchain.langchain_service import (
    create_chat_service,
    delete_chat_by_id_service,
    get_all_chats_service,
    get_chat_by_id_service,
    update_chat_service,
    update_chat_title_service,
)

router = APIRouter(prefix='langchain', tags=["langchain"])


@router.post("/langchain/chat")
def chat(chatIn: ChatIn, background_tasks: BackgroundTasks):
    gsn = create_chat_service(chatIn, background_tasks)
    return StreamingResponse(
        gsn,
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


@router.get("/chats", response_model=ResponseModel)
def get_all_chats_list():
    data = get_all_chats_service()
    return ResponseSuccessModel(data=data)


@router.get("/chat/{id}", response_model=ResponseModel)
def get_chat(id: str):
    data = get_chat_by_id_service(id)
    return ResponseSuccessModel(data=data)


@router.delete("/chat/{id}", response_model=ResponseModel)
def delete_chat_by_id(id: str):
    data = delete_chat_by_id_service(id)
    return ResponseSuccessModel(data=data)

@router.put("/chat/{id}/title")
def chat_update_title(id: str, title: ChatInTitle):
    data = update_chat_title_service(id, title.title)
    return ResponseSuccessModel(data=data)
