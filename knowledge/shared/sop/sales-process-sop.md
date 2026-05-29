# SOP QUY TRÌNH BÁN HÀNG (SALES PROCESS)

> Quy trình bán hàng chuẩn hóa cho NVKD ERK Transport - Từ Lead đến Customer

---

## THÔNG TIN

| Thông tin                 | Chi tiết                             |
| -------------------------- | ------------------------------------- |
| **Tiêu đề SOP**   | Quy trình Bán hàng (Sales Process) |
| **Mã SOP**          | SOP-SALES-001                         |
| **Phòng ban**       | Phòng Kinh doanh                     |
| **Owner**            | Sales Manager                         |
| **Ngày tạo**       | 31/03/2026                            |
| **Ngày hiệu lực** | 01/04/2026                            |
| **Phiên bản**      | 1.0                                   |

---

## 1. MỤC ĐÍCH (PURPOSE)

### 1.1 Mục đích

- Chuẩn hóa quy trình bán hàng cho toàn bộ NVKD
- Tăng tỷ lệ chuyển đổi từ Lead → Customer
- Đảm bảo tính nhất quán trong cách tiếp cận khách hàng
- Cung cấp framework rõ ràng để training và đánh giá

### 1.2 Lợi ích

- NVKD mới có thể bắt đầu làm việc nhanh chóng
- Giảm variation trong performance giữa các NVKD
- Dễ dàng identify bottleneck trong quy trình
- Tăng forecast accuracy

---

## 2. PHẠM VI (SCOPE)

### 2.1 Áp dụng cho

- Tất cả NVKD (27 người)
- Trưởng phòng Team (3 người)
- Trợ lý KD (3 người)
- Nhân viên mới trong probation

### 2.2 Loại khách hàng

- Khách hàng doanh nghiệp (B2B)
- Khách hàng cá nhân kinh doanh (E-commerce, Shop online)

### 2.3 Không áp dụng cho

- Khách hàng thuần túy B2C (không kinh doanh)
- Khách hàng chỉ inquiry một lần, không có nhu cầu thực sự

---

## 3. ĐỊNH NGHĨA (DEFINITIONS)

| Thuật ngữ                              | Định nghĩa                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| **Lead**                           | Thông tin liên hệ của khách hàng tiềm năng (chưa qualify)               |
| **MQL** (Marketing Qualified Lead) | Lead được Marketing qualify, đáp ứng 3/5 tiêu chí MQL                    |
| **SQL** (Sales Qualified Lead)     | Lead được Sales xác nhận có nhu cầu thực sự, có khả năng ra đơn    |
| **Opportunity**                    | Cơ hội bán hàng, đã xác định được nhu cầu cụ thể và timeline     |
| **Pipeline**                       | Tổng tất cả opportunities đang theo đuổi                                   |
| **Quotation**                      | Báo giá gửi cho khách hàng                                                  |
| **Closed Won**                     | Chốt đơn thành công, khách hàng đã ký hợp đồng/ra đơn đầu tiên |
| **Closed Lost**                    | Mất đơn, khách hàng không mua                                              |

---

## 4. TRÁCH NHIỆM (ROLES & RESPONSIBILITIES)

| Role                           | Trách nhiệm chính                                                  |
| ------------------------------ | --------------------------------------------------------------------- |
| **NVKD**                 | Thực hiện quy trình bán hàng, cập nhật CRM, đạt target       |
| **Trưởng phòng Team** | Coaching, review pipeline, approve discount, hỗ trợ negotiation     |
| **Sales Manager**        | Xây dựng & cải tiến quy trình, training, đánh giá hiệu suất |
| **Trợ lý KD**          | Hỗ trợ docs, data entry, coordination                               |
| **Marketing**            | Cung cấp MQL, content support                                        |
| **Operations**           | Nhận đơn hàng, thực hiện giao nhận                             |
| **Finance**              | Credit check, pricing support, invoice                                |

---

## 5. TỔNG QUAN QUY TRÌNH

### 5.1 Sales Funnel

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SALES FUNNEL ERK TRANSPORT                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│    ┌─────────┐                                                       │
│    │  LEAD   │  ← Thu thập từ nhiều nguồn                            │
│    └────┬────┘                                                       │
│         ↓                                                            │
│    ┌─────────┐                                                       │
│    │  MQL    │  ← Marketing qualify (3/5 tiêu chí)                   │
│    └────┬────┘                                                       │
│         ↓                                                            │
│    ┌─────────┐                                                       │
│    │  SQL    │  ← Sales qualify (BANT)                               │
│    └────┬────┘                                                       │
│         ↓                                                            │
│    ┌─────────────┐                                                   │
│    │ OPPORTUNITY │  ← Xác định nhu cầu cụ thể, value, timeline       │
│    └──────┬──────┘                                                   │
│         ↓                                                            │
│    ┌─────────────┐                                                   │
│    │  PROPOSAL   │  ← Gửi báo giá                                    │
│    └──────┬──────┘                                                   │
│         ↓                                                            │
│    ┌──────────────┐                                                  │
│    │ NEGOTIATION  │  ← Đàm phán, xử lý phản đối                      │
│    └───────┬──────┘                                                  │
│         ↓                                                            │
│    ┌─────────────┐     ┌─────────────┐                               │
│    │ CLOSED WON  │     │ CLOSED LOST │                               │
│    └─────────────┘     └─────────────┘                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Conversion Rate Targets

