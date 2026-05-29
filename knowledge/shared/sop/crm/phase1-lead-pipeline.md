# Phase 1: Core Lead Pipeline — Spec Chi Tiết
## CRM ERK Transport | Chỉ thiết kế .md

---

## 1. DATA MODEL

### 1.1 LEAD (Bảng chính)

| Field | Type | Required | Mô tả |
|-------|------|:--------:|-------|
| `id` | UUID | ✅ | PK, auto |
| `code` | String | ✅ | Auto: "L-YYYYMMDD-XXX" |
| `name` | String | ✅ | Tên KH/người liên hệ |
| `phone` | String | ✅ | Số điện thoại |
| `zalo` | String | | Zalo (thường = phone) |
| `email` | String | | Email |
| `company_name` | String | | Tên công ty |
| `address` | String | | Địa chỉ KH |
| `status` | Enum | ✅ | `L0`, `L1`, `L2`, `L3`, `L4`, `L5` |
| `tag` | Enum | ✅ | `NEW`, `RECYCLE`, `POTENTIAL` (chỉ ở L0) |
| `source` | Enum | ✅ | `MKT_NEW`, `MKT_RECYCLE`, `SALE_SELF`, `CUSTOMER_SELF`, `RESALE` |
| `source_channel` | Enum | | `FB_ADS`, `TIKTOK`, `WEBSITE`, `EVENT`, `HOTLINE`, `REFERRAL`, `OTHER` |
| `campaign_id` | FK → Campaign | | Nullable, chỉ khi source=MKT |
| `created_by_dept` | Enum | ✅ | `MARKETING`, `SALES` |
| `created_by` | FK → User | ✅ | Ai tạo |
| `assigned_to` | FK → User | | NVKD được assign (nullable = unowned) |
| `assigned_by` | FK → User | | Ai assign |
| `assigned_at` | Timestamp | | Thời điểm assign |
| `first_quote_at` | Timestamp | | Thời điểm tạo báo giá đầu → trigger L0→L1 |
| `first_order_at` | Timestamp | | Thời điểm đơn đầu → trigger L1→L2 |
| `last_order_at` | Timestamp | | Đơn gần nhất |
| `monthly_revenue` | Decimal | | Doanh thu tháng hiện tại (computed) |
| `total_revenue` | Decimal | | Tổng doanh thu (computed) |
| `vip_tier` | Enum | | `BASIC`, `PRO`, `PREMIUM`, `ELITE` |
| `reject_reason` | Enum | | `PRICE`, `TIMING`, `NO_NEED`, `COMPETITOR`, `OTHER` |
| `reject_note` | Text | | Chi tiết lý do reject |
| `l3_warning_at` | Timestamp | | Khi vào L3 |
| `l3_confirm_deadline` | Timestamp | | = l3_warning_at + 7 days |
| `blacklist_reason` | Text | | Chỉ khi L5 |
| `has_order_history` | Boolean | ✅ | = true nếu từng ở L2. Quyết định [NEW] vs [RECYCLE] |
| `lifecycle_round` | Integer | ✅ | Vòng đời thứ mấy (default 1, +1 mỗi lần ra khỏi L3) |
| `notes` | Text | | Ghi chú chung |
| `created_at` | Timestamp | ✅ | Auto |
| `updated_at` | Timestamp | ✅ | Auto |

### 1.2 USER

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | UUID | PK |
| `name` | String | Tên nhân viên |
| `email` | String | Email đăng nhập |
| `role` | Enum | `MKT_STAFF`, `MKT_LEAD`, `SALES_REP`, `SALES_LEAD`, `GDKD` |
| `department` | Enum | `MARKETING`, `SALES`, `MANAGEMENT` |
| `region` | String | Khu vực phụ trách |
| `is_active` | Boolean | Đang hoạt động |

