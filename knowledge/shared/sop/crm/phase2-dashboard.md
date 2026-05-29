# Phase 2: Dashboard & Tracking — Spec Chi Tiết
## CRM ERK Transport | Chỉ thiết kế .md

---

## 1. MARKETING DASHBOARD

**Ai xem:** MKT Staff (data mình tạo), MKT Lead (tất cả MKT), TP Sale (view-only), GDKD

### 1.1 Header KPIs (4 ô lớn, real-time)

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 MARKETING DASHBOARD              [Tháng ▼] [Năm ▼]        │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────────┐
│  │ LEAD DRAW    │ │ QUOTATION    │ │ CONVERT      │ │ GIÁ TRỊ KH     │
│  │              │ │ RATE         │ │ RATE         │ │ THÁNG ĐẦU      │
│  │  132 / 150   │ │  31.1%       │ │  3.0%        │ │  42tr / KH     │
│  │  ████████░░  │ │  target 30%  │ │  target 2.4% │ │                │
│  │  88% target  │ │  ✅          │ │  ✅          │ │                │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Công thức:**

| KPI | Công thức | Nguồn data |
|-----|-----------|-----------|
| **Lead Draw** | COUNT(leads WHERE created_by_dept=MKT AND created_at trong tháng) + COUNT(leads WHERE source=MKT_RECYCLE AND created_at trong tháng) | lead.created_by_dept, lead.source |
| **Quotation Rate** | COUNT(leads source=MKT có first_quote_at trong tháng) / Lead Draw × 100% | lead.first_quote_at |
| **Convert Rate** | COUNT(leads source=MKT đạt L2 trong tháng) / COUNT(leads source=MKT có first_quote_at) × 100% | lead.status, lead.first_order_at |
| **Giá trị KH tháng đầu** | AVG(revenue 30 ngày đầu) của KH convert từ MKT trong tháng | lead.first_order_at, lead.monthly_revenue |

### 1.2 Lead by Channel (Bar chart)

```
┌─ LEAD THEO KÊNH ──────────────────────────────┐
│                                                │
│  FB Ads      ████████████████  72  (CPL: 55K)  │
│  TikTok      ████████         35  (CPL: 42K)  │
│  Website     ████             15  (CPL: 0)    │
│  Event       ██                8  (CPL: 125K) │
│  Hotline     █                 5  (CPL: 0)    │
│  Referral    █                 4  (CPL: 0)    │
│  L3 Recycle  ██               10  (CPL: 0)    │
│                                                │
│  Tổng: 149          CPL trung bình: 49K       │
└────────────────────────────────────────────────┘
```

**Công thức CPL:** Campaign budget / COUNT(leads WHERE campaign_id = X)

### 1.3 Funnel Visualization

```
┌─ FUNNEL THÁNG 05/2026 ─────────────────────────┐
│                                                  │
│  L0 (Draw)     ████████████████████  132  100%   │
│                        ↓                         │
│  L0→L1 (Quoted) ████████████        42   31.8%  │
│                        ↓                         │
│  L1→L2 (Convert) ██                  4    3.0%  │
│                                                  │
│  Reject (L1→L3):  38  │  Lý do:                 │
│  ┌────────────────────────────────────────┐      │
│  │ Giá chưa phù hợp    ████████  42%     │      │
│  │ Thời gian chưa OK   ██████    28%     │      │
│  │ Đang dùng đối thủ   ████     18%     │      │
│  │ Không có nhu cầu    ██       12%     │      │
│  └────────────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
```

### 1.4 Sale Feedback (MKT xem chất lượng lead qua mắt Sale)

