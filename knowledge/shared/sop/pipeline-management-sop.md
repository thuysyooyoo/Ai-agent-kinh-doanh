# SOP QUẢN LÝ PIPELINE (PIPELINE MANAGEMENT)

> Quy trình quản lý pipeline và forecast doanh số cho NVKD ERK Transport

---

## THÔNG TIN

| Thông tin | Chi tiết |
|-----------|----------|
| **Tiêu đề SOP** | Quy trình Quản lý Pipeline (Pipeline Management) |
| **Mã SOP** | SOP-SALES-003 |
| **Phòng ban** | Phòng Kinh doanh |
| **Owner** | Sales Manager |
| **Ngày tạo** | 31/03/2026 |
| **Ngày hiệu lực** | 01/04/2026 |
| **Phiên bản** | 1.0 |

---

## 1. MỤC ĐÍCH (PURPOSE)

### 1.1 Mục đích
- Chuẩn hóa cách quản lý pipeline cho toàn bộ NVKD
- Đảm bảo pipeline đủ strong để đạt target
- Cải thiện độ chính xác của forecast
- Dễ dàng identify at-risk deals và take action

### 1.2 Lợi ích
- Tăng predictability của doanh số
- Identify bottlenecks trong sales process
- Prioritize opportunities hiệu quả
- Improve conversion rates

---

## 2. PHẠM VI (SCOPE)

### 2.1 Áp dụng cho
- Tất cả NVKD (27 người)
- Trưởng phòng Team (3 người)
- Trợ lý KD (3 người)
- Sales Manager

### 2.2 Loại pipeline áp dụng
- Pipeline khách hàng mới (New Business)
- Pipeline khách hàng hiện tại (Existing Business)
- Pipeline upsell/cross-sell

---

## 3. ĐỊNH NGHĨA (DEFINITIONS)

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Pipeline** | Tổng tất cả opportunities đang theo đuổi, được tính theo weighted value |
| **Pipeline Value** | Tổng giá trị opportunities trong pipeline |
| **Weighted Pipeline** | Pipeline Value × Probability (của từng stage) |
| **Coverage Ratio** | Pipeline Value / Target (tỷ lệ phủ) |
| **Conversion Rate** | Tỷ lệ chuyển đổi từ stage này sang stage khác |
| **Velocity** | Tốc độ opportunities di chuyển qua các stage |
| **Aging** | Thời gian một opportunity nằm trong stage |
| **Forecast** | Dự báo doanh số kỳ vọng trong period |

---

## 4. PIPELINE STAGES & PROBABILITY

### 4.1 Stage Definitions

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PIPELINE STAGES - ERK TRANSPORT                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   STAGE 1: PROSPECT (10%)                                           │
│   ├── Lead mới, chưa contact                                        │
│   ├── Info cơ bản đã có trong CRM                                   │
│   └── Cần: First touch                                              │
│                                                                      │
│   STAGE 2: QUALIFIED (20%)                                          │
│   ├── Đã có conversation                                            │
│   ├── Nhu cầu đã confirm                                            │
│   ├── BANT đã qualify                                               │
│   └── Cần: Deep discovery                                           │
│                                                                      │
│   STAGE 3: PROPOSAL (40%)                                           │
│   ├── Đã gửi báo giá                                                │
│   ├── Khách đang xem                                                │
│   ├── Timeline quyết định đã biết                                   │
│   └── Cần: Follow-up, address questions                             │
│                                                                      │
│   STAGE 4: NEGOTIATION (60%)                                        │
│   ├── Khách quan tâm, đang negotiate                                │
│   ├── Objections đang được address                                  │
│   ├── Price/terms đang discuss                                      │
│   └── Cần: Close negotiation, get commitment                        │
│                                                                      │
│   STAGE 5: VERBAL COMMIT (80%)                                      │
│   ├── Khách đồng ý verbally                                         │
│   ├── Terms đã agree                                                │
│   ├── Chờ contract/credit check                                     │
│   └── Cần: Get contract signed                                      │
│                                                                      │
│   STAGE 6: CONTRACT SENT (90%)                                      │
│   ├── Contract đã gửi                                               │
│   ├── Credit đang check                                             │
│   ├── Deposit pending (nếu cần)                                     │
│   └── Cần: Finalize contract, receive deposit                       │
│                                                                      │
│   STAGE 7: CLOSED WON (100%)                                        │
│   ├── Contract đã ký                                                │
│   ├── Deposit/Credit OK                                             │
│   ├── First order đã place                                          │
│   └── Revenue recognized                                            │
│                                                                      │
│   STAGE 8: CLOSED LOST (0%)                                         │
│   ├── Không thành công                                              │
│   ├── Reason documented                                             │
│   └── Learn for future                                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Stage Entry & Exit Criteria

