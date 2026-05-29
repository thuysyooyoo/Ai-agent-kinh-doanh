# Phase 4: Automation & Polish — Spec Chi Tiết
## CRM ERK Transport | Chỉ thiết kế .md

---

## 1. AUTO-SCHEDULER (Scheduled Jobs)

### 1.1 Danh sách jobs

| # | Job | Tần suất | Logic | Output |
|---|-----|----------|-------|--------|
| 1 | **L2 Warning (30d)** | Mỗi ngày 00:00 | Tìm lead L2 có `last_order_created_at` > 30 ngày, chưa warning | Set `l2_warning_at`, alert Sale confirm (7 ngày) |
| 2 | **L2→L3 Check (37d)** | Mỗi ngày 00:00 | Tìm lead L2 có `l2_warning_at` > 7 ngày + Sale chưa confirm | Auto chuyển L3 + gỡ Sale + notification |
| 3 | **Quote Expired** | Mỗi ngày 08:00 | Tìm quote SENT có `valid_until` < today | Status → EXPIRED + alert NVKD |
| 4 | **L2 Early Warning (25d)** | Mỗi ngày 08:00 | Tìm lead L2 có 25+ ngày không đơn mới | Alert NVKD "KH sắp cần confirm" |
| 5 | **Monthly Report** | Ngày 1 mỗi tháng 06:00 | Tổng hợp data tháng trước | Tạo report + gửi MKT Lead, TP Sale, GDKD |

### 1.2 Chi tiết Job #1: L2 Warning (30 ngày)

```
CHẠY: Mỗi ngày 00:00

FOR EACH lead WHERE status = L2 AND l2_warning_at IS NULL:
    days_since_last_order = TODAY - last_order_created_at

    IF days_since_last_order >= 30:
        lead.l2_warning_at = NOW()
        lead.l2_confirm_deadline = NOW() + 7 days
        (vẫn giữ status = L2)

        log_activity(
            action: L2_WARNING,
            note: "Auto: 30 ngày không đơn → cảnh báo, Sale có 7 ngày confirm"
        )

        notify(lead.assigned_to, CRITICAL,
            "KH {name} đã 30 ngày không đơn. Confirm giữ KH trong 7 ngày
             hoặc hệ thống sẽ tự động chuyển L3.")
        notify(TP_SALE, WARNING,
            "KH {name} cần Sale {assigned_to} confirm (deadline: {deadline})")
```

**Sale confirm giữ KH:**
```
KHI SALE BẤM [Confirm giữ KH]:
    lead.l2_warning_at = NULL
    lead.l2_confirm_deadline = NULL
    (Reset — chu kỳ 30 ngày bắt đầu lại từ now)
    lead.last_order_created_at = NOW()  ← reset đếm

    log_activity(
        action: L2_CONFIRMED,
        note: "Sale confirm giữ KH. Reset chu kỳ 30 ngày."
    )
```

### 1.3 Chi tiết Job #2: L2→L3 Check (hết 7 ngày)

```
CHẠY: Mỗi ngày 00:00

FOR EACH lead WHERE status = L2
    AND l2_warning_at IS NOT NULL
    AND l2_confirm_deadline < TODAY:

    old_sale = lead.assigned_to
    lead.status = L3
    lead.assigned_to = NULL
    lead.l2_warning_at = NULL

    log_activity(
        action: STATUS_CHANGED,
        old: L2, new: L3,
        note: "Auto: {old_sale} không confirm trong 7 ngày → L3 + gỡ Sale"
    )

    notify(TP_SALE, CRITICAL,
        "KH {name} → L3. {old_sale} không confirm. Giờ unowned.")
```

### 1.4 Chi tiết Job #3: Quote Expired

```
CHẠY: Mỗi ngày 08:00

FOR EACH quotation WHERE status = SENT AND valid_until < TODAY:
    quotation.status = EXPIRED

    log_activity(
        lead_id: quotation.lead_id,
        action: QUOTE_EXPIRED,
        note: "Quote #{number} hết hạn"
    )

    notify(quotation.created_by, WARNING,
        "Quote {number} cho KH {name} đã hết hạn. Renew hay close?")
```

---

## 2. NOTIFICATION ENGINE

### 2.1 Kiến trúc

