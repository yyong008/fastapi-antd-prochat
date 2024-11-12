from langchain_community.document_loaders import PyPDFLoader
import os

class PDFLoader():
    loader = None

    @classmethod
    def get_pdf_load(self, file_path):
        full_path = f"{os.getcwd()}{file_path}"

        self.loader = PyPDFLoader(full_path)
        return self.loader
