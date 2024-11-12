from backend.langchain.rag.vector.vector_chroma import VectorChroma
from backend.langchain.rag.splitter.index import Splitter
from backend.langchain.rag.loader.pdf import PDFLoader
from backend.langchain.rag.embeddings.zhipu import ZhipuEmbeddings


class StorageToVectorDB:
    @classmethod
    def save_to_db(self, file_path, collection_name):
        loader = PDFLoader.get_pdf_load(file_path)
        docs = loader.load()

        splited_docs = Splitter.split_docs(docs)

        splits = [
            {"page_content": d.page_content if hasattr(d, "page_content") else ""}
            for d in splited_docs
        ]

        txt_content = ""
        for d in splits:
            # txt_content(d['page_content'])
            txt_content = f"{txt_content}{d['page_content']}"

        embeddings = ZhipuEmbeddings.create_zhipu_embeddings(model_name="embedding-3")

        VectorChroma.create_chroma_storage_from_texts(
            texts=[txt_content],
            embeddings=embeddings,
            collection_name=collection_name,
            persist_directory="backend/_data",
        )
