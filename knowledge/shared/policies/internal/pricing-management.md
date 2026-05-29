# KIỂM SOÁT GIÁ & ĐỊNH GIÁ (Pricing Management)

> **Policy Nội bộ** — Dành cho NVKD, TP, Finance, GDKD
> **Policy KH tương ứng:** `customer/pricing-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa cách tính giá và báo giá cho toàn bộ dịch vụ ERK
- Đảm bảo margin tối thiểu cho từng loại hình dịch vụ
- Trao quyền báo giá rõ ràng, đồng thời kiểm soát rủi ro về giá
- Tạo cơ sở dữ liệu giá nhất quán, giảm thời gian báo giá

### 1.2 Phạm vi áp dụng
- Tất cả NVKD, TP Team, Finance, Operations
- Mọi báo giá cho khách hàng ERK Transport

---

## 2. CÔNG THỨC TÍNH GIÁ

### 2.1 Giá vốn (Cost)

```
GIÁ VỐN = Cước vendor + Phí hải quan + Phí vận hành + Phí khác

Trong đó:
├── Cước vendor: Giá nhà xe/tàu/bay báo cho ERK
├── Phí hải quan: Phí tờ khai, kiểm hóa, HS code...
├── Phí vận hành: Phí xử lý đơn, chứng từ, nhân công...
└── Phí khác: Bảo hiểm, đóng gói, lưu kho...
```

### 2.2 Giá bán

```
GIÁ BÁN = Giá vốn × (1 + Margin%)

Margin% tối thiểu:
├── KH mới: ≥ 15%
├── KH cũ (Pro trở xuống): ≥ 12%
├── KH cũ (Premium/Elite): ≥ 10%
└── Đơn > 500tr: ≥ 8% (cần GDKD duyệt)
```

### 2.3 Giá áp dụng cho KH

```
Giá báo KH = MIN(Giá Flex, Giá VIP)

Giá Flex = Bảng giá chuẩn × Hệ số volume
Giá VIP = Bảng giá chuẩn × (1 - Discount hạng VIP)
```

---

## 3. BẢNG GIÁ CƯỚC CHUẨN (KHUNG NỘI BỘ)

### 3.1 Theo tuyến đường

| Tuyến | Đường bộ | Đường biển | Hàng không |
|-------|----------|------------|------------|
| Quảng Châu → HCM | [Giá] | [Giá] | [Giá] |
| Quảng Châu → HN | [Giá] | [Giá] | [Giá] |
| Thâm Quyến → HCM | [Giá] | [Giá] | [Giá] |
| Bằng Tường → các tỉnh | [Giá] | — | — |
| Busan → HCM | — | [Giá] | [Giá] |
| Incheon → HN | — | [Giá] | [Giá] |

> Bảng giá đầy đủ lưu trong file `BangGiaCuoc_2026.xlsx`, cập nhật hàng quý.

### 3.2 Hệ số theo loại hàng

| Loại hàng | Hệ số | Ví dụ |
|-----------|:----:|-------|
| Hàng thường | × 1.0 | Quần áo, vải, giày dép |
| Hàng dễ vỡ | × 1.3 | Gốm sứ, thủy tinh, điện tử |
| Hàng cồng kềnh | × 1.5 | Nội thất, đồ gỗ lớn |
| Hàng đặc biệt | × 1.5-2.0 | Thực phẩm, mỹ phẩm, hóa chất |

### 3.3 Hệ số theo khối lượng

| Khối lượng/tháng | Hệ số giảm |
|-----------------|:----------:|
| < 100 kg | × 1.0 |
| 100-500 kg | × 0.95 |
| 500 kg - 1 tấn | × 0.90 |
| 1-5 tấn | × 0.85 |
| > 5 tấn | × 0.80 |

---

## 4. PHÂN QUYỀN BÁO GIÁ

| Chức vụ | Thẩm quyền | Điều kiện |
|---------|-----------|-----------|
| **NVKD** | Báo giá theo bảng giá chuẩn | Margin ≥ 15% |
| **NVKD** | Điều chỉnh ±5% so với giá chuẩn | Cần ghi lý do trong CRM |
| **TP Team** | Phê duyệt điều chỉnh ±10% | Margin ≥ 10% |
| **GDKD** | Phê duyệt mọi mức giá đặc biệt | Margin < 10% hoặc đơn > 500tr |

---

## 5. QUY TRÌNH BÁO GIÁ

```
KH yêu cầu báo giá
      ↓
NVKD xác định: Tuyến + Loại hàng + Khối lượng
      ↓
NVKD tính giá theo bảng giá chuẩn
      ↓
NVKD tạo quote trên CRM → AUTO L0→L1
      ↓
Nếu trong thẩm quyền → Gửi KH ngay
Nếu vượt thẩm quyền → Trình TP/GDKD duyệt
      ↓
KH phản hồi → NVKD cập nhật CRM
```

---

## 6. KIỂM SOÁT MARGIN

| Hoạt động | Tần suất | Owner |
|-----------|----------|-------|
| Kiểm tra margin từng đơn | Tự động (CRM) | System |
| Báo cáo margin TB theo NVKD | Hàng tuần | TP Team |
| Báo cáo margin theo tuyến/dịch vụ | Hàng tháng | Finance |
| Review & điều chỉnh bảng giá | Hàng quý | Finance + GDKD |

### Ngưỡng cảnh báo

| Chỉ số | Ngưỡng | Hành động |
|--------|:------:|-----------|
| Margin TB NVKD < 12% | Cảnh báo | TP review, coaching |
| Margin TB Team < 10% | Cảnh báo | GDKD review chiến lược giá |
| Margin đơn lẻ < 8% | Cảnh báo | Tự động yêu cầu GDKD duyệt |

---

## 7. CẬP NHẬT BẢNG GIÁ

| Trigger | Hành động | Owner |
|---------|-----------|-------|
| Vendor thay đổi giá | Cập nhật trong 48h | Operations |
| Tỷ giá biến động > 3% | Cập nhật hệ số | Finance |
| Mùa cao điểm (Tết, Trung thu, cuối năm) | Áp dụng hệ số mùa | Finance + GDKD |
| Định kỳ hàng quý | Review toàn bộ bảng giá | Finance + GDKD |

---

## 8. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Mọi báo giá phải thực hiện trên CRM, không qua Excel/Zalo
- Vi phạm quy định báo giá → Nhắc nhở → Trừ P3 → Kỷ luật
- Review định kỳ: **Hàng quý**
- Owner: Finance + GDKD

---

*Version 1.0 | 08/05/2026 | Finance + GDKD*
