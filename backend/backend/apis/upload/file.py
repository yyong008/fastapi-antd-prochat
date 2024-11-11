from fastapi import APIRouter, File, HTTPException, UploadFile
from backend.utils.pdf import extract_text_from_pdf
from backend.services.file_service import FileService
import uuid
import hashlib

router = APIRouter(prefix="/upload", tags=["Upload"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 设置最大文件大小为 2MB

@router.post("/file")
async def upload_file(file: UploadFile = File(...)):

    file_size = file.size  # 获取文件大小

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="文件大小不能超过 2MB")

    id = str(uuid.uuid4())
    file_name = f"{id}_{file.filename}"
    collection_name = f"file-{id}"
    path = f"/static/upload/{file_name}"

    with open(f".{path}", "wb") as f:
        content = await file.read()
        f.write(content)

    

    if file.content_type == "application/pdf":
        content_str = extract_text_from_pdf(content)
    else:
        try:
            content_str = content.decode("utf-8")
        except UnicodeDecodeError:
            content_str = content.decode("gbk")
        except UnicodeDecodeError:
            content_str = content.decode("latin-1")

    _data = {
        "id": id,
        "filename":  file_name,
        "hash": hashlib.sha256(content).hexdigest(),
        "data": {
            "content": content_str
        },
        "meta": {
            "collection_name": collection_name,
            "content_type": file.content_type,
            "name": file.filename,
            "size": file.size
        }
    }
    # 添加到数据库
    FileService.create_file_service(_data)

    return _data
