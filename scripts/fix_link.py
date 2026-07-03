# -*- coding: utf-8 -*-
import io

filepath = r"d:\AI AGENT THUY\AI agent Kinh doanh\agents\05_conformity_assessor.md"

new_content_block = u"""Để hỗ trợ doanh nghiệp thực hiện thông quan và công bố sản phẩm hợp pháp theo Quyết định số 2839/QĐ-BKHCN-2026, Nghị định số 37/2026/NĐ-CP và Thông tư số 14/2026/TT-BKHCN, bạn cần khai thác và sử dụng các biểu mẫu trống trong thư mục chung:
*   **Đường dẫn thư mục (Windows Explorer):** `d:\\AI AGENT THUY\\AI agent Kinh doanh\\templates\\biểu mẫu giấy tờ\\.10. MẪU GIẤY TỜ LÀM KIỂM TRA CHUYÊN NGÀNH\\MẪU HỒ SƠ LÀM KIỂM TRA CHUYÊN NGÀNH\\BỘ HỒ SƠ LÀM KIỂM TRA CHẤT LƯỢNG\\BỘ TEMPLATE CHUẨN AGENT 5`
*   **Liên kết thư mục nhanh:** **[BỘ TEMPLATE CHUẨN AGENT 5](../templates/bi%E1%BB%83u%20m%E1%BA%ABu%20gi%E1%BA%A5y%20t%E1%BB%9D/.10.%20M%E1%BA%AEU%20GI%E1%BA%A5Y%20T%E1%BB%9D%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/M%E1%BA%AEU%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/B%E1%BB%98%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CH%E1%BA%A4T%20L%C6%AF%E1%BB%A2NG/B%E1%BB%98%20TEMPLATE%20CHU%E1%BA%A8N%20AGENT%205)**

**Liên kết nhanh đến từng biểu mẫu trống (.docx):**
1.  **[Bản đăng ký công bố hợp quy (Phụ lục IV)](../templates/bi%E1%BB%83u%20m%E1%BA%ABu%20gi%E1%BA%A5y%20t%E1%BB%9D/.10.%20M%E1%BA%AEU%20GI%E1%BA%A5Y%20T%E1%BB%9D%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/M%E1%BA%AEU%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/B%E1%BB%98%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CH%E1%BA%A4T%20L%C6%AF%E1%BB%A2NG/B%E1%BB%98%20TEMPLATE%20CHU%E1%BA%A8N%20AGENT%205/PHU_LUC_IV_BAN_DANG_KY_CONG_BO_HOP_QUY.docx)**
2.  **[Báo cáo tự đánh giá hợp quy (Phụ lục V)](../templates/bi%E1%BB%83u%20m%E1%BA%ABu%20gi%E1%BA%A5y%20t%E1%BB%9D/.10.%20M%E1%BA%AEU%20GI%E1%BA%A5Y%20T%E1%BB%9D%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/M%E1%BA%AEU%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/B%E1%BB%98%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CH%E1%BA%A4T%20L%C6%AF%E1%BB%A2NG/B%E1%BB%98%20TEMPLATE%20CHU%E1%BA%A8N%20AGENT%205/PHU_LUC_V_BAO_CAO_TU_DANH_GIA_HOP_QUY.docx)**
3.  **[Danh mục sản phẩm 9 cột (Phụ lục số 01)](../templates/bi%E1%BB%83u%20m%E1%BA%ABu%20gi%E1%BA%A5y%20t%E1%BB%9D/.10.%20M%E1%BA%AEU%20GI%E1%BA%A5Y%20T%E1%BB%9D%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/M%E1%BA%AEU%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/B%E1%BB%98%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CH%E1%BA%A4T%20L%C6%AF%E1%BB%A2NG/B%E1%BB%98%20TEMPLATE%20CHU%E1%BA%A8N%20AGENT%205/DANH_MUC_SAN_PHAM_9_COT.docx)**
4.  **[Đăng ký kiểm tra chất lượng - Mẫu 01 Phụ lục VII (NĐ 37)](../templates/bi%E1%BB%83u%20m%E1%BA%ABu%20gi%E1%BA%A5y%20t%E1%BB%9D/.10.%20M%E1%BA%AEU%20GI%E1%BA%A5Y%20T%E1%BB%9D%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/M%E1%BA%AEU%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CHUY%C3%8AN%20NG%C3%80NH/B%E1%BB%98%20H%E1%BB%92%20S%C6%A0%20L%C3%80M%20KI%E1%BB%82M%20TRA%20CH%E1%BA%A4T%20L%C6%AF%E1%BB%A2NG/B%E1%BB%98%20TEMPLATE%20CHU%E1%BA%A8N%20AGENT%205/MAU_01_PHU_LUC_VII_DANG_KY_KIEM_TRA_CHAT_LUONG.docx)**"""

with io.open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
replaced = False
for line in lines:
    if line.strip().startswith(u"Để hỗ trợ doanh nghiệp thực hiện thông quan"):
        new_lines.append(new_content_block + u"\n")
        replaced = True
        print("REPLACED SUCCESSFUL BY PREFIX")
    else:
        new_lines.append(line)

if not replaced:
    print("COULD NOT FIND PREFIX")

with io.open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
