import math

# BẢNG GIÁ VIP CỐ ĐỊNH (Basic, Pro, Premium, Elite)
# Đơn vị: VND/m3 hoặc VND/kg
VIP_TARIFFS = {
    "Bộ": {
        "Quảng Châu": {
            "Hà Nội": {
                "m3": {"Basic": 1850000, "Pro": 1665000, "Premium": 1480000, "Elite": 1295000},
                "kg": {"Basic": 9000, "Pro": 8100, "Premium": 7200, "Elite": 6300}
            },
            "Hồ Chí Minh": {
                "m3": {"Basic": 2600000, "Pro": 2340000, "Premium": 2080000, "Elite": 1820000},
                "kg": {"Basic": 12500, "Pro": 11250, "Premium": 10000, "Elite": 8750}
            }
        },
        "Bằng Tường": {
            "Hà Nội": {
                "m3": {"Basic": 1450000, "Pro": 1305000, "Premium": 1160000, "Elite": 1015000},
                "kg": {"Basic": 9000, "Pro": 8100, "Premium": 7200, "Elite": 6300}
            },
            "Hồ Chí Minh": {
                "m3": {"Basic": 2150000, "Pro": 1935000, "Premium": 1720000, "Elite": 1505000},
                "kg": {"Basic": 12500, "Pro": 11250, "Premium": 10000, "Elite": 8750}
            }
        }
    }
}

# BẢNG GIÁ LINH HOẠT THEO MỐC
FLEXIBLE_TARIFFS_M3 = {
    "Quảng Châu": {
        "Hà Nội": [
            (0.0, 1.0, 1850000),
            (1.0, 2.0, 1700000),
            (2.0, 5.0, 1600000),
            (5.0, 10.0, 1500000),
            (10.0, 20.0, 1400000),
            (20.0, 30.0, 1300000),
            (30.0, float('inf'), 1300000)
        ],
        "Hồ Chí Minh": [
            (0.0, 1.0, 2600000),
            (1.0, 2.0, 2200000),
            (2.0, 5.0, 2100000),
            (5.0, 10.0, 2000000),
            (10.0, 20.0, 1900000),
            (20.0, 30.0, 1800000),
            (30.0, float('inf'), 1800000)
        ]
    },
    "Bằng Tường": {
        "Hà Nội": [
            (0.0, 1.0, 1450000),
            (1.0, 2.0, 1400000),
            (2.0, 5.0, 1300000),
            (5.0, 10.0, 1200000),
            (10.0, 20.0, 1100000),
            (20.0, 30.0, 1000000),
            (30.0, float('inf'), 1000000)
        ],
        "Hồ Chí Minh": [
            (0.0, 1.0, 2150000),
            (1.0, 2.0, 1900000),
            (2.0, 5.0, 1800000),
            (5.0, 10.0, 1700000),
            (10.0, 20.0, 1600000),
            (20.0, 30.0, 1500000),
            (30.0, float('inf'), 1500000)
        ]
    }
}

FLEXIBLE_TARIFFS_KG = {
    "Quảng Châu": {
        "Hà Nội": [
            (0.0, 300.0, 9000),
            (300.0, 500.0, 8000),
            (500.0, 1500.0, 7000),
            (1500.0, 5000.0, 6000),
            (5000.0, 10000.0, 5000),
            (10000.0, float('inf'), 5000)
        ],
        "Hồ Chí Minh": [
            (0.0, 300.0, 12500),
            (300.0, 500.0, 11500),
            (500.0, 1500.0, 10500),
            (1500.0, 5000.0, 9500),
            (5000.0, 10000.0, 8500),
            (10000.0, float('inf'), 8500)
        ]
    },
    "Bằng Tường": {
        "Hà Nội": [
            (0.0, 300.0, 9000),
            (300.0, 500.0, 8000),
            (500.0, 1500.0, 7000),
            (1500.0, 5000.0, 6000),
            (5000.0, 10000.0, 5000),
            (10000.0, float('inf'), 5000)
        ],
        "Hồ Chí Minh": [
            (0.0, 300.0, 12500),
            (300.0, 500.0, 11500),
            (500.0, 1500.0, 10500),
            (1500.0, 5000.0, 9500),
            (5000.0, 10000.0, 8500),
            (10000.0, float('inf'), 8500)
        ]
    }
}

def get_flexible_rate(warehouse_tq, warehouse_vn, value, unit="m3"):
    t = FLEXIBLE_TARIFFS_M3 if unit == "m3" else FLEXIBLE_TARIFFS_KG
    tiers = t.get(warehouse_tq, {}).get(warehouse_vn, [])
    for start, end, rate in tiers:
        if start <= value < end:
            return rate
    return 0