| Stage | Entry Criteria | Exit Criteria (để move lên) |
|-------|----------------|----------------------------|
| **Prospect** | Lead info có trong CRM | Đã có first conversation |
| **Qualified** | Đã qualify BANT | Đã gửi báo giá |
| **Proposal** | Báo giá đã gửi | Khách respond, bắt đầu negotiate |
| **Negotiation** | Khách discuss price/terms | Khách verbal agree |
| **Verbal Commit** | Khách verbal agree | Contract đã gửi |
| **Contract Sent** | Contract đã gửi | Contract signed + Credit OK |
| **Closed Won** | Contract signed | N/A - Final stage |
| **Closed Lost** | Opportunity không thành | N/A - Final stage |

### 4.3 Probability Weights

| Stage | Probability | Weighted Value Calculation |
|-------|-------------|---------------------------|
| Prospect | 10% | Value × 10% |
| Qualified | 20% | Value × 20% |
| Proposal | 40% | Value × 40% |
| Negotiation | 60% | Value × 60% |
| Verbal Commit | 80% | Value × 80% |
| Contract Sent | 90% | Value × 90% |
| Closed Won | 100% | Value × 100% |
| Closed Lost | 0% | Value × 0% |

---

## 5. PIPELINE COVERAGE REQUIREMENTS

### 5.1 Coverage Ratio Targets

```
COVERAGE RATIO = Pipeline Value / Target

VÍ DỤ:
├── Target tháng: 300 triệu
├── Pipeline value: 900 triệu
└── Coverage ratio = 900/300 = 3x
```

### 5.2 Minimum Coverage Requirements

| Level | Min Coverage | Recommended | Risk Level |
|-------|--------------|-------------|------------|
| NVKD | 3x target | 4x target | Low |
| TP Team | 3x team target | 4x team target | Low |
| Phòng KD | 3x phòng target | 4x phòng target | Low |

**Lưu ý:**
- Coverage < 2x = **High Risk** → Cần push prospection
- Coverage < 1.5x = **Critical** → Escalate TP

### 5.3 Pipeline Balance Requirements

Ngoài coverage ratio, pipeline cần **CÂN BẰNG** theo stage:

| Stage | Min % of Pipeline | Lý do |
|-------|-------------------|-------|
| Prospect + Qualified | 40% | Top of funnel - cần liên tục replenish |
| Proposal + Negotiation | 40% | Active deals - focus để convert |
| Verbal Commit + Contract | 20% | Closing soon - cần support |

**Warning signs:**
- ❌ Quá nhiều Prospect, ít Proposal → Cần qualify & advance nhanh hơn
- ❌ Quá nhiều Contract Sent nhưng không close → Bottleneck ở closing
- ❌ Quá ít Prospect → Pipeline sẽ cạn trong 1-2 tháng

---

## 6. PIPELINE AGING RULES

### 6.1 Aging Limits theo Stage

| Stage | Max Aging | Action khi vượt |
|-------|-----------|-----------------|
| Prospect | 7 ngày | Review: Qualify hoặc Close Lost |
| Qualified | 14 ngày | Push để gửi proposal hoặc review fit |
| Proposal | 14 ngày | Follow-up call, check timeline |
| Negotiation | 21 ngày | Meeting với KH, identify blockers |
| Verbal Commit | 7 ngày | Push contract, identify delay reason |
| Contract Sent | 7 ngày | Follow-up daily, escalate nếu stuck |

### 6.2 Aging Review Process

```
DAILY: Check opportunities aging > 50% limit
    ↓
WEEKLY: Review opportunities aging > 75% limit
    ├── TP Team review với NVKD
    └── Decide: Push or Close
    ↓
EXCEPTION: Opportunities aging > 100% limit
    ├── Escalate TP Team
    ├── Mandatory action plan
    └── Daily follow-up
```

---

## 7. DAILY PIPELINE ACTIVITIES

### 7.1 NVKD Daily Activities

