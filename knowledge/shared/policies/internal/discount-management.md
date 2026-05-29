# KIỂM SOÁT CHIẾT KHẤU (Discount Control)

> **Policy Nội bộ** — Dành cho NVKD, TP, Finance, GDKD
> **Policy KH tương ứng:** `customer/discount-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 2.0

---

## PHÂN BIỆT VỚI POLICY KH

| Tiêu chí | Policy KH (`customer/discount-policy.md`) | Policy Nội bộ (file này) |
|----------|-------------------------------------------|---------------------------|
| Mục đích | Giới thiệu quyền lợi giảm giá cho KH | Kiểm soát việc áp dụng discount |
| Nội dung | Hạng VIP, mức giảm, điều kiện, FAQ | Hạn mức duyệt, quy trình, giám sát, audit |
| Người đọc | Khách hàng | NVKD, TP, Finance, GDKD |

---

## 1. PHÂN LOẠI KH & MỨC GIẢM GIÁ CHUẨN

| Hạng | Doanh thu/năm | Discount chuẩn | Gross Margin |
|------|---------------|:--------------:|:------------:|
| **Basic** | ≤ 50 triệu | 0% | 51% |
| **Pro** | ≤ 400 triệu | 10% | 43% |
| **Premium** | ≤ 2 tỷ | 20% | 33% |
| **Elite** | ≥ 2 tỷ | 30% | 31% |

> Giảm giá VIP chỉ áp dụng cho **CƯỚC VẬN CHUYỂN**. Phí ủy thác và phí rủi ro không được giảm.

---

## 2. GIỚI HẠN GIẢM GIÁ THEO CHỨC VỤ

| Chức vụ | Giảm tối đa | Ghi chú |
|---------|:----------:|---------|
| NVKD | 5% | Không cần phê duyệt |
| Trưởng phòng | 15% | Không cần phê duyệt |
| GDKD | 30% | Quyết định tối cao |

Discount trong hạn mức: Được quyền quyết định trực tiếp. Vượt hạn mức: Phải xin phê duyệt cấp trên.

---

## 3. QUY TRÌNH PHÊ DUYỆT

```
NVKD muốn giảm > 5% → Gửi request → TP → Phê duyệt/Từ chối
TP muốn giảm > 15% → Gửi request → GDKD → Phê duyệt/Từ chối
Discount > 30% → KHÔNG được phép (trừ CEO phê duyệt)
```

**Request phải bao gồm:** Mã KH, Lý do, Mức đề xuất, Giá trị đơn hàng, Lợi ích mang lại.

---

## 4. ĐIỀU KIỆN ÁP DỤNG

| Discount | Điều kiện volume | Cam kết hợp đồng |
|----------|------------------|:----------------:|
| 0-5% | Không yêu cầu | Không yêu cầu |
| 5-15% | Tối thiểu 50tr/tháng | 3 tháng |
| 15-30% | Tối thiểu 200tr/tháng | 6 tháng |
| >30% | Case-by-case | 12 tháng |

---

## 5. CÁC TRƯỜNG HỢP KHÔNG ĐƯỢC GIẢM GIÁ

1. **Khách hàng mới lần đầu** — Giá niêm yết (trừ khi TP approve)
2. **Đơn hàng < 10 triệu** — Không áp dụng discount
3. **Thanh toán chậm trễ** — Tạm ngưng discount đến khi thanh toán đủ
4. **KH có nợ quá hạn > 30 ngày** — Không discount cho đơn mới

---

## 6. GIÁM SÁT LẠM DỤNG

| Chỉ số | Ngưỡng cảnh báo | Hành động |
|--------|:--------------:|-----------|
| Tỷ lệ discount/doanh thu NVKD | > 15% | TP review |
| Số đơn discount vượt thẩm quyền | > 0 | Cảnh báo ngay |
| Discount TB team | > 20% | GDKD review |
| Cùng KH, discount tăng bất thường | > 5% vs tháng trước | TP kiểm tra |

### Cảnh báo tự động (CRM)

| Trigger | Action |
|---------|--------|
| NVKD áp discount > 5% không approval | Tự động alert TP |
| Discount > 15% không approval GDKD | Tự động alert GDKD |
| KH nợ quá hạn vẫn được discount | Tự động chặn, alert Finance |

---

## 7. QUY TRÌNH AUDIT

| Hoạt động | Tần suất | Owner |
|-----------|----------|-------|
| Kiểm tra ngẫu nhiên 10% đơn có discount | Hàng tuần | TP Team |
| Báo cáo discount theo NVKD | Hàng tháng | Finance |
| Audit toàn bộ discount > 5% | Hàng quý | Finance + GDKD |

---

## 8. PENALTY

| Vi phạm | Hình thức |
|---------|-----------|
| Giảm giá không có quyền | Warning + Reimbursement |
| Giảm giá không xin approval | Warning lần 1, Deduct lương lần 2 |
| Lạm dụng discount | Revoke quyền discount |

---

## 9. TEMPLATE REQUEST

```
**Yêu cầu phê duyệt giảm giá**

- Mã KH: [Mã] | Tên KH: [Tên]
- Hạng hiện tại: [Basic/Pro/Premium/Elite]
- Doanh thu 12 tháng: [Số]
- Giá trị đơn hàng: [Số]
- Discount chuẩn: [%] | Discount đề xuất: [%]

**Lý do:** [Chi tiết]
**Lợi ích kỳ vọng:** Volume: [Số] | Long-term: [Yes/No]

**Người đề xuất:** [Tên] | **Ngày:** [Ngày]
```

---

## 10. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026** (thay thế Discount Policy v1.1)
- NVKD báo cáo: Weekly số đơn có discount; Monthly tổng discount
- TP review: Monthly discount rate team; Quarterly audit compliance
- Finance audit: Quarterly margin analysis
- Review định kỳ: **Quý**

---

*Version 2.0 | 08/05/2026 | Owner: GDKD*
