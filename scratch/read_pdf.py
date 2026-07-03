import sys
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"C:\Users\Admin\Downloads\CBHQ_727. IT106976805 DANH MUC.pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total Pages: {len(reader.pages)}")
    for i in range(min(2, len(reader.pages))):
        print(f"\n--- PAGE {i+1} ---")
        print(reader.pages[i].extract_text())
except Exception as e:
    print(f"Error reading PDF: {e}")
