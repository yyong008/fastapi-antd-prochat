from fastapi import FastAPI
from backend.apis.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="FastAPI Antd Chat")

app.include_router(chat_router, prefix="/api")

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
