from langchain_chroma import Chroma


class VectorChroma:
    @classmethod
    def create_chroma_storage_from_texts(
        self, texts, embeddings, collection_name, persist_directory
    ):
        vector_store = Chroma.from_texts(
            texts,
            embeddings,
            collection_name=collection_name,
            persist_directory=persist_directory,
        )
        return vector_store

    @classmethod
    def get_chroma_storage(self, collection_name, embeddings, persist_directory):
        return Chroma(
            collection_name=collection_name,
            persist_directory=persist_directory,
            embedding_function=embeddings,
        )