```
EVENT xảy ra (VD: MKT assign lead)
       │
       ▼
NOTIFICATION ENGINE
       │
       ├── In-app Notification (realtime)
       │   → Bell icon 🔔 + badge count
       │   → Notification panel (dropdown)
       │
       └── Email Notification (async)
           → Chỉ cho CRITICAL events
           → Gửi email tóm tắt
```

### 2.2 In-app Notification UI

```
┌──────────────────────────────────────────┐
│  🔔 (5)                                  │  ← Header bar
│  ┌────────────────────────────────────┐  │
│  │ THÔNG BÁO                   [Đọc hết]│
│  │                                    │  │
│  │ 🔴 2 phút trước                   │  │
│  │ KH "Cty ABC" 30 ngày không đơn.    │  │
│  │ Confirm giữ KH trong 7 ngày.       │  │
│  │ [Xem KH] [Confirm giữ]            │  │
│  │                                    │  │
│  │ 🟡 1 giờ trước                    │  │
│  │ Lead "Cty XYZ" assign 25h trước,   │  │
│  │ chưa báo giá. SLA: ≤24h           │  │
│  │ [Tạo báo giá]                     │  │
│  │                                    │  │
│  │ 🟢 3 giờ trước                    │  │
│  │ NV Lan (MKT) giao lead mới:       │  │
│  │ "Cty DEF" — FB Ads campaign       │  │
│  │ [Xem lead]                        │  │
│  │                                    │  │
│  │ ... [Xem tất cả]                  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### 2.3 Bảng Notification Rules (đầy đủ)

| # | Event | Ai nhận | Mức | Kênh | Có action? |
|---|-------|---------|:---:|------|:---:|
| 1 | MKT giao lead mới | NVKD | 🟢 | In-app | [Xem lead] |
| 2 | MKT giao lead mới | TP Sale | 🟢 | In-app | [Xem lead] |
| 3 | Lead > 24h chưa quote | NVKD | 🟡 | In-app | [Tạo báo giá] |
| 4 | Lead > 24h chưa quote | TP Sale | 🟡 | In-app | [Xem NVKD] |
| 5 | Lead > 48h chưa quote | TP Sale + GDKD | 🔴 | In-app + Email | [Xem NVKD] |
| 6 | KH 25+ ngày không đơn (early warning) | NVKD | 🟡 | In-app | [Xem KH] |
| 7 | KH 30 ngày không đơn (cần confirm 7d) | NVKD + TP Sale | 🔴 | In-app + Email | [Confirm giữ] |
| 8 | Sale hết 7 ngày không confirm → L3 | TP Sale | 🔴 | In-app + Email | [Xem L3 Pool] |
| 9 | Convert KH mới (→L2) | TP Sale + MKT (nếu src=MKT) | 🟢 | In-app | [Xem KH] |
| 10 | Quote reject → L3 | MKT (nếu src=MKT) | 🟡 | In-app | [Xem lý do] |
| 11 | Request L5 (cần approve) | TP Sale | 🔴 | In-app + Email | [Approve/Reject] |
| 12 | Quote chờ duyệt | TP/GDKD | 🟡 | In-app | [Duyệt] |
| 13 | Quote hết hạn | NVKD | 🟡 | In-app | [Renew/Close] |
| 14 | Monthly report sẵn | MKT Lead + TP + GDKD | 🟢 | In-app + Email | [Xem report] |

### 2.4 Notification Data Model

```
NOTIFICATION
├── id (PK)
├── user_id (FK → User)         ← Ai nhận
├── type: Enum                   ← Loại event (14 loại trên)
├── level: Enum [INFO, WARNING, CRITICAL]
├── title: String                ← Tiêu đề ngắn
├── message: Text                ← Nội dung
├── action_url: String           ← Link đến trang liên quan
├── action_label: String         ← Text nút action
├── reference_type: Enum         ← LEAD / QUOTATION / REPORT
├── reference_id: UUID           ← ID đối tượng
├── is_read: Boolean             ← Đã đọc?
├── is_email_sent: Boolean       ← Đã gửi email?
├── created_at: Timestamp
```

---

## 3. USER MANAGEMENT & AUTH

### 3.1 Roles & Permissions (RBAC)

| Permission | MKT Staff | MKT Lead | NVKD | TP Sale | GDKD |
|-----------|:---------:|:--------:|:----:|:-------:|:----:|
| **Lead** |
| Tạo lead (src=MKT) | ✅ | ✅ | ❌ | ❌ | ✅ |
| Tạo lead (src=SALE) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Xem lead mình tạo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Xem tất cả lead | ❌ | ✅ | ❌ | ✅ | ✅ |
| Assign lead → NVKD | ✅ | ✅ | ❌ | ✅ | ✅ |
| Xóa lead L0 [NEW] | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tag [POTENTIAL] | ✅ | ✅ | ✅ | ✅ | ✅ |
| **L3/L4** |
| Xem L3 Pool | ✅ | ✅ | ❌ | ✅ | ✅ |
| Lấy L3 → L0 RECYCLE | ✅ | ✅ | ❌ | ❌ | ✅ |
| Chuyển L3 → L4 | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve L5 | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Quotation** |
| Tạo/sửa quote | ❌ | ❌ | ✅ | ✅ | ✅ |
| Approve quote (≤ threshold) | ❌ | ❌ | ✅* | ✅ | ✅ |
| Approve quote (> threshold) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Approve quote (GDKD level) | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Campaign** |
| Tạo/sửa campaign | ✅ | ✅ | ❌ | ❌ | ✅ |
| Xem campaign mình | ✅ | ✅ | ❌ | ❌ | ✅ |
| Xem tất cả campaign | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Dashboard** |
| MKT Dashboard | ✅* | ✅ | ❌ | ✅ᵛ | ✅ |
| TP Sale Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| NVKD Dashboard | ❌ | ❌ | ✅* | ✅ | ✅ |
| GDKD Dashboard | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Admin** |
| Quản lý user | ❌ | ❌ | ❌ | ❌ | ✅ |
| Xem audit log | ❌ | ❌ | ❌ | ✅ | ✅ |
| Export data | ❌ | ✅ | ❌ | ✅ | ✅ |

*\* = chỉ data của mình | ᵛ = view-only*

### 3.2 Quản lý User

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 QUẢN LÝ NHÂN SỰ (GDKD only)              [+ Thêm NV]     │
│                                                                 │
│  ┌──────┬──────────┬───────────┬────────┬────────┬──────────┐  │
│  │ Tên  │ Email    │ Role      │ Phòng  │ Status │ Action   │  │
│  ├──────┼──────────┼───────────┼────────┼────────┼──────────┤  │
│  │ Lan  │lan@erk   │ MKT Staff │ MKT    │ 🟢 On  │ [✏️][⛔] │  │
│  │ Mai  │mai@erk   │ MKT Staff │ MKT    │ 🟢 On  │ [✏️][⛔] │  │
│  │ Hùng │hung@erk  │ Sales Rep │ Sale   │ 🟢 On  │ [✏️][⛔] │  │
│  │ Tuấn │tuan@erk  │ Sales Rep │ Sale   │ 🟢 On  │ [✏️][⛔] │  │
│  │ Minh │minh@erk  │ Sales Rep │ Sale   │ 🟢 On  │ [✏️][⛔] │  │
│  │ NV X │x@erk     │ Sales Lead│ Sale   │ 🟢 On  │ [✏️][⛔] │  │
│  │ Bảo  │bao@erk   │ Sales Rep │ Sale   │ 🔴 Off │ [✏️][🔄] │  │
│  └──────┴──────────┴───────────┴────────┴────────┴──────────┘  │
│                                                                 │
│  ⛔ = Deactivate  │  🔄 = Reactivate                           │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Onboard / Offboard

```
ONBOARD (thêm NV mới):
  1. GDKD tạo account → set role + department
  2. Hệ thống tạo credentials (email + temp password)
  3. NV đăng nhập lần đầu → đổi mật khẩu
  4. Dashboard trống → sẵn sàng nhận lead

