# Phase 3: Quotation Module — Spec Chi Tiết
## CRM ERK Transport | Chỉ thiết kế .md

> Tham chiếu: `quotation-policy.md` (approval matrix, margin rules, templates)

---

## 1. TỔNG QUAN

### 1.1 Mục tiêu

- **100% báo giá trên CRM** — không làm Excel ngoài
- **Trigger L0→L1 tự động** khi tạo quote cho contact L0
- **Auto-fill VIP discount** theo hạng KH
- **Margin check realtime** khi nhập giá
- **Approval workflow** theo quotation-policy
- **Đo lường** số quote mới/NVKD/tháng, quote speed, conversion

### 1.2 Ai dùng?

| Role | Quyền |
|------|-------|
| NVKD | Tạo, sửa, gửi quote. Approve discount ≤5% (quote <50tr) |
| TP Sale | Approve discount >5% (quote <50tr), ≤10% (50-200tr) |
| GDKD | Approve discount >10% (50-200tr), tất cả quote >200tr |

---

## 2. QUOTE BUILDER

### 2.1 Tạo báo giá

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 TẠO BÁO GIÁ MỚI                                           │
│                                                                 │
│  ┌─ THÔNG TIN KH (auto-fill từ Lead) ──────────────────────┐  │
│  │ Lead: L-260501-042 — Cty Minh Anh Fashion               │  │
│  │ Người LH: Trần Minh Anh  │  SĐT: 0987 654 321          │  │
│  │ Email: anh@minhanh.vn     │  VIP: Basic (0% discount)   │  │
│  │ Địa chỉ: Q.Tân Bình, HCM                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ LOẠI HÌNH DỊCH VỤ * ──────────────────────────────────┐   │
│  │ ● Tự đứng tên trên tờ khai XNK                         │   │
│  │ ○ Ủy thác XNK (Có VAT)                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ LOẠI HÌNH VẬN CHUYỂN * ──────────────────────────────┐   │
│  │ ● Gom cont                                              │   │
│  │ ○ Nguyên lô FCL/LCL                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚡ Auto logic:                                                  │
│     • Tự đứng tên: KHÔNG có phí ủy thác                        │
│     • Ủy thác + Gom cont: Phí ủy thác 400.000đ/mục             │
│     • Ủy thác + Nguyên lô: Phí ủy thác 1-3% giá trị hàng       │
│                                                                 │
│  ┌─ THÔNG TIN SHIPMENT ────────────────────────────────────┐   │
│  │ Loại hàng *:     [Quần áo thời trang________________]   │   │
│  │ Xuất xứ *:       [Quảng Châu, Trung Quốc___________]   │   │
│  │ Điểm đến *:      [HCM, Việt Nam____________________]   │   │
│  │ Phương thức *:    [▼ Đường bộ ▼]                        │   │
│  │ Trọng lượng *:    [2000___] kg                           │   │
│  │ Volume:           [______] CBM                           │   │
│  │ Incoterms:        [▼ DDP ▼]                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ CHI TIẾT GIÁ (Line Items — gợi ý theo loại hình) ──────┐  │
│  │                                                          │  │
│  │ ⚡ Gợi ý auto theo: Ủy thác + Gom cont                  │  │
│  │                                                          │  │
│  │ #  │ Hạng mục             │ ĐVT  │ SL   │Đơn giá │Thành│  │
│  │────┼──────────────────────┼──────┼──────┼────────┼─────│  │
│  │ 1  │ ✅ Cước vận chuyển   │ /kg  │ 2000 │ 28.000 │56tr │  │
│  │ 2  │ ✅ Phí hải quan      │ lô   │ 1    │500.000 │500K │  │
│  │ 3  │ 🔒 Phí ủy thác (gom)│ /mục │ 1    │400.000 │400K │  │
│  │ 4  │ ☐ Phí kho            │ ngày │      │        │     │  │
│  │ 5  │ ☐ Phí nội địa TQ    │ lô   │      │        │     │  │
│  │ 6  │ ☐ Phí bảo hiểm      │ lô   │      │        │     │  │
│  │                                                          │  │
│  │ ✅ = auto thêm (bắt buộc)                                │  │
│  │ 🔒 = auto thêm, không giảm giá (ủy thác)               │  │
│  │ ☐  = gợi ý, NVKD tick nếu cần                          │  │
│  │                                                          │  │
│  │ [+ Thêm hạng mục khác]                                  │  │
│  │                                                          │  │
│  │ Tạm tính:                              56.900.000đ      │  │
│  │                                                          │  │
│  │ ┌─ GIẢM GIÁ ────────────────────────────────────────┐   │  │
│  │ │ VIP Auto: Basic = 0%                   0đ         │   │  │
│  │ │ Discount thêm: [____] % → [________] đ           │   │  │
│  │ │ ⚠️ Discount >5% cần TP approve (quote <50tr)     │   │  │
│  │ │ Lưu ý: Giảm giá KHÔNG áp dụng cho phí ủy thác   │   │  │
│  │ └───────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │ TỔNG CỘNG:                             56.900.000đ      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ MARGIN CHECK (realtime) ───────────────────────────────┐   │
│  │ Giá vốn (auto từ hệ thống):    29.500.000đ              │   │
│  │ Margin:                          48.1%                    │   │
│  │ Target (Basic):                  51%  ⚠️ dưới target    │   │
│  │ Min (Basic):                     45%  ✅ trên min        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ ĐIỀU KHOẢN ────────────────────────────────────────────┐   │
│  │ Lead time: [5-7 ngày làm việc_______]                    │   │
│  │ Thanh toán: [▼ Theo Credit Policy ▼]                     │   │
│  │ Bảo hiểm:  [▼ Không bao gồm ▼]                          │   │
│  │ Ghi chú:   [___________________________________]         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Lưu nháp]  [Gửi duyệt]  [Gửi KH]                           │
│                                                                 │
│  ⚡ Khi lưu/gửi: Nếu lead đang L0 → AUTO chuyển L1            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Margin Check realtime

