from langchain_community.embeddings import ZhipuAIEmbeddings
import dotenv

class ZhipuEmbeddings():
    api_key = dotenv.get_key(".env", "api_key")

    @classmethod
    def create_zhipu_embeddings(self, model_name):
        embeddings = ZhipuAIEmbeddings(
            model=model_name,
            api_key=self.api_key
        )
        return embeddings
