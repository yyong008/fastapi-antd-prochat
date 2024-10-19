import uuid
from fastapi import APIRouter, BackgroundTasks
from langchain_openai import ChatOpenAI
from backend.services.langchain.langchain_chat_stream import last_chunk_new
from backend.services.langchain.langchain_chat_stream import yield_string
from backend.dals.chat import (
    delete_chat_by_id,
    get_all_chats,
    get_chat_by_id,
    update_chat,
)
from .langchain_chat_stream import generate_stream_new, generate_stream_update
from backend.zhipu_ai.client import client
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from backend.config.config import get_settings

api_key = get_settings().api_key

router = APIRouter()


def create_chat_service(chatIn, background_tasks: BackgroundTasks):
    llm = ChatOpenAI(
        temperature=0.95,
        model="glm-4-flash",
        openai_api_key=api_key,
        openai_api_base="https://open.bigmodel.cn/api/paas/v4/",
    )
    msg = []
    messages = chatIn.messages
    for chat in messages:
        role = chat.role
        if role == "user":
            msg.append(HumanMessage(content=chat.content))
        elif role == "system":
            msg.append(SystemMessage(content=chat.content))
        elif role == 'assistant':
            msg.append(AIMessage(content=chat.content))
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
    data_in_db["title"] = title

    data = update_chat(id, data_in_db)
    return data