```
KHI NVKD NHẬP GIÁ:

1. Hệ thống lấy giá vốn từ bảng giá cước (OPS update hàng tuần)
2. Tính margin = (Giá bán - Giá vốn) / Giá bán × 100%
3. So sánh với target/min margin theo VIP tier

┌─ MARGIN INDICATOR ──────────────────────────────┐
│                                                  │
│  Margin 48.1%  [████████████████░░░░]            │
│                               ▲         ▲        │
│                            Min=45%   Target=51%  │
│                                                  │
│  🟢 ≥ Target:  "Margin OK"                      │
│  🟡 ≥ Min:     "Dưới target, có thể approve"    │
│  🔴 < Min:     "Dưới min, cần GDKD approve"     │
└──────────────────────────────────────────────────┘
```

### 2.3 Bảng gợi ý hạng mục theo loại hình

| Hạng mục | Tự đứng tên + Gom | Tự đứng tên + Nguyên lô | Ủy thác + Gom | Ủy thác + Nguyên lô |
|----------|:--:|:--:|:--:|:--:|
| Cước vận chuyển | ✅ Bắt buộc | ✅ Bắt buộc | ✅ Bắt buộc | ✅ Bắt buộc |
| Phí hải quan | ☐ Gợi ý | ☐ Gợi ý | ✅ Bắt buộc | ✅ Bắt buộc |
| Phí ủy thác | — | — | 🔒 400K/mục | 🔒 1-3% giá trị |
| Phí rủi ro (>100tr/m³) | — | — | ☐ Gợi ý | ☐ Gợi ý |
| Phí kho | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý |
| Phí nội địa TQ | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý |
| Phí bảo hiểm | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý |
| Phí cont (Full) | — | ☐ Gợi ý | — | ☐ Gợi ý |
| Phí xử lý đặc biệt | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý | ☐ Gợi ý |