| Stage                          | Conversion Target | Avg Time in Stage   |
| ------------------------------ | ----------------- | ------------------- |
| Lead → MQL                    | 30%               | 24h                 |
| MQL → SQL                     | 70%               | 48h                 |
| SQL → Opportunity             | 50%               | 1 tuần             |
| Opportunity → Proposal        | 80%               | 3 ngày             |
| Proposal → Negotiation        | 60%               | 1 tuần             |
| Negotiation → Closed Won      | 40%               | 2 tuần             |
| **Overall (MQL → Won)** | **≥ 5%**   | **4-6 tuần** |

---

## 6. QUY TRÌNH CHI TIẾT TỪNG GIAI ĐOẠN

### 6.1 STAGE 1: LEAD GENERATION & QUALIFICATION

#### 6.1.1 Nguồn Leads

| Nguồn                         | Mô tả                    | Priority     | Response SLA |
| ------------------------------ | -------------------------- | ------------ | ------------ |
| **Hotline/Zalo inbound** | Khách tự liên hệ       | 🔴 Cao       | 2 giờ       |
| **FB Ads**               | Lead từ Marketing         | 🔴 Cao       | 24 giờ      |
| **Website form**         | Form submission            | 🟡 TB        | 48 giờ      |
| **Event**                | Từ sự kiện, networking  | 🟡 TB        | 48 giờ      |
| **Referral**             | KH hiện tại giới thiệu | 🔴 Cao       | 24 giờ      |
| **Self-prospected**      | NVKD tự tìm              | 🟢 NVKD owns | Tự quyết   |

#### 6.1.2 Tiêu chí MQL (Marketing Qualified Lead)

Lead được coi là **MQL** khi đáp ứng **ĐỦ 3/5 tiêu chí**:

| # | Tiêu chí                   | Mô tả                                                       |
| - | ---------------------------- | ------------------------------------------------------------- |
| 1 | **ICP Match**          | Trong tệp khách hàng mục tiêu (DN XNK, FMCG, Fashion...) |
| 2 | **Có nhu cầu**       | Có nhu cầu vận chuyển TQ/KR → VN                         |
| 3 | **Volume tiềm năng** | Tiềm năng ≥ 20tr/tháng                                    |
| 4 | **Timeline**           | Có kế hoạch nhập hàng trong 30 ngày                     |
| 5 | **Contact đúng**     | Có SĐT/Zalo của người quyết định                      |

#### 6.1.3 Tiêu chí SQL (Sales Qualified Lead) - BANT

Lead được coi là **SQL** khi đáp ứng **BANT**:

| BANT                | Câu hỏi verify                                                     |
| ------------------- | -------------------------------------------------------------------- |
| **B**udget    | "Ngân sách cho shipment này khoảng bao nhiêu?"                  |
| **A**uthority | "Anh/chị là người quyết định hay cần xin ý kiến ai khác?" |
| **N**eed      | "Nhu cầu vận chuyển cụ thể là gì? Regular hay one-time?"      |
| **T**imeline  | "Khi nào anh/chị cần hàng về?"                                  |

#### 6.1.4 Quy trình Qualification

```
NHẬN LEAD
    ↓
KIỂM TRA THÔNG TIN CƠ BẢN
    ├── Có SĐT/Zalo? → Không: Request thêm
    └── Có tên công ty? → Không: Google search
    ↓
CALL/CHAT LẦN ĐẦU (Discovery)
    ├── Xác nhận nhu cầu
    ├── Identify pain points
    └── Qualify BANT
    ↓
PHÂN LOẠI
    ├── SQL → Tạo Opportunity
    ├── MQL (chưa đủ BANT) → Nurture
    └── Không qualify → Close Lost, lý do
    ↓
UPDATE CRM
```

#### 6.1.5 Checklist Stage 1

**Trước khi call lần đầu:**

- [ ] Đã research về công ty (Google, Website, Fanpage)
- [ ] Đã check industry (match với ICP?)
- [ ] Đã chuẩn bị discovery questions
- [ ] Đã check lead source (để personalize approach)

