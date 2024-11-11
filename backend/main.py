from fastapi import FastAPI, HTTPException
from backend.apis.chat import router as chat_router
from backend.apis.langchain_chat import router as langchain_chat_router
from backend.apis.translate import router as translate_router
from backend.apis.embeddings import router as embeddings_router
from backend.apis.knowledge.index import router as knowledge_router
from backend.apis.upload.file import router as file_router

from fastapi.middleware.cors import CORSMiddleware

from backend.exception import http_exception_handler, validation_exception_handler
app = FastAPI(title="FastAPI Antd Chat")

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(HTTPException, validation_exception_handler)

app.include_router(chat_router, prefix="/api")
app.include_router(langchain_chat_router, prefix="/api")
app.include_router(translate_router, prefix="/api")
app.include_router(translate_router, prefix="/api")
app.include_router(embeddings_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")
app.include_router(file_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def start():
  import uvicorn
  uvicorn.run("main:app", reload=True, port=7788)

if __name__ == "__main__":
  start()