> ✅ Bắt buộc = auto thêm, không xóa được
> 🔒 = auto thêm, không giảm giá, không xóa
> ☐ Gợi ý = hiện sẵn, NVKD tick để thêm
> — = không hiện

### 2.4 VIP Discount auto-fill

```
KHI TẠO QUOTE CHO KH:

1. Hệ thống check lead.vip_tier
2. Auto fill discount theo bảng VIP:

  Basic:   0%
  Pro:     Theo thỏa thuận (manual input, TP approve)
  Premium: Theo thỏa thuận (manual input, TP approve)
  Elite:   Theo thỏa thuận (manual input, GDKD approve)

3. Discount CHỈ áp dụng cho cước vận chuyển
4. Phí ủy thác KHÔNG giảm (hiện warning nếu NVKD cố gắng giảm)
```

---

## 3. APPROVAL WORKFLOW

### 3.1 Flow

```
NVKD tạo quote
     │
     ├── Không cần approve (discount ≤5%, quote <50tr)
     │   → Status: SENT
     │   → Gửi KH ngay
     │
     ├── Cần TP approve
     │   → Status: PENDING_APPROVAL
     │   → Notification → TP Sale
     │   → TP approve → SENT → Gửi KH
     │   → TP reject → DRAFT (sửa lại)
     │
     └── Cần GDKD approve
         → Status: PENDING_APPROVAL
         → Notification → GDKD (+ CC TP)
         → GDKD approve → SENT → Gửi KH
         → GDKD reject → DRAFT (sửa lại)
```

### 3.2 Approval Matrix (theo policy)

| Giá trị quote | Discount | Approve |
|---------------|----------|---------|
| < 50tr | ≤ 5% | NVKD tự approve |
| < 50tr | > 5% | TP approve |
| 50-200tr | ≤ 10% | TP approve |
| 50-200tr | > 10% | GDKD approve |
| > 200tr | Any | GDKD approve |
| > 500tr | Any | GDKD + Finance review |
| Dưới Min Margin | Any | GDKD approve |

### 3.3 Màn hình Approval

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ PHÊ DUYỆT BÁO GIÁ                                         │
│                                                                 │
│  Quote: QT-260502-001 │ NVKD: Hùng │ KH: Cty Minh Anh         │
│  Giá trị: 56.9tr │ Discount: 8% │ Margin: 44.2%               │
│                                                                 │
│  ⚠️ Discount 8% > 5% → cần TP approve (quote <50tr)            │
│  ⚠️ Margin 44.2% < Target 51% (nhưng ≥ Min 45%)               │
│                                                                 │
│  Ghi chú NVKD: "KH mới, cần giá tốt để chốt đơn đầu"         │
│                                                                 │
│  TP ghi chú:    [___________________________________]           │
│                                                                 │
│  [❌ Từ chối]                              [✅ Phê duyệt]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. QUOTE STATUS & TRACKING

### 4.1 Trạng thái báo giá

| Status | Mô tả | Ai action |
|--------|-------|-----------|
| `DRAFT` | Đang soạn | NVKD |
| `PENDING_APPROVAL` | Chờ duyệt | TP/GDKD |
| `SENT` | Đã gửi KH | System |
| `VIEWED` | KH đã xem (nếu track được) | System |
| `NEGOTIATING` | Đang đàm phán | NVKD |
| `ACCEPTED` | KH chấp nhận → tạo đơn | NVKD |
| `REJECTED` | KH từ chối | NVKD |
| `EXPIRED` | Hết hạn | System (auto) |

### 4.2 Follow-up Alerts

| Ngày | Alert | Ai nhận |
|------|-------|---------|
| 0 | Quote sent | TP Sale (info) |
| 1 | "Check KH đã nhận chưa?" | NVKD |
| 3 | "Follow-up: có câu hỏi gì?" | NVKD |
| 5 | "Follow-up: timeline quyết định?" | NVKD |
| 6 | "Quote sắp hết hạn (ngày mai)" | NVKD + TP |
| 7 | "Quote expired — renew hay close?" | NVKD |

