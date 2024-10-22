from fastapi import APIRouter
from fastapi.responses import JSONResponse

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI

from backend.schemas.embeddings import EmbeddingsIn
from backend.config.config import get_settings

api_key = get_settings().api_key


router = APIRouter()


@router.post("/embeddings/demo")
async def create_embeddings():
    # Step 1: 初始化嵌入模型，并将一些文本嵌入到向量数据库中
    model_path = "E:\\ai\\hg\\embedding\\bge-large-zh-v1.5"
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


@router.post("/embeddings/retriever/demo")
async def create_embeddings_retriever(qst: EmbeddingsIn):
    print("question", qst.question, type(qst.question))
    question = qst.question

    # Step 1: 初始化嵌入模型，并将一些文本嵌入到向量数据库中
    model_path = "E:\\ai\\hg\\embedding\\bge-large-zh-v1.5"
    embeddings = HuggingFaceBgeEmbeddings(model_name=model_path)
    texts = [
        "LangChain is a framework for working with large language models.",
        "Embeddings help to convert text into numerical vectors for similarity search.",
        "FAISS is a library for efficient similarity search and clustering of dense vectors.",
    ]
    vector_store = FAISS.from_texts(texts, embeddings)

    # 创建检索器
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 1},
    )

    # 提示模板
    template = """请根据以下情景回答问题：
    {context}

    问题：{question}
    """
    prompt = ChatPromptTemplate.from_template(template)

    # 输出解析器
    output_parser = StrOutputParser()

    # 并行任务执行 setup_and_retrieval
    setup_and_retrieval = {"context": retriever, "question": RunnablePassthrough()}
    
    llm = ChatOpenAI(
        temperature=0.95,
        model="glm-4-flash",
        openai_api_key=api_key,
        openai_api_base="https://open.bigmodel.cn/api/paas/v4/",
    )

    # 创建完整的链条
    chain = setup_and_retrieval | prompt | llm | output_parser

    # 使用 `invoke` 方法并传递输入字典
    data = chain.invoke(question)

    print("data", data)
    return {"result": data}
