# QUẢN LÝ HIỆU SUẤT GIAO HÀNG (OTD Performance Management)

> **Policy Nội bộ** — Dành cho Operations, NVKD, TP, GDKD
> **Policy KH tương ứng:** `customer/otd-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 2.0

---

## PHÂN BIỆT VỚI POLICY KH

| Tiêu chí | Policy KH (`customer/otd-policy.md`) | Policy Nội bộ (file này) |
|----------|--------------------------------------|---------------------------|
| Mục đích | Cam kết SLA, quyền lợi KH khi delay | Kiểm soát OTD, tracking, cải tiến |
| Nội dung | SLA, ngoại lệ, cách tracking | T1-T7, công thức, vendor scorecard, PDCA |
| Người đọc | Khách hàng | Operations, NVKD, TP, GDKD |

---

## 1. ĐỊNH NGHĨA

### 1.1 On-Time Delivery (OTD)

```
OTD = (Số đơn giao đúng hạn / Tổng số đơn) × 100%
Đúng hạn = Giao trong khoảng SLA ± 1 ngày
```

### 1.2 SLA theo loại vận chuyển

| Loại | SLA | Đúng hạn = |
|------|-----|------------|
| Đường bộ | 5-7 ngày | Giao trong 4-8 ngày |
| Đường biển | 10-15 ngày | Giao trong 9-16 ngày |
| Đường hàng không | 1-2 ngày | Giao trong 2-3 ngày |

### 1.3 Các trạng thái giao hàng

| Status | Định nghĩa | Code |
|--------|------------|:----:|
| **On-Time** | Giao trong SLA ± 1 ngày | OT |
| **Early** | Giao trước SLA - 1 ngày | EA |
| **Late** | Giao sau SLA + 1 ngày | LT |
| **Damage** | Hàng hư hỏng khi giao | DM |
| **Exception** | Force majeure, lỗi khách | EX |

---

## 2. TIMELINE MILESTONES (T1-T7)

```
T1: Nhận đơn (Order Received)
T2: Xác nhận với KH (Order Confirmed)
T3: Hàng về kho TQ (At Warehouse)
T4: Xuất kho (Departed)
T5: Qua biên giới (Border Crossed)
T6: Về kho VN (Arrived VN Warehouse)
T7: Giao hàng (Delivered)

