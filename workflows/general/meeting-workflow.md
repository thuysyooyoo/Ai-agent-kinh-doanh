# Meeting Workflow

## Mục đích

Quy trình họp Agent để thảo luận và ra quyết định cho các vấn đề phức tạp.

---

## Khi nào sử dụng

- Vấn đề cần nhiều Agent tham gia
- Cần thảo luận và đồng thuận
- Quyết định chiến lược
- Giải quyết vấn đề liên phòng

---

## Quy trình

### BƯỚC 1: USER REQUEST

**User:** Gọi `/meeting [topic]`

**Ví dụ:**
```
/meeting Xây dựng quy trình Sales-Marketing
/meeting Kế hoạch mở rộng miền Trung
```

**Output:** Topic xác định

---

### CHẾ ĐỘ HỌP (Meeting Mode)

Trước khi họp, Chủ trì xác định chế độ họp phù hợp:

| Chế độ | Dùng khi | Cách điều hành |
|--------|----------|----------------|
| **Báo cáo** | Cập nhật tiến độ, số liệu, KPI | Agent báo cáo → Hỏi đáp → Kết luận |
| **Phê duyệt** | Cần ra quyết định YES/NO | Trình bày đề xuất → Thảo luận → Quyết định |
| **Brainstorm** | Tìm giải pháp mới, thiết kế chiến lược/quy trình | Theo quy trình 7 bước của `brainstorm-workflow.md` |

**Khi chọn chế độ Brainstorm:**
- Facilitator = Chủ trì (có thể không phải GDKD nếu chủ đề chuyên môn sâu)
- Stakeholder = Các agent Đóng góp
- Áp dụng quy trình 7 bước: Hiểu ngữ cảnh → Hiểu ý tưởng → NFR → Chốt hiểu → Phương án → Thiết kế → Decision Log
- Mỗi lần 1 câu hỏi, xác nhận từng phần, không code/implement
- Tham chiếu đầy đủ: `workflows/general/brainstorm-workflow.md`

---

### BƯỚC 2: PHÂN CÔNG

**GDKD Agent:**
1. Xác định vấn đề + chọn chế độ họp
2. Phân công Agent tham gia

**Phân loại role:**
| Role | Mô tả |
|------|-------|
| **Chủ trì** | Lead cuộc họp. Với Brainstorm mode → kiêm Facilitator |
| **Đóng góp** | Cung cấp input. Với Brainstorm mode → kiêm Stakeholder |
| **Reviewer** | Kiểm tra output |

**Template phân công:**
```
Topic: [Topic]
Chế độ: [Báo cáo / Phê duyệt / Brainstorm]
Chủ trì: [Agent]
Đóng góp: [Agent 1], [Agent 2]
Reviewer: [Agent]
```

---

### BƯỚC 3: CHUẨN BỊ (Song song)

**Mỗi Agent:**
1. Đọc knowledge base liên quan
2. Chuẩn bị input theo role
3. Ghi nhận điểm cần thảo luận

**Checklist chuẩn bị:**
- [ ] Đã đọc knowledge base?
- [ ] Đã chuẩn bị input?
- [ ] Đã ghi nhận questions?

---

### BƯỚC 4: CUỘC HỌP

**Chủ trì điều phối:**

1. **Opening** (5 min)
   - Statement of purpose
   - Agenda review
   - Time allocation

2. **Input Sharing** (Each Agent: 5-10 min)
   - Agent 1 presents
   - Agent 2 presents
   - ...

3. **Discussion** (15-20 min)
   - Brainstorming ideas
   - Debate
   - Build on ideas
   - *Với Brainstorm mode:* Facilitator dẫn từng bước (mỗi lần 1 câu hỏi), Stakeholder trả lời, ghi nhận assumptions

4. **Decision** (10 min)
   - Options summary
   - Vote/consensus
   - Action items
   - *Với Brainstorm mode:* Ghi Decision Log (chọn gì, bỏ gì, tại sao)

**Output Format (Báo cáo / Phê duyệt):**
```markdown
# Meeting Notes - [Date]

## Topic
[Topic]

## Participants
- Chủ trì: [Agent]
- Đóng góp: [Agents]

## Key Points
- [Point 1]
- [Point 2]

## Decisions
- [Decision 1]
- [Decision 2]

## Action Items
| Item | Owner | Deadline |
|------|-------|----------|
| [Action] | [Agent] | [Date] |

## Next Steps
- [Next step]
```

**Output Format (Brainstorm mode):**
```markdown
# Brainstorming Session - [Date]

## Topic
[Topic]

## Participants
- Facilitator: [Agent]
- Stakeholder: [Agents]

## Tóm tắt hiểu biết (Bước 4 - Understanding Lock)
- [Key point 1]
- [Key point 2]

## Phương án đã cân nhắc (Bước 5)
| Phương án | Mô tả | Trade-off |
|-----------|-------|-----------|
| A: [Tên] | [Mô tả] | [Trade-off] |
| B: [Tên] | [Mô tả] | [Trade-off] |

## Phương án chọn + Thiết kế (Bước 6)
[Kiến trúc / quy trình / luồng dữ liệu]

## Decision Log (Bước 7)
| # | Quyết định | Alternatives | Lý do chọn |
|---|-----------|-------------|-----------|
| 1 | [Quyết định] | [Alt] | [Lý do] |

## Action Items
| Item | Owner | Deadline |
|------|-------|----------|
| [Action] | [Agent] | [Date] |
```

---

### BƯỚC 5: REVIEW CHÉO

**Reviewer Agent kiểm tra:**

**Checklist Review:**
- [ ] Logic đúng không?
- [ ] Thông tin chính xác không?
- [ ] Nhất quán với knowledge base?
- [ ] Phù hợp với chiến lược?

**Nếu chưa đạt:**
- Note issues
- Quay lại Bước 4

---

### BƯỚC 6: USER CONFIRM

**Trình bày cho User:**
1. Summary quyết định
2. Rationale
3. Action items

**User phản hồi:**
- **Approve:** → Lưu document
- **Revise:** → Quay lại Bước 4
- **Reject:** → Discuss alternatives

**Final Output:**
- File: `projects/[project-name]/meeting-notes-[date].md`
- Hoặc: `projects/[project-name]/document-final-[name].md`

---

## Checklist Meeting

### Before Meeting
- [ ] Topic rõ ràng
- [ ] Agents đã assign
- [ ] Time đã confirm

### During Meeting
- [ ] All agents participated
- [ ] Key points documented
- [ ] Decisions recorded

### After Meeting
- [ ] Review completed
- [ ] User approved
- [ ] Document saved

---

## Meeting Roles chi tiết

### Chủ trì (GDKD thường)
- Điều phối cuộc họp
- Đảm bảo progress
- Tóm tắt decisions
- Assign action items

### Đóng góp
- Cung cấp expertise
- Share relevant data
- Propose solutions
- Answer questions

### Reviewer
- Kiểm tra logic
- Verify accuracy
- Ensure consistency
- Quality gate

---

*Meeting Workflow v1.0*
