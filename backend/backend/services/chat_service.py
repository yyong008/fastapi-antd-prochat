from fastapi import APIRouter, BackgroundTasks
from backend.dals.chat import delete_chat_by_id, get_all_chats, get_chat_by_id, update_chat
from .chat_stream import generate_stream_new, generate_stream_update
from backend.zhipu_ai.client import client

router = APIRouter()


def create_chat_service(chatIn, background_tasks: BackgroundTasks):
    model = "glm-4-flash"
    messages = chatIn.messages
    response = client.chat.completions.create(
        model=model,
        messages=[message.model_dump() for message in messages],
        stream=True,
    )
    return generate_stream_new(response, background_tasks, messages)


def update_chat_service(id, chatIn, background_tasks: BackgroundTasks):
    model = "glm-4-flash"
    messages = chatIn.messages
    response = client.chat.completions.create(
        model=model,
        messages=[message.model_dump() for message in messages],
        stream=True,
    )
    return generate_stream_update(response, background_tasks, messages, id)


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
    data_in_db['title'] = title

    data = update_chat(id, data_in_db)
    return data
