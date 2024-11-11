import PyPDF2
from io import BytesIO


def extract_text_from_pdf(content: bytes) -> str:
    """
    从给定的 PDF 文件内容中提取文本
    """
    # 将 PDF 内容加载到 BytesIO 中
    pdf_file = BytesIO(content)

    # 使用 PyPDF2 提取文本
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()  # 提取文本

    return text