Lead Time = T7 - T1
Transit Time = T7 - T4
```

### Responsibility Timeline

| Mốc | Người phụ trách | Thời gian update |
|-----|-----------------|------------------|
| T1 - Nhận đơn | NVKD | Ngay khi có đơn |
| T2 - Confirm | Operations | Trong 2 giờ |
| T3 - Về kho TQ | Kho TQ | Ngay khi hàng đến |
| T4 - Xuất kho | Operations | Trước khi xe chạy |
| T5 - Qua biên giới | Vendor vận chuyển | Khi qua cửa khẩu |
| T6 - Về kho VN | Operations | Khi hàng về |
| T7 - Giao hàng | Operations | Khi giao xong + POD |

---

## 3. CÔNG THỨC TÍNH OTD

### 3.1 OTD theo đơn hàng

```
OTD_Đơn = Số đơn OT / Tổng số đơn × 100%
```

### 3.2 OTD theo giá trị

```
OTD_Giá trị = Giá trị đơn OT / Tổng giá trị × 100%
```

### 3.3 OTD tổng hợp

```
OTD Score = (OTD_Đơn × 60%) + (OTD_Giá trị × 40%)
```

---

## 4. EXCEPTION HANDLING

### 4.1 Loại trừ khỏi OTD

| Exception | Mô tả | Cần chứng minh |
|-----------|-------|:------------:|
| **Force Majeure** | Thiên tai, dịch bệnh, chiến tranh | ✓ |
| **Customs Hold** | Hải quan giữ hàng không do lỗi ERK | ✓ |
| **Customer Delay** | KH chậm cung cấp thông tin/đóng gói | ✓ |
| **Holiday** | Ngày lễ TQ/VN | ✓ |
| **Wrong Address** | KH cung cấp sai địa chỉ | ✓ |

### 4.2 Quy trình log exception

```
Phát hiện delay → Log vào system → Xác định nguyên nhân
→ Nếu là exception → Check điều kiện → Upload proof
→ Manager approve → Update OTD report
```

### 4.3 Maximum exception rate

```
Exception rate ≤ 5% tổng đơn
Nếu > 5% → Review quy trình
```

---

## 5. TRACKING PROCESS

### 5.1 Daily Tracking

| Công việc | Tần suất | Người thực hiện |
|-----------|----------|-----------------|
| Update status đơn | Daily (EOD) | Operations |
| Check overdue đơn | Daily (AM) | Operations |
| Follow-up vendor | Daily | Operations |
| Notify Sales về delay | Ngay khi biết | Operations |

### 5.2 Data Entry Template

```
| Mã đơn | Mã KH | Loại VC | T1 | T2 | T3 | T4 | T5 | T6 | T7 | SLA | Status | Exception |
```

---

## 6. BÁO CÁO

### 6.1 Weekly Report

| Nội dung | Người nhận |
|----------|------------|
| OTD tuần | GDKD, TPKD, Operations |
| Top 5 đơn late | GDKD, TPKD |
| Root cause analysis | GDKD |
| Action plan | GDKD |

### 6.2 Monthly Report

| Nội dung | Người nhận |
|----------|------------|
| OTD tháng | GDKD, Board |
| OTD theo tuyến đường | GDKD, Operations |
| OTD theo vendor | GDKD |
| Trend analysis | GDKD |
| Cải tiến đề xuất | GDKD |

---

## 7. ROOT CAUSE ANALYSIS

### 7.1 Phân loại nguyên nhân delay

| Category | Nguyên nhân | Action Owner |
|----------|-------------|--------------|
| **Vendor** | Xe hỏng, delay vendor | Operations |
| **Customs** | Hải quan kiểm tra | Operations |
| **Warehouse** | Chậm đóng gói, thiếu hàng | Operations |
| **Customer** | Thiếu thông tin, chốt chậm | Sales |
| **Internal** | Sai quy trình, communication | Operations |
| **External** | Tắc đường, thời tiết | N/A |

---

## 8. KPI & TARGET

| KPI | Target 2026 |
|-----|:----------:|
| OTD Tổng | **95%** |
| OTD Đường bộ | 95% |
| OTD Đường biển | 90% |
| OTD Đường hàng không | 98% |
| Exception rate | ≤ 5% |

### KPI Cascade

| Level | KPI | Target |
|-------|-----|:------:|
| Công ty | OTD tổng | 95% |
| Operations | OTD | 95% |
| Vendor | OTP (On-Time Pickup) | 98% |
| Vendor | OTD (On-Time Delivery) | 95% |

---

## 9. VENDOR PERFORMANCE

| Vendor | OTD Target | Action if below |
|--------|:---------:|-----------------|
| Đạt target | ≥ 95% | Tiếp tục hợp tác |
| Cảnh báo | 90-95% | Meeting, improvement plan |
| Review | 80-90% | Giảm volume, tìm vendor thay thế |
| Thay thế | < 80% | Chấm dứt hợp tác |

---

## 10. CẢNH BÁO TỰ ĐỘNG

| Trigger | Action |
|---------|--------|
| OTD tuần < 90% | Alert Operations Manager |
| 3 đơn late liên tiếp từ cùng vendor | Alert Operations + Flag vendor |
| Exception rate > 5% | Alert GDKD |
| Đơn quá hạn > 24h chưa update | Alert NVKD + TP |

---

## 11. COMMUNICATION FLOW KHI DELAY

```
Phát hiện delay → Internal:
1. Operations log vào system
2. Notify NVKD qua Zalo/Call
3. NVKD contact KH, giải thích + estimated time

External:
1. Gửi email thông báo cho KH
2. Update tracking
3. Follow-up đến khi giao xong
```

### 11.1 Nghiêm cấm hứa sai SLA

NVKD **không được** hứa với KH thời gian vận chuyển ngắn hơn SLA chuẩn (đường bộ 5-7 ngày, đường biển 10-15 ngày, hàng không 1-2 ngày) để chốt đơn. Chế tài cụ thể xem tại [marketing-sales-sla.md](marketing-sales-sla.md) §4.5.

---

## 12. PDCA IMPROVEMENT

```
PLAN    → Xác định target, quy trình
DO      → Thực hiện tracking
CHECK   → Review metrics, root cause
ACT     → Cải tiến quy trình
```

| Hoạt động | Tần suất |
|-----------|----------|
| Daily standup | Daily |
| Weekly review | Weekly |
| Monthly analysis | Monthly |
| Quarterly improvement | Quarterly |
| Annual audit | Annually |

---

## 13. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Operations chịu trách nhiệm tracking & báo cáo
- Review định kỳ: **Monthly** (OTD), **Quarterly** (Policy)
- Owner: Operations + GDKD

---

*Version 2.1 | 09/05/2026 | Target: 95% OTD by Q2 2026*
*Owner: Operations*