OFFBOARD (NV nghỉ việc):
  1. GDKD deactivate account
  2. Hệ thống check: NV này có lead nào đang active?

  IF NVKD (Sales):
    → Leads L0 chưa quote: tự động unassign (MKT assign lại)
    → Leads L1 đang quote: chuyển cho TP Sale reassign
    → Leads L2 active: chuyển cho TP Sale reassign
    → Log tất cả vào activity

  IF MKT:
    → Campaigns: chuyển owner cho MKT Lead
    → Leads chưa assign: chuyển cho MKT Lead

  3. Account deactivated → không đăng nhập được
  4. Data giữ nguyên (không xóa) → báo cáo lịch sử vẫn chính xác
```

---

## 4. DATA IMPORT / EXPORT

### 4.1 Import Lead (Excel)

```
┌─────────────────────────────────────────────────────────────────┐
│  📥 IMPORT LEAD TỪ EXCEL                                       │
│                                                                 │
│  [📁 Chọn file .xlsx]    template_lead.xlsx                    │
│                                                                 │
│  ┌─ PREVIEW ────────────────────────────────────────────────┐  │
│  │ Tên KH        │ SĐT          │ Email        │ Công ty   │  │
│  │ Nguyễn A      │ 0912345678   │ a@abc.com    │ Cty ABC   │  │
│  │ Trần B        │ 0987654321   │ b@def.com    │ Cty DEF   │  │
│  │ ⚠️ Lê C       │ (trùng SĐT)  │              │ Cty GHI   │  │
│  │ Phạm D        │ 0911222333   │ d@jkl.com    │ Cty JKL   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Tổng: 4 dòng │ OK: 3 │ Trùng: 1 │ Lỗi: 0                    │
│                                                                 │
│  Trùng SĐT: [▼ Bỏ qua ▼]                                     │
│  ┌──────────────────────────────────────┐                      │
│  │ ○ Bỏ qua (không import dòng trùng)   │                      │
│  │ ○ Cập nhật (ghi đè thông tin)        │                      │
│  │ ○ Tạo mới (cho phép trùng)           │                      │
│  └──────────────────────────────────────┘                      │
│                                                                 │
│  Auto set: status=L0, tag=NEW, source=theo dept người import   │
│                                                                 │
│  [Hủy]                              [Import 3 leads]            │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Export Data