**Sau khi call:**

- [ ] Đã qualify BANT?
- [ ] Đã update CRM với đầy đủ thông tin?
- [ ] Đã classify (SQL/MQL/Disqualified)?
- [ ] Đã set next action?

---

### 6.2 STAGE 2: DISCOVERY & NEEDS ASSESSMENT

#### 6.2.1 Mục tiêu

- Hiểu rõ business của khách hàng
- Identify pain points hiện tại
- Xác định nhu cầu cụ thể
- Build relationship & trust

#### 6.2.2 Discovery Questions Framework

**Questions về Business:**

```
1. "Anh/chị có thể chia sẻ về mô hình kinh doanh của công ty không?"
2. "Sản phẩm chủ lực là gì? Xu hướng ra sao?"
3. "Khách hàng target của anh/chị là ai?"
4. "Quy mô nhập hàng hiện tại khoảng bao nhiêu?"
```

**Questions về Shipping Needs:**

```
1. "Anh/chị thường nhập hàng từ đâu? (TQ, Hàn Quốc, nước khác)"
2. "Phương thức vận chuyển ưa thích: đường bộ, biển, hay hàng không?"
3. "Tần suất nhập hàng: hàng tuần, hàng tháng, hay theo mùa?"
4. "Volume trung bình mỗi shipment: bao nhiêu kg/CBM?"
5. "Có yêu cầu đặc biệt không: nhiệt độ, fragile, oversize?"
```

**Questions về Pain Points:**

```
1. "Đối tác logistics hiện tại có gì anh/chị chưa hài lòng?"
2. "Vấn đề lớn nhất anh/chị gặp phải khi nhập hàng là gì?"
3. "Có bao giờ bị delay không? Xử lý thế nào?"
4. "Chi phí vận chuyển có đang là áp lực không?"
```

**Questions về Decision Making:**

```
1. "Quy trình quyết định chọn đối tác logistics như thế nào?"
2. "Ai là người phê duyệt hợp đồng/chi phí?"
3. "Anh/chị cần so sánh bao nhiêu báo giá trước khi quyết định?"
4. "Timeline để quyết định là bao lâu?"
```

#### 6.2.3 Document Findings

Sau Discovery, NVKD phải ghi nhận vào CRM:

```
DISCOVERY NOTES TEMPLATE

1. THÔNG TIN DOANH NGHIỆP
   - Loại hình KD: ___________
   - Sản phẩm: ___________
   - Quy mô: ___________

2. NHU CẦU VẬN CHUYỂN
   - Tuyến: ___________
   - Phương thức: ___________
   - Tần suất: ___________
   - Volume: ___________

3. PAIN POINTS
   - Pain 1: ___________
   - Pain 2: ___________

4. DECISION MAKERS
   - Người liên hệ: ___________ (Role: ___________)
   - Người quyết định: ___________

5. COMPETITORS HIỆN TẠI
   - Đối tác hiện tại: ___________
   - Điểm yếu: ___________

6. NEXT STEPS
   - Action: ___________
   - Timeline: ___________
```

#### 6.2.4 Checklist Stage 2

- [ ] Đã hoàn thành discovery call (ít nhất 30 phút)
- [ ] Đã identify ít nhất 2 pain points
- [ ] Đã xác định decision maker
- [ ] Đã biết competitor hiện tại
- [ ] Đã ghi nhận đầy đủ vào CRM
- [ ] Đã agree next steps với khách

---

### 6.3 STAGE 3: SOLUTION PROPOSAL

#### 6.3.1 Khi nào gửi báo giá?

**Điều kiện cần:**

- ✅ Đã hoàn thành Discovery
- ✅ Đã xác định nhu cầu cụ thể
- ✅ Đã biết budget range
- ✅ Đã biết timeline

**Điều kiện đủ:**

- ✅ Có thông tin shipment rõ ràng (xuất xứ, điểm đến, loại hàng, volume)
- ✅ Khách request báo giá
- ✅ Khách đang ở giai đoạn sẵn sàng quyết định

#### 6.3.2 Quy trình Draft Quotation

Tham khảo chi tiết: [Quotation Policy](../shared/policies/quotation-policy.md)

```
THU THẬP THÔNG TIN SHIPMENT
    ↓
CHECK PRICING
    ├── Liên hệ Operations/Finance
    └── Verify rates
    ↓
TÍNH GIÁ
    ├── Cước VC
    ├── Phí HQ
    ├── Phí kho
    └── Phí khác
    ↓
TÍNH MARGIN
    ├── Check theo Discount Policy
    └── Adjust nếu cần
    ↓
DRAFT QUOTATION (theo template)
    ↓
REVIEW (nếu cần approval)
    ├── Discount > quyền hạn → TP approve
    └── Margin < min → TP/GDKD approve
    ↓
GỬI KHÁCH
```

