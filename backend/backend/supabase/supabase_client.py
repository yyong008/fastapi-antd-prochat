from typing import Any, Dict, List
from supabase import create_client, Client

from backend.config.config import get_settings

settings = get_settings()

url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_KEY

class SupabaseClient:
    def __init__(self, url: str, key: str):
        self.supabase: Client = create_client(url, key)

    def create_item(self, table: str, data: Dict[str, Any]):
        response = self.supabase.table(table).insert(data).execute()
        return response.data[0]

    def get_all_items(self, table: str) -> List[Dict[str, Any]]:
        response = self.supabase.table(table).select("*").order('created_at', desc=True) .execute()
        return response.data

    def get_item_by_id(self, table: str, item_id: int) -> Dict[str, Any]:
        response = (
            self.supabase.table(table).select("*").eq("id", item_id).single().execute()
        )

        return response.data

    def update_item(
        self, table: str, item_id: int, data: Dict[str, Any]
    ) -> Dict[str, Any]:
        response = self.supabase.table(table).update(data).eq("id", item_id).execute()
        return response.data[0]

    def delete_item(self, table: str, item_id: int) -> None:
        response = self.supabase.table(table).delete().eq("id", item_id).execute()
        return response


supabase_client = SupabaseClient(url, key)
