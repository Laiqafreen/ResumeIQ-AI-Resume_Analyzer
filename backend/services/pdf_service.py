from PyPDF2 import PdfReader

def extract_text_from_pdf(file_object):
    reader = PdfReader(file_object)
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n".join(pages).strip()