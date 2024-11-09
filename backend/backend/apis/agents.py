from fastapi import APIRouter

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage

from langgraph.checkpoint import MemorySaver

from backend.backend.langchain.agent.agent_executor import create_agent_executor
from backend.langchain.model import create_model


router = APIRouter()


@router.post("/agents/")
async def create_embeddings():
    search = TavilySearchResults(max_results=2)
    tools = [search]
    model = create_model()
    model_with_tools = model.bind_tools(tools)

    response = model_with_tools.invoke([HumanMessage(content="Hi!")])

    print(f"ContentString: {response.content}")
    print(f"ToolCalls: {response.tool_calls}")


@router.post("/agents/demo")
async def create_agents_demo():

    memory = MemorySaver()
    search = TavilySearchResults(max_results=2)
    tools = [search]
    model = create_model()
    agent_executor = create_agent_executor(model, tools, memory=memory)
    config = {"configurable": {"thread_id": "abc123"}}
    for chunk in agent_executor.stream(
      {"messages": [HumanMessage(content="hi im bob! and i live in sf")]}, config
    ):
      print(chunk)
      print("----")

    for chunk in agent_executor.stream(
      {"messages": [HumanMessage(content="whats the weather where I live?")]}, config
    ):
      print(chunk)
      print("----")