| Ai | Export được gì | Format |
|---|---|---|
| MKT Lead | Leads MKT tạo, Campaigns | CSV, Excel |
| TP Sale | Tất cả leads, Quotes, Orders | CSV, Excel |
| GDKD | Tất cả + Reports | CSV, Excel, PDF |

### 4.3 Duplicate Check

```
KHI TẠO LEAD MỚI (manual hoặc import):

1. Check SĐT trùng (exact match)
2. Check Zalo trùng (exact match)
3. Check Email trùng (exact match)

NẾU TRÙNG:
  → Hiện popup: "Lead này đã tồn tại!"
  → Hiện thông tin lead cũ (status, assigned_to)
  → Options: [Hủy] [Xem lead cũ] [Tạo mới (force)]
  → Log nếu force create
```

---

## 5. AUDIT TRAIL

### 5.1 Mục đích

Mọi thay đổi quan trọng trên hệ thống đều được ghi lại để:
- Truy vết khi có tranh chấp
- Đảm bảo accountability
- Phục vụ báo cáo compliance

### 5.2 Những gì được log

| Đối tượng | Sự kiện |
|-----------|---------|
| **Lead** | Tạo, sửa, assign, đổi status, đổi tag, xóa |
| **Quotation** | Tạo, sửa, gửi duyệt, approve/reject, gửi KH, expired |
| **Order** | Tạo, đổi status (pending→transit→completed→cancelled) |
| **Campaign** | Tạo, sửa, cập nhật chi phí |
| **User** | Đăng nhập, đổi role, deactivate/reactivate |

### 5.3 Audit Log UI (TP Sale, GDKD)

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 AUDIT LOG                [Ngày ▼] [User ▼] [Loại ▼]       │
│                                                                 │
│  Thời gian    │ User      │ Action        │ Chi tiết           │
│  ─────────────┼───────────┼───────────────┼────────────────────│
│  14:30 04/05  │ Hùng      │ Quote Created │ QT-0502 cho Cty DEF│
│  14:25 04/05  │ System    │ Status → L3   │ Cty MNO (30d auto) │
│  14:00 04/05  │ NV Lan    │ Lead Assigned │ Cty ABC → Hùng     │
│  13:50 04/05  │ NV Lan    │ Lead Created  │ Cty ABC (FB Ads)   │
│  13:45 04/05  │ TP Sale   │ L5 Approved   │ Cty PQR (blacklist)│
│  ...                                                           │
│                                                       Page 1/50│
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. MOBILE RESPONSIVE