### 1.3 CAMPAIGN

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | UUID | PK |
| `name` | String | Tên chiến dịch |
| `channel` | Enum | `FB_ADS`, `TIKTOK`, `WEBSITE`, `EVENT`, `OTHER` |
| `budget` | Decimal | Ngân sách |
| `start_date` | Date | Ngày bắt đầu |
| `end_date` | Date | Ngày kết thúc |
| `created_by` | FK → User | Ai tạo |

### 1.4 ACTIVITY_LOG

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | UUID | PK |
| `lead_id` | FK → Lead | Lead liên quan |
| `action` | Enum | `CREATED`, `ASSIGNED`, `STATUS_CHANGED`, `TAG_CHANGED`, `NOTE_ADDED`, `QUOTED`, `REJECTED`, `RECYCLED` |
| `performed_by` | FK → User | Ai thực hiện |
| `old_value` | String | Giá trị cũ |
| `new_value` | String | Giá trị mới |
| `note` | Text | Ghi chú |
| `created_at` | Timestamp | Auto |

---

## 2. MÀN HÌNH & WIREFRAME

### 2.1 Lead List (Danh sách lead)

**Ai xem:** Tất cả (filter theo quyền)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Filter: [Status ▼] [Source ▼] [Tag ▼] [NVKD ▼] [Tháng ▼]  │
│  ┌─ Tabs ──────────────────────────────────────────────────┐    │
│  │ Tất cả │ L0 (120) │ L1 (45) │ L2 (320) │ L3 (28) │ L4 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [+ Tạo Lead]                          Tổng: 513 │ Trang 1/26  │
│                                                                 │
│  ┌──────┬────────┬────────┬───────┬──────┬────────┬──────────┐  │
│  │ Code │ Tên KH │ Công ty│ SĐT   │Status│ Tag    │ NVKD     │  │
│  ├──────┼────────┼────────┼───────┼──────┼────────┼──────────┤  │
│  │L-0501│Nguyễn A│Cty ABC │09xxx  │ L0   │🆕 NEW  │ Hùng     │  │
│  │L-0502│Trần B  │Cty XYZ │09xxx  │ L0   │♻️ REC  │ —        │  │
│  │L-0503│Lê C    │—       │09xxx  │ L0   │⭐ POT  │ Tuấn     │  │
│  │L-0510│Phạm D  │Cty DEF │09xxx  │ L1   │—       │ Minh     │  │
│  │L-0234│Hoàng E │Cty GHI │09xxx  │ L2   │—       │ Hùng     │  │
│  └──────┴────────┴────────┴───────┴──────┴────────┴──────────┘  │
│                                                                 │
│  Tags: 🆕=New  ♻️=Recycle  ⭐=Potential                        │
└─────────────────────────────────────────────────────────────────┘
```

**Filter theo quyền:**
- MKT Staff: chỉ thấy lead `created_by_dept=MARKETING`
- NVKD: chỉ thấy lead `assigned_to=mình` + lead `source=SALE_SELF` do mình tạo
- TP Sale: thấy tất cả
- GDKD: thấy tất cả

### 2.2 Lead Detail (Chi tiết lead)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back    L-240501-012                    Status: L0 🆕 NEW    │
│                                                                 │
│  ┌─ THÔNG TIN ─────────────────┬─ PHÂN BỔ ──────────────────┐  │
│  │ Tên: Nguyễn Văn A           │ Nguồn: MKT_NEW             │  │
│  │ SĐT: 0912 345 678          │ Kênh: FB_ADS               │  │
│  │ Zalo: 0912 345 678         │ Campaign: "Q2 Lead Gen"    │  │
│  │ Email: a@abc.com           │ Tạo bởi: NV Lan (MKT)     │  │
│  │ Công ty: Cty ABC           │ Ngày tạo: 01/05/2026      │  │
│  │ Ngành: Fashion & FMCG     │                             │  │
│  │ Khu vực: Hà Nội           │ Assign cho: Hùng (NVKD)    │  │
│  │                            │ Assign bởi: NV Lan (MKT)   │  │
│  │                            │ Assign lúc: 01/05 10:30    │  │
│  └────────────────────────────┴─────────────────────────────┘  │
│                                                                 │
│  ┌─ LỊCH SỬ (Timeline) ────────────────────────────────────┐   │
│  │ 📝 01/05 10:30 — NV Lan assign cho Hùng                 │   │
│  │ ➕ 01/05 09:15 — NV Lan tạo lead từ FB Ads              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ HÀNH ĐỘNG ──────────────────────────────────────────────┐   │
│  │ [📋 Tạo báo giá]  [✏️ Sửa]  [📌 Tag Potential]          │   │
│  │ [🗑️ Xóa] ← chỉ hiện nếu tag=NEW, has_order_history=F   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ♻️ NẾU [RECYCLE]: Hiện box lịch sử cũ                        │
│  ┌─ LỊCH SỬ VÒNG TRƯỚC ────────────────────────────────────┐   │
│  │ Vòng 1: MKT tạo → Hùng chăm → L2 (6 tháng, 300tr)     │   │
│  │ → L3 lý do: Hùng không confirm. Vào L3: 15/04/2026     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Tạo Lead

```
┌─────────────────────────────────────────────────────┐
│  ➕ TẠO LEAD MỚI                                    │
│                                                     │
│  Tên KH *:        [___________________________]     │
│  SĐT *:           [___________________________]     │
│  Zalo:             [___________________________]     │
│  Email:            [___________________________]     │
│  Công ty:          [___________________________]     │
│  Địa chỉ:          [___________________________]     │
│                                                     │
│  Kênh nguồn:       [▼ FB Ads / TikTok / ... ___]     │
│  Chiến dịch:       [▼ Chọn campaign ___________ ]     │
│  (chỉ hiện nếu người tạo = MKT)                    │
│                                                     │
│  Ghi chú:          [___________________________]     │
│                    [___________________________]     │
│                                                     │
│  ⚠️ Hệ thống tự set:                               │
│  • source = MKT_NEW (nếu MKT tạo)                  │
│  • source = SALE_SELF (nếu Sale tạo)                │
│  • source = CUSTOMER_SELF (nếu KH tự tạo)          │
│  • tag = NEW                                        │
│  • status = L0                                      │
│                                                     │
│  [Hủy]                              [Tạo Lead]      │
└─────────────────────────────────────────────────────┘
```

### 2.4 Assign Lead (MKT → NVKD)

```
┌─────────────────────────────────────────────────────┐
│  📤 ASSIGN LEAD CHO SALE                            │
│                                                     │
│  Lead: L-240501-012 — Nguyễn Văn A (Cty ABC)       │
│                                                     │
│  Chọn NVKD:  [▼ Danh sách NVKD ________________]   │
│                                                     │
│  ┌─ GỢI Ý ─────────────────────────────────────┐   │
│  │ 🟢 Hùng — 12/25 leads active                │   │
│  │ 🟢 Tuấn — 8/25 leads active                 │   │
│  │ 🟡 Minh — 22/25 leads active                │   │
│  │ 🔴 Hoa — 25/25 FULL                         │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Ghi chú assign: [___________________________]      │
│                                                     │
│  [Hủy]                              [Assign]        │
└─────────────────────────────────────────────────────┘
```

**Chỉ MKT Staff, MKT Lead, TP Sale, GDKD** có nút Assign.

### 2.5 L3 Pool (MKT xem để lấy remarketing)

```
┌─────────────────────────────────────────────────────────────────┐
│  ♻️ L3 POOL — Lead tạm dừng (có thể lấy remarketing)           │
│                                                                 │
│  Filter: [Chỉ unowned ✅]                                      │
│                                                                 │
│  ┌──────┬────────┬────────┬──────────┬───────────┬──────────┐  │
│  │ Code │ Tên KH │ Công ty│ DT cũ    │ Lý do L3  │ Action   │  │
│  ├──────┼────────┼────────┼──────────┼───────────┼──────────┤  │
│  │L-0234│Hoàng E │Cty GHI │180tr/6th │ Không cfm │[🔄 Lấy] │  │
│  │L-0189│Lê F    │Cty JKL │50tr/3th  │ Giá cao   │[🔄 Lấy] │  │
│  │L-0156│Phạm G  │Cty MNO │320tr/1yr │ Đang chờ  │[🔒 Owned]│  │
│  └──────┴────────┴────────┴──────────┴───────────┴──────────┘  │
│                                                                 │
│  🔄 = Lấy về L0 [RECYCLE] → assign cho NVKD                   │
│  🔒 = Vẫn gắn Sale (trong 7 ngày confirm) → chưa lấy được    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.6 L4 Resale (TP Sale quản lý)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔄 L4 RESALE POOL — TP Sale quản lý                           │
│                                                                 │
│  ┌──────┬────────┬────────┬──────────┬───────────┬──────────┐  │
│  │ Code │ Tên KH │ Công ty│ DT cũ    │ Sale mới  │ Đã quote?│  │
│  ├──────┼────────┼────────┼──────────┼───────────┼──────────┤  │
│  │L-0301│Trần H  │Cty PQR │90tr/2th  │ Tuấn      │ ❌ Chưa  │  │
│  │L-0288│Vũ I    │Cty STU │200tr/8th │ Minh      │ ✅ Đã    │  │
│  └──────┴────────┴────────┴──────────┴───────────┴──────────┘  │
│                                                                 │
│  Actions: [Assign Sale mới] [Chuyển L5 (cần approve)]          │
│                                                                 │
│  Khi Sale mới tạo báo giá từ L4 → Auto chuyển L1 (RESALE)     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.7 My Pipeline (NVKD cá nhân)

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 MY PIPELINE — NVKD Hùng                     Tháng 05/2026  │
│                                                                 │
│  ┌─ KANBAN VIEW ───────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  L0 (5)      │  L1 (3)      │  L2 (15)     │  L4 (2)  │    │
│  │  ─────       │  ─────       │  ─────        │  ─────   │    │
│  │ [Cty ABC]    │ [Cty DEF]    │ [Cty JKL]     │[Cty PQR] │    │
│  │  🆕 2h ago   │  📋 Quoted   │  🚚 Active    │ Resale   │    │
│  │ [Cty XYZ]    │ [Cty GHI]    │ [Cty MNO]     │[Cty STU] │    │
│  │  ⭐ Potential│  📋 Đàm phán │  🚚 Active    │ Resale   │    │
│  │ [Cty UVW]    │ [Cty RST]    │ [...]         │          │    │
│  │  🆕 1d ago   │  📋 Chờ KH   │               │          │    │
│  │ [...]        │              │               │          │    │
│  │              │              │               │          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ THÁNG NÀY ────────────────────────────────────────────┐    │
│  │ Báo giá mới: 8    │ Convert L2: 2    │ Revenue: 85tr   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ⚠️ ALERTS                                                     │
│  • Cty ABC: được assign 2h trước, chưa có báo giá              │
│  • Cty DEF: báo giá hết hạn trong 2 ngày                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. BUSINESS RULES

