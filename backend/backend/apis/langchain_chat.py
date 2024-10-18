from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

from backend.services.langchain.langchain_chat_stream import yield_string
from backend.schemas.chat import ChatIn, ChatInTitle
from backend.schemas.response import ResponseModel, ResponseSuccessModel
from backend.config.config import get_settings
router = APIRouter(prefix="/langchain-chat")




api_key = get_settings().api_key


@router.post("/chat")
def chat(chatIn: ChatIn, background_tasks: BackgroundTasks):
    llm = ChatOpenAI(
    temperature=0.95,
    model="glm-4-flash",
    openai_api_key=api_key,
    openai_api_base="https://open.bigmodel.cn/api/paas/v4/"
)
    messages = [
      SystemMessage(content="Translate the following from English into Italian"),
      HumanMessage(content="hi!"),
    ]
    gsn = llm.stream(messages)
    def gen():
        for chunk in gsn:
            yield yield_string(chat_id="1", content=chunk.content, role="assistant")
    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
    )