#### 6.3.3 Timeline SLA Báo giá

| Loại quote            | Từ request đến gửi | Owner      |
| ---------------------- | ---------------------- | ---------- |
| Báo giá nhanh        | 2 giờ làm việc      | NVKD       |
| Báo giá chính thức | 4 giờ làm việc      | NVKD       |
| Báo giá phức tạp   | 24 giờ                | NVKD + OPS |
| Báo giá dự án lớn | 48 giờ                | TP + NVKD  |

#### 6.3.4 Tips Gửi Báo giá

**Trước khi gửi:**

- [ ] Double-check thông tin khách hàng
- [ ] Double-check thông tin shipment
- [ ] Verify giá đã chính xác
- [ ] Check margin đạt target
- [ ] Check discount trong quyền hạn hoặc đã approved
- [ ] Set ngày hết hạn (valid until)

**Khi gửi:**

- 📧 Gửi email kèm Zalo notification
- 📞 Call/Chat để confirm khách đã nhận
- 📋 Giải thích các hạng mục trong báo giá nếu cần
- ❓ Hỏi timeline quyết định

#### 6.3.5 Checklist Stage 3

- [ ] Đã draft báo giá theo template chuẩn
- [ ] Đã check pricing với Operations/Finance
- [ ] Đã verify margin đạt target
- [ ] Discount đã được approve (nếu vượt quyền hạn)
- [ ] Đã gửi báo giá đúng SLA
- [ ] Đã confirm khách nhận
- [ ] Đã set follow-up date

---

### 6.4 STAGE 4: NEGOTIATION & HANDLING OBJECTIONS

#### 6.4.1 Common Objections trong Logistics

| Objection                           | Tần suất | Level |
| ----------------------------------- | ---------- | ----- |
| "Giá bên em cao quá"             | Rất cao   | 🔴    |
| "Để anh hỏi bên khác đã"     | Cao        | 🔴    |
| "Anh đang có đối tác rồi"     | Cao        | 🟡    |
| "Giao hàng chậm thì sao?"        | TB         | 🟡    |
| "Chưa biết chất lượng bên em" | TB         | 🟡    |
| "Thủ tục có phức tạp không?"  | Thấp      | 🟢    |
| "Anh cần xin sếp"                 | TB         | 🟡    |

#### 6.4.2 Framework Xử lý Objection

```
┌─────────────────────────────────────────────────────────────────┐
│                    OBJECTION HANDLING FRAMEWORK                  │
│                       (A.C.R. Method)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   A - ACKNOWLEDGE (Công nhận)                                    │
│   ├── "Em hiểu quan tâm của anh/chị..."                         │
│   ├── "Đây là câu hỏi rất tốt..."                               │
│   └── "Em cũng thường gặp câu hỏi này từ khách hàng khác..."    │
│                                                                  │
│   C - CLARIFY (Làm rõ)                                           │
│   ├── "Anh/chị có thể chia sẻ thêm về...?"                      │
│   ├── "So với mức nào anh/chị thấy cao?"                        │
│   └── "Ngoài giá ra, yếu tố nào quan trọng với anh/chị?"        │
│                                                                  │
│   R - RESPOND (Trả lời)                                          │
│   ├── Trả lời trực tiếp                                          │
│   ├── Cung cấp evidence/case study                              │
│   └── Reframe giá trị                                            │
│                                                                  │
│   C - CHECK (Xác nhận)                                           │
│   ├── "Điều này có giải đáp được quan tâm của anh/chị không?"   │
│   └── "Anh/chị còn thắc mắc gì khác không?"                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 6.4.3 Scripts Xử lý Objection Phổ biến

**OBJECTION 1: "Giá bên em cao quá"**

```
Step 1 - ACKNOWLEDGE:
"Em hiểu giá là yếu tố quan trọng. Nhiều khách hàng cũng có cùng quan tâm này ban đầu."

Step 2 - CLARIFY:
"Anh/chị có thể chia sẻ so với mức nào thấy cao không? Là so với đối tác hiện tại hay bên khác?"

Step 3 - RESPOND:
"Tùy theo cách nhìn, nhưng nếu anh/chị xét về tổng chi phí:
 • Tỷ lệ OTD của ERK là 95%+, giảm rủi ro hàng chậm
 • Bao trọn gói HQ, không phát sinh phí ẩn
 • Có dedicated NVKD support 24/7
 → Thực tế total cost thấp hơn nhiều đối thủ"