### 3.1 Auto-transitions

| Rule | Trigger | Action |
|------|---------|--------|
| L0 → L1 | NVKD tạo Quotation cho contact L0 | `status = L1`, `first_quote_at = now()`, log activity |

| L1 → L2 | Hệ thống ghi nhận đơn hàng cho contact L1 | `status = L2`, `first_order_at = now()`, log activity |
| L2 → L3 | 30 ngày không đơn mới | `status = L3`, `l3_warning_at = now()`, `l3_confirm_deadline = +7d`, log |
| L3 unown | Hết 7 ngày Sale không confirm | `assigned_to = NULL`, log "Sale gỡ do hết deadline" |

### 3.2 L0 Tag Rules

| Điều kiện | Tag | Xóa được? |
|-----------|-----|:---------:|
| `has_order_history = false` | `NEW` | ✅ |
| `has_order_history = true` | `RECYCLE` | ❌ |
| MKT/Sale gắn thủ công | `POTENTIAL` | ❌ |

### 3.3 Reject Rules (L1 → ?)

| Lý do | Destination | Ai approve |
|-------|:-----------:|------------|
| Giá chưa phù hợp | L3 | NVKD tự chuyển |
| Thời gian chưa OK | L3 | NVKD tự chuyển |
| Đang dùng đối thủ | L3 | NVKD tự chuyển |
| Không có nhu cầu | L3 | NVKD tự chuyển |
| Fake/Scam/Blacklist | L5 | TP Sale verify + approve |

