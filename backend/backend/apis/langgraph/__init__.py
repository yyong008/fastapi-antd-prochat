from typing import Annotated
from FastAPI import APIRouter

from typing_extensions import TypedDict

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

from backend.langchain.model import create_model

class State(TypedDict):
  messages: Annotated[list, add_messages]


router = APIRouter()

@router.get("/langgraph")
async def get_langgraph():
  model = create_model()
  def chat_bot(state: State):
    return { "message": [model.invoke(state["messages"])] }
  
  graph_builder = StateGraph(State)
  graph_builder.add_node(chat_bot)
  return StateGraph(START, END)