```
┌─ PHẢN HỒI TỪ SALE ────────────────────────────┐
│                                                 │
│  Tổng lead giao:       42                       │
│  Sale đã báo giá:      42/42 = 100%            │
│  Sale chấp nhận (L2):  4/42 = 9.5%             │
│  Sale reject (→L3):    38/42 = 90.5%           │
│                                                 │
│  ┌─ TOP LÝ DO REJECT ─────────────────────┐    │
│  │ 1. Giá chưa phù hợp (42%)             │    │
│  │    → Gợi ý: Review lại target audience │    │
│  │ 2. Thời gian chưa OK (28%)            │    │
│  │    → Gợi ý: Nurture, follow-up sau    │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### 1.5 Trend (Line chart — so sánh tháng)

```
┌─ TREND 6 THÁNG ────────────────────────────────┐
│                                                 │
│  Lead Draw:    [T12] [T1] [T2] [T3] [T4] [T5]  │
│                 98   105  112  120  128  132     │
│                                     ↗ trending  │
│                                                 │
│  Quotation %:  25%  28%  27%  30%  29%  31%     │
│  Convert %:    1.8% 2.1% 2.0% 2.5% 2.8% 3.0%   │
└─────────────────────────────────────────────────┘
```

---

## 2. TP SALE DASHBOARD

**Ai xem:** TP Sale, GDKD

### 2.1 Overview — Lead từ Marketing

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 TP SALE DASHBOARD                [Tháng ▼] [Team ▼]        │
│                                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐
│  │ LEAD MKT  │ │ ĐÃ BÁO GIÁ│ │ QUOTE     │ │CONVERT  │ │ REVENUE  │
│  │ NHẬN      │ │           │ │ SPEED TB  │ │ L2      │ │ KH MỚI   │
│  │    42     │ │ 42 (100%) │ │  8.2h     │ │4 (9.5%) │ │  168tr   │
│  │           │ │           │ │ target≤24h│ │         │ │          │
│  │           │ │           │ │  ✅       │ │         │ │          │
│  └───────────┘ └───────────┘ └───────────┘ └─────────┘ └──────────┘
│                                                                 │
│  📌 Quote Speed = thời gian TB từ assign → NVKD tạo báo giá    │
│     (chỉ tính lead draw data = L0 mới được assign)              │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Bảng giao lead gần nhất (real-time)

```
┌─ LEAD GIAO GẦN NHẤT ───────────────────────────────────────────┐
│                                                                 │
│  Ngày/Giờ  │ MKT giao  │ Cho NVKD │ Lead        │ Đã quote? │  │
│  ──────────┼───────────┼──────────┼─────────────┼───────────│  │
│  04/05 9h  │ NV Lan    │ Hùng     │ Cty ABC     │ ✅ 2h sau │  │
│  03/05 3h  │ NV Mai    │ Tuấn     │ Cty XYZ     │ ⚠️ 36h    │  │
│  03/05 10h │ NV Lan    │ Minh     │ Cty DEF     │ ✅ 5h sau │  │
│  02/05 2h  │ NV Hoa    │ Hùng     │ Cty GHI     │ ✅ 1h sau │  │
│                                                                 │
│  ⚠️ = Quá 24h chưa báo giá                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Per-NVKD Performance

```
┌─ HIỆU QUẢ THEO NVKD ──────────────────────────────────────────┐
│                                                                 │
│  NVKD  │ L0   │ Quote│ Quote │ L2    │ Revenue │ Retention     │
│        │ Nhận │ Mới  │ Speed │Convert│ KH mới  │ L2            │
│  ──────┼──────┼──────┼───────┼───────┼─────────┼──────────     │
│  Hùng  │  12  │  12  │ 3.2h  │ 2     │ 85tr    │ 95%           │
│  Tuấn  │  10  │   9  │ 18h   │ 1     │ 42tr    │ 88%     ⚠️   │
│  Minh  │   8  │   8  │ 4.1h  │ 1     │ 41tr    │ 96%           │
│  Hoa   │   6  │   6  │ 2.8h  │ 0     │ 0       │ 92%           │
│  ...   │      │      │       │       │         │               │
│                                                                 │
│  📌 Quote Speed = thời gian TB từ assign → tạo báo giá         │
│  📌 Retention = % KH L2 giữ được (không rơi L3)                │
└─────────────────────────────────────────────────────────────────┘
```

**Công thức per-NVKD:**

