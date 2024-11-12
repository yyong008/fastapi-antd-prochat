from fastapi import HTTPException, status
from backend.dals.file_dal import FileDal
from backend.dals.knownledge_dal import KnownledgeDal

import uuid

class KnowledgeService:
    @classmethod
    def create_knowledge_service(self, knowledgeIn):
        """创建知识库"""
        try:
            data = {
                "id": str(uuid.uuid4()),
                **knowledgeIn.model_dump(),
            }
            return KnownledgeDal.create_knowledge(data=data)
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error creating knowledge: {e}",
            )

    @classmethod
    def get_knowledges_service(self):
        """获取知识库列表"""
        try:
            return KnownledgeDal.get_knowledges()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error getting knowledge: {e}",
            )

    @classmethod
    def get_knowledge_by_id_service(self, id):
        """获取知识库详情"""
        try:
            info = KnownledgeDal.get_knowledge_by_id(id=id)
            if info['data'] is not None and info['data']['file_ids'] != []:
               files = FileDal.get_files_by_ids(ids=info["data"]["file_ids"])
            else:
                files = []
# 
            return {"info": info, "files": files}
        except Exception as e:
            print(e)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error getting knowledge: {e}",
            )

    @classmethod
    def delete_knowledge_by_id_service(self, id):
        """删除知识库"""
        try:
            return KnownledgeDal.delete_knowledge_by_id(id=id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error deleting knowledge: {e}",
            )

    @classmethod
    def add_file_to_knowledge_service(self, knowledge_id, file_id):
        """添加文件到知识库"""
        try:
            return KnownledgeDal.add_file_to_knowledge(knowledge_id=knowledge_id, file_id=file_id)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error adding file to knowledge: {e}",
            )
