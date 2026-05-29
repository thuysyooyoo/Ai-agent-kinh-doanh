# Brainstorming Workflow — Động não có Cấu trúc

## Mục đích

Biến ý tưởng mơ hồ thành thiết kế đã được kiểm chứng, thông qua đối thoại có cấu trúc và suy luận có kỷ luật. **Không code — chỉ thiết kế.**

---

## Nguyên tắc cốt lõi

1. **Mỗi lần một câu hỏi** — Không dội bom câu hỏi
2. **Giả định rõ ràng** — Mọi assumption phải được nói ra và ghi lại
3. **Khám phá alternatives** — Luôn có ít nhất 2 phương án
4. **Kiểm chứng từng phần** — Không trình bày toàn bộ thiết kế một lần
5. **YAGNI ruthlessly** — Loại bỏ thứ không cần thiết ngay từ thiết kế
6. **Clarity over cleverness** — Giải pháp đơn giản được ưu tiên

---

## Khi nào sử dụng

| Dùng | Không dùng |
|------|------------|
| Thiết kế chiến lược mới | Báo cáo định kỳ |
| Thiết kế quy trình/dịch vụ | Task đơn giản đã rõ cách làm |
| Giải quyết vấn đề phức tạp | Phê duyệt thông thường |
| Trước khi triển khai thay đổi lớn | Hỏi đáp thông tin |

---

## Quy trình 7 bước

### BƯỚC 1: HIỂU NGỮ CẢNH

**Facilitator:**
1. Đọc các file knowledge base liên quan đến chủ đề
2. Xem xét dữ liệu hiện có (KPI, báo cáo, quy trình hiện tại)
3. Xác định các agent stakeholder cần tham gia

**Output:** Danh sách stakeholder + context summary (3-5 bullet)

**Nguyên tắc:** Chỉ đọc và hiểu — chưa thiết kế gì cả.

---

### BƯỚC 2: HIỂU Ý TƯỞNG

**Facilitator hỏi từng câu một, ưu tiên câu hỏi trắc nghiệm:**

**Phải cover:**
- [ ] Mục đích — Tại sao làm? Giải quyết vấn đề gì?
- [ ] Người dùng — Ai dùng? Ai hưởng lợi?
- [ ] Ràng buộc — Thời gian, ngân sách, nhân sự, quy định?
- [ ] Tiêu chí thành công — Làm sao biết đã đạt được mục tiêu?
- [ ] Non-goals — Cái gì KHÔNG nằm trong scope?

**Ví dụ câu hỏi:**
> "Mục tiêu chính của chiến dịch này là: A) Tăng nhận diện thương hiệu, B) Tăng lead, C) Tăng retention, hay D) Khác?"

**Output:** Bản ghi câu trả lời cho từng mục trên.

---

### BƯỚC 3: YÊU CẦU PHI CHỨC NĂNG (BẮT BUỘC)

**Facilitator làm rõ hoặc ghi nhận default cho:**

| Hạng mục | Câu hỏi | Default (nếu không rõ) |
|----------|---------|------------------------|
| **Quy mô** | Bao nhiêu KH/đơn/người bị ảnh hưởng? | Ghi "Chưa xác định" |
| **Thời gian** | Deadline? Giai đoạn? | Ghi "Linh hoạt" |
| **Ngân sách** | Giới hạn chi phí? | Ghi "Chưa có budget" |
| **Rủi ro** | Rủi ro lớn nhất nếu thất bại? | Ghi "Cần đánh giá thêm" |
| **Tuân thủ** | Quy định pháp lý nào áp dụng? (NĐ 70, NĐ 37, CV 15726...) | Ghi "Cần legal review" |
| **Bảo trì** | Ai duy trì sau khi triển khai? Tần suất? | Ghi "Chưa phân công" |

**Output:** Bảng NFR đã điền đầy đủ.

---

### BƯỚC 4: CHỐT HIỂU (HARD GATE)

**Facilitator tổng hợp và trình bày:**

```markdown
## Tóm tắt hiểu biết (5-7 bullet)
1. [Vấn đề cần giải quyết]
2. [Người dùng / bên liên quan]
3. [Ràng buộc chính]
4. [Tiêu chí thành công]
5. [Non-goals]
6. [Rủi ro lớn nhất]
7. [Timeline / ngân sách]

## Giả định (Assumptions)
- [Assumption 1]
- [Assumption 2]

## Câu hỏi mở
- [Question 1?]
- [Question 2?]
```

**Sau đó hỏi:**
> "Đây có phản ánh đúng ý định của bạn không?"

**KHÔNG đi tiếp cho đến khi được xác nhận rõ ràng.**

