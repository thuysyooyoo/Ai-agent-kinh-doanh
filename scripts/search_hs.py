import os
import sys
import argparse
import pandas as pd

# Set standard output encoding to UTF-8 to support Vietnamese characters on Windows
sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARIFF_PATH = os.path.join(SCRIPT_DIR, "knowledge", "customs_rules", "danh_muc_xnk.txt")
ANNOUNCEMENT_PATH = os.path.join(SCRIPT_DIR, "knowledge", "customs_rules", "thong_bao_phan_loai.txt")

def clean_hs_code(val):
    if pd.isna(val):
        return ""
    s = str(val).strip().replace(".", "")
    if s.endswith(".0"):
        s = s[:-2]
    return s

def format_tax(val):
    if pd.isna(val):
        return "-"
    # Check if float or percentage
    try:
        if isinstance(val, float):
            return f"{int(val * 100)}%" if val < 1 else f"{val}%"
        return str(val)
    except:
        return str(val)

def search_hs(query_str=None, code_str=None):
    results = []
    
    if not os.path.exists(TARIFF_PATH):
        print(f"Error: Tariff file not found at {TARIFF_PATH}")
        return
        
    print(f"Loading database... Please wait a moment.")
    
    # Read the TSV file
    try:
        df_tariff = pd.read_csv(TARIFF_PATH, sep='\t', low_memory=False)
    except Exception as e:
        print(f"Error reading tariff file: {e}")
        return

    # Standardize column names
    # Column mapping based on index:
    # 4 -> 'V' (sometimes index 4)
    # 5 -> 'Mã hàng'
    # 6 -> 'Mô tả hàng hoá - Tiếng Việt'
    # 7 -> 'Mô tả hàng hoá - Tiếng Anh'
    # 8 -> 'Đơn vị tính'
    # 12 -> 'NK ưu đãi'
    # 15 -> 'VAT'
    # 18 -> 'ACFTA' (China CO form E)
    # 94 -> 'Chính sách mặt hàng theo mã HS'
    
    # Let's dynamically find the correct columns based on names since the spreadsheet might have slightly different names
    col_mapping = {}
    for col in df_tariff.columns:
        col_str = str(col).strip()
        if "Mã hàng" in col_str or "Ma hang" in col_str:
            col_mapping['code'] = col
        elif "Mô tả hàng hoá - Tiếng Việt" in col_str or "Tiếng Việt" in col_str:
            col_mapping['desc_vi'] = col
        elif "Mô tả hàng hoá - Tiếng Anh" in col_str or "Tiếng Anh" in col_str:
            col_mapping['desc_en'] = col
        elif "Đơn vị" in col_str:
            col_mapping['unit'] = col
        elif "NK\nưu\nđãi" in col_str or "NK ưu đãi" in col_str or "nhập khẩu ưu đãi" in col_str.lower():
            col_mapping['mfn'] = col
        elif "VAT" in col_str:
            col_mapping['vat'] = col
        elif "ACFTA" in col_str:
            col_mapping['acfta'] = col
        elif "Chính sách mặt hàng" in col_str or "Chính sách" in col_str:
            col_mapping['policy'] = col

    # Fallbacks if columns not found by string matching
    if 'code' not in col_mapping:
        col_mapping['code'] = df_tariff.columns[5]
    if 'desc_vi' not in col_mapping:
        col_mapping['desc_vi'] = df_tariff.columns[6]
    if 'desc_en' not in col_mapping:
        col_mapping['desc_en'] = df_tariff.columns[7]
    if 'unit' not in col_mapping:
        col_mapping['unit'] = df_tariff.columns[8]
    if 'mfn' not in col_mapping:
        col_mapping['mfn'] = df_tariff.columns[12]
    if 'vat' not in col_mapping:
        col_mapping['vat'] = df_tariff.columns[15]
    if 'acfta' not in col_mapping:
        col_mapping['acfta'] = df_tariff.columns[18]
    if 'policy' not in col_mapping:
        # Check around index 94
        idx = min(94, len(df_tariff.columns) - 1)
        col_mapping['policy'] = df_tariff.columns[idx]

    # Convert code to clean string
    df_tariff['clean_code'] = df_tariff[col_mapping['code']].apply(clean_hs_code)
    
    # Perform filtering
    matched_df = pd.DataFrame()
    
    if code_str:
        clean_code_search = code_str.replace(".", "").strip()
        matched_df = df_tariff[df_tariff['clean_code'].str.startswith(clean_code_search)]
    elif query_str:
        q = query_str.lower().strip()
        # Search in vietnamese or english descriptions
        mask_vi = df_tariff[col_mapping['desc_vi']].astype(str).str.lower().str.contains(q, na=False)
        mask_en = df_tariff[col_mapping['desc_en']].astype(str).str.lower().str.contains(q, na=False)
        matched_df = df_tariff[mask_vi | mask_en]
        
    # Limit to top 20 matches to keep output clean and fast
    matched_df = matched_df.head(20)
    
    print("\n# KẾT QUẢ TRA CỨU BIỂU THUẾ & MÃ HS 2026")
    if matched_df.empty:
        print("\nKhông tìm thấy mã HS nào phù hợp trong danh mục.")
    else:
        print(f"\nTìm thấy {len(matched_df)} kết quả hàng đầu:\n")
        for idx, row in matched_df.iterrows():
            hs_code = row['clean_code']
            # Format nicely with dots e.g., 0102.29.11
            formatted_code = hs_code
            if len(hs_code) == 8:
                formatted_code = f"{hs_code[:4]}.{hs_code[4:6]}.{hs_code[6:]}"
            elif len(hs_code) == 6:
                formatted_code = f"{hs_code[:4]}.{hs_code[4:]}"
                
            desc_vi = str(row[col_mapping['desc_vi']]).strip()
            desc_en = str(row[col_mapping['desc_en']]).strip()
            unit = str(row[col_mapping['unit']]).strip() if not pd.isna(row[col_mapping['unit']]) else "-"
            mfn_rate = format_tax(row[col_mapping['mfn']])
            vat_rate = format_tax(row[col_mapping['vat']])
            acfta_rate = format_tax(row[col_mapping['acfta']])
            policy = str(row[col_mapping['policy']]).strip() if not pd.isna(row[col_mapping['policy']]) else "Bình thường (Không có chính sách đặc biệt)"
            
            print(f"### 📦 Mã HS: **{formatted_code}** ({unit})")
            print(f"- **Mô tả Tiếng Việt:** {desc_vi}")
            if desc_en and desc_en != "nan":
                print(f"- **Mô tả Tiếng Anh:** *{desc_en}*")
            print(f"- **Thuế suất:** Nhập khẩu ưu đãi MFN: `{mfn_rate}` | VAT: `{vat_rate}` | **ACFTA (Form E): `{acfta_rate}`**")
            print(f"- **Chính sách quản lý:** {policy}")
            print("-" * 50)
            
    # Search announcement if exists
    if os.path.exists(ANNOUNCEMENT_PATH):
        try:
            df_ann = pd.read_csv(ANNOUNCEMENT_PATH, sep='\t')
            # Find search
            matched_ann = pd.DataFrame()
            if code_str:
                clean_code_search = code_str.replace(".", "").strip()
                df_ann['clean_code'] = df_ann['Mã HS'].apply(clean_hs_code)
                matched_ann = df_ann[df_ann['clean_code'].str.startswith(clean_code_search)]
            elif query_str:
                q = query_str.lower().strip()
                matched_ann = df_ann[df_ann['Mô tả hàng hóa'].astype(str).str.lower().str.contains(q, na=False)]
                
            matched_ann = matched_ann.head(10)
            
            print("\n# THÔNG BÁO PHÂN LOẠI HẢI QUAN LIÊN QUAN")
            if matched_ann.empty:
                print("Không tìm thấy thông báo phân loại tương ứng trong tài liệu đã tra cứu.")
            else:
                for idx, row in matched_ann.iterrows():
                    code = str(row['Mã HS']).strip()
                    desc = str(row['Mô tả hàng hóa']).strip()
                    print(f"- 📄 **Mã HS:** `{code}` - **Mô tả hàng hóa thực tế:** {desc}")
        except Exception as e:
            print(f"\nError searching announcements: {e}")
    else:
        print("\nKhông tìm thấy tệp thông báo phân loại.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Tra cứu mã HS và chính sách thuế XNK Eureka")
    parser.add_argument("-q", "--query", type=str, help="Từ khóa tìm kiếm trong mô tả sản phẩm (Tiếng Việt hoặc Tiếng Anh)")
    parser.add_argument("-c", "--code", type=str, help="Tra cứu chính xác theo mã HS (2, 4, 6, hoặc 8 số)")
    
    args = parser.parse_args()
    
    if not args.query and not args.code:
        parser.print_help()
        sys.exit(1)
        
    search_hs(query_str=args.query, code_str=args.code)
