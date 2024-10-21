from fastapi import APIRouter
from fastapi.responses import JSONResponse

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceBgeEmbeddings

from backend.config.config import get_settings

api_key = get_settings().api_key


router = APIRouter()


@router.post("/embeddings/demo")
async def create_embeddings():
    # Step 1: 初始化嵌入模型，并将一些文本嵌入到向量数据库中
    model_path = "E:\\ai\\hg\\bge-large-zh-v1.5"
    embeddings = HuggingFaceBgeEmbeddings(model_name=model_path)
    texts = [
        "LangChain is a framework for working with large language models.",
        "Embeddings help to convert text into numerical vectors for similarity search.",
        "FAISS is a library for efficient similarity search and clustering of dense vectors.",
    ]
    vector_store = FAISS.from_texts(texts, embeddings)

    # Step 2: 用户输入问题
    query = "How is FAISS?"

    # Step 3: 将用户问题转换为嵌入向量并在向量数据库中进行相似性搜索
    docs = vector_store.similarity_search(query, k=1)

    # Step 4: 遍历搜索到的文档，将它们合并为一个新的 prompt
    context = "\n".join([doc.page_content for doc in docs])

    print("context", context)
    return JSONResponse({"data": context, "code": 0, "message": "success"})
