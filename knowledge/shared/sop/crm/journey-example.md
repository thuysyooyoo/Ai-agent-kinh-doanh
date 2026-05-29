# Ví dụ Full Journey KH + Revenue Dự Kiến
## CRM ERK Transport

---

## 1. HÀNH TRÌNH KH: CTY MINH ANH FASHION

> KH từ FB Ads → báo giá → đi hàng 4 tháng → tạm dừng → reject → L5 (chuyển ngành)

---

### BƯỚC 1: MKT tạo lead → L0 [NEW]

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                           Status: L0 🆕 NEW   │
│                                                             │
│  Tên: Trần Minh Anh            Nguồn: MKT_NEW              │
│  SĐT: 0987 654 321            Kênh: FB_ADS                 │
│  Zalo: 0987 654 321           Campaign: "Q2 Fashion Lead"  │
│  Email: anh@minhanh.vn        Tạo bởi: NV Lan (MKT)       │
│  Công ty: Cty Minh Anh Fashion Ngày tạo: 01/05/2026 09:15  │
│  Địa chỉ: Q.Tân Bình, HCM                                  │
│                                                             │
│  Assign cho: — (chưa assign)                                │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 09:15 — NV Lan tạo lead từ FB Ads campaign          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [📤 Assign cho Sale]  [📌 Tag Potential]  [🗑️ Xóa]       │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 2: MKT assign cho NVKD → vẫn L0

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                           Status: L0 🆕 NEW   │
│                                                             │
│  Assign cho: NVKD Hùng (Miền Nam)                           │
│  Assign bởi: NV Lan (MKT)                                  │
│  Assign lúc: 01/05/2026 10:30                               │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 10:30 — NV Lan assign cho Hùng                       │   │
│  │ 09:15 — NV Lan tạo lead từ FB Ads                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [📋 Tạo báo giá]  [📌 Tag Potential]                      │
│                                                             │
│  💡 TP Sale Dashboard tự động hiện:                         │
│  "NV Lan (MKT) → giao cho Hùng → Cty Minh Anh → 10:30"   │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 3: NVKD tạo báo giá → AUTO chuyển L1

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                     Status: L1 📋 ĐÃ BÁO GIÁ │
│                                                             │
│  ┌─ BÁO GIÁ ───────────────────────────────────────────┐   │
│  │ Quote: QT-260502-001                                 │   │
│  │ Loại: Báo giá chính thức                             │   │
│  │ Tuyến: Quảng Châu → HCM (đường bộ)                  │   │
│  │ Hàng: Quần áo thời trang, 2.000 kg                   │   │
│  │ Cước: 28.000đ/kg                                     │   │
│  │ Phí ủy thác: 400.000đ/mục                            │   │
│  │ Tổng: 56.400.000đ                                    │   │
│  │ VIP: Basic (0% discount)                              │   │
│  │ Margin: 48%                                           │   │
│  │ Hiệu lực: 7 ngày (đến 09/05)                         │   │
│  │ Status: SENT ✅                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 02/05 14:00 — Hùng tạo báo giá → AUTO chuyển L1     │   │
│  │ 02/05 14:05 — Hùng gửi báo giá cho KH               │   │
│  │ 01/05 10:30 — NV Lan assign cho Hùng                 │   │
│  │ 01/05 09:15 — NV Lan tạo lead                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 Quote Speed: 1 ngày 3.5h (từ assign → báo giá)        │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 4: KH chốt đơn → AUTO chuyển L2

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                    Status: L2 🚚 ĐANG ĐI HÀNG│
│                                                             │
│  VIP: Basic → (tracking upgrade)                            │
│  Đơn đầu tiên: 05/05/2026                                  │
│                                                             │
│  ┌─ ĐƠN HÀNG ──────────────────────────────────────────┐   │
│  │ #  │ Ngày tạo │ Tuyến      │ Est. Rev │ Status      │   │
│  │ 1  │ 05/05    │ QC→HCM    │ 56.4tr   │ 🟡 In-transit│   │
│  │                                                      │   │
│  │ Revenue dự kiến tháng: 56.4tr                        │   │
│  │ Revenue hoàn thành:    0 (đang vận chuyển)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 05/05 — Đơn #1 tạo → AUTO chuyển L2                 │   │
│  │ 02/05 — Hùng tạo báo giá → L1                       │   │
│  │ ...                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 5: KH đi hàng đều 4 tháng → L2 active

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                    Status: L2 🚚 ĐANG ĐI HÀNG│
│                                                             │
│  VIP: Basic → Pro (đạt 200tr doanh thu dự kiến)            │
│  Vòng đời: 1  │  Lifecycle: 4 tháng                         │
│                                                             │
│  ┌─ ĐƠN HÀNG ──────────────────────────────────────────┐   │
│  │ #  │ Ngày tạo │ Tuyến   │ Est.Rev │ Actual │ Status │   │
│  │ 7  │ 28/08    │ QC→HCM │ 62tr    │ —      │🟡Transit│   │
│  │ 6  │ 15/08    │ QC→HCM │ 58tr    │ 57.2tr │✅ Done  │   │
│  │ 5  │ 01/08    │ SZ→HCM │ 45tr    │ 44.8tr │✅ Done  │   │
│  │ 4  │ 12/07    │ QC→HCM │ 55tr    │ 56.1tr │✅ Done  │   │
│  │ 3  │ 25/06    │ QC→HCM │ 52tr    │ 51.5tr │✅ Done  │   │
│  │ 2  │ 10/06    │ QC→HCM │ 48tr    │ 49.0tr │✅ Done  │   │
│  │ 1  │ 05/05    │ QC→HCM │ 56tr    │ 55.8tr │✅ Done  │   │
│  │                                                      │   │
│  │ Tổng Est. Revenue:  376tr                            │   │
│  │ Tổng Actual Revenue: 314.4tr (đơn đã hoàn thành)    │   │
│  │ Đang vận chuyển:     62tr (1 đơn)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 Metric: First Month Value = 56.4tr (Est.)              │
│  📊 Avg Monthly Est. Revenue = 94tr/tháng                   │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 6: KH dừng đặt → 30 ngày → AUTO L3

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                  Status: L3 ⚠️ TẠM DỪNG      │
│                                                             │
│  ★ ATTRIBUTION RESET                                        │
│  Warning từ: 28/09/2026                                     │
│  Deadline confirm: 05/10/2026 (còn 5 ngày)                 │
│  NVKD: Hùng (vẫn gắn, đang trong 7 ngày confirm)          │
│                                                             │
│  ┌─ HÀNH ĐỘNG CHO HÙNG ────────────────────────────────┐   │
│  │                                                      │   │
│  │ Lý do tạm dừng: [▼ Chọn lý do __________________]   │   │
│  │ Ghi chú:         [KH nói đang chuyển đổi mô hình_]  │   │
│  │                                                      │   │
│  │ [✅ Confirm giữ KH]     [❌ Để vào L3]              │   │
│  │                                                      │   │
│  │ ⏰ Nếu không action trước 05/10 → auto gỡ Hùng     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 28/09 — 30 ngày không đơn mới → AUTO vào L3         │   │
│  │ 28/08 — Đơn #7 cuối cùng                            │   │
│  │ ...                                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 7: Sale không confirm → gỡ Sale → MKT lấy về L0 [RECYCLE]

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042              Status: L0 ♻️ RECYCLE            │
│                            Vòng đời: 2 (bắt đầu mới)       │
│                                                             │
│  Assign cho: — (MKT chưa assign lại)                       │
│  Lấy bởi: NV Mai (MKT) — remarketing campaign Q4           │
│                                                             │
│  ⚠️ KHÔNG THỂ XÓA (có lịch sử đơn hàng)                   │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 08/10 — NV Mai (MKT) lấy từ L3 → L0 [RECYCLE]      │   │
│  │ 05/10 — Hết 7 ngày, Hùng bị gỡ (auto)              │   │
│  │ 28/09 — 30 ngày không đơn → AUTO vào L3             │   │
│  │ 28/08 — Đơn #7 cuối cùng (QC→HCM, 62tr)            │   │
│  │ 15/08 — Đơn #6 (QC→HCM, 58tr)                      │   │
│  │ ... (xem thêm)                                       │   │
│  │ 02/05 — Hùng tạo báo giá → AUTO L1                  │   │
│  │ 01/05 — NV Lan assign cho Hùng                       │   │
│  │ 01/05 — NV Lan tạo lead từ FB Ads                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [📤 Assign cho Sale]   [↩️ Trả về L3]                     │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 8: Assign Sale mới → báo giá → KH từ chối → L3 → TP chuyển L4

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                           Status: L4 🔄 RESALE│
│                            Vòng đời: 2                      │
│                                                             │
│  Assign cho: NVKD Tuấn (resale)                             │
│  Assign bởi: TP Sale                                        │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 20/11 — TP Sale chuyển L3→L4, assign Tuấn           │   │
│  │ 15/11 — Tuấn reject: "KH nói đang chuyển ngành"     │   │
│  │         → L1 reject → L3 (lý do: không có nhu cầu)  │   │
│  │ 10/11 — Tuấn tạo báo giá mới → auto L1             │   │
│  │ 08/11 — NV Mai assign cho Tuấn                       │   │
│  │ 08/10 — NV Mai (MKT) lấy từ L3 → L0 [RECYCLE]      │   │
│  │ 05/10 — Hết 7 ngày, Hùng bị gỡ (auto)              │   │
│  │ 28/09 — 30 ngày không đơn → AUTO vào L3             │   │
│  │ 28/08 — Đơn #7 cuối cùng                            │   │
│  │ ... (xem thêm)                                       │   │
│  │ 01/05 — NV Lan tạo lead từ FB Ads                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  [Assign Sale khác]  [⛔ Chuyển L5 — cần TP approve]       │
└─────────────────────────────────────────────────────────────┘
```

---

### BƯỚC 9: TP Sale approve → L5 Blacklist

```
┌─────────────────────────────────────────────────────────────┐
│  L-260501-042                       Status: L5 ⛔ BLACKLIST  │
│                                                             │
│  Lý do: KH đã chuyển ngành, không còn nhu cầu vận chuyển   │
│  Approve bởi: TP Sale Nguyễn Văn X                          │
│  Ngày: 25/11/2026                                           │
│                                                             │
│  ┌─ TIMELINE ───────────────────────────────────────────┐   │
│  │ 25/11 — TP Sale approve → L5 BLACKLIST               │   │
│  │         Lý do: KH chuyển ngành                        │   │
│  │ 20/11 — TP Sale chuyển L3→L4, assign Tuấn            │   │
│  │ 15/11 — Tuấn reject: "chuyển ngành" → L1→L3          │   │
│  │ 10/11 — Tuấn tạo báo giá mới → auto L1              │   │
│  │ 08/11 — NV Mai assign cho Tuấn                        │   │
│  │ 08/10 — NV Mai (MKT) lấy từ L3 → L0 [RECYCLE]       │   │
│  │ 05/10 — Hùng bị gỡ (hết 7 ngày confirm)             │   │
│  │ 28/09 — 30 ngày không đơn → AUTO vào L3              │   │
│  │ 28/08 — Đơn #7 cuối cùng (QC→HCM, 62tr)             │   │
│  │ ... (xem thêm 15 mục)                                │   │
│  │ 05/05 — Đơn #1 → AUTO L2                             │   │
│  │ 02/05 — Hùng tạo báo giá → AUTO L1                   │   │
│  │ 01/05 — NV Lan assign cho Hùng                        │   │
│  │ 01/05 — NV Lan tạo lead từ FB Ads                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ⛔ KHÔNG THỂ CHUYỂN RA KHỎI L5                             │
│  📁 Dữ liệu lưu trữ vĩnh viễn (chỉ xem, không sửa)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. REVENUE DỰ KIẾN vs THỰC TẾ