def calculate_quotation(vip_class, num_items, weight, volume, declared_value, vat_pct=8, nk_pct=0, other_pct=0, transport_type="Bộ", warehouse_tq="Bằng Tường", warehouse_vn="Hồ Chí Minh", supplier_payment=0):
    # Quy đổi khối để công bằng hàng nặng
    volume_converted = weight / 250.0
    volume_applied = max(volume, volume_converted)
    
    # 1. Tính toán cước theo Bảng giá VIP cố định (Lấy MAX giữa tính theo m3 và tính theo kg)
    vip_rate_m3 = 0
    vip_rate_kg = 0
    if transport_type == "Bộ":
        vip_rate_m3 = VIP_TARIFFS["Bộ"].get(warehouse_tq, {}).get(warehouse_vn, {}).get("m3", {}).get(vip_class, 0)
        vip_rate_kg = VIP_TARIFFS["Bộ"].get(warehouse_tq, {}).get(warehouse_vn, {}).get("kg", {}).get(vip_class, 0)
    
    c15_vip_m3_fee = volume * vip_rate_m3
    c15_vip_kg_fee = weight * vip_rate_kg
    c15_vip_fee = max(c15_vip_m3_fee, c15_vip_kg_fee)
    
    # 2. Tính toán cước theo Bảng giá Linh Hoạt theo mốc (Lấy MAX giữa tính theo m3 và tính theo kg)
    flex_rate_m3 = get_flexible_rate(warehouse_tq, warehouse_vn, volume, "m3")
    flex_rate_kg = get_flexible_rate(warehouse_tq, warehouse_vn, weight, "kg")
    
    c16_flex_m3_fee = volume * flex_rate_m3
    c16_flex_kg_fee = weight * flex_rate_kg
    c16_flex_fee = max(c16_flex_m3_fee, c16_flex_kg_fee)
    
    # 3. Cước áp dụng = MIN(Cước VIP, Cước Linh Hoạt)
    c19_shipping_fee = min(c15_vip_fee, c16_flex_fee)
    
    # 4. Phí ủy thác cố định (A): 400k (Bộ) hoặc 500k (Biển)
    trust_unit_rate = 400000 if transport_type == "Bộ" else 500000
    c18_trust_fee = trust_unit_rate * num_items
    
    # 5. Phí phòng ngừa rủi ro hàng giá trị cao (B)
    value_per_volume = declared_value / volume_applied
    c20_risk_fee = 0
    if value_per_volume > 100000000:
        c20_risk_fee = (value_per_volume - 100000000) * volume_applied * 0.01
    
    c20_risk_fee = round(c20_risk_fee)
    
    # 6. Tính thuế hải quan (C22)
    import_tax = declared_value * (nk_pct / 100.0)
    other_tax = (declared_value + import_tax) * (other_pct / 100.0)
    vat_tax = (declared_value + import_tax + other_tax) * (vat_pct / 100.0)
    c22_total_taxes = round(import_tax + other_tax + vat_tax)
    
    # 7. Tổng chi phí tạm tính (C25)
    c25_total_est_cost = c18_trust_fee + c19_shipping_fee + c20_risk_fee + c22_total_taxes
    
    # 8. Tính toán dòng tiền 3 bước
    c28_payment_1 = supplier_payment
    c29_payment_2 = (declared_value + c22_total_taxes) * 1.02 - c28_payment_1
    c29_payment_2 = round(c29_payment_2)
    c30_balance = round(c25_total_est_cost - c29_payment_2)
    
    return {
        "volume_converted": volume_converted,
        "volume_applied": volume_applied,
        "vip_rate_m3": vip_rate_m3,
        "vip_rate_kg": vip_rate_kg,
        "vip_m3_fee": c15_vip_m3_fee,
        "vip_kg_fee": c15_vip_kg_fee,
        "vip_shipping_fee": c15_vip_fee,
        "flexible_rate_m3": flex_rate_m3,
        "flexible_rate_kg": flex_rate_kg,
        "flexible_m3_fee": c16_flex_m3_fee,
        "flexible_kg_fee": c16_flex_kg_fee,
        "flexible_shipping_fee": c16_flex_fee,
        "shipping_fee": c19_shipping_fee,
        "trust_fee": c18_trust_fee,
        "risk_fee": c20_risk_fee,
        "import_tax": import_tax,
        "other_tax": other_tax,
        "vat_tax": vat_tax,
        "total_taxes": c22_total_taxes,
        "total_est_cost": c25_total_est_cost,
        "payment_1_supplier": c28_payment_1,
        "payment_2_invoice": c29_payment_2,
        "balance_payment_3": c30_balance
    }