| Thời gian | Hoạt động | Chi tiết |
|-----------|-----------|----------|
| **8:00-8:30** | Check pipeline | Review opportunities cần action hôm nay |
| **8:30-9:00** | Prioritize | Identify top 5 opportunities cần focus |
| **Trong ngày** | Update CRM | Update sau mỗi interaction |
| **17:00-17:30** | End-of-day | Update status, plan ngày mai |

### 7.2 Required CRM Updates

**Sau mỗi interaction với khách:**
- [ ] Update Status (nếu có thay đổi)
- [ ] Log Activity (call, email, meeting)
- [ ] Add Notes (key points, next steps)
- [ ] Update Next Action Date
- [ ] Update Value (nếu có thay đổi)

**Minimum update frequency:**
| Stage | Update frequency |
|-------|------------------|
| Prospect | Mỗi 3 ngày |
| Qualified | Mỗi 3 ngày |
| Proposal | Mỗi 2 ngày |
| Negotiation | Daily |
| Verbal Commit | Daily |
| Contract Sent | Daily |

### 7.3 Daily Pipeline Checklist

**Buổi sáng:**
- [ ] Check opportunities có action hôm nay
- [ ] Check opportunities aging > 50%
- [ ] Identify opportunities cần advance
- [ ] Plan calls/meetings

**Buổi chiều:**
- [ ] Update CRM sau interactions
- [ ] Move opportunities nếu cần
- [ ] Update next actions

---

## 8. WEEKLY PIPELINE REVIEW

### 8.1 NVKD Self-Review

**Thực hiện trước meeting với TP:**

```
WEEKLY PIPELINE SELF-REVIEW TEMPLATE

1. PIPELINE SNAPSHOT
   ├── Total Pipeline Value: _____
   ├── Coverage Ratio: _____x
   ├── # Opportunities: _____
   └── Weighted Pipeline: _____

2. MOVES THIS WEEK
   ├── New opportunities added: _____
   ├── Opportunities advanced: _____
   ├── Opportunities closed won: _____
   └── Opportunities closed lost: _____

3. TOP 5 OPPORTUNITIES
   | # | Account | Value | Stage | Next Action | ETA Close |
   |---|---------|-------|-------|-------------|-----------|
   | 1 |         |       |       |             |           |
   | 2 |         |       |       |             |           |
   | 3 |         |       |       |             |           |
   | 4 |         |       |       |             |           |
   | 5 |         |       |       |             |           |

4. AT-RISK OPPORTUNITIES
   | Account | Issue | Action Needed | Support Needed |
   |---------|-------|---------------|----------------|
   |         |       |               |                |

5. FORECAST COMMIT
   ├── Commit: _____ (90%+ confident)
   ├── Best Case: _____ (60-90% confident)
   └── Pipeline: _____ (total in play)

6. BLOCKERS
   └── Issues cần TP support: _____
```

### 8.2 TP Team Review Meeting

**Agenda (30 phút/NVKD hoặc 1h/team):**

| Thời gian | Nội dung |
|-----------|----------|
| 5 phút | Pipeline snapshot review |
| 10 phút | Review top 5 opportunities |
| 10 phút | At-risk deals discussion |
| 5 phút | Forecast commit |

### 8.3 Weekly Review Checklist

- [ ] Đã review coverage ratio?
- [ ] Đã review aging opportunities?
- [ ] Đã identify at-risk deals?
- [ ] Đã commit forecast?
- [ ] Đã plan actions cho tuần sau?

---

## 9. FORECASTING

### 9.1 Forecast Categories

| Category | Định nghĩa | Probability | Criteria |
|----------|------------|-------------|----------|
| **Commit** | Chắc chắn close | 90%+ | Contract Sent hoặc Verbal Commit với clear path |
| **Best Case** | Có khả năng close | 60-90% | Negotiation hoặc Proposal với strong signals |
| **Pipeline** | Trong pipeline | < 60% | Tất cả opportunities khác |
| **Upside** | Over-perform | N/A | Opportunities có thể vượt commit |

### 9.2 Forecast Submission

**Weekly Forecast Submission:**