### 2.1 Vấn đề

```
LOGISTICS TIMELINE:
  Ngày 1: KH đặt đơn vận chuyển (biết giá trị đơn)
  Ngày 5-15: Hàng đang vận chuyển TQ → VN
  Ngày 15-25: Thông quan, giao hàng
  Ngày 25-30: Hoàn thành, đối soát, thanh toán

→ Từ lúc đặt đơn → hoàn thành = 15-30 ngày
→ Nếu chỉ tính revenue "hoàn thành" → dashboard luôn trễ 1 tháng
→ Cần tính revenue DỰ KIẾN tại thời điểm đặt đơn để đo lường real-time
```

### 2.2 Giải pháp: Tách 2 loại revenue

| Loại | Định nghĩa | Khi nào có | Dùng cho |
|------|-----------|-----------|---------|
| **Est. Revenue** (Dự kiến) | Giá trị đơn hàng tại thời điểm tạo đơn | Ngay khi đặt đơn | Dashboard real-time, KPI tháng, đo convert |
| **Actual Revenue** (Thực tế) | Giá trị sau đối soát, thanh toán | Sau hoàn thành đơn | Báo cáo tài chính, tính VIP tier, commission |

### 2.3 Trạng thái đơn hàng

| Status | Icon | Est. Revenue | Actual Revenue |
|--------|:----:|:------------:|:--------------:|
| `PENDING` (chờ xử lý) | 🔵 | ✅ Có (từ báo giá) | ❌ Chưa |
| `IN_TRANSIT` (đang vận chuyển) | 🟡 | ✅ Có | ❌ Chưa |
| `COMPLETED` (hoàn thành) | ✅ | ✅ Có | ✅ Có (đối soát xong) |
| `CANCELLED` (hủy) | ❌ | ~~Xóa khỏi tính~~ | ❌ Không |

