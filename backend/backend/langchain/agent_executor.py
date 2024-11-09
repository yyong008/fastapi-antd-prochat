from langgraph.prebuilt import create_react_agent


def create_agent_executor(model, tools, memory):
    agent_executor = create_react_agent(model, tools, checkpointer=memory)
    return agent_executor
