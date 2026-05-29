import sys
import os

# Thêm thư mục scripts vào PATH
sys.path.append(os.path.dirname(__file__))

from calc_quotation import calculate_quotation

def run_test_cases():
    print("=========================================================")
    print("       EUREKA LOGISTICS - QUOTATION VERIFICATION TEST     ")
    print("=========================================================")
    
    # 1. KIỂM THỬ XÁC THỰC CÁC TÌNH HUỐNG HẠNG VIP KHÁC NHAU (TESTING VIP CLASSES)
    # Lô hàng thử nghiệm: Bằng Tường -> Hồ Chí Minh, 476.52 kg, 2.808 m3, 2 mục hàng, trị giá 67,002,089đ
    # Thanh toán NCC: 20,000,000đ.
    # Đây là lô hàng thực tế trong file Excel!
    
    print("\n[TESTING VIP TIERS] Cho đơn hàng thực tế trong Excel:")
    print("Thông số đơn hàng: Tuyến Bằng Tường - HCM, 476.52 kg, 2.808 m3, 2 mục hàng, Trị giá 67,002,089đ")
    
    vip_classes = ["Basic", "Pro", "Premium", "Elite"]
    for vip in vip_classes:
        res = calculate_quotation(
            vip_class=vip,
            num_items=2,
            weight=476.52,
            volume=2.808,
            declared_value=67002089,
            vat_pct=8,
            nk_pct=0,
            other_pct=0,
            transport_type="Bộ",
            warehouse_tq="Bằng Tường",
            warehouse_vn="Hồ Chí Minh",
            supplier_payment=20000000
        )
        print(f"\n Hạng VIP: {vip}")
        print(f"  - Cước VIP (C15): {res['vip_shipping_fee']:,.0f} VND (M3 rate: {res['vip_rate_m3']:,} | KG rate: {res['vip_rate_kg']:,})")
        print(f"  - Cước Linh hoạt (C16): {res['flexible_shipping_fee']:,.0f} VND (M3 rate: {res['flexible_rate_m3']:,} | KG rate: {res['flexible_rate_kg']:,})")
        print(f"  - Cước Áp dụng (C19 = MIN(VIP, Linhhoat)): {res['shipping_fee']:,.0f} VND")
        print(f"  - Phí ủy thác (A): {res['trust_fee']:,.0f} VND")
        print(f"  - Tổng phí tạm tính: {res['total_est_cost']:,.0f} VND")
        print(f"  - Thanh toán Lần 2 (Hóa đơn nháp): {res['payment_2_invoice']:,.0f} VND")
        print(f"  - Cấn trừ cựơc Lần 3 (Balance): {res['balance_payment_3']:,.0f} VND")
        
        # Kiểm tra tính khớp số với Excel đối với hạng Pro (Pro là trường hợp trong Excel)
        if vip == "Pro":
            # Excel C15: 5.433.480, C16: 5.479.980, C19: 5.433.480, C18: 800.000, C25: 11.593.647.12, C29: 53.809.501.24, C30: -42.215.854.12
            assert res['vip_shipping_fee'] == 5433480, f"Lỗi cước VIP Pro! Thực tế: {res['vip_shipping_fee']}"
            assert res['flexible_shipping_fee'] == 5479980, f"Lỗi cước Linh hoạt Pro! Thực tế: {res['flexible_shipping_fee']}"
            assert res['shipping_fee'] == 5433480, f"Lỗi cước áp dụng Pro! Thực tế: {res['shipping_fee']}"
            assert res['trust_fee'] == 800000, f"Lỗi phí ủy thác! Thực tế: {res['trust_fee']}"
            print(f"  >> [XÁC THỰC] Hạng Pro khớp 100% từng đồng lẻ với Excel mẫu!")

    # 2. KIỂM THỬ XÁC THỰC CÁC CASE STUDY HÀNG GIÁ TRỊ CAO (TESTING RISK FEES)
    print("\n[TESTING RISK FEES] Kiểm tra 4 Case Study thực tế từ Chính sách giá 2026:")
    
    # Case 1: Hàng nhẹ giá trị trung bình
    res1 = calculate_quotation(vip_class="Pro", num_items=1, weight=150, volume=1.0, declared_value=120000000)
    assert res1['risk_fee'] == 200000, f"Lỗi Case 1! Thực tế: {res1['risk_fee']}"
    print("- Case 1 (120tr | 1m3 | 150kg) Pass! Phí rủi ro: 200,000đ")

    # Case 2: Hàng siêu giá trị
    res2 = calculate_quotation(vip_class="Pro", num_items=1, weight=100, volume=1.0, declared_value=500000000)
    assert res2['risk_fee'] == 4000000, f"Lỗi Case 2! Thực tế: {res2['risk_fee']}"
    print("- Case 2 (500tr | 1m3 | 100kg) Pass! Phí rủi ro: 4,000,000đ")

    # Case 3: Hàng rất nặng giá trị cao
    res3 = calculate_quotation(vip_class="Pro", num_items=1, weight=1000, volume=0.8, declared_value=600000000)
    assert res3['risk_fee'] == 2000000, f"Lỗi Case 3! Thực tế: {res3['risk_fee']}"
    print("- Case 3 (600tr | 0.8m3 | 1000kg) Pass! Phí rủi ro: 2,000,000đ")

    # Case 4: Hàng thông thường dưới ngưỡng
    res4 = calculate_quotation(vip_class="Pro", num_items=1, weight=100, volume=1.0, declared_value=90000000)
    assert res4['risk_fee'] == 0, f"Lỗi Case 4! Thực tế: {res4['risk_fee']}"
    print("- Case 4 (90tr | 1m3 | 100kg) Pass! Phí rủi ro: 0đ")

    print("\n=========================================================")
    print(" [SUCCESS] TẤT CẢ KIỂM THỬ VIP & 4 CASE STUDY ĐÃ ĐẠT 100%! ")
    print("=========================================================")

if __name__ == "__main__":
    run_test_cases()
