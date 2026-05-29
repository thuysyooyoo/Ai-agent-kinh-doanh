# PHIẾU YÊU CẦU PHÊ DUYỆT (SALES SUITE)

> Template: `templates/approval/approval-request-form.md`
> Workflow: `workflows/general/approval-workflow.md`
> Ai dùng: Sales Staff (User) hoặc các Agent đề xuất đặc duyệt

---

## Thông tin yêu cầu

| Trường | Giá trị |
|--------|---------|
| **Mã PD** | [Tự sinh: PD-YYYYMMDD-XXX] |
| **Ngày đề xuất** | [Tự sinh: Ngày hiện tại] |
| ★ **Người đề xuất** | [Tên Sales Staff / Agent đề xuất] |
| ★ **Tác tử / Vai trò** | ○ Sales Staff (User) ○ Agent 1 (Quotation) ○ Agent 2 (Customs) ○ Agent 3 (Communication) ○ Agent 4 (Finance) |
| ★ **Loại phê duyệt** | ○ Báo giá đặc biệt ○ Phương án HS Code / Tờ khai ○ Tín dụng / Công nợ hạn mức ○ Hợp đồng & Điều khoản ○ Kịch bản đàm phán đặc thù |
| ★ **Mức ưu tiên** | ○ Khẩn cấp ○ Bình thường ○ Thấp |

---

## Nội dung phê duyệt

### Chung (bắt buộc)

| Trường | Giá trị |
|--------|---------|
| ★ **Tiêu đề** | [≤100 ký tự] |
| ★ **Mô tả chi tiết** | [Mô tả rõ nội dung cần phê duyệt] |
| ★ **Lý do đề xuất** | [Tại sao cần đặc duyệt / phê duyệt phương án này] |
| ★ **Giải pháp đề xuất** | [Phương án đề nghị GDKD duyệt] |

### Riêng: Chiết khấu / Cước phí & Dòng tiền (Agent 1 & Agent 4)

| Trường | Giá trị |
|--------|---------|
| ★ **Giá trị lô hàng** | [VND] |
| ★ **Mức chiết khấu đề xuất** | [Số % hoặc số tiền chiết khấu] |
| **Đơn giá cước đề xuất** | [VND / m³ hoặc VND / kg] |
| ★ **Dòng tiền 3 bước điều chỉnh** | [Mô tả luồng tiền đề xuất cho lô hàng] |

> Tham chiếu chính sách giá: `knowledge/contracts_finance/` hoặc `calc_quotation.py`

### Riêng: Hạn mức Công nợ & Tín dụng (Agent 4)

| Trường | Giá trị |
|--------|---------|
| ★ **Tên khách hàng** | [Tên doanh nghiệp] |
| ★ **Hạng VIP khách hàng** | ○ Basic ○ Pro ○ Premium ○ Elite |
| ★ **Hạn mức công nợ đề xuất** | [Số tiền VND] |
| ★ **Thời gian công nợ đề xuất** | [Số ngày nợ] |
| **Điểm tín dụng Eureka** | [Điểm số tính theo công thức của Agent 4] |

### Riêng: Hải quan & HS Code (Agent 2)

| Trường | Giá trị |
|--------|---------|
| ★ **Tên hàng khai báo** | [Tên hàng chi tiết tiếng Việt] |
| ★ **Mã HS Code đề xuất** | [Mã HS 8 số] |
| ★ **Thuế suất NK & VAT** | [NK % | VAT %] |
| **Rủi ro hải quan** | ○ Thấp ○ Trung bình ○ Cao (Tham vấn giá/Kiểm hoá) |

---

## Tài liệu kèm theo

- [ ] Dự thảo báo giá / Dự thảo hợp đồng / Phụ lục
- [ ] Bảng tính dòng tiền chi tiết
- [ ] Hồ sơ năng lực / Lịch sử thanh toán của khách hàng (nếu xin nợ)
- [ ] Tài liệu kỹ thuật hàng hóa / Catalog (nếu duyệt HS Code)

---

## Ma trận phê duyệt

| Cấp | Vai trò | Người / Agent | Trạng thái | Ngày | Ghi chú |
|-----|---------|---------------|------------|------|---------|
| **Review** | Chuyên gia phụ trách | ○ Agent 1 ○ Agent 2 ○ Agent 3 ○ Agent 4 | ○ Pass ○ Sửa ○ Từ chối | ________ | [Ý kiến chuyên môn] |
| **Phê duyệt** | GDKD (User) | GDKD / Sales Lead | ○ Duyệt ○ Duyệt có điều kiện ○ Từ chối | ________ | [Ý kiến quyết định] |

---

## Gate Check (Kiểm tra trước khi gửi)

- [ ] Tất cả trường ★ đã điền đầy đủ thông tin
- [ ] Tài liệu đính kèm hoặc kịch bản liên quan đã sẵn sàng
- [ ] Đã qua bước review chéo chuyên môn của Agent phụ trách chuyên nghiệp

---

## Kết quả phê duyệt cuối cùng

| Trường | Giá trị |
|--------|---------|
| **Quyết định** | ○ Đã phê duyệt ○ Duyệt có điều kiện ○ Cần sửa ○ Từ chối |
| **Điều kiện (nếu có)** | [Điều kiện kèm theo] |
| **Ghi chú của GDKD** | [Ý kiến thêm] |

---

*Sales Suite Approval Request Form v1.0*
