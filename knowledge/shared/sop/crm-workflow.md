# CRM WORKFLOW — ERK Transport
> Quy trình quản lý Lead L0-L5, báo giá, đo lường & tự động hóa trên CRM
> Phiên bản: 1.0 | Ngày: 04/05/2026

---

## 1. VÒNG ĐỜI LEAD (L0-L5)

### 1.1 Tổng quan

| Status | Tên | Mô tả | Trigger vào |
|:------:|-----|-------|-------------|
| **L0** | Draw Data | Tất cả contact mới | Tạo manual/import |
| **L1** | Đã báo giá | NVKD đã tạo quote trên CRM | AUTO khi tạo báo giá |
| **L2** | Đi hàng | KH đã có đơn vận chuyển | AUTO khi quote ACCEPTED + tạo đơn |
| **L3** | Tạm dừng | KH tạm ngưng, xóa attribution | AUTO khi Sale không confirm 7d |
| **L4** | Resale | TP Sale assign Sale mới | TP Sale chuyển thủ công |
| **L5** | Blacklist | Bỏ hẳn | TP Sale approve |

### 1.2 L0 — Draw Data (3 tag)

| Tag | Mô tả | Xóa được? |
|-----|-------|:---------:|
| `NEW` | Lead mới hoàn toàn | ✅ |
| `RECYCLE` | Từ L3, có lịch sử đơn | ❌ |
| `POTENTIAL` | Đang bám đuổi, chưa sẵn sàng | ❌ |

### 1.3 Transition Matrix

| Từ → Đến | Trigger | Ai thực hiện |
|-----------|---------|:------------:|
| L0 → L1 | Tạo báo giá trên CRM | AUTO (system) |
| L1 → L2 | Quote ACCEPTED + tạo đơn | AUTO (system) |
| L1 → L3 | KH từ chối (lý do khách quan) | NVKD |
| L1 → L5 | KH blacklist | NVKD request + TP approve |
| L2 → L2 ⚠️ | 30d không đơn → cảnh báo (vẫn L2) | AUTO (system) |
| L2 ⚠️ → L2 | Sale confirm giữ KH (reset 30d) | NVKD |
| L2 ⚠️ → L3 | Sale không confirm trong 7d | AUTO (system) |
| L3 → L0 [RECYCLE] | MKT lấy remarketing (nếu unowned) | MKT Staff |
| L3 → L4 | TP Sale assign Sale mới | TP Sale |
| L3 → L5 | Blacklist | TP Sale approve |
| L4 → L1 | Sale mới tạo báo giá | AUTO (system) |

> **Quy tắc L2 → L3:** 30d không đơn → cảnh báo (VẪN Ở L2) → Sale có 7d confirm → nếu không confirm → AUTO chuyển L3 + gỡ Sale. Tổng: 37 ngày từ đơn cuối.

---

## 2. BÁO GIÁ (QUOTATION MODULE)

### 2.1 Tạo báo giá

**Bước 1:** Chọn loại hình dịch vụ:
- Tự đứng tên trên tờ khai XNK
- Ủy thác XNK (Có VAT)

**Bước 2:** Chọn loại hình vận chuyển:
- Gom cont
- Nguyên lô FCL/LCL

**Bước 3:** Nhập thông tin shipment + line items (gợi ý theo loại hình)

### 2.2 Gợi ý hạng mục chi phí

| Hạng mục | Tự đứng tên + Gom | Tự đứng tên + Nguyên lô | Ủy thác + Gom | Ủy thác + Nguyên lô |
|----------|:--:|:--:|:--:|:--:|
| Cước vận chuyển | ✅ | ✅ | ✅ | ✅ |
| Phí hải quan | ☐ | ☐ | ✅ | ✅ |
| Phí ủy thác | — | — | 🔒 400K/mục | 🔒 1-3% giá trị |
| Phí rủi ro (>100tr/m³) | — | — | ☐ | ☐ |
| Phí kho / nội địa TQ / bảo hiểm | ☐ | ☐ | ☐ | ☐ |
| Phí cont (Full) | — | ☐ | — | ☐ |

✅ = auto bắt buộc | 🔒 = auto, không giảm giá | ☐ = gợi ý | — = ẩn

### 2.3 Approval Matrix

| Giá trị quote | Discount | Approve |
|---------------|----------|---------|
| < 50tr | ≤ 5% | NVKD tự approve |
| < 50tr | > 5% | TP approve |
| 50-200tr | ≤ 10% | TP approve |
| 50-200tr | > 10% | GDKD approve |
| > 200tr | Any | GDKD approve |
| > 500tr | Any | GDKD + Finance |
| Dưới Min Margin | Any | GDKD approve |

### 2.4 Margin Guidelines

| Hạng KH | Target Margin | Min Margin |
|---------|:---:|:---:|
| Basic | 51% | 45% |
| Pro | 43% | 38% |
| Premium | 33% | 28% |
| Elite | 31% | 25% |

### 2.5 Quote Status

`DRAFT` → `PENDING_APPROVAL` → `SENT` → `VIEWED` → `NEGOTIATING` → `ACCEPTED` / `REJECTED` / `EXPIRED`

---

## 3. REVENUE: DỰ KIẾN vs THỰC TẾ