Nếu không chắc chắn → tiếp tục hỏi để làm rõ.

---

### BƯỚC 5: ĐỀ XUẤT HƯỚNG TIẾP CẬN

**Facilitator đề xuất 2-3 phương án:**

```markdown
## Phương án A: [Tên]
- Mô tả: 2-3 câu
- Ưu điểm:
- Nhược điểm:
- Phù hợp nhất khi:

## Phương án B: [Tên]
- Mô tả: 2-3 câu
- Ưu điểm:
- Nhược điểm:
- Phù hợp nhất khi:

## Khuyến nghị
Chọn Phương án X vì [lý do ngắn]
```

**Nguyên tắc:**
- Mỗi phương án phải thực sự khác biệt (không phải biến thể nhỏ)
- Trade-off phải rõ ràng
- Áp dụng YAGNI — cắt bỏ mọi thứ không cần thiết

---

### BƯỚC 6: TRÌNH BÀY THIẾT KẾ

**Trình bày từng phần ≤300 từ. Sau mỗi phần hỏi:**
> "Phần này ổn chưa?"

**Các phần cần cover (theo thứ tự):**
1. **Kiến trúc tổng quan** — Các thành phần chính, mối quan hệ
2. **Luồng dữ liệu / quy trình** — Input → Xử lý → Output
3. **Xử lý lỗi / edge cases** — Các tình huống ngoại lệ
4. **Kế hoạch kiểm thử / đo lường** — Làm sao biết nó hoạt động?

**Nếu stakeholder nói "chưa ổn" → dừng, hỏi rõ issue, điều chỉnh.**

---

### BƯỚC 7: DECISION LOG (BẮT BUỘC)

**Ghi lại mọi quyết định đã đưa ra:**

```markdown
# Decision Log — [Tên dự án/vấn đề]

| # | Quyết định | Phương án thay thế đã cân nhắc | Lý do chọn | Ngày |
|---|-----------|-------------------------------|-----------|------|
| 1 | [Quyết định] | [Alternative] | [Lý do] | [Date] |
| 2 | [Quyết định] | [Alternative] | [Lý do] | [Date] |
```

---

## Sau khi hoàn thiện thiết kế

### Documentation
Lưu toàn bộ output vào file:
```
projects/[ten-du-an]/design-[date].md
```

Bao gồm:
- Tóm tắt hiểu biết (Bước 4)
- Bảng NFR (Bước 3)
- Phương án đã chọn + thiết kế (Bước 5-6)
- Decision Log (Bước 7)

### Implementation Handoff (Tùy chọn)
- Hỏi: "Sẵn sàng triển khai chưa?"
- Nếu có → chuyển sang `/task` để tạo implementation plan
- Nếu rủi ro cao → cân nhắc chuyển sang `/meeting` để thảo luận thêm

---

## Tiêu chí kết thúc (Hard Stop)

Chỉ kết thúc brainstorming khi **TẤT CẢ** các điều sau đúng:
- [ ] Understanding Lock đã được xác nhận
- [ ] Ít nhất 1 phương án thiết kế đã được duyệt
- [ ] Các giả định chính đã được ghi lại
- [ ] Rủi ro chính đã được nhận diện
- [ ] Decision Log hoàn chỉnh

---

## Tích hợp với hệ thống Eureka Sales Agents Suite

### Agent tham gia mặc định

| Chủ đề Brainstorming | Facilitator (Chủ trì) | Stakeholders chính (Tham gia) |
|----------------------|-----------------------|-------------------------------|
| **Lập báo giá đặc biệt & Tối ưu dòng tiền** | **Agent 1** (Quotation Assistant) | Agent 4 (Finance), Agent 3 (Communication) |
| **Phân tích HS Code rủi ro & Thủ tục hải quan khó** | **Agent 2** (Customs Consultant) | Agent 1 (Quotation), Agent 3 (Communication) |
| **Xây dựng kịch bản đàm phán cước & Xử lý từ chối** | **Agent 3** (Communication Expert) | Agent 1 (Quotation), Agent 4 (Finance) |
| **Thiết lập thỏa thuận công nợ & Soạn thảo Hợp đồng** | **Agent 4** (Finance & Contract) | Agent 2 (Customs), Agent 3 (Communication) |

### Liên kết workflow khác
- **→ `/meeting`:** Khi cần thêm ý kiến đa chiều sau brainstorming
- **→ `/task`:** Khi đã có thiết kế, cần tạo implementation plan
- **→ `/approve`:** Khi thiết kế cần phê duyệt chính thức
- **→ `/review`:** Khi cần cross-review bản thiết kế trước khi triển khai

---

*Brainstorming Workflow v1.0 — Eureka Sales Agents Suite*