### 3.4 Permission Matrix (tóm tắt)

| Action | MKT | NVKD | TP Sale | GDKD |
|--------|:---:|:----:|:-------:|:----:|
| Tạo lead (source=MKT) | ✅ | ❌ | ❌ | ✅ |
| Tạo lead (source=SALE) | ❌ | ✅ | ✅ | ✅ |
| Xem lead MKT tạo | ✅ | ✅* | ✅ | ✅ |
| Xem lead Sale tạo | ❌ | ✅* | ✅ | ✅ |
| Assign lead → NVKD | ✅ | ❌ | ✅ | ✅ |
| Tạo báo giá (trigger L1) | ❌ | ✅ | ✅ | ✅ |
| Reject L1 → L3 | ❌ | ✅ | ✅ | ✅ |
| Reject L1 → L5 | ❌ | ❌ | ✅ | ✅ |
| Lấy L3 → L0 RECYCLE | ✅ | ❌ | ❌ | ✅ |
| Chuyển L3 → L4 | ❌ | ❌ | ✅ | ✅ |
| Xóa lead L0 [NEW] | ✅ | ✅ | ✅ | ✅ |
| Tag [POTENTIAL] | ✅ | ✅ | ✅ | ✅ |

*NVKD chỉ thấy lead assigned cho mình