def format_quotation_report(vip_class, num_items, weight, volume, declared_value, vat_pct, nk_pct, other_pct, transport_type, warehouse_tq, warehouse_vn, supplier_payment, res):
    lines = []
    lines.append(f"# BẢNG PHÂN TÍCH VÀ BÁO GIÁ DỊCH VỤ ỦY THÁC GOM CONT")
    lines.append(f"**Khách hàng VIP:** Hạng {vip_class} | **Hình thức vận chuyển:** {transport_type} (Chính ngạch)")
    lines.append(f"**Kho nhận hàng:** {warehouse_tq} | **Kho giao hàng:** {warehouse_vn}")
    lines.append(f"---")
    lines.append(f"## 1. THÔNG TIN HÀNG HÓA VÀ QUY ĐỔI")
    lines.append(f"- **Số lượng mặt hàng (dòng khai báo):** {num_items} mục hàng")
    lines.append(f"- **Trọng lượng thực tế:** {weight:,.2f} kg")
    lines.append(f"- **Thể tích thực tế:** {volume:,.3f} m³")
    lines.append(f"- **Khối quy đổi (Cân nặng / 250):** {res['volume_converted']:,.3f} m³")
    lines.append(f"- **Khối áp dụng (MAX thực tế vs quy đổi):** {res['volume_applied']:,.3f} m³")
    lines.append(f"- **Trị giá hàng khai báo:** {declared_value:,.0f} VND")
    
    lines.append(f"\n## 2. CHI TIẾT CÁC THÀNH PHẦN CHI PHÍ")
    lines.append(f"1. **Phí ủy thác cố định (A):** {res['trust_fee']:,.0f} VND")
    lines.append(f"   *({num_items} mục hàng x {'400,000đ (Đường bộ)' if transport_type == 'Bộ' else '500,000đ (Đường biển)'})*")
    
    lines.append(f"2. **Cước vận chuyển quốc tế:** {res['shipping_fee']:,.0f} VND")
    lines.append(f"   *(Hệ thống tự động so sánh m3 vs kg, chọn MIN của cước VIP vs cước Linh Hoạt)*")
    lines.append(f"   - *Cước VIP cố định theo hạng {vip_class}:* {res['vip_shipping_fee']:,.0f} VND")
    lines.append(f"     *(MAX của {volume:,.3f}m³ x {res['vip_rate_m3']:,.0f}đ/m³ vs {weight:,.2f}kg x {res['vip_rate_kg']:,.0f}đ/kg)*")
    lines.append(f"   - *Cước Linh hoạt theo lượng hàng:* {res['flexible_shipping_fee']:,.0f} VND")
    lines.append(f"     *(MAX của {volume:,.3f}m³ x {res['flexible_rate_m3']:,.0f}đ/m³ vs {weight:,.2f}kg x {res['flexible_rate_kg']:,.0f}đ/kg)*")
    
    lines.append(f"3. **Phí phòng ngừa rủi ro hàng giá trị cao (B):** {res['risk_fee']:,.0f} VND")
    if res['risk_fee'] > 0:
        val_per_vol = declared_value / res['volume_applied']
        lines.append(f"   *(Trị giá {val_per_vol:,.0f}đ/khối vượt mốc 100 triệu/khối. Thu 1% trên phần vượt)*")
    else:
        lines.append(f"   *(Không phát sinh do trị giá dưới ngưỡng 100 triệu/khối áp dụng)*")
        
    lines.append(f"4. **Tạm tính Thuế hải quan nhập khẩu & VAT:** {res['total_taxes']:,.0f} VND")
    lines.append(f"   - *Thuế Nhập khẩu ({nk_pct}%):* {res['import_tax']:,.0f} VND")
    if other_pct > 0:
        lines.append(f"   - *Thuế khác ({other_pct}%):* {res['other_tax']:,.0f} VND")
    lines.append(f"   - *Thuế VAT ({vat_pct}%):* {res['vat_tax']:,.0f} VND")
    
    lines.append(f"\n👉 **TỔNG CHI PHÍ TẠM TÍNH (Cần bám đuổi):** **{res['total_est_cost']:,.0f} VND**")
    
    lines.append(f"\n## 3. QUY TRÌNH DÒNG TIỀN VÀ THANH TOÁN 3 BƯỚC")
    lines.append(f"Để đảm bảo đúng hóa đơn doanh nghiệp và đối chiếu công nợ rõ ràng:")
    lines.append(f"- **Bước 1: Thanh toán NCC Trung Quốc (Khoản 1):** **{res['payment_1_supplier']:,.0f} VND**")
    lines.append(f"  *(Khách hàng chuyển tiền VNĐ từ tài khoản công ty để Eureka thanh toán tệ chính ngạch cho NCC Trung Quốc)*")
    lines.append(f"- **Bước 2: Thanh toán Hóa đơn hàng về (Khoản 2):** **{res['payment_2_invoice']:,.0f} VND**")
    lines.append(f"  *(Tính theo công thức: (Trị giá + Thuế) x 1.02 - Khoản 1. Chuyển khoản từ tài khoản doanh nghiệp)*")
    
    lines.append(f"- **Bước 3: Cân đối cấn trừ cước vận chuyển (Khoản 3):**")
    if res['balance_payment_3'] >= 0:
        lines.append(f"  ➔ **Khách hàng thanh toán thêm:** **{res['balance_payment_3']:,.0f} VND**")
        lines.append(f"    *(Do Phí dịch vụ cước {res['shipping_fee']+res['trust_fee']+res['risk_fee']:,.0f}đ lớn hơn Khoản 2 dư. Khách chuyển từ tài khoản cá nhân)*")
    else:
        lines.append(f"  ➔ **Eureka hoàn trả lại khách hàng:** **{-res['balance_payment_3']:,.0f} VND**")
        lines.append(f"    *(Do số tiền khách thanh toán hóa đơn Khoản 2 còn dư so với phí dịch vụ cước. Eureka hoàn trả qua tài khoản cá nhân)*")
        
    return "\n".join(lines)
