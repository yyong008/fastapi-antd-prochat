from fastapi import HTTPException
from backend.supabase.supabase_client import supabase_client

class FileDal:
  table_name = "file"


  @classmethod
  def create_file(self, data):
    """插入文件"""
    del data["hash"]
    try:
      response = supabase_client.create_item(self.table_name, data)
      return response
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
    

  @classmethod
  def get_files(self):
    """获取所有文件"""
    try:
      response = supabase_client.table(self.chat_db_name).select("*").execute()
      return response.data
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

  @classmethod
  def get_file_by_id(self, id):
    """根据id获取文件"""
    try:
      response = supabase_client.table(self.chat_db_name).select("*").eq("id", id).execute()
      return response.data[0]
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

  @classmethod
  def get_files_by_ids(self, ids):
    """根据id列表获取文件"""
    try:
      response = supabase_client.get_items_by_ids(self.table_name, ids)
      return response
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

  @classmethod
  def delete_file_by_id(self, id):
    """根据id删除文件"""
    try:
      response = supabase_client.table(self.chat_db_name).delete().eq("id", id).execute()
      return response.data
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
