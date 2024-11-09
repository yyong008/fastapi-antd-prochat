from fastapi import APIRouter

from langchain_chroma import Chroma

from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from langchain import hub
from langchain_text_splitters import RecursiveCharacterTextSplitter


from backend.langchain.loader.web_loader import create_web_loader
from backend.langchain.model import create_model
from backend.config.config import get_settings


api_key = get_settings().api_key


router = APIRouter()


@router.post("/agents/")
async def create_embeddings():
    model = create_model()
    loader = create_web_loader(
        path=("https://lilianweng.github.io/posts/2023-06-23-agent/"),
        cls=("post-content", "post-title", "post-header"),
    )
    docs = loader.load()

    embeddings = create_embeddings()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)

    # Retrieve and generate using the relevant snippets of the blog.
    retriever = vectorstore.as_retriever()
    prompt = hub.pull("rlm/rag-prompt")

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | model
        | StrOutputParser()
    )

    data = rag_chain.invoke("What is Task Decomposition?")
    return data
