import os
import sys
import argparse
import pandas as pd

# Set standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REFUND_PATH = os.path.join(SCRIPT_DIR, "knowledge", "customs_rules", "hoan_thue_trung_quoc.txt")
DUAL_USE_PATH = os.path.join(SCRIPT_DIR, "knowledge", "customs_rules", "china_dual_use_catalog.txt")

def clean_hs_code(val):
    if pd.isna(val):
        return ""
    s = str(val).strip().replace(".", "")
    if s.endswith(".0"):
        s = s[:-2]
    return s

def search_refund(code_str):
    if not os.path.exists(REFUND_PATH):
        print(f"Error: Tax refund database not found at {REFUND_PATH}")
        return
        
    try:
        df = pd.read_csv(REFUND_PATH, sep="\t", low_memory=False)
    except Exception as e:
        print(f"Error loading tax refund database: {e}")
        return
        
    # Clean codes in database
    # Column names based on inspect:
    # 'Mã hàng hóa / HS code', 'HS code 8 số', 'Ngày bắt đầu hiệu lực', 'Ngày kết thúc hiệu lực', 'Tên hàng hóa tiếng Trung', 'Thuế suất GTGT/VAT', 'Thuế suất hoàn thuế xuất khẩu'
    code_clean = code_str.replace(".", "").strip()
    
    # Check exact match or startswith
    df['clean_hs8'] = df['HS code 8 số'].apply(clean_hs_code)
    df['clean_hs10'] = df['Mã hàng hóa / HS code'].apply(clean_hs_code)
    
    matches = df[df['clean_hs8'].str.startswith(code_clean) | df['clean_hs10'].str.startswith(code_clean)]
    
    print("\n# 🇨🇳 KẾT QUẢ TRA CỨU HOÀN THUẾ XUẤT KHẨU TRUNG QUỐC")
    if matches.empty:
        print(f"Không tìm thấy dữ liệu hoàn thuế cho mã HS: `{code_str}`.")
    else:
        print(f"Tìm thấy {len(matches)} kết quả phù hợp:\n")
        # Display top 5 matches
        for idx, row in matches.head(5).iterrows():
            hs10 = row['Mã hàng hóa / HS code']
            hs8 = row['HS code 8 số']
            desc_zh = row['Tên hàng hóa tiếng Trung']
            start_date = row['Ngày bắt đầu hiệu lực']
            end_date = row['Ngày kết thúc hiệu lực']
            vat = row['Thuế suất GTGT/VAT']
            refund = row['Thuế suất hoàn thuế xuất khẩu']
            
            print(f"### 📦 Mã HS TQ: **{hs10}** (8 số đối chiếu: `{hs8}`)")
            print(f"- **Mô tả Tiếng Trung:** {desc_zh}")
            print(f"- **Hiệu lực:** Từ `{start_date}` đến `{end_date}`")
            print(f"- **Thuế suất:** Thuế GTGT/VAT xuất khẩu: `{vat}` | **Tỉ lệ Hoàn thuế xuất khẩu: `{refund}`**")
            print("-" * 50)
            
        print("\n💡 *Lưu ý:* Vui lòng kiểm tra thêm trên link chính thức https://www.hsbianma.com/ để cập nhật thông tin thời gian thực chính xác nhất.")

def search_dual_use(query_str=None, code_str=None):
    if not os.path.exists(DUAL_USE_PATH):
        print(f"Error: China dual-use catalog not found at {DUAL_USE_PATH}")
        return
        
    try:
        with open(DUAL_USE_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading dual-use catalog: {e}")
        return
        
    # Search for keywords or codes in text
    search_term = ""
    if code_str:
        search_term = code_str.replace(".", "").strip()
    elif query_str:
        search_term = query_str.strip()
        
    if not search_term:
        return
        
    # Parse text by page indicators
    pages = content.split("--- Page ")
    matched_pages = []
    
    for p in pages:
        if not p.strip():
            continue
        p_content = "--- Page " + p
        if search_term.lower() in p_content.lower():
            # Extract page number
            first_line = p.split("\n")[0]
            page_num = first_line.split(" ---")[0]
            matched_pages.append((page_num, p_content))
            
    print("\n# 🇨🇳 KẾT QUẢ TRA CỨU DANH MỤC KIỂM SOÁT XUẤT KHẨU TRUNG QUỐC (HÀNG LƯỠNG DỤNG / GIẤY PHÉP)")
    if not matched_pages:
        print(f"Không tìm thấy từ khóa hoặc mã HS `{search_term}` trong danh mục quản lý giấy phép xuất khẩu.")
    else:
        print(f"⚠️ Phát hiện từ khóa hoặc mã HS `{search_term}` được đề cập trong danh mục kiểm soát ở {len(matched_pages)} trang:\n")
        # Display top 3 pages with brief snippets
        for p_num, p_text in matched_pages[:3]:
            print(f"### 📄 Trang số: **{p_num}**")
            lines = p_text.split("\n")
            # Find lines containing search term and show context
            count = 0
            for line in lines:
                if search_term.lower() in line.lower() and count < 4:
                    print(f"- *... {line.strip()} ...*")
                    count += 1
            print("-" * 50)
        
        if len(matched_pages) > 3:
            print(f"*Còn {len(matched_pages) - 3} trang khác cũng có đề cập đến mặt hàng này.*")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tra cứu chính sách hoàn thuế và giấy phép xuất khẩu Trung Quốc")
    parser.add_argument("-c", "--code", type=str, help="Tra cứu theo mã HS (8 số hoặc 10 số) cho cả hoàn thuế và lưỡng dụng")
    parser.add_argument("-q", "--query", type=str, help="Tìm kiếm từ khóa trong danh mục kiểm soát lưỡng dụng")
    
    args = parser.parse_args()
    
    if not args.code and not args.query:
        parser.print_help()
        sys.exit(1)
        
    if args.code:
        search_refund(args.code)
        search_dual_use(code_str=args.code)
    elif args.query:
        search_dual_use(query_str=args.query)