### 2.4 Dashboard hiển thị revenue

```
┌─ REVENUE KH: CTY MINH ANH ─────────────────────────────┐
│                                                          │
│  Tháng 08/2026                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Est. Revenue (dự kiến):         165tr            │    │
│  │ ├── Completed (đã hoàn thành):  103tr  ✅       │    │
│  │ ├── In-transit (đang chuyển):    62tr  🟡       │    │
│  │ └── Pending (chờ xử lý):         0tr  🔵       │    │
│  │                                                  │    │
│  │ Actual Revenue (thực tế):       103tr            │    │
│  │ Variance (chênh lệch):          +1.2tr (1.2%)  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│  6 tháng gần nhất:                                       │
│  Tháng │ Est.Rev │ Actual │ Variance │ Đơn │ Status      │
│  T05   │ 56tr    │ 55.8tr │ -0.4%    │  1  │ ✅ All done │
│  T06   │ 100tr   │ 100.5tr│ +0.5%    │  2  │ ✅ All done │
│  T07   │ 55tr    │ 56.1tr │ +2.0%    │  1  │ ✅ All done │
│  T08   │ 165tr   │ 103tr  │ pending  │  3  │ 🟡 1 transit│
└──────────────────────────────────────────────────────────┘
```

### 2.5 Quy tắc dùng loại revenue nào