Step 4 - CHECK:
"Ngoài giá ra, yếu tố nào quan trọng nhất với anh/chị?"
```

**OBJECTION 2: "Để anh hỏi bên khác đã"**

```
Step 1 - ACKNOWLEDGE:
"Dạ đúng rồi anh, việc so sánh là rất cần thiết để chọn được đối tác phù hợp nhất."

Step 2 - CLARIFY:
"Anh định so sánh với bao nhiêu bên? Tiêu chí nào quan trọng nhất khi anh so sánh?"

Step 3 - RESPOND:
"Khi anh so sánh, em khuyến nghị anh check kỹ:
 • Tỷ lệ OTD thực tế (có document chứng minh không?)
 • Có bao trọn HQ không hay phát sinh phí?
 • Có dedicated support không hay call center chung?
 • Feedback từ khách hàng hiện tại

Em có thể gửi anh case study khách hàng tương tự industry với anh để tham khảo."

Step 4 - CHECK:
"Em có thể follow-up với anh vào [ngày] được không? Nếu anh cần thêm thông tin để so sánh, em sẵn sàng support."
```

**OBJECTION 3: "Anh đang có đối tác rồi, hài lòng rồi"**

```
Step 1 - ACKNOWLEDGE:
"Dạ tốt quá anh, việc có đối tác ổn định cho thấy business anh đang chạy tốt."

Step 2 - CLARIFY:
"Anh đã hợp tác bao lâu rồi? Có điều gì anh chưa 100% hài lòng không, dù là nhỏ?"

Step 3 - RESPOND:
"Em không đề nghị anh thay đổi ngay. Nhưng nhiều khách hàng của ERK vẫn giữ 2-3 đối tác:
 • Để backup khi cần (high season, over capacity)
 • Để so sánh giá定期
 • Để có option khi service không ổn định

Em đề xuất anh thử 1-2 đơn nhỏ với ERK, không cam kết gì cả. Nếu không满意, không sao cả."

Step 4 - CHECK:
"Anh thấy đề xuất này thế nào?"
```

#### 6.4.4 Quy trình Discount Approval

Tham khảo chi tiết: [Discount Policy](../shared/policies/discount-policy.md)

| Chức vụ | Giảm tối đa | Cần approval nếu vượt |
| --------- | -------------- | ------------------------- |
| NVKD      | 5%             | TP Team                   |
| TP Team   | 15%            | GDKD                      |
| GDKD      | 30%            | CEO (nếu > 30%)          |

**Quy trình request discount:**

```
1. NVKD prepare request:
   - Mã KH, hạng hiện tại
   - Giá trị đơn hàng
   - Discount đề xuất
   - Lý do + Benefit kỳ vọng

2. Submit qua Zalo/Email cho TP

3. TP review & approve/reject trong 2h

4. Nếu approve → Proceed với discount
5. Nếu reject → Negotiate lại với khách
```

#### 6.4.5 Checklist Stage 4

- [ ] Đã identify objection chính xác
- [ ] Đã sử dụng ACR framework
- [ ] Đã document objection và response vào CRM
- [ ] Nếu có discount, đã được approve đúng quy trình
- [ ] Đã agree được next steps với khách

---

### 6.5 STAGE 5: CLOSING

#### 6.5.1 Closing Signals

**Signals khách hàng sẵn sàng mua:**

- ✅ Hỏi về payment terms
- ✅ Hỏi về contract, cam kết
- ✅ Hỏi về timeline bắt đầu
- ✅ Request discount cuối cùng
- ✅ Discuss về onboarding, handoff
- ✅ Yêu cầu gặp mặt để ký

#### 6.5.2 Closing Techniques

**1. Trial Close**

```
"Nếu em có thể arrange được schedule như anh yêu cầu,
anh có sẵn sàng bắt đầu với đơn đầu tiên tuần sau không?"
```

**2. Summary Close**

```
"Tóm lại, em đã hiểu nhu cầu của anh:
 • Tuyến Quảng Châu → HCM
 • Đường bộ, 2-3 container/tháng
 • Cần OTD 95%+
 • Payment: Net 15

Báo giá của em bao gồm:
 • Cước VC: XXX
 • HQ trọn gói
 • Đảm bảo OTD 95%+

