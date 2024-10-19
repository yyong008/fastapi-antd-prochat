from backend.dals.chat import create_chat, update_chat

def store_db_new(chat_id: int, chat_content: str, title: str = "New Chat"):
    data = {"id": chat_id, "title": title, "chat": chat_content}
    create_chat(data)


def store_db_update(chat_id: int, chat_content: str):
    data = {"title": "New Chat", "chat": chat_content}
    update_chat(chat_id, data)
