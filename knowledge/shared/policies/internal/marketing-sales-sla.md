# MARKETING - SALES SLA (Service Level Agreement)

> **Policy Nội bộ** — Dành cho Marketing, NVKD, TP, GDKD
> **Đây là policy thuần nội bộ, không có policy KH tương ứng**
> **Tham chiếu:** `sop/crm-workflow.md` (quy trình CRM chi tiết)
> Ngày ban hành: 08/05/2026 | Phiên bản: 2.1

---

## 1. MỤC ĐÍCH

- Quản lý toàn bộ lead trên **CRM tập trung** (không qua Zalo/Excel)
- Enforce báo giá trên hệ thống — trigger tự động L0→L1
- Đo lường chính xác hiệu quả Marketing (CPL, Convert Rate) và Sales (Quote Speed, Retention)
- Đảm bảo handoff rõ ràng, không mất data, có audit trail

---

## 2. VÒNG ĐỜI LEAD TRÊN CRM

| Status | Tên | Trigger |
|:------:|-----|---------|
| **L0** | Draw Data | MKT/Sale tạo, import, hoặc lấy từ L3 |
| **L1** | Đã báo giá | AUTO khi NVKD tạo quote trên CRM |
| **L2** | Đi hàng | AUTO khi quote ACCEPTED + tạo đơn |
| **L3** | Tạm dừng | AUTO khi Sale không confirm (30d+7d) |
| **L4** | Resale | TP Sale assign Sale mới |
| **L5** | Blacklist | TP Sale approve |

---

## 3. MARKETING CAM KẾT

### 3.1 Targets 2026

| Metric | Target | Ghi chú |
|--------|:------:|---------|
| **Lead Draw** | 150 leads/tháng | Bao gồm mới + recycle |
| **Quotation Rate** | ≥ 30% | % lead được Sale báo giá |
| **Convert Rate** | ≥ 2.4% | % lead đạt L2 / lead có quote |
| **CPL** | ≤ 100K VND | Tính theo campaign |

### 3.2 Trách nhiệm MKT

| Hành động | SLA |
|-----------|:---:|
| Tạo lead vào CRM (L0) | Ngay khi tiếp nhận |
| Assign lead cho NVKD phù hợp | Trong 4h làm việc |
| Tạo campaign trên CRM (tên, kênh, chi phí) | Trước khi chạy campaign |
| Cập nhật chi phí campaign | Hàng tuần |
| Lấy L3 unowned → L0 [RECYCLE] để remarketing | Khi cần |

### 3.3 MKT KHÔNG được

- Giao lead qua Zalo (phải trên CRM)
- Xóa lead L0 tag [RECYCLE] hoặc [POTENTIAL]
- Lấy lead L3 còn gắn Sale (assigned_to ≠ NULL)

---

## 4. SALES CAM KẾT

### 4.1 Quote Speed

| Metric | SLA | Escalation |
|--------|:---:|------------|
| Quote Speed (từ assign → tạo báo giá) | ≤ 24h | > 24h → alert TP Sale |
| | | > 48h → alert GDKD |

> **Báo giá = trên CRM.** Không làm qua Excel. Tạo quote → AUTO chuyển L0→L1.

### 4.2 Trách nhiệm NVKD

| Hành động | SLA |
|-----------|:---:|
| Tạo báo giá cho L0 được assign | ≤ 24h |
| Cập nhật status quote (gửi KH, đàm phán, accept/reject) | Trong ngày |
| Follow-up quote đã gửi | Ngày 1, 3, 5, 7 sau gửi |
| Confirm giữ KH khi nhận cảnh báo 30d | Trong 7 ngày |
| Nhập lý do khi KH reject | Bắt buộc |

### 4.3 NVKD KHÔNG được

- Báo giá ngoài CRM (Excel, Zalo)
- Tự chuyển status lead thủ công (L0→L1 phải qua quote)
- Xóa lead có tag [POTENTIAL]

### 4.4 CRM Log SLA

Mọi tương tác với KH (gọi điện, nhắn tin, gửi báo giá, gặp mặt) phải được log vào CRM trong vòng **24h** kể từ thời điểm tương tác.

| Vi phạm | Chế tài |
|---------|---------|
| 1-2 lần không log/tháng | Nhắc nhở |
| 3-4 lần không log/tháng | Trừ P3 + Cảnh cáo |
| ≥ 5 lần không log/tháng | Trừ P3 + Giảm capacity + Review với TP |

