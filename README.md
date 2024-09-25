# fastapi-antd-prochat

## 标题

当 FastAPI 遇到 Antd ProChat 实现一个自己的 AI 聊天软件

## 技术选型


- 后端：Python (poetry) + fastapi
- 前端：react + antd prochat + tanstack-router + tailwindcss
- 存储 supabase (本地)
- AI: zhipu（glm-4-flash 模型）

## 部署

- 自己部署一个 supabase，或者适用免费的额度
- 注册 zhipu 账号，获取 api key

## 启动服务

### 后端

```sh
cd backend # 进入后端目录
poetry install
poetry shell  # 进入虚拟环境

# 指定环境变量

# 运行环境
poetry run main.py
```

### 环境变量

```sh
api_key = your_zhipu_api_key

SUPABASE_KEY = supabase_key
SUPABASE_URL = http://localhost:8000
```

### 前端

```sh
cd frontend # 进入前端目录
pnpm install
pnpm run dev
```

## 访问

- http://localhost:5173
- http://localhost:8000/chat

## 开始聊天

- 新建聊天
- 聊天的增删改查

## 数据结构设置

```json
{
  "id": "chat_uuid_id",
  "title": "your_chat_title",
  "content": [
    {
      "id": "message_uuid_id",
      "content": "your_message_content",
      "role": "user"
    }
  ]
}
```