### 4.3 Danh sách quote (NVKD view)

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 BÁO GIÁ CỦA TÔI                     [Tháng ▼] [Status ▼]  │
│                                                                 │
│  [+ Tạo báo giá mới]                                           │
│                                                                 │
│  ┌────────┬──────────┬─────────┬───────┬────────┬───────────┐  │
│  │ Quote# │ KH       │ Giá trị │Margin │ Status │ Hết hạn   │  │
│  ├────────┼──────────┼─────────┼───────┼────────┼───────────┤  │
│  │QT-0501 │Cty ABC   │ 56.9tr  │ 48%   │✅ Sent │ 2d left   │  │
│  │QT-0502 │Cty DEF   │ 120tr   │ 52%   │⏳ Appro│ —         │  │
│  │QT-0503 │Cty GHI   │ 35tr    │ 55%   │📝 Draft│ —         │  │
│  │QT-0420 │Cty JKL   │ 80tr    │ 45%   │✅ Acce │ —         │  │
│  │QT-0415 │Cty MNO   │ 42tr    │ 50%   │❌ Rej  │ —         │  │
│  │QT-0410 │Cty PQR   │ 65tr    │ 48%   │⌛ Expir│ expired   │  │
│  └────────┴──────────┴─────────┴───────┴────────┴───────────┘  │
│                                                                 │
│  Tháng này: 6 quotes │ Accepted: 1 │ Pending: 2 │ Rate: 17%   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. TÍCH HỢP VỚI LEAD LIFECYCLE

### 5.1 Quote trigger L0→L1

```
KHI NVKD TẠO QUOTE (lưu hoặc gửi):

IF lead.status == L0:
    → lead.status = L1 (auto)
    → lead.first_quote_at = now()
    → log: "Quote #{number} tạo → AUTO L0→L1"
    → notification: TP Sale

IF lead.status == L0 AND lead.tag == RECYCLE:
    → lead.status = L1 (auto)
    → log: "Quote #{number} tạo cho [RECYCLE] → AUTO L0→L1"

IF lead.status == L4 (resale):
    → KHÔNG auto chuyển (L4 không có rule auto)
    → log: "Quote #{number} tạo từ L4"
```

### 5.2 Quote → Order (L1→L2)

```
KHI NVKD CHUYỂN QUOTE STATUS → ACCEPTED:

→ Hiện popup: "Tạo đơn hàng từ báo giá này?"
→ Nếu Yes: Auto tạo ORDER với est_revenue = quote total
→ Nếu lead.status == L1:
    → lead.status = L2 (auto)
    → lead.first_order_at = now()
```

### 5.3 Quote Rejected → L1→L3

```
KHI NVKD CHUYỂN QUOTE STATUS → REJECTED:

→ Bắt buộc chọn lý do: [Giá] [Thời gian] [Đối thủ] [Không nhu cầu] [Khác]
→ Bắt buộc ghi chú

IF lý do = khách quan (Giá, Thời gian, Đối thủ):
    → lead.status = L3
    → log reject reason

IF lý do = nghiêm trọng (NVKD muốn blacklist):
    → Tạo request L5 → TP Sale approve
```

---

## 6. DATA MODEL