| Metric | Công thức |
|--------|-----------|
| L0 Nhận | COUNT(leads assigned_to=NVKD trong tháng) |
| Quote Mới | COUNT(quotations cho L0 contacts by NVKD trong tháng) |
| Quote Speed | AVG(first_quote_at - assigned_at) cho leads of NVKD |
| L2 Convert | COUNT(leads of NVKD đạt L2 trong tháng) |
| Revenue KH mới | SUM(revenue 30d đầu) cho KH convert by NVKD |
| Retention | COUNT(L2 cuối tháng) / COUNT(L2 đầu tháng) của NVKD |

**Công thức Quote Speed tổng (header):**

```
Quote Speed TB = AVG(first_quote_at - assigned_at)
                 cho TẤT CẢ leads L0 draw data được assign trong tháng

VÍ DỤ:
  42 lead MKT giao trong tháng 05
  Hùng: TB 3.2h | Tuấn: TB 18h | Minh: TB 4.1h | Hoa: TB 2.8h
  → Tổng TB = 8.2h ✅ (target ≤ 24h)

NẾU > 24h → hiện ⚠️ trên dashboard
NẾU > 48h → alert 🔴 cho GDKD
```

### 2.4 Pipeline Overview

```
┌─ PIPELINE TỔNG ─────────────────────────────────────────────┐
│                                                              │
│  L0: 120 leads          L3: 28 KH (12 unowned)             │
│  ├─ NEW: 85             L4: 15 KH (5 chưa assign)          │
│  ├─ RECYCLE: 15         L5: 42 KH                           │
│  └─ POTENTIAL: 20                                            │
│                                                              │
│  L1: 45 leads (đang đàm phán)                               │
│  L2: 320 KH (active, revenue tháng: 2.1 tỷ)                │
└──────────────────────────────────────────────────────────────┘
```

### 2.5 Alerts

```
┌─ ⚠️ ALERTS ──────────────────────────────────────────────────┐
│                                                               │
│  🔴 KHẨN CẤP                                                 │
│  • Tuấn: Lead "Cty XYZ" assign 36h trước, chưa báo giá      │
│  • 3 KH L2 sắp vào L3 (25+ ngày không đơn)                  │
│                                                               │
│  🟡 CHÚ Ý                                                    │
│  • 5 KH L3 hết 7 ngày confirm → sẽ gỡ Sale                  │
│  • 3 leads L4 chưa assign Sale mới (> 7 ngày)                │
│                                                               │
│  🟢 THÔNG TIN                                                │
│  • MKT vừa giao 3 leads mới cho Hùng, Minh, Hoa             │
│  • Minh vừa convert 1 KH mới (Cty PQR) — revenue 35tr       │
└───────────────────────────────────────────────────────────────┘
```

---

## 3. NVKD DASHBOARD (Cá nhân)

**Ai xem:** NVKD (chỉ data của mình)

