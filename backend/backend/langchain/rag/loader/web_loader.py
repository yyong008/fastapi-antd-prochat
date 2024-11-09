from langchain_community.document_loaders import WebBaseLoader
import bs4

def create_web_loader(path: tuple, cls: tuple):
  WebBaseLoader(
        web_paths=(path),
        bs_kwargs=dict(
            parse_only=bs4.SoupStrainer(
                class_=cls
            )
        ),
    )