### 6.1 QUOTATION

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | UUID | PK |
| `quote_number` | String | Auto: "QT-YYYYMMDD-XXX" |
| `lead_id` | FK → Lead | KH được báo giá |
| `service_type` | Enum | `SELF_DECLARED`, `ENTRUSTED` (tự đứng tên / ủy thác) |
| `transport_type` | Enum | `CONSOLIDATION`, `FCL_LCL` (gom cont / nguyên lô) |
| `status` | Enum | `DRAFT`, `PENDING_APPROVAL`, `SENT`, `VIEWED`, `NEGOTIATING`, `ACCEPTED`, `REJECTED`, `EXPIRED` |
| `shipment_type` | String | Loại hàng |
| `origin` | String | Xuất xứ |
| `destination` | String | Điểm đến |
| `transport_method` | Enum | `ROAD`, `SEA`, `AIR`, `MULTIMODAL` |
| `weight_kg` | Decimal | Trọng lượng |
| `volume_cbm` | Decimal | Volume |
| `incoterms` | String | DDP/DDU/... |
| `subtotal` | Decimal | Tạm tính (tổng line items) |
| `vip_discount_pct` | Decimal | % giảm VIP auto |
| `extra_discount_pct` | Decimal | % giảm thêm (manual) |
| `discount_amount` | Decimal | Số tiền giảm |
| `total` | Decimal | Tổng sau giảm |
| `cost_price` | Decimal | Giá vốn (từ bảng giá cước) |
| `margin_pct` | Decimal | Margin % (computed) |
| `lead_time` | String | Thời gian vận chuyển |
| `payment_terms` | String | Điều kiện thanh toán |
| `insurance` | Boolean | Có bảo hiểm? |
| `valid_until` | Date | Ngày hết hạn |
| `notes` | Text | Ghi chú |
| `reject_reason` | Enum | Lý do KH từ chối |
| `reject_note` | Text | Chi tiết reject |
| `approved_by` | FK → User | Ai approve |
| `approved_at` | Timestamp | Khi nào approve |
| `sent_at` | Timestamp | Khi nào gửi KH |
| `created_by` | FK → User | NVKD tạo |
| `created_at` | Timestamp | Auto |
| `updated_at` | Timestamp | Auto |

### 6.2 QUOTATION_LINE_ITEM

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | UUID | PK |
| `quotation_id` | FK → Quotation | Quote cha |
| `sort_order` | Integer | Thứ tự hiển thị |
| `description` | String | Tên hạng mục |
| `unit` | String | Đơn vị (kg, lô, mục...) |
| `quantity` | Decimal | Số lượng |
| `unit_price` | Decimal | Đơn giá |
| `amount` | Decimal | Thành tiền (auto = qty × price) |
| `is_discountable` | Boolean | Có áp dụng giảm giá không? (phí ủy thác = false) |

---

## 7. ACCEPTANCE CRITERIA

### 7.1 Quote Builder
- [ ] Chọn loại hình dịch vụ (Tự đứng tên / Ủy thác) trước khi báo giá
- [ ] Ủy thác → auto thêm line phí ủy thác (không giảm giá)
- [ ] Auto-fill thông tin KH từ Lead
- [ ] Line items: thêm/sửa/xóa hạng mục
- [ ] Phí ủy thác không cho áp dụng discount (is_discountable=false)
- [ ] Auto tính tổng, discount, margin realtime

### 7.2 VIP & Margin
- [ ] Auto-fill VIP discount theo lead.vip_tier
- [ ] Margin indicator (🟢🟡🔴) realtime khi nhập giá
- [ ] Warning khi margin dưới target, block khi dưới min (cần GDKD)

### 7.3 Approval
- [ ] Approval matrix đúng theo policy
- [ ] Notification cho approver khi có quote chờ duyệt
- [ ] Approve/Reject flow hoạt động đúng

### 7.4 Lifecycle Integration
- [ ] Tạo quote cho L0 contact → AUTO chuyển L1
- [ ] Quote ACCEPTED → tạo Order → AUTO L1→L2
- [ ] Quote REJECTED → bắt buộc lý do → L1→L3 hoặc request L5
- [ ] Quote EXPIRED → auto alert

### 7.5 Tracking
- [ ] 8 trạng thái quote hoạt động đúng
- [ ] Follow-up alerts theo timeline (ngày 1, 3, 5, 6, 7)
- [ ] Dashboard: quote count, acceptance rate, avg margin

---

## 8. NEXT → Phase 4 (Automation & Polish)

Phase 4 sẽ spec:
- Auto-scheduler (L2→L3 30 ngày, L3 gỡ Sale 7 ngày)
- Notification engine
- Data import/export
- User management & auth
- Mobile responsive
