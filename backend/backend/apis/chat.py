from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.schemas.chat import ChatIn
from backend.zhipu_ai.client import client
import json

router = APIRouter()


def generate_stream(response):
    for chunk in response:
        if chunk.choices[0].delta:
            delta = chunk.choices[0].delta
            data = {"content": delta.content, "role": delta.role}
            print(data)
            yield f"data: {json.dumps(data)}\n\n"


@router.post("/chat")
def chat(content: ChatIn):
    print(content)
    response = client.chat.completions.create(
        model="glm-4-flash",  # 填写需要调用的模型编码
        messages=[
            {"role": "user", "content": content.content},
        ],
        stream=True,
    )
    # 使用 StreamingResponse 进行流式响应
    return StreamingResponse(generate_stream(response), media_type="text/event-stream")
