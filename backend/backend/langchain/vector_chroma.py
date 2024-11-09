from langchain_chroma import Chroma


def create_chroma_storage(texts, embeddings):
  vector_store = Chroma.from_texts(texts, embeddings)
  return vector_store
