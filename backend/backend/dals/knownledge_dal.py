from fastapi import HTTPException
from backend.supabase.supabase_client import supabase_client

class KnownledgeDal:
  chat_db_name = "knowledge"

  @classmethod
  def create_knowledge(self, data):
    """创建知识库"""
    try:
      response = supabase_client.create_item(self.chat_db_name, data)
      return response
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
  
  @classmethod
  def get_knowledges(self):
    """获取知识库"""
    try:
      response = supabase_client.get_all_items(self.chat_db_name)
      return response
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

  @classmethod
  def get_knowledge_by_id(self, id):
    """根据id获取知识库"""
    try:
      response = supabase_client.get_item_by_id(self.chat_db_name, id)
      return response
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
    
  
  @classmethod
  def delete_knowledge_by_id(self, id):
    """根据id删除知识库"""
    try:
      response = supabase_client.delete_item(self.chat_db_name, id)
      return response.data
    except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))

  @classmethod
  def add_file_to_knowledge(self, knowledge_id, file_id):
    try:
      file = supabase_client.get_item_by_id("file",file_id)
      kl = supabase_client.get_item_by_id(self.chat_db_name, knowledge_id)
      if kl['data'] is None or kl['data']['file_ids'] is None and kl['data']['file_ids'] == []:
        print(file["id"])
        kl['data'] = { 'file_ids': [file["id"]] }
      else:
        if file['id'] not in kl['data']['file_ids']:
          kl['data']['file_ids'].append(file["id"])
      response = supabase_client.update_item(self.chat_db_name, knowledge_id, kl)
      return response
    except Exception as e:
      print(e)
      raise HTTPException(status_code=500, detail=str(e))
