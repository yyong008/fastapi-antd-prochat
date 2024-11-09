from langchain_community.vectorstores import FAISS


def create_faiss_storage(texts, embeddings):
    vector_store = FAISS.from_texts(texts, embeddings)
    return vector_store
