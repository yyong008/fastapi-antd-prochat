import json
import uuid

from backend.dals.chat import create_chat, update_chat

def store_db_new(chat_id, chat_content):
    data = {"id": chat_id, "title": "New Chat", "chat": chat_content}
    create_chat(data)


def store_db_update(chat_id, chat_content):
    data = {"title": "New Chat", "chat": chat_content}
    update_chat(chat_id, data)


def last_chunk_new(chunk, chat_id, messages, background_tasks, content_in_db):
    if chunk.choices[0].finish_reason == "stop":
        msgs = []
        for m in messages:
            mm = m.model_dump()
            if not hasattr(mm, "id"):
                mm["id"] = chat_id
            msgs.append(mm)
        msgs.append({"id": chat_id, "role": "assistant", "content": content_in_db})
        chat_content = f"{json.dumps(msgs)}"
        background_tasks.add_task(store_db_new, chat_id, chat_content)
        return
    return

def last_chunk_update(chunk, chat_id, messages, background_tasks, content_in_db):
    if chunk.choices[0].finish_reason == "stop":
        msgs = []
        for m in messages:
            mm = m.model_dump()
            if not hasattr(mm, "id"):
                mm["id"] = chat_id
            msgs.append(mm)
        msgs.append({"id": chat_id, "role": "assistant", "content": content_in_db})
        chat_content = f"{json.dumps(msgs)}"
        background_tasks.add_task(store_db_update, chat_id, chat_content)
        return
    return


def generate_stream_new(
    response,
    background_tasks,
    messages,
):
    content_in_db = ""
    chat_id: None | str = None
    for chunk in response:
        if chunk.choices[0].delta:
            delta = chunk.choices[0].delta
            content_in_db += delta.content
            if not hasattr(delta, "id") and not chat_id:
                chat_id = str(uuid.uuid4())
            
            last_chunk_new(
                chunk, chat_id, messages, background_tasks, content_in_db
            )
            yield yield_string(chat_id, delta.content, delta.role)


def generate_stream_update(
    response,
    background_tasks,
    messages,
    chat_id: str,
):
    content_in_db = ""
    for chunk in response:
        if chunk.choices[0].delta:
            delta = chunk.choices[0].delta
            content_in_db += delta.content
            last_chunk_update(chunk, chat_id, messages, background_tasks, content_in_db)
            yield yield_string(chat_id, delta.content, delta.role)


def yield_string(chat_id, content, role):
    data = {"id": chat_id, "content": content, "role": role}
    stream_response_data = f"data: {json.dumps(data)}\n\n"
    return stream_response_data