### 6.1 Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Desktop | ≥ 1280px | Full layout, sidebar + content |
| Tablet | 768-1279px | Sidebar collapse, stacked cards |
| Mobile | < 768px | Bottom nav, single column, swipe |

### 6.2 Mobile Priority Screens

```
NVKD dùng mobile nhiều nhất → ưu tiên:

1. My Pipeline (kanban swipe)
2. Lead Detail (xem nhanh, gọi KH)
3. Tạo báo giá (form simplified)
4. Notifications (bell icon)

┌─────────────────────────┐
│  ERK CRM          🔔(5) │
│                         │
│  Xin chào, Hùng         │
│                         │
│  ┌─────────────────┐    │
│  │ LEAD CẦN XỬ LÝ  │    │
│  │                 │    │
│  │ 🔴 Cty ABC      │    │
│  │    2h — chưa BG  │    │
│  │ 🟡 Cty UVW      │    │
│  │    12h — chưa BG │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ KH SẮP L3       │    │
│  │ Cty MNO — 25d   │    │
│  │ [Confirm] [L3]  │    │
│  └─────────────────┘    │
│                         │
│  ──────────────────     │
│  🏠  📋  ➕  📊  👤   │
│  Home List New  Dash Me │
└─────────────────────────┘
```

---

## 7. ACCEPTANCE CRITERIA

### 7.1 Auto-scheduler
- [ ] Job L2 Warning: cảnh báo Sale khi KH L2 đạt 30 ngày không đơn (vẫn ở L2)
- [ ] Job L2→L3: chuyển L3 + gỡ Sale nếu hết 7 ngày Sale không confirm
- [ ] Sale confirm giữ KH → reset chu kỳ 30 ngày
- [ ] Job Quote Expired: auto expired + alert
- [ ] Job L2 Warning: alert NVKD khi KH 25+ ngày
- [ ] Job Monthly Report: tạo report ngày 1 mỗi tháng

### 7.2 Notifications
- [ ] 14 notification rules hoạt động đúng
- [ ] In-app: bell icon + badge count + dropdown panel
- [ ] Email: gửi cho CRITICAL events
- [ ] Action buttons trong notification (Xem, Confirm, Duyệt...)
- [ ] Mark as read / Mark all as read

### 7.3 User Management
- [ ] RBAC 5 roles hoạt động đúng
- [ ] Onboard: tạo user → credentials → login
- [ ] Offboard: deactivate → reassign leads/campaigns
- [ ] Data NV cũ giữ nguyên (không xóa)

### 7.4 Import / Export
- [ ] Import Excel (.xlsx) leads với duplicate check
- [ ] Preview trước khi import
- [ ] Export CSV/Excel cho MKT Lead, TP Sale, GDKD
- [ ] Export PDF report cho GDKD

### 7.5 Audit Trail
- [ ] Log mọi thay đổi lead, quote, order, campaign, user
- [ ] Audit log UI filter theo ngày, user, loại
- [ ] Không xóa được audit log

### 7.6 Mobile
- [ ] Responsive 3 breakpoints (desktop, tablet, mobile)
- [ ] NVKD mobile: Pipeline, Lead Detail, Quick Quote, Notifications
- [ ] Bottom navigation trên mobile

---

## 8. TỔNG KẾT CÁC PHASE

| Phase | Nội dung | File |
|:-----:|----------|------|
| 0 | Workflow L0-L5, Business Rules | crm-workflow-v3.md |
| 1 | Data Model, Screens, Permissions | crm-phase1-lead-pipeline.md |
| 2 | 4 Dashboards, Monthly Report, Notifications | crm-phase2-dashboard.md |
| 2+ | Revenue Est/Actual, Campaign Management | crm-phase2-dashboard.md.resolved |
| 3 | Quotation Module, Approval, Lifecycle Integration | crm-phase3-quotation.md |
| 4 | Automation, Notifications, User Mgmt, Import/Export | crm-phase4-automation.md |
| — | Journey Example (L0→L5) | crm-journey-example.md |