| Loại | Khi nào | Dùng cho |
|------|---------|---------|
| **Est. Revenue** | Ngay khi đặt đơn | Dashboard, KPI, đo convert |
| **Actual Revenue** | Sau đối soát | VIP tier, commission, tài chính |

| Trạng thái đơn | Est. | Actual |
|:---:|:---:|:---:|
| PENDING 🔵 | ✅ | ❌ |
| IN_TRANSIT 🟡 | ✅ | ❌ |
| COMPLETED ✅ | ✅ | ✅ |
| CANCELLED ❌ | Xóa | ❌ |

> **Rule 30d → cảnh báo L2:** Tính từ `last_order_created_at` (ngày TẠO đơn cuối).

---

## 4. DASHBOARD & ĐO LƯỜNG

### 4.1 Marketing Dashboard

| KPI | Công thức |
|-----|-----------|
| Lead Draw | COUNT(L0 src=MKT + RECYCLE by MKT trong tháng) |
| Quotation Rate | Leads MKT có quote / Lead Draw × 100% |
| Convert Rate | Leads MKT đạt L2 / Leads MKT có quote × 100% |
| CPL | Campaign total_cost / lead_count |

### 4.2 TP Sale Dashboard

| KPI | Công thức |
|-----|-----------|
| Lead MKT nhận | COUNT(leads assigned trong tháng) |
| Quote Speed TB | AVG(first_quote_at - assigned_at) cho lead draw data |
| Convert L2 | COUNT(leads đạt L2 trong tháng) |
| Retention | KH L2 cuối tháng / KH L2 đầu tháng |

### 4.3 Campaign Management

- CRUD chiến dịch (tên, kênh, ngày, chi phí 3 loại)
- CPL auto = tổng chi phí / số leads
- Funnel per campaign (L0→L1→L2 + reject)
- So sánh campaigns: CPL, Convert Rate, ROI

---

## 5. AUTO-SCHEDULER (5 Jobs)

| # | Job | Logic |
|---|-----|-------|
| 1 | L2 Warning (30d) | L2 + 30d không đơn → cảnh báo, Sale 7d confirm (vẫn L2) |
| 2 | L2→L3 Check | Warning + 7d Sale không confirm → L3 + gỡ Sale |
| 3 | Quote Expired | Quote SENT + hết hạn → EXPIRED + alert |
| 4 | L2 Early Warning (25d) | L2 + 25d không đơn → alert sớm |
| 5 | Monthly Report | Ngày 1 mỗi tháng → auto report |

---

## 6. NOTIFICATION RULES (14 rules)

| # | Event | Ai nhận | Mức |
|---|-------|---------|:---:|
| 1-2 | MKT giao lead mới | NVKD + TP Sale | 🟢 |
| 3-4 | Lead > 24h chưa quote | NVKD + TP Sale | 🟡 |
| 5 | Lead > 48h chưa quote | TP + GDKD | 🔴 |
| 6 | KH 25+ ngày không đơn | NVKD | 🟡 |
| 7 | KH 30d cần confirm (7d) | NVKD + TP | 🔴 |
| 8 | Hết 7d không confirm → L3 | TP Sale | 🔴 |
| 9 | Convert KH mới (→L2) | TP + MKT | 🟢 |
| 10 | Quote reject → L3 | MKT | 🟡 |
| 11 | Request L5 | TP Sale | 🔴 |
| 12 | Quote chờ duyệt | TP/GDKD | 🟡 |
| 13 | Quote hết hạn | NVKD | 🟡 |
| 14 | Monthly report | MKT+TP+GDKD | 🟢 |

---

## 7. PHÂN QUYỀN (RBAC)

| Chức năng | MKT Staff | MKT Lead | NVKD | TP Sale | GDKD |
|-----------|:-:|:-:|:-:|:-:|:-:|
| Tạo lead (MKT) | ✅ | ✅ | — | — | ✅ |
| Tạo lead (Sale) | — | — | ✅ | ✅ | ✅ |
| Assign lead | ✅ | ✅ | — | ✅ | ✅ |
| Tạo quote | — | — | ✅ | ✅ | ✅ |
| Lấy L3 → L0 | ✅ | ✅ | — | — | ✅ |
| Chuyển L3 → L4 | — | — | — | ✅ | ✅ |
| Approve L5 | — | — | — | ✅ | ✅ |
| Tạo campaign | ✅ | ✅ | — | — | ✅ |
| Quản lý user | — | — | — | — | ✅ |

---

## 8. IMPORT / OFFBOARD

### Import Lead
- Format: Excel (.xlsx)
- Duplicate check: SĐT, Zalo, Email
- Preview trước khi import
- Auto set: L0, tag=NEW, source=dept

### Offboard NV
- NVKD nghỉ: leads chuyển cho TP Sale reassign
- MKT nghỉ: campaigns chuyển cho MKT Lead
- Data giữ nguyên (không xóa)

---

*Chi tiết từng phase: xem thư mục `sop/crm/`*
- `crm/phase1-lead-pipeline.md` — Data model, wireframes, business rules
- `crm/phase2-dashboard.md` — 4 dashboards, revenue model, campaign management, monthly report
- `crm/phase3-quotation.md` — Quote builder, approval, margin check, lifecycle
- `crm/phase4-automation.md` — Scheduler, notifications, RBAC, import/export, audit
- `crm/journey-example.md` — Ví dụ hành trình KH L0→L5 (Cty Minh Anh)


