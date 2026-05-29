import os
import sys

try:
    import pypdf
except ImportError:
    print("[FAIL] pypdf is not installed. Please wait for pip installation to finish.")
    sys.exit(1)

source_dir = r"d:\CONGTY (1)\SỔ TAY KHÁCH HÀNG"
target_dir = r"D:\AI AGENT THUY\AI agent Kinh doanh\knowledge\customs_rules"

pdf_files = [
    "Danh mục hàng hóa cấm nhập khẩu Eureka không nhận vận chuyển.pdf",
    "Danh muc hàng hóa rủi ro trong quá trình nhập khẩu.pdf",
    "Lưu ý tên hàng hóa khai báo.pdf",
    "Quy trình làm kiểm tra an toàn thực phẩm.pdf",
    "Quy trình làm kiểm tra chất lượng.pdf"
]

def extract_pdf_to_md(pdf_name):
    pdf_path = os.path.join(source_dir, pdf_name)
    md_name = pdf_name.replace(".pdf", ".md").lower().replace(" ", "_")
    target_path = os.path.join(target_dir, md_name)
    
    print(f"Extracting {pdf_name} -> {md_name}...")
    if not os.path.exists(pdf_path):
        print(f"[ERROR] Source file {pdf_path} does not exist!")
        return
        
    reader = pypdf.PdfReader(pdf_path)
    text_content = []
    
    text_content.append(f"# {pdf_name.replace('.pdf', '').upper()}")
    text_content.append(f"*Tài liệu tri thức nghiệp vụ trích xuất tự động từ hệ thống Eureka*\n")
    text_content.append(f"---")
    
    for page_num, page in enumerate(reader.pages):
        text = page.extract_text()
        text_content.append(f"\n## TRANG {page_num + 1}")
        text_content.append(text)
        
    with open(target_path, "w", encoding="utf-8") as f:
        f.write("\n".join(text_content))
    print(f"[SUCCESS] Wrote to {target_path}")

if __name__ == "__main__":
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
        
    for pdf in pdf_files:
        extract_pdf_to_md(pdf)