### 4.5 Hứa sai SLA vận chuyển

Nghiêm cấm NVKD hứa với KH thời gian vận chuyển **ngắn hơn SLA chuẩn** (đường bộ 5-7 ngày, đường biển 10-15 ngày, hàng không 1-2 ngày) để chốt đơn.

| Vi phạm | Chế tài |
|---------|---------|
| Lần đầu | Trừ P3 + Chịu chi phí phát sinh nếu KH khiếu nại |
| Tái phạm | Trừ P3 + Cảnh cáo + Giảm capacity |
| Gây thiệt hại nghiêm trọng (KH hủy hợp đồng, đòi bồi thường) | NVKD chịu 100% thiệt hại + Cảnh cáo + Tạm đình chỉ |

---

## 5. QUY TRÌNH CHUYỂN GIAO (HANDOFF)

### 5.1 MKT → Sale

```
MKT tạo lead L0 trên CRM → MKT assign cho NVKD phù hợp
→ NVKD nhận notification → TP Sale thấy trên dashboard
→ NVKD tạo báo giá → AUTO L0→L1
```

### 5.2 Sale → L3 → MKT (Recycle)

```
L2 + 30 ngày không đơn → Cảnh báo (vẫn L2)
→ Sale có 7 ngày confirm giữ KH
→ Nếu confirm → reset chu kỳ 30 ngày
→ Nếu không → AUTO L3 + gỡ Sale
→ MKT có thể lấy lead L3 unowned → L0 [RECYCLE]
```

### 5.3 Reject Flow

```
KH từ chối báo giá:
→ NVKD chọn lý do: [Giá] [Thời gian] [Đối thủ] [Không nhu cầu]
→ Lý do khách quan → L1→L3
→ Lý do nghiêm trọng → request L5 (TP approve)
```

---

## 6. ĐO LƯỜNG CHUNG

### 6.1 Marketing Metrics

| Metric | Công thức | Target |
|--------|-----------|:------:|
| Lead Draw | L0 mới + recycle by MKT/tháng | 150 |
| Quotation Rate | Leads có quote / Lead Draw | ≥ 30% |
| Convert Rate | Leads đạt L2 / Leads có quote | ≥ 2.4% |
| CPL | Campaign cost / leads | ≤ 100K |

### 6.2 Sales Metrics

| Metric | Công thức | Target |
|--------|-----------|:------:|
| Quote Speed TB | AVG(first_quote_at - assigned_at) | ≤ 24h |
| Retention L2 | L2 cuối tháng / L2 đầu tháng | ≥ 90% |
| Quote → Accept Rate | — | ≥ 40% |

### 6.3 Joint Metrics

| Metric | Target |
|--------|:------:|
| KH mới (L2) / tháng | 45 |
| Revenue KH mới (30d đầu) | 10% total |
| CAC | Track |
| Cycle Time (L0→L2) | Track |

---

## 7. ESCALATION

| Tình huống | Escalate đến | Timing |
|------------|:------------:|--------|
| Lead > 24h chưa quote | TP Sale | Auto alert |
| Lead > 48h chưa quote | GDKD | Auto alert |
| KH 30d không đơn, Sale không confirm | TP Sale | Auto → L3 sau 7d |
| Conflict lead quality | GDKD | Meeting |

---

## 8. MONTHLY REPORT (Tự động)

**Sinh ra:** Ngày 1 hàng tháng bởi CRM
**Gửi cho:** MKT Lead, TP Sale, GDKD

1. **Marketing:** Lead Draw, Quotation Rate, Convert Rate, CPL, Lead by channel
2. **Sales:** Quote Speed, Convert by NVKD, Retention, Revenue KH mới
3. **Executive:** KH mới, Revenue, CAC, Pipeline health
4. **Top NVKD:** Ranking theo lead, quote, convert, revenue
5. **Alerts:** SLA vi phạm, issues

---

## 9. REVIEW & ADJUSTMENT

| Thời điểm | Nội dung |
|-----------|----------|
| Monthly | Review metrics trên CRM dashboard |
| Quarterly | Full SLA review, update targets |
| Annually | Major revision theo strategy |

---

*Version 2.2 | 09/05/2026 | Review tiếp theo: 30/06/2026*
*Owner: Marketing Manager + Sales Manager + GDKD*
