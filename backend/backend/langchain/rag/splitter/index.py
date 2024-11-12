from langchain_text_splitters import RecursiveCharacterTextSplitter

class Splitter:

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    @classmethod
    def split_text(self, text):
        splited_text = self.text_splitter.split_text(text)
        return splited_text


    @classmethod
    def split_docs(self, docs):
        splited_docs = self.text_splitter.split_documents(docs)
        return splited_docs