```
WEEKLY FORECAST - TUẦN [XX] - [TÊN NVKD]

COMMIT (90%+ confident):
| Account | Value | Expected Close Date |
|---------|-------|---------------------|
|         |       |                     |
| TOTAL COMMIT: |       |                     |

BEST CASE (60-90% confident):
| Account | Value | Expected Close Date |
|---------|-------|---------------------|
|         |       |                     |
| TOTAL BEST CASE: |     |                     |

PIPELINE SUMMARY:
├── Total Pipeline: _____
├── Coverage Ratio: _____x
└── Weighted Pipeline: _____

FORECAST SUMMARY:
├── Commit: _____
├── Best Case: _____
└── Expected (Commit + 50% Best Case): _____
```

### 9.3 Forecast Accuracy Tracking

```
FORECAST ACCURACY = Actual Closed / Forecast Commit

TARGET:
├── Week 1 forecast → ≥ 90% accuracy
├── Week 2 forecast → ≥ 80% accuracy
└── Month forecast → ≥ 85% accuracy

PENALTY:
├── Miss forecast > 20% under → Review với TP
├── Miss forecast > 30% under → Review với Sales Manager
└── Consistent miss → Performance concern
```

---

## 10. CRM REQUIREMENTS

### 10.1 Required Fields cho Opportunity

```
OPPORTUNITY RECORD - REQUIRED FIELDS

□ THÔNG TIN CƠ BẢN
  ├── Opportunity Name: [Tên KH - Loại đơn]
  ├── Account: [Link to Account]
  ├── Contact: [Link to Contact]
  ├── Owner: [NVKD]
  └── Currency: VND/USD

□ THÔNG TIN GIÁ TRỊ
  ├── Amount: [Giá trị]
  ├── Expected Revenue: [Amount × Probability]
  └── Margin %: [Target margin]

□ THÔNG TIN STAGE
  ├── Stage: [Stage hiện tại]
  ├── Probability: [Auto-populate theo stage]
  └── Close Date: [Ngày dự kiến close]

□ THÔNG TIN TIMELINE
  ├── Created Date: [Auto]
  ├── Last Activity Date: [Auto]
  ├── Last Stage Change: [Auto]
  └── Days in Stage: [Auto]

□ THÔNG TIN PRODUCT
  ├── Loại VC: [Đường bộ/Biển/Hàng không]
  ├── Tuyến: [Điểm đi - Điểm đến]
  └── Volume estimate: [kg/CBM]

□ NOTES & NEXT STEPS
  ├── Next Step: [Action tiếp theo]
  ├── Next Step Due: [Ngày]
  └── Notes: [Ghi chú]
```

### 10.2 Data Quality Standards

| Field | Standard | Check |
|-------|----------|-------|
| Amount | Realistic, based on quote | ≥ 0 |
| Close Date | Within 90 days for active | Date > Today |
| Stage | Accurate based on criteria | Valid stage |
| Next Step | Specific, actionable | Not empty |
| Notes | Updated after each interaction | Recent date |

### 10.3 CRM Hygiene Rules

**Không được phép:**
- ❌ Tạo opportunity trùng lặp
- ❌ Để opportunity không update > 7 ngày
- ❌ Giữ opportunity trong stage quá aging limit
- ❌ Close Won mà không có actual revenue
- ❌ Close Lost mà không có reason

---

## 11. REPORTING

### 11.1 NVKD Reports

| Report | Tần suất | Mục đích |
|--------|----------|----------|
| Pipeline Snapshot | Daily | Quick view of pipeline |
| Weekly Forecast | Weekly | Commit forecast |
| Aging Report | Weekly | Identify stuck deals |

### 11.2 TP Team Reports

| Report | Tần suất | Mục đích |
|--------|----------|----------|
| Team Pipeline | Weekly | Review team performance |
| Conversion Funnel | Monthly | Identify bottlenecks |
| Forecast vs Actual | Monthly | Track accuracy |

### 11.3 Sales Manager Reports

| Report | Tần suất | Mục đích |
|--------|----------|----------|
| Full Pipeline | Weekly | Overview toàn phòng |
| Pipeline by Stage | Weekly | Balance check |
| Pipeline by NVKD | Weekly | Performance comparison |
| Pipeline Trend | Monthly | Health check |
| Conversion by Stage | Monthly | Process optimization |

### 11.4 Sample Reports

