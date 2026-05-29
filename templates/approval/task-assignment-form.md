# PHIẾU GIAO VIỆC (SALES SUITE)

> Template: `templates/approval/task-assignment-form.md`
> Workflow: `workflows/general/task-assignment-workflow.md`
> Ai dùng: GDKD / Sales Staff (User) giao nhiệm vụ cho các Agent chuyên trách

---

## Thông tin nhiệm vụ

| Trường | Giá trị |
|--------|---------|
| **Mã NV** | [Tự sinh: TA-YYYYMMDD-XXX] |
| **Ngày giao** | [Tự sinh: Ngày hiện tại] |
| ★ **Người giao** | [GDKD / Nhân sự Sales (User)] |
| ★ **Giao cho** | ○ Agent 1 (Quotation) ○ Agent 2 (Customs) ○ Agent 3 (Communication) ○ Agent 4 (Finance) |
| ★ **Mức ưu tiên** | ○ Khẩn cấp ○ Cao ○ Bình thường ○ Thấp |
| ★ **Hạn hoàn thành** | [Thời gian chi tiết, ví dụ: 30 phút / 2 giờ / 1 ngày] |
| ★ **Dự kiến công sức** | ○ <30 phút ○ 1-2 giờ ○ Nửa ngày ○ 1-2 ngày |

---

## Mô tả nhiệm vụ

| Trường | Giá trị |
|--------|---------|
| ★ **Mục tiêu** | [Cần các Agent giải quyết vấn đề gì cho lô hàng / khách hàng] |
| ★ **Kết quả giao ngay** | [Báo giá / Phương án HS Code / Kịch bản đàm phán / Dự thảo Hợp đồng] |
| ★ **Tiêu chí chấp nhận** | [Đúng quy chuẩn Eureka, số liệu khớp lõi cước, đúng HS Code áp dụng, v.v.] |
| **Phạm vi** | [Giới hạn scope nhiệm vụ] |
| **Tài nguyên hỗ trợ** | [Biểu cước hiện hành, thông tin chi tiết từ khách hàng, catalog sản phẩm] |

---

## Phụ thuộc (Dependencies)

| Nhiệm vụ phụ thuộc | Mã Task | Trạng thái |
|---------------------|---------|------------|
| [Ví dụ: Agent 2 duyệt HS Code trước] | [Mã] | ○ Chưa xong ○ Đã xong |
| [Ví dụ: Agent 1 tính cước nháp trước] | [Mã] | ○ Chưa xong ○ Đã xong |

---

## Các mốc (Milestones)

| Mốc | Hạn | Trạng thái |
|-----|-----|------------|
| [Mốc 1: Bản nháp đầu tiên] | [Thời gian] | ○ Chưa ○ Đạt |
| [Mốc 2: Review chéo giữa các Agent] | [Thời gian] | ○ Chưa ○ Đạt |
| [Mốc 3: Hoàn thiện gửi User] | [Thời gian] | ○ Chưa ○ Đạt |

---

## Cập nhật trạng thái

| Trạng thái | Thời gian | Ghi chú / Cập nhật của Agent |
|------------|-----------|------------------------------|
| **ASSIGNED** | [Thời gian giao] | |
| **IN_PROGRESS** | ________ | [Bắt đầu khi nào] |
| **REVIEW** | ________ | [Nộp kết quả chờ User duyệt khi nào] |
| **DONE** | ________ | [Hoàn thành khi nào] |

> Nếu bị nghẽn (Block): Đánh dấu **BLOCKED** + lý do nghẽn + cần Agent nào hoặc User hỗ trợ gì.

---

## Kết quả (điền khi hoàn thành)

| Trường | Giá trị |
|--------|---------|
| **Output thực tế** | [Nội dung phương án cuối cùng gửi khách hàng] |
| **Bài học rút ra** | [Điểm lưu ý về hành vi khách hàng / quy trình hải quan / công nợ] |

---

## Gate Check

- [ ] Mục tiêu rõ ràng, đo lường được
- [ ] Kết quả giao ngay cụ thể và đúng mẫu xuất bản
- [ ] Tiêu chí chấp nhận rõ ràng và an toàn cho doanh nghiệp
- [ ] Hạn hoàn thành thực tế và đáp ứng tốc độ phản hồi khách hàng (SLA)
- [ ] Agent được giao đã xác nhận nhận nhiệm vụ

---

**Người giao ký:** ___________ **Ngày:** ___________
**Agent thực hiện ký:** [Eureka Agent X] **Ngày:** ___________

---

*Sales Suite Task Assignment Form v1.0*