Anh có muốn proceed với đơn đầu tiên không?"
```

**3. Urgency Close**

```
"Hiện tại slot cho tuyến Quảng Châu cuối tháng này đang khá full.
Nếu anh confirm hôm nay, em có thể arrange ngay cho đơn đầu tiên."
```

**4. Assumptive Close**

```
"Vậy để em prepare contract và gửi anh review nhé?
Anh gửi giúp em thông tin công ty để em draft đúng thông tin."
```

#### 6.5.3 Quy trình Closing

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLOSING PROCESS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   BƯỚC 1: CREDIT CHECK                                          │
│   ├── Submit credit check request → Finance                     │
│   ├── Finance verify trong 2h                                   │
│   └── Nếu không pass → Cần deposit hoặc collateral              │
│                                                                  │
│   BƯỚC 2: CONTRACT PREPARATION                                  │
│   ├── Trợ lý draft contract                                     │
│   ├── TP review                                                 │
│   └── Gửi khách sign                                            │
│                                                                  │
│   BƯỚC 3: DEPOSIT (nếu cần)                                     │
│   ├── Khách hàng mới: Cọc 50-100% đơn đầu                       │
│   ├── Sau 3 đơn: Review lại credit                              │
│   └── Confirm receipt of deposit                                │
│                                                                  │
│   BƯỚC 4: FIRST ORDER                                           │
│   ├── Nhận thông tin đơn hàng đầu tiên                          │
│   ├── Handoff to Operations                                     │
│   └── Track đến khi giao xong                                   │
│                                                                  │
│   BƯỚC 5: UPDATE STATUS                                         │
│   ├── Mark Opportunity → Closed Won                             │
│   ├── Update actual value                                       │
│   └── Close date                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 6.5.4 Credit Check

Tham khảo chi tiết: [Credit Policy](../shared/policies/credit-policy.md)

| Loại KH             | Credit Check        | Yêu cầu                    |
| -------------------- | ------------------- | ---------------------------- |
| Khách hàng mới    | Bắt buộc          | Cọc 50-100% đơn đầu     |
| Khách Pro+          | Review credit score | Hạn mức theo Credit Policy |
| Khách Premium/Elite | Review              | Hạn mức cao hơn           |

#### 6.5.5 Checklist Stage 5

**Trước khi closing:**

- [ ] Đã verify closing signals
- [ ] Đã credit check (hoặc安排 deposit)
- [ ] Đã prepare contract
- [ ] Đã clarify tất cả terms

**Sau khi closing:**

- [ ] Đã nhận signed contract
- [ ] Đã nhận deposit (nếu cần)
- [ ] Đã update CRM → Closed Won
- [ ] Đã handoff to Operations
- [ ] Đã schedule onboarding call

---

### 6.6 STAGE 6: POST-SALE

#### 6.6.1 Handoff to Operations

Tham khảo chi tiết: [Sales-Operations Handoff SOP](sales-operations-handoff-sop.md)

```
THÔNG TIN CẦN HANDOFF:

□ THÔNG TIN KHÁCH HÀNG
  ├── Tên công ty
  ├── Mã KH
  ├── Người liên hệ chính
  ├── SĐT/Zalo/Email
  ├── Địa chỉ giao hàng
  └── Credit status

□ THÔNG TIN ĐƠN HÀNG
  ├── Loại hàng
  ├── Xuất xứ
  ├── Điểm đi - Điểm đến
  ├── Phương thức VC
  ├── Trọng lượng/Volume
  ├── Incoterms
  ├── Special requirements
  └── Timeline yêu cầu

□ THÔNG TIN TÀI CHÍNH
  ├── Giá đã agree
  ├── Discount đã approve
  ├── Payment terms
  └── Credit limit