| Mục đích | Dùng revenue nào | Lý do |
|----------|:----------------:|-------|
| **Dashboard KPI tháng** | Est. Revenue | Real-time, đo ngay khi phát sinh đơn |
| **First Month Value** | Est. Revenue | KH mới → đơn đầu chưa hoàn thành |
| **Quotation Rate / Convert Rate** | Est. Revenue | Chỉ cần biết có đơn hay không |
| **Nâng hạng VIP** | Actual Revenue | Cần số chính xác |
| **Tính hoa hồng / commission** | Actual Revenue | Cần đối soát xong |
| **Báo cáo tài chính** | Actual Revenue | Chính xác, kiểm toán được |
| **Đánh giá L2 → L3 (30 ngày)** | Est. Revenue | Tính từ ngày tạo đơn cuối |
| **So sánh NVKD** | Est. Revenue | Công bằng, real-time |

### 2.6 Cập nhật Data Model (bổ sung vào Phase 1)

```
ORDER (bảng mới)
├── id (PK)
├── lead_id (FK → Lead)
├── order_number: "ORD-YYYYMMDD-XXX"
├── route: String (VD: "Quảng Châu → HCM")
├── cargo_type: String
├── weight_kg: Decimal
├── estimated_revenue: Decimal    ← Tính từ báo giá tại thời điểm đặt
├── actual_revenue: Decimal       ← Cập nhật sau hoàn thành đối soát
├── status: ENUM [PENDING, IN_TRANSIT, COMPLETED, CANCELLED]
├── created_at: Timestamp         ← Ngày đặt đơn
├── completed_at: Timestamp       ← Ngày hoàn thành
├── created_by: FK → User

LEAD (bổ sung fields)
├── est_monthly_revenue: Decimal  ← SUM(estimated_revenue) đơn trong tháng
├── actual_monthly_revenue: Decimal ← SUM(actual_revenue) đơn completed trong tháng
├── total_est_revenue: Decimal    ← Tổng dự kiến
├── total_actual_revenue: Decimal ← Tổng thực tế
├── last_order_created_at: Timestamp ← Ngày tạo đơn cuối (dùng tính 30d → L3)
```

> [!IMPORTANT]
> **Rule 30 ngày → L3:** Tính từ `last_order_created_at` (ngày TẠO đơn cuối), không phải ngày hoàn thành. Vì đơn có thể đang vận chuyển nhưng KH vẫn active.
