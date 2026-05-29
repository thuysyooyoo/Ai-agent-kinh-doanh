import os
import sys
import pandas as pd
from pypdf import PdfReader

# Set standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

base_dir = r"D:\AI AGENT THUY\AI agent Kinh doanh\knowledge\customs_rules"

def convert_refund_excel():
    src = os.path.join(base_dir, "Danh mục tỉ lệ hoàn thuế XK ở trung quốc - hiệu lực.xlsx")
    dest = os.path.join(base_dir, "hoan_thue_trung_quoc.txt")
    if not os.path.exists(src):
        print("Danh mục tỉ lệ hoàn thuế XK ở trung quốc - hiệu lực.xlsx not found.")
        return
    try:
        df = pd.read_excel(src)
        df.to_csv(dest, sep="\t", index=False, encoding="utf-8")
        print("Successfully converted China tax refund excel to hoan_thue_trung_quoc.txt")
    except Exception as e:
        print(f"Error converting China tax refund: {e}")

def convert_dual_use_pdf():
    src = os.path.join(base_dir, "P020251231607833453633.pdf")
    dest = os.path.join(base_dir, "china_dual_use_catalog.txt")
    if not os.path.exists(src):
        print("P020251231607833453633.pdf not found.")
        return
    try:
        print("Reading 1492-page China dual-use PDF... Please wait.")
        reader = PdfReader(src)
        full_text = []
        # Extract pages
        total = len(reader.pages)
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text.append(f"--- Page {i+1} ---")
                full_text.append(text)
            if (i + 1) % 100 == 0 or (i + 1) == total:
                print(f"Extracted {i+1}/{total} pages...")
                
        with open(dest, "w", encoding="utf-8") as f:
            f.write("\n".join(full_text))
        print("Successfully converted China dual-use PDF to china_dual_use_catalog.txt")
    except Exception as e:
        print(f"Error converting China dual-use PDF: {e}")

if __name__ == "__main__":
    print("Starting conversion of China export regulation files...")
    convert_refund_excel()
    convert_dual_use_pdf()
    print("China export regulation files conversion completed!")