```

#### 6.6.2 Onboarding Khách hàng Mới

**Tuần đầu tiên:**

| Ngày | Hoạt động                                 | Owner      |
| ----- | -------------------------------------------- | ---------- |
| Day 1 | Welcome call, giới thiệu quy trình        | NVKD       |
| Day 2 | Gửi welcome pack (guidelines, contact list) | NVKD       |
| Day 3 | Confirm first shipment status                | Operations |
| Day 5 | Follow-up call, xem có câu hỏi gì không | NVKD       |

**Tháng đầu tiên:**

| Tuần   | Hoạt động                                | Owner      |
| ------- | ------------------------------------------- | ---------- |
| Tuần 1 | Welcome + First shipment                    | NVKD + OPS |
| Tuần 2 | Follow-up after first delivery              | NVKD       |
| Tuần 3 | Check satisfaction                          | NVKD       |
| Tuần 4 | Review tháng đầu, discuss next shipments | NVKD       |

#### 6.6.3 Customer Care Schedule

Tham khảo chi tiết: [Customer Care Policy](../shared/policies/customer-care-policy.md)

| Hạng KH | Tần suất check-in | Owner   |
| -------- | ------------------- | ------- |
| Elite    | Weekly              | TP Team |
| Premium  | 2 tuần/lần        | NVKD    |
| Pro      | Monthly             | NVKD    |
| Basic    | Sau mỗi đơn      | NVKD    |

#### 6.6.4 Checklist Stage 6

- [ ] Đã handoff đầy đủ cho Operations
- [ ] Đã thực hiện welcome call
- [ ] Đã gửi welcome pack
- [ ] Đã follow-up sau đơn đầu tiên
- [ ] Đã set lịch care định kỳ

---

## 7. CÔNG CỤ & TÀI NGUYÊN (TOOLS & RESOURCES)

### 7.1 Công cụ

| Công cụ      | Mục đích                                  | Link       |
| -------------- | -------------------------------------------- | ---------- |
| CRM            | Quản lý khách hàng, pipeline, activities | [Internal] |
| Excel/Sheets   | Reports, tracking                            | [Internal] |
| Zalo           | Communication với khách                    | N/A        |
| Email          | Formal communication                         | [Internal] |
| Quotation Tool | Tạo báo giá nhanh                         | [Internal] |

### 7.2 Templates

| Template           | Mục đích              | Location                                                |
| ------------------ | ------------------------ | ------------------------------------------------------- |
| Quotation Template | Báo giá                | [Quotation Policy](../shared/policies/quotation-policy.md) |
| Contract Template  | Hợp đồng              | [Internal]                                              |
| Discovery Notes    | Ghi nhận discovery      | [CRM Template]                                          |
| Handoff Form       | Chuyển giao đơn hàng | [Sales-Ops Handoff SOP](sales-operations-handoff-sop.md)   |

### 7.3 Documents tham khảo

| Document               | Mô tả                    | Location                                                               |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------- |
| Company Profile        | Thông tin ERK Transport   | [company-profile.md](../shared/company-profile.md)                        |
| Quotation Policy       | Chính sách báo giá     | [quotation-policy.md](../shared/policies/quotation-policy.md)             |
| Discount Policy        | Chính sách giảm giá    | [discount-policy.md](../shared/policies/discount-policy.md)               |
| Credit Policy          | Chính sách công nợ     | [credit-policy.md](../shared/policies/credit-policy.md)                   |
| Customer Care Policy   | Chính sách CSKH          | [customer-care-policy.md](../shared/policies/customer-care-policy.md)     |
| Marketing-Sales SLA    | Phối hợp Marketing-Sales | [marketing-sales-sla.md](../shared/policies/marketing-sales-sla.md)       |
| Lead Allocation Policy | Phân bổ leads            | [lead-allocation-policy.md](../shared/policies/lead-allocation-policy.md) |

---

## 8. KPIs & METRICS

### 8.1 Activity Metrics (Leading Indicators)

| Metric                   | Target | Tracking |
| ------------------------ | ------ | -------- |
| Calls/week               | ≥ 50  | CRM      |
| Meetings/week            | ≥ 5   | CRM      |
| Quotes sent/week         | ≥ 10  | CRM      |
| New leads contacted/week | ≥ 10  | CRM      |
| CRM update rate          | 100%   | CRM      |

### 8.2 Conversion Metrics

| Metric                    | Target | Tracking |
| ------------------------- | ------ | -------- |
| Lead → SQL rate          | ≥ 50% | Monthly  |
| SQL → Opportunity rate   | ≥ 50% | Monthly  |
| Quote → Close rate       | ≥ 40% | Monthly  |
| Overall MQL → Close rate | ≥ 5%  | Monthly  |

### 8.3 Performance Metrics (Lagging Indicators)

| Metric                | Target                | Tracking |
| --------------------- | --------------------- | -------- |
| Doanh số/tháng      | Theo target cá nhân | Monthly  |
| Số khách hàng mới | Theo target           | Monthly  |
| Average deal size     | Track                 | Monthly  |
| Sales cycle length    | ≤ 6 tuần            | Monthly  |

---

## 9. XỬ LÝ NGOẠI LỆ (EXCEPTIONS)

### 9.1 Trường hợp ngoại lệ

| Tình huống                         | Cách xử lý            | Người phê duyệt |
| ------------------------------------ | ------------------------ | ------------------- |
| Khách yêu cầu discount > 30%      | Review case-by-case      | GDKD + CEO          |
| Credit không pass                   | Deposit hoặc collateral | Finance + GDKD      |
| Khách VIP yêu cầu đặc biệt     | Custom solution          | GDKD                |
| Conflict với khách của NVKD khác | Review account ownership | TP Team             |
| Khách yêu cầu NVKD cụ thể       | Respect request          | TP Team             |

### 9.2 Escalation Path

```
Level 1: NVKD → TP Team (24h response)
    ↓ (nếu không resolve)
Level 2: TP Team → Sales Manager (24h response)
    ↓ (nếu không resolve)
