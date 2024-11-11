from fastapi import HTTPException, status
from backend.dals.file_dal import FileDal

class FileService:
  @classmethod
  def create_file_service(self, knowledgeIn):
        """创建知识库"""
        try:
            return FileDal.create_file(data=knowledgeIn)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error creating knowledge: {e}",
            )

  @classmethod
  def get_files_service(self):
        """获取所有知识库"""
        try:
            return FileDal.get_knowledges()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error getting knowledges: {e}",
            )

  @classmethod
  def get_file_by_id_service(self, id):
        """根据id获取知识库"""
        try:
            return FileDal.get_knowledge_by_id(id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error getting knowledge: {e}",
            )

  @classmethod
  def delete_file_by_id_service(self, id):
        """根据id删除知识库"""
        try:
            return FileDal.delete_knowledge_by_id(id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error deleting knowledge: {e}",
            )
        