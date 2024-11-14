import uuid

from fastapi import APIRouter, BackgroundTasks
from backend.utils.message import format_messages
from backend.langchain.model import create_ollama_chat_models
from backend.services.ollama.ollama_stream import last_chunk_update, last_chunk_new, yield_string

from backend.dals.chat import (
    delete_chat_by_id,
    get_all_chats,
    get_chat_by_id,
    update_chat,
)

from backend.config.config import get_settings

api_key = get_settings().api_key

router = APIRouter()


def create_chat_service(model_name, chatIn, background_tasks: BackgroundTasks):
    llm = create_ollama_chat_models(model_name=model_name) 
    msg = format_messages(chatIn.messages)
    gsn = llm.stream(msg)

    def gen():
        content_in_db = ""
        chat_id: None | str = None
        for chunk in gsn:
            content_in_db += chunk.content
            if not chat_id:
              chat_id = str(uuid.uuid4())
            last_chunk_new(
                chunk, chat_id, msg, background_tasks, content_in_db
            )
            yield yield_string(chat_id=chat_id, content=chunk.content, role="assistant")

    return gen


def update_chat_service(id, model_name, chatIn, background_tasks: BackgroundTasks):
    llm = create_ollama_chat_models(model_name=model_name)
    msg = format_messages(chatIn.messages)
    gsn = llm.stream(msg)

    def gen():
        content_in_db = ""
        chat_id: None | str = id
        for chunk in gsn:
            content_in_db += chunk.content
            last_chunk_update(
                chunk, chat_id, msg, background_tasks, content_in_db
            )
            yield yield_string(chat_id=chat_id, content=chunk.content, role="assistant")

    return gen


def get_all_chats_service():
    data = get_all_chats()
    return data


def get_chat_by_id_service(id: str):
    data = get_chat_by_id(id)
    return data


def delete_chat_by_id_service(id: str):
    data = delete_chat_by_id(id)
    return data


def update_chat_title_service(id: str, title: str):
    data_in_db = get_chat_by_id(id)
    data_in_db["title"] = title

    data = update_chat(id, data_in_db)
    return data
