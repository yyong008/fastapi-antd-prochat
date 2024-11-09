from fastapi import APIRouter
from fastapi.responses import JSONResponse

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from backend.langchain.model import create_model
from backend.backend.langchain.rag.embeddings.huggingface_embeddings import create_huggingface_embeddings
from backend.schemas.embeddings import EmbeddingsIn
from backend.backend.langchain.rag.vector.vector_faiss import create_faiss_storage
from backend.langchain.templates.question import question_template

router = APIRouter()

texts = [
        "LangChain is a framework for working with large language models.",
        "Embeddings help to convert text into numerical vectors for similarity search.",
        "FAISS is a library for efficient similarity search and clustering of dense vectors.",
    ]

@router.post("/embeddings/demo")
async def create_embeddings():
    # Step 1: 初始化嵌入模型，并将一些文本嵌入到向量数据库中
    embeddings = create_huggingface_embeddings()
    
    vector_store = create_faiss_storage(texts, embeddings)

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
    embeddings = create_huggingface_embeddings()
    vector_store = create_faiss_storage(texts, embeddings)

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

    print("data", data)
    return {"result": data}