Level 3: Sales Manager → GDKD (Final decision)
```

---

## 10. KIỂM SOÁT & AUDIT (CONTROLS & AUDIT)

### 10.1 Checkpoints

| Checkpoint           | Nội dung                  | Tần suất |
| -------------------- | -------------------------- | ---------- |
| CRM data quality     | Đầy đủ, chính xác    | Weekly     |
| Pipeline accuracy    | Stage đúng, value đúng | Weekly     |
| Quotation compliance | Theo template, approved    | Monthly    |
| Discount compliance  | Theo policy                | Monthly    |
| Process compliance   | Theo SOP                   | Monthly    |

### 10.2 Records cần lưu

| Record                  | Thời gian lưu               | Location    |
| ----------------------- | ----------------------------- | ----------- |
| Quotations              | 1 năm (active), 3 năm (won) | CRM + Drive |
| Contracts               | 5 năm                        | Drive       |
| Customer communications | 2 năm                        | CRM         |
| Meeting notes           | 1 năm                        | CRM         |

---

## 11. LỊCH SỬ CẬP NHẬT (REVISION HISTORY)

| Version | Ngày      | Tác giả | Thay đổi      |
| ------- | ---------- | --------- | --------------- |
| 1.0     | 31/03/2026 | BusKit    | Initial version |

---

## 12. PHÊ DUYỆT (APPROVAL)

| Role     | Tên               | Chữ ký | Ngày |
| -------- | ------------------ | -------- | ----- |
| Owner    | Sales Manager      |          |       |
| Reviewer | Operations Manager |          |       |
| Approver | GDKD               |          |       |

---

## PHỤ LỤC

### Appendix A: Sales Funnel Flowchart

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SALES FUNNEL WITH ACTIVITIES                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   LEAD ─────────────────────────────────────────────────────────────  │
│     │                                                                 │
│     │ Activities: Call, Email, Research                               │
│     │ SLA: 24h first contact                                          │
│     ↓                                                                 │
│   MQL ──────────────────────────────────────────────────────────────  │
│     │                                                                 │
│     │ Activities: Discovery call, BANT qualify                        │
│     │ SLA: 48h qualify                                                │
│     ↓                                                                 │
│   SQL ──────────────────────────────────────────────────────────────  │
│     │                                                                 │
│     │ Activities: Deep discovery, Solution design                     │
│     │ Output: Needs assessment                                        │
│     ↓                                                                 │
│   OPPORTUNITY ──────────────────────────────────────────────────────  │
│     │                                                                 │
│     │ Activities: Prepare & send quotation                            │
│     │ SLA: 4h for standard quote                                      │
│     ↓                                                                 │
│   PROPOSAL ─────────────────────────────────────────────────────────  │
│     │                                                                 │
│     │ Activities: Follow-up, Handle objections, Negotiate             │
│     │ Output: Addressed concerns                                      │
│     ↓                                                                 │
│   NEGOTIATION ──────────────────────────────────────────────────────  │
│     │                                                                 │
│     │ Activities: Final discount, Contract, Credit check              │
│     │ Output: Signed contract                                         │
│     ↓                                                                 │
│   ┌──────────────┐     ┌──────────────┐                               │
│   │  CLOSED WON  │     │ CLOSED LOST  │                               │
│   └──────────────┘     └──────────────┘                               │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Appendix B: Daily Checklist NVKD

**BUỔI SÁNG (8:00 - 12:00)**

- [ ] Check email, Zalo (15 phút)
- [ ] Review CRM - opportunities cần follow-up (15 phút)
- [ ] Plan activities trong ngày (10 phút)
- [ ] Follow-up calls với opportunities (2h)
- [ ] Respond requests từ khách (30 phút)
- [ ] Prospecting calls (30 phút)

**BUỔI CHIỀU (13:30 - 17:30)**

- [ ] Send quotations (1h)
- [ ] Discovery calls với leads mới (1h)
- [ ] Meetings (nếu có) (1-2h)
- [ ] Update CRM (30 phút)
- [ ] End-of-day review (15 phút)

### Appendix C: FAQs

**Q1: Khách hàng không trả lời call/email thì sao?**
A: Thực hiện theo 5-touch rule:

- Day 1: Call + Zalo
- Day 2: Email follow-up
- Day 4: Call khác giờ
- Day 7: Final attempt
- Day 8+: Move to Nurture hoặc Close

**Q2: Khách hàng muốn gặp mặt thì arrange thế nào?**
A:

1. Confirm mục đích meeting
2. Check calendar, propose 2-3 slots
3. Prepare materials
4. Nếu khách VIP → Invite TP/GDKD
5. Send calendar invite + location

**Q3: Khách hàng hỏi về service mà NVKD không biết?**
A:

1. Không đoán
2. Acknowledge: "Để em verify lại chính xác cho anh/chị"
3. Check với Operations/Expert
4. Respond trong 24h

---

*SOP Quy trình Bán hàng v1.0*
*Owner: Sales Manager*
*Cập nhật: 31/03/2026*