---

## 4. ACCEPTANCE CRITERIA

### 4.1 Lead CRUD
- [ ] Tạo lead mới → auto set status=L0, tag=NEW, source theo dept
- [ ] Xem danh sách lead với filter theo status, source, tag, NVKD
- [ ] Xem chi tiết lead với timeline hoạt động
- [ ] Sửa thông tin lead (contact info)
- [ ] Xóa lead: chỉ khi tag=NEW và has_order_history=false

### 4.2 Assign
- [ ] MKT assign lead L0 cho NVKD → log activity, set assigned_at
- [ ] Hiện gợi ý NVKD (capacity)
- [ ] TP Sale dashboard thấy: ai giao, cho ai, lúc nào

### 4.3 L0 Tags
- [ ] Tag [NEW] tự động cho lead mới chưa có order history
- [ ] Tag [RECYCLE] tự động khi lấy từ L3 (có order history)
- [ ] Tag [POTENTIAL] thủ công do MKT/Sale gắn
- [ ] Nút Xóa ẩn khi tag=RECYCLE hoặc POTENTIAL

### 4.4 L3 Pool & L4 Resale
- [ ] MKT xem L3 pool, filter unowned, lấy về L0 [RECYCLE]
- [ ] TP Sale chuyển L3 → L4, assign Sale mới
- [ ] Contact L3 vẫn có Sale (trong 7d) → MKT không lấy được

### 4.5 Activity Log
- [ ] Mọi thay đổi status, assign, tag → ghi log
- [ ] Timeline hiện trong Lead Detail

---

## 5. NEXT → Phase 2 (Dashboard & Tracking)

Sau khi Phase 1 hoàn thành, Phase 2 sẽ spec:
- Marketing Dashboard (Lead Draw, Quotation Rate, Convert Rate, First Month Value)
- TP Sale Dashboard (overview + per-NVKD)
- NVKD Dashboard (cá nhân)
- Monthly Report tự động
