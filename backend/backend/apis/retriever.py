from fastapi import APIRouter
from fastapi.responses import JSONResponse

from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from backend.backend.langchain.rag.embeddings.huggingface_embeddings import create_huggingface_embeddings
from backend.langchain.model import create_model
from backend.schemas.embeddings import EmbeddingsIn
from backend.config.config import get_settings
from backend.langchain.templates.question import question_template

api_key = get_settings().api_key


router = APIRouter()

texts = [
        "LangChain is a framework for working with large language models.",
        "Embeddings help to convert text into numerical vectors for similarity search.",
        "FAISS is a library for efficient similarity search and clustering of dense vectors.",
    ]

@router.post("/retriever/demo")
async def create_retriever(qst: EmbeddingsIn):
    print("question", qst.question, type(qst.question))
    question = qst.question

    # Step 1: 初始化嵌入模型，并将一些文本嵌入到向量数据库中
    embeddings = create_huggingface_embeddings()
    
    vector_store = Chroma.from_texts(texts, embeddings)

    # vector_store.similarity_search("cat")
    # vector_store.similarity_search_with_score("cat")
    # retriever = RunnableLambda(vectorstore.similarity_search).bind(k=1)  # select top resul
    # retriever.batch(["cat", "shark"])


    # 创建检索器
    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 1},
    )

    prompt = ChatPromptTemplate.from_template(question_template)

    # 输出解析器
    output_parser = StrOutputParser()

    # 并行任务执行 setup_and_retrieval
    setup_and_retrieval = {"context": retriever, "question": RunnablePassthrough()}
    
    llm = create_model()

    # 创建完整的链条
    chain = setup_and_retrieval | prompt | llm | output_parser

    # 使用 `invoke` 方法并传递输入字典
    data = chain.invoke(question)

    return JSONResponse(content=data)