**PIPELINE BY STAGE:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PIPELINE BY STAGE - [PERIOD]                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Stage        │ # Opps │ Value      │ Weighted  │ % of Pipeline    │
│   ─────────────┼────────┼────────────┼───────────┼──────────────────│
│   Prospect     │   20   │  200.0 tr  │   20.0 tr │       10%        │
│   Qualified    │   15   │  300.0 tr  │   60.0 tr │       15%        │
│   Proposal     │   12   │  400.0 tr  │  160.0 tr │       20%        │
│   Negotiation  │    8   │  500.0 tr  │  300.0 tr │       25%        │
│   Verbal Commit│    4   │  300.0 tr  │  240.0 tr │       15%        │
│   Contract Sent│    3   │  300.0 tr  │  270.0 tr │       15%        │
│   ─────────────┼────────┼────────────┼───────────┼──────────────────│
│   TOTAL        │   62   │ 2,000.0 tr │ 1,050.0 tr │      100%        │
│                                                                      │
│   Target: 500 tr │ Coverage: 4.0x │ Weighted Coverage: 2.1x         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**CONVERSION FUNNEL:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONVERSION FUNNEL - [PERIOD]                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Stage        │ Entered │ Exited │ Conversion │ Avg Days in Stage  │
│   ─────────────┼─────────┼────────┼────────────┼───────────────────│
│   Prospect     │    50   │   45   │    90%     │      5.2 days     │
│   Qualified    │    45   │   35   │    78%     │      8.3 days     │
│   Proposal     │    35   │   25   │    71%     │     10.5 days     │
│   Negotiation  │    25   │   18   │    72%     │     12.1 days     │
│   Verbal Commit│    18   │   15   │    83%     │      4.2 days     │
│   Contract Sent│    15   │   13   │    87%     │      3.8 days     │
│   ─────────────┼─────────┼────────┼────────────┼───────────────────│
│   Closed Won   │    13   │   -    │    -       │        -          │
│   Closed Lost  │    30   │   -    │    -       │        -          │
│   ─────────────┼─────────┼────────┼────────────┼───────────────────│
│   Overall (Prospect → Won): 26%                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. BEST PRACTICES

### 12.1 Pipeline Management Tips

**1. Luôn maintain 3-4x coverage**
```
Pipeline cạn → Push prospection
Pipeline đủ → Focus advance deals
Pipeline thừa → Qualify tighter, focus quality
```

**2. Review aging daily**
```
Opportunities stuck > 50% aging limit → Action today
Opportunities stuck > 75% aging limit → TP consult
```

**3. Move deals nhanh qua stages**
```
Không giữ deals ở stage thấp quá lâu
Qualify nhanh → Advance hoặc Close
```

**4. Accurate forecasting**
```
Không inflate forecast
Không sandbag
Base on facts, not hope
```

**5. Clean CRM data**
```
Update after every interaction
Close lost opportunities promptly
Don't keep dead deals alive
```

### 12.2 Common Pipeline Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Pipelines "ảo" (không update) | Forecast sai | Daily CRM update |
| Giữ opportunities quá lâu | Pipeline inflated | Aging rules, close lost |
| Không qualify đúng | Waste time on bad deals | BANT qualification |
| Inflated values | Forecast sai | Realistic values based on quotes |
| Missing close dates | Cannot forecast | Always set close date |

---

## 13. KPIs & METRICS

### 13.1 Pipeline KPIs

| Metric | Target | Tracking |
|--------|--------|----------|
| Coverage Ratio | ≥ 3x | Weekly |
| Weighted Coverage | ≥ 2x | Weekly |
| Pipeline Balance | Per stage targets | Weekly |
| Aging Compliance | ≤ 10% over limit | Weekly |
| CRM Update Rate | 100% | Daily |

### 13.2 Forecast KPIs

| Metric | Target | Tracking |
|--------|--------|----------|
| Forecast Accuracy (Week 1) | ≥ 90% | Weekly |
| Forecast Accuracy (Month) | ≥ 85% | Monthly |
| Commit Conversion | ≥ 90% | Monthly |

### 13.3 Pipeline Health Score

```
PIPELINE HEALTH SCORE = (Coverage Score + Balance Score + Velocity Score) / 3

COVERAGE SCORE:
├── ≥ 4x = 10 points
├── 3-4x = 8 points
├── 2-3x = 5 points
└── < 2x = 2 points

BALANCE SCORE:
├── All stages within targets = 10 points
├── 1 stage off = 7 points
├── 2 stages off = 4 points
└── 3+ stages off = 2 points

VELOCITY SCORE:
├── Avg days < targets = 10 points
├── Avg days = targets = 7 points
└── Avg days > targets = 4 points

HEALTH RATING:
├── 9-10 = Excellent (Green)
├── 7-8 = Good (Yellow)
├── 5-6 = Needs Attention (Orange)
└── < 5 = Critical (Red)
```

