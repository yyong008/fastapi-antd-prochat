from zhipuai import ZhipuAI
from backend.config.config import get_settings

api_key = get_settings().api_key

client = ZhipuAI(api_key=api_key)  # 请填写您自己的APIKey
