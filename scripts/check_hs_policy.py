import os
import sys
import json
import re
import argparse

sys.stdout.reconfigure(encoding='utf-8')

def clean_hs(hs):
    if not hs:
        return ""
    return re.sub(r'[^0-9]', '', str(hs))

def search_hs(query_hs, db):
    cleaned_query = clean_hs(query_hs)
    if not cleaned_query:
        return []
        
    results = []
    
    # 1. Exact match
    if cleaned_query in db:
        for entry in db[cleaned_query]:
            results.append({
                "match_type": "Khớp chính xác",
                "matched_key": cleaned_query,
                "data": entry
            })
        return results
        
    # 2. Prefix match: DB key is a prefix of the query (e.g. DB has '8517' and query is '85171100')
    prefix_matches = []
    for key, entries in db.items():
        if cleaned_query.startswith(key):
            for entry in entries:
                prefix_matches.append({
                    "match_type": f"Khớp tiền tố (Mã nhóm {key})",
                    "matched_key": key,
                    "data": entry
                })
    if prefix_matches:
        return prefix_matches
        
    # 3. Sub-code match: Query is a prefix of DB keys (e.g. query is '8517' and DB has '85171100')
    sub_matches = []
    for key, entries in db.items():
        if key.startswith(cleaned_query):
            for entry in entries:
                sub_matches.append({
                    "match_type": f"Khớp mã con (Mã HS {key})",
                    "matched_key": key,
                    "data": entry
                })
    return sub_matches

def main():
    parser = argparse.ArgumentParser(description="Tra cứu chính sách hàng hóa nhập khẩu rủi ro theo HS Code.")
    parser.add_argument("--hs", type=str, required=True, help="Mã HS cần tra cứu (ví dụ: 8517.11.00 hoặc 8517)")
    args = parser.parse_args()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "..", "knowledge", "customs_rules", "danh_muc_tra_cuu_hs_code_rui_ro.json")
    json_path = os.path.normpath(json_path)
    
    if not os.path.exists(json_path):
        print(f"Error: Database file not found at {json_path}")
        sys.exit(1)
        
    with open(json_path, "r", encoding="utf-8") as f:
        db = json.load(f)
        
    query = args.hs.strip()
    results = search_hs(query, db)
    
    if not results:
        print(f"### Hết quả tra cứu HS Code: {query}")
        print("\n❌ Không tìm thấy thông tin rủi ro nhóm 2 hoặc các quy chuẩn áp dụng cho mã HS này. Hàng hóa có thể thuộc diện hàng thông thường hoặc cần tra cứu thủ công.")
        sys.exit(0)
        
    print(f"### Kết quả tra cứu HS Code: {query}")
    print(f"Tìm thấy **{len(results)}** kết quả phù hợp:\n")
    
    # Limit output to 15 items to avoid long text if prefix is too generic
    limit = 15
    for idx, r in enumerate(results[:limit]):
        data = r["data"]
        print(f"#### {idx+1}. {r['match_type']} - Mã gốc trong danh mục: `{data['Mã số HS gốc']}`")
        print(f"- **Mức độ rủi ro:** **{data['Mức độ rủi ro']}**")
        print(f"- **Bộ ban ngành quản lý:** {data['Bộ ban ngành quản lý']}")
        print(f"- **Tên sản phẩm:** {data['Tên sản phẩm, hàng hóa']}")
        print(f"- **Quy chuẩn kỹ thuật/Tiêu chuẩn:** `{data['Quy chuẩn kỹ thuật/Tiêu chuẩn']}`")
        print(f"- **Mô tả:** {data['Mô tả sản phẩm, hàng hóa']}")
        print(f"- **Yêu cầu quản lý chất lượng:** {data['Yêu cầu quản lý chất lượng tương ứng']}")
        print("-" * 40)
        
    if len(results) > limit:
        print(f"\n*(Đã ẩn {len(results) - limit} kết quả do danh sách quá dài. Vui lòng tra cứu cụ thể hơn)*")

if __name__ == "__main__":
    main()
