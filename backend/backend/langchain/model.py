from langchain_openai import ChatOpenAI
from backend.config.config import get_settings
from langchain_ollama import ChatOllama

api_key = get_settings().api_key


def create_model(model_name):
  if not model_name:
    model_name = "glm-4-flash"
  model = ChatOpenAI(
        temperature=0.95,
        model=model_name,
        openai_api_key=api_key,
        openai_api_base="https://open.bigmodel.cn/api/paas/v4/",
  )
  return model


def create_ollama_chat_models(model_name):
  return ChatOllama(model=model_name)
