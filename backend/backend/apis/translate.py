from fastapi import APIRouter
from fastapi.responses import JSONResponse

from langchain_core.messages import HumanMessage, SystemMessage
from backend.langchain.model import create_model
from backend.schemas.translate import TanslateIn
from langchain_core.output_parsers import StrOutputParser

router = APIRouter()


@router.post("/translate")
def chat(tIn: TanslateIn):
    llm = create_model()
    if not tIn.lang_from or not tIn.lang_to or not tIn.content:
        return JSONResponse({"data": None, "code": 1, "message": "参数错误"})
    msg = [
        SystemMessage(
            content=f"Translate the following from {tIn.lang_from} into {tIn.lang_to} : "
        ),
        HumanMessage(content=tIn.content),
    ]

    result = llm.invoke(msg)
    parser = StrOutputParser()
    data = parser.invoke(result)
    return JSONResponse({"data": data, "code": 0, "message": "success"})
