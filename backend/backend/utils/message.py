from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

def format_messages(messages):
  msg = []
  for chat in messages:
        role = chat.role
        if role == "user":
            msg.append(HumanMessage(content=chat.content))
        elif role == "system":
            msg.append(SystemMessage(content=chat.content))
        elif role == 'assistant':
            msg.append(AIMessage(content=chat.content))
  return msg