---

## 14. CHECKLIST TỔNG HỢP

### 14.1 Daily Checklist

- [ ] Check opportunities cần action hôm nay
- [ ] Review aging opportunities
- [ ] Update CRM sau interactions
- [ ] Move opportunities nếu stage thay đổi
- [ ] Update next actions

### 14.2 Weekly Checklist

- [ ] Self-review pipeline
- [ ] Calculate coverage ratio
- [ ] Identify at-risk opportunities
- [ ] Submit weekly forecast
- [ ] Attend TP review meeting
- [ ] Clean up stale opportunities

### 14.3 Monthly Checklist

- [ ] Full pipeline audit
- [ ] Close lost opportunities
- [ ] Review forecast accuracy
- [ ] Analyze conversion rates
- [ ] Identify improvement areas

---

## 15. LỊCH SỬ CẬP NHẬT (REVISION HISTORY)

| Version | Ngày | Tác giả | Thay đổi |
|---------|------|---------|----------|
| 1.0 | 31/03/2026 | BusKit | Initial version |

---

## 16. PHÊ DUYỆT (APPROVAL)

| Role | Tên | Chữ ký | Ngày |
|------|-----|--------|------|
| Owner | Sales Manager | | |
| Reviewer | TP Team Representatives | | |
| Approver | GDKD | | |

---

## PHỤ LỤC

### Appendix A: Pipeline Stage Quick Reference

```
┌─────────────────────────────────────────────────────────────────────┐
│              PIPELINE STAGES QUICK REFERENCE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   STAGE          PROB    AGING    KEY ACTIVITIES                    │
│   ───────────────────────────────────────────────────────────────   │
│   Prospect       10%     7 days  → First contact                    │
│   Qualified      20%     14 days → Deep discovery, send quote       │
│   Proposal       40%     14 days → Follow-up, address questions     │
│   Negotiation    60%     21 days → Negotiate, handle objections     │
│   Verbal Commit  80%     7 days  → Send contract                    │
│   Contract Sent  90%     7 days  → Get signature, credit check      │
│   Closed Won     100%    -       → Handoff, onboarding              │
│   Closed Lost    0%      -       → Document learnings               │
│                                                                      │
│   MIN COVERAGE: 3x TARGET | RECOMMENDED: 4x TARGET                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Appendix B: Forecast Commit Template

```
FORECAST COMMIT - [THÁNG/TUẦN]

NVKD: _______________
Ngày submit: _______________

═══════════════════════════════════════════════════════════════

COMMIT (90%+ Confident):

| Account | Value | Close Date | Status |
|---------|-------|------------|--------|
|         |       |            |        |

TOTAL COMMIT: _______________

═══════════════════════════════════════════════════════════════

BEST CASE (60-90% Confident):

| Account | Value | Close Date | Blockers |
|---------|-------|------------|----------|
|         |       |            |          |

TOTAL BEST CASE: _______________

═══════════════════════════════════════════════════════════════

SUMMARY:
├── Target: _______________
├── Commit: _______________ (_____% of target)
├── Best Case: _______________
└── Expected: _______________ (Commit + 50% Best Case)

═══════════════════════════════════════════════════════════════
```

### Appendix C: FAQs

**Q1: Coverage ratio > 4x có tốt không?**
A: Có, nhưng cần check quality. Nếu coverage cao nhưng conversion thấp → Pipeline có thể inflated với deals không quality.

**Q2: Khi nào nên close lost một opportunity?**
A: Khi:
- Khách明确的 nói không
- Timeline không xác định > 90 ngày
- Không respond sau 5+ attempts
- Requirements không match với service của ERK

**Q3: Forecast sai bị penalty thế nào?**
A:
- Miss 10-20%: Coaching với TP
- Miss 20-30%: Review với Sales Manager
- Miss > 30% thường xuyên: Performance concern

**Q4: CRM data không clean ảnh hưởng gì?**
A:
- Forecast không chính xác
- Cannot identify at-risk deals
- Wasted time on bad data
- Poor decision making

---

*SOP Quản lý Pipeline v1.0*
*Owner: Sales Manager*
*Cập nhật: 31/03/2026*
