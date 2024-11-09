from langchain_chroma import Chroma


class VectorChroma:
  def create_chroma_storage(self,texts, embeddings):
    vector_store = Chroma.from_texts(texts, embeddings)
    return vector_store
  
  def get_chroma_storage(self, collection_name,embeddings, persist_directory):
    return Chroma(
      collection_name=collection_name,
      persist_directory=persist_directory,
      embedding_function=embeddings
    )
