from fastapi import HTTPException
from backend.supabase.supabase_client import supabase_client

chat_db_name = "chat_test"


def create_chat(data):
    try:
        data = supabase_client.create_item(chat_db_name, data)
        return data
    except Exception as e:
        print(e)
        return {"error": str(e)}

def update_chat(chat_id: int, data):
    try:
        data = supabase_client.update_item(chat_db_name, chat_id, data)
        return data
    except Exception as e:
        print(e)
        return {"error": str(e)}

def get_all_chats():
    data = supabase_client.get_all_items(chat_db_name)
    return data

def get_chat_by_id(id):
    try:
        data = supabase_client.get_item_by_id(chat_db_name, id)
        return data
    except Exception as e:
        raise HTTPException(404, str(e))

def delete_chat_by_id(id):
    data = supabase_client.delete_item(chat_db_name, id)
    return data