```
┌─────────────────────────────────────────────────────────────────┐
│  👤 NVKD: Hùng                              Tháng 05/2026      │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ LEAD MỚI    │ │ BÁO GIÁ MỚI│ │ CONVERT L2  │ │ REVENUE   │ │
│  │     12      │ │     12      │ │     2       │ │   85tr    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  ┌─ LEAD CẦN XỬ LÝ ────────────────────────────────────────┐  │
│  │ 🔴 Cty ABC — assign 2h trước — CHƯA BÁO GIÁ            │  │
│  │ 🟡 Cty UVW — assign 12h trước — CHƯA BÁO GIÁ           │  │
│  │ 🟢 Cty XYZ — đã báo giá 3 ngày trước — chờ KH          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ KH SẮP VÀO L3 (WARNING) ────────────────────────────────┐ │
│  │ Cty MNO — 25 ngày không đơn — [Confirm giữ] [Để L3]     │ │
│  │ Cty RST — 28 ngày không đơn — [Confirm giữ] [Để L3]     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ THÁNG NÀY ──────────────────────────────────────────────┐  │
│  │ Tổng KH L2:    15                                        │  │
│  │ Revenue tháng:  420tr                                     │  │
│  │ KH VIP:         3 Pro, 1 Premium                          │  │
│  │ Retention:      95% (14/15 giữ được)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. GDKD DASHBOARD (Executive)

**Ai xem:** GDKD only

```
┌─────────────────────────────────────────────────────────────────┐
│  🏢 EXECUTIVE DASHBOARD                    Tháng 05/2026       │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐ │
│  │ KH MỚI (L2)  │ │ REVENUE      │ │ CAC          │ │ TOTAL  │ │
│  │              │ │ KH MỚI       │ │              │ │ L2 KH  │ │
│  │     28       │ │  890tr       │ │  145K/KH     │ │  320   │ │
│  │  target: 45  │ │  target: 10% │ │              │ │        │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────┘ │
│                                                                 │
│  ┌─ KH MỚI THEO NGUỒN ──────────────────────────────────────┐ │
│  │ Marketing:     4 KH  │ Revenue: 168tr │ CAC: 320K        │ │
│  │ Sale tự tìm:  21 KH  │ Revenue: 630tr │ CAC: 0           │ │
│  │ KH tự đến:     3 KH  │ Revenue: 92tr  │ CAC: 0           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ SỨC KHỎE PIPELINE ──────────────────────────────────────┐ │
│  │ L0→L1 (Quotation Rate):  31%                             │ │
│  │ L1→L2 (Convert Rate):    9.5%                            │ │
│  │ L2→L3 (Churn Rate):      3.7% (12/320)                   │ │
│  │ Cycle Time (L0→L2):      18 ngày TB                       │ │
│  │ Retention L2:             96.3%                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ TOP NVKD ────────────────────────────────────────────────┐ │
│  │ 1. Minh:  5/12=42% convert │ Revenue: 215tr              │ │
│  │ 2. Hùng:  4/15=27% convert │ Revenue: 185tr              │ │
│  │ 3. Tuấn:  2/12=17% convert │ Revenue: 98tr               │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. MONTHLY REPORT (Tự động)

**Sinh ra:** Ngày 1 hàng tháng, cho tháng trước
**Gửi cho:** MKT Lead, TP Sale, GDKD

