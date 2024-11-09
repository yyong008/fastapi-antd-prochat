from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from backend.constants.model import LOCAL_EMBEDDING_NAME

def create_huggingface_embeddings(model_path):
    if not model_path:
        model_path = LOCAL_EMBEDDING_NAME
    embeddings = HuggingFaceBgeEmbeddings(model_name=model_path)
    return embeddings
