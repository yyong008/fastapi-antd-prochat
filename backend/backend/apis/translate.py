from fastapi import APIRouter
from fastapi.responses import JSONResponse
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from backend.schemas.translate import TanslateIn
from backend.config.config import get_settings
from langchain_core.output_parsers import StrOutputParser
parser = StrOutputParser()
api_key = get_settings().api_key

router = APIRouter()


@router.post("/translate")
def chat(tIn: TanslateIn):
    llm = ChatOpenAI(
        temperature=0.95,
        model="glm-4-flash",
        openai_api_key=api_key,
        openai_api_base="https://open.bigmodel.cn/api/paas/v4/",
    )
    if not tIn.lang_from or not tIn.lang_to or not tIn.content:
        return JSONResponse({"data": None, "code": 1, "message": "参数错误"})
    msg = [
        SystemMessage(
            content=f"Translate the following from {tIn.lang_from} into {tIn.lang_to} : "
        ),
        HumanMessage(content=tIn.content),
    ]

    result = llm.invoke(msg)
    data = parser.invoke(result)
    return JSONResponse({"data": data, "code": 0, "message": "success"})
