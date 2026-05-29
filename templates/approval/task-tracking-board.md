# BẢNG THEO DÕI NHIỆM VỤ (SALES SUITE TRACKING BOARD)

> Template: `templates/approval/task-tracking-board.md`
> Workflow: `workflows/general/task-assignment-workflow.md`
> Cập nhật lần cuối: [Ngày]

---

## Hướng dẫn sử dụng

- GDKD / Sales Lead review bảng này **hàng ngày / hàng tuần** để theo dõi hiệu suất phục vụ khách hàng.
- Các Agent cập nhật trạng thái **hướng dịch vụ** ngay khi nhận yêu cầu hoặc có tiến triển mới.
- Cập nhật lại toàn bộ bảng mỗi lần có lệnh `/task` mới phát sinh từ Sales Staff.

---

## Tổng quan trạng thái

| Chỉ số | Giá trị |
|--------|---------|
| **Tổng nhiệm vụ đang active** | [Số] |
| **ASSIGNED (Chờ nhận)** | [Số] |
| **IN_PROGRESS (Đang làm)** | [Số] |
| **REVIEW (Chờ duyệt)** | [Số] |
| **BLOCKED (Nghẽn)** | [Số] |
| **Quá hạn phản hồi (SLA)** | [Số] |

---

## ASSIGNED (Chờ thực hiện)

| Mã NV | Tiêu đề nhiệm vụ | Giao cho | Hạn (SLA) | Ưu tiên | Phụ thuộc |
|-------|------------------|----------|-----------|---------|-----------|
| [Mã] | [Tiêu đề] | ○ Agent 1 ○ Agent 2 ○ Agent 3 ○ Agent 4 | [Thời gian] | ○ Khẩn ○ Cao | [Mã task] |

---

## IN_PROGRESS (Đang thực hiện)

| Mã NV | Tiêu đề nhiệm vụ | Giao cho | Hạn (SLA) | Tiến độ | Ưu tiên |
|-------|------------------|----------|-----------|---------|---------|
| [Mã] | [Tiêu đề] | ○ Agent 1 ○ Agent 2 ○ Agent 3 ○ Agent 4 | [Thời gian] | [__%] | [Mức] |

---

## REVIEW (Chờ GDKD / Sales Staff xem xét)

| Mã NV | Tiêu đề nhiệm vụ | Giao cho | Hạn (SLA) | Kết quả giao ngay | Review bởi |
|-------|------------------|----------|-----------|-------------------|------------|
| [Mã] | [Tiêu đề] | ○ Agent 1 ○ Agent 2 ○ Agent 3 ○ Agent 4 | [Thời gian] | [Link báo giá/HS Code/Hợp đồng] | [GDKD / Sales Staff] |

---

## DONE (Hoàn thành - Trong vòng 30 ngày)

| Mã NV | Tiêu đề nhiệm vụ | Giao cho | Hoàn thành | Kết quả thực tế đạt được |
|-------|------------------|----------|------------|--------------------------|
| [Mã] | [Tiêu đề] | [Agent X] | [Thời gian] | [Tóm tắt kết quả gửi khách hàng] |

---

## Nhiệm vụ bị quá hạn hoặc nghẽn (Blocked/Delayed)

| Mã NV | Tiêu đề nhiệm vụ | Quá hạn | Lý do nghẽn | Hành động khắc phục | Hướng tăng cấp |
|-------|------------------|---------|-------------|---------------------|----------------|
| [Mã] | [Tiêu đề] | [Số giờ/ngày] | [Lý do từ Agent] | [Đề xuất hỗ trợ] | [GDKD / User hỗ trợ] |

---

## Nhiệm vụ phối hợp liên Agent (Cross-Agent Coordination)

| Mã NV | Từ (Agent phát động) | Đến (Agent phối hợp) | Nội dung phối hợp | Trạng thái phối hợp | SLA còn lại |
|-------|----------------------|----------------------|-------------------|---------------------|-------------|
| [Mã] | [Agent X] | [Agent Y] | [Ví dụ: Áp HS Code trước khi Báo giá] | [ASSIGNED / IN_PROGRESS] | [Thời gian] |

> Quy trình phối hợp tuân thủ: `workflows/general/`

---

## Thống kê hiệu suất tuần của Suite

| Chỉ số hiệu suất | Tuần này | Mục tiêu | Trạng thái |
|------------------|----------|----------|------------|
| **Tổng số Task hoàn thành** | [Số] | — | — |
| **Tỷ lệ đúng hạn (On-time SLA)** | [Số %] | > 95% | ○ Đạt ○ Không đạt |
| **Số Task bị Block cần can thiệp** | [Số] | 0 | ○ Đạt ○ Không đạt |
| **Đánh giá hài lòng từ Sales (User)**| [Sao 1-5] | 4.8 / 5 | ○ Đạt ○ Không đạt |

---

*Sales Suite Task Tracking Board v1.0*