```
┌─────────────────────────────────────────────────────────────────┐
│  📄 BÁO CÁO THÁNG 05/2026 — TỰ ĐỘNG                          │
│  Ngày tạo: 01/06/2026                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══ 1. MARKETING ═══                                           │
│  Lead Draw:        132 (mới: 120 + recycle: 12) │ Target: 150  │
│  Quotation Rate:   42/132 = 31.8%               │ Target: 30%  │
│  Convert Rate:     4/42 = 9.5%                  │ Target: 2.4% │
│  Giá trị TB KH:    42tr/KH tháng đầu                           │
│  CPL:              49K (TB)                      │ Target: ≤100K│
│  Lead by channel:  FB(72) TikTok(35) Web(15) Other(10)         │
│  Recycle Convert:  2/12 = 16.7%                                │
│                                                                 │
│  ═══ 2. SALES ═══                                               │
│  Tổng lead nhận:   185 (MKT:42 + Self:130 + Resale:13)         │
│  Quote Speed TB:   8.2h (target: ≤24h)                          │
│  Convert tổng:     28/185 = 15.1%                               │
│  • Từ MKT:         4/42 = 9.5%                                  │
│  • Từ Self:        21/130 = 16.2%                               │
│  • Từ Resale:      3/13 = 23.1%                                 │
│  Retention L2:     96.3% (308/320)                              │
│  L2→L3:            12 KH                                        │
│                                                                 │
│  ═══ 3. EXECUTIVE ═══                                           │
│  KH mới (L2):      28                           │ Target: 45   │
│  Revenue KH mới:   890tr                                        │
│  CAC:              ~145K/KH                                     │
│  Cycle Time:       18 ngày (L0→L2)                              │
│  Total L2 KH:      320 │ Revenue tháng: 2.1 tỷ                │
│                                                                 │
│  ═══ 4. TOP NVKD (tháng) ═══                                   │
│  #  │ NVKD  │ Lead │ Quote│ Convert│ Revenue│ Retention         │
│  1  │ Minh  │  12  │  12  │  5     │ 215tr  │ 96%               │
│  2  │ Hùng  │  15  │  15  │  4     │ 185tr  │ 95%               │
│  3  │ Tuấn  │  12  │   9  │  2     │ 98tr   │ 88% ⚠️           │
│                                                                 │
│  ═══ 5. ALERTS & ISSUES ═══                                    │
│  • 3 NVKD có quote speed > 24h (SLA vi phạm)                  │
│  • 12 KH rơi L3 — lý do chính: không đơn mới                  │
│  • MKT reject rate cao (90%) — cần review target audience      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. NOTIFICATION RULES (In-app)

| # | Event | Ai nhận | Timing | Mức độ |
|---|-------|---------|--------|--------|
| 1 | MKT giao lead mới | NVKD được assign | Ngay lập tức | 🟢 Info |
| 2 | MKT giao lead mới | TP Sale | Ngay lập tức | 🟢 Info |
| 3 | Lead assign > 24h chưa báo giá | NVKD | Sau 24h | 🟡 Warning |
| 4 | Lead assign > 24h chưa báo giá | TP Sale | Sau 24h | 🟡 Warning |
| 5 | Lead assign > 48h chưa báo giá | TP Sale + GDKD | Sau 48h | 🔴 Critical |
| 6 | KH L2 sắp vào L3 (25+ ngày) | NVKD | 25 ngày | 🟡 Warning |
| 7 | KH vào L3 | NVKD + TP Sale | Ngay khi vào | 🔴 Critical |
| 8 | L3 hết 7 ngày, Sale bị gỡ | TP Sale | Sau 7 ngày | 🟡 Warning |
| 9 | NVKD convert KH mới (→L2) | TP Sale + MKT (nếu source=MKT) | Ngay lập tức | 🟢 Info |
| 10 | L1 reject → L3 | MKT (nếu source=MKT) | Ngay lập tức | 🟡 Warning |
| 11 | L1 reject → L5 request | TP Sale (cần approve) | Ngay lập tức | 🔴 Critical |
| 12 | Monthly report sẵn | MKT Lead + TP Sale + GDKD | Ngày 1 tháng | 🟢 Info |

---

## 7. ACCEPTANCE CRITERIA

### 7.1 Marketing Dashboard
- [ ] 4 KPI header hiển thị đúng công thức
- [ ] Filter theo tháng/năm hoạt động
- [ ] Chart lead by channel + CPL
- [ ] Funnel visualization (L0 → L1 → L2) với tỷ lệ %
- [ ] Bảng reject reasons (top lý do)
- [ ] Trend 6 tháng (line chart)

### 7.2 TP Sale Dashboard
- [ ] Overview KPIs (lead nhận, đã quote, convert, revenue)
- [ ] Bảng lead giao gần nhất (real-time)
- [ ] Bảng per-NVKD performance (sort được)
- [ ] Pipeline overview (count theo status)
- [ ] Alerts panel (3 mức: critical, warning, info)

### 7.3 NVKD Dashboard
- [ ] KPIs cá nhân (lead mới, quote mới, convert, revenue)
- [ ] Danh sách lead cần xử lý (chưa báo giá, sắp hết hạn)
- [ ] KH sắp vào L3 warning (25+ ngày)
- [ ] Tổng hợp tháng (KH L2, revenue, VIP tier, retention)

### 7.4 GDKD Dashboard
- [ ] KPIs executive (KH mới, revenue, CAC, total L2)
- [ ] KH mới theo nguồn (MKT / Self / Resale)
- [ ] Sức khỏe pipeline (conversion rates, churn, retention)
- [ ] Top NVKD ranking

### 7.5 Monthly Report & Notifications
- [ ] Report tự động sinh ngày 1 hàng tháng
- [ ] 12 notification rules hoạt động đúng
- [ ] Notification hiển thị in-app (bell icon + badge count)

---

## 8. NEXT → Phase 3 (Quotation Module)

Phase 3 sẽ spec chi tiết:
- Quote builder (tạo báo giá trên CRM)
- Auto-fill VIP discount
- Margin check + approval flow
- PDF generation
- Quote tracking & follow-up
