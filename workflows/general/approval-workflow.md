# Approval Workflow (Quy trình Phê duyệt Đặc duyệt)

## Mục đích

Quy trình chuẩn hóa việc phê duyệt các đề xuất đặc thù nằm ngoài biểu cước, chính sách công nợ hoặc HS Code rủi ro trong hệ thống **Eureka Sales Agents Suite**. Đảm bảo mọi đề xuất đặc duyệt được đánh giá chuyên môn kỹ lưỡng trước khi GDKD (User) đưa ra quyết định cuối cùng, giữ an toàn tài chính và pháp lý cho Eureka Logistics.

## Khi nào sử dụng

- Cần xin chiết khấu cước vận chuyển vượt khung quy định cho khách hàng.
- Cần cấp hạn mức công nợ hoặc nới rộng thời gian công nợ vượt tiêu chuẩn cho khách hàng VIP.
- Cần phê duyệt phương án áp HS Code rủi ro cao (hàng nhạy cảm, thuế NK cao, cần kiểm tra chuyên ngành).
- Cần phê duyệt điều khoản hợp đồng ủy thác sửa đổi theo yêu cầu riêng của khách hàng.

---

## Phân loại yêu cầu phê duyệt

| Loại đề xuất | Ví dụ | Reviewer mặc định (Chuyên môn) | Approver cuối cùng |
|--------------|-------|-------------------------------|--------------------|
| **Báo giá & Chiết khấu** | Chiết khấu cước > 10%, miễn phí phí ủy thác | Agent 1 (Quotation Assistant) | GDKD (User) |
| **Tín dụng & Công nợ** | Cấp nợ > 50 triệu, thời gian nợ > 15 ngày | Agent 4 (Finance & Contract) | GDKD (User) |
| **Hải quan & HS Code** | Áp mã HS hàng khó, hàng kiểm tra chuyên ngành | Agent 2 (Customs Consultant) | GDKD / Sales Lead (User) |
| **Hợp đồng đặc thù** | Điều khoản phạt hợp đồng sửa đổi, bồi thường riêng | Agent 4 (Finance & Contract) | GDKD (User) |

---

## Ma trận quyền phê duyệt chi tiết

| Loại đề xuất | Mức độ | Người đề xuất | Reviewer chuyên môn | Quyền quyết định (Approver) |
|--------------|--------|---------------|----------------------|----------------------------|
| **Chiết khấu cước** | ≤ 10% | Sales Staff | Agent 1 (Tự động kiểm tra) | Tự động duyệt theo VIP |
| **Chiết khấu cước** | 10% - 20% | Sales Staff | Agent 1 | GDKD (User) |
| **Chiết khấu cước** | > 20% | Sales Staff | Agent 1 + Agent 4 | GDKD (User) |
| **Hạn mức công nợ** | Hạn mức ≤ 50tr & ≤ 15 ngày nợ | Sales Staff | Agent 4 | GDKD (User) |
| **Hạn mức công nợ** | Hạn mức > 50tr hoặc > 15 ngày nợ | Sales Staff | Agent 4 (Đánh giá tín dụng) | GDKD + Giám đốc Eureka |
| **HS Code & Hải quan**| Hàng thường (Thuế NK rõ ràng) | Sales Staff | Agent 2 (Áp tự động) | Tự động duyệt |
| **HS Code & Hải quan**| Hàng khó, hàng rủi ro cao | Sales Staff | Agent 2 | GDKD / Sales Lead |

---

## SLA Phê duyệt (Tốc độ kinh doanh)

| Mức ưu tiên | SLA Review chuyên môn | SLA Phê duyệt cuối cùng | Trường hợp áp dụng |
|-------------|-----------------------|-------------------------|--------------------|
| **Khẩn cấp** | **10 phút** | **15 phút** | Khách hàng VIP đang chờ chốt đơn trực tiếp |
| **Bình thường**| **30 phút** | **1 giờ** | Yêu cầu thông thường trong ngày |
| **Thấp** | **2 giờ** | **4 giờ** | Lên phương án cho khách hàng tiềm năng |

---

## Quy trình thực hiện 4 bước

### BƯỚC 1: TẠO YÊU CẦU ĐẶC DUYỆT

- **Ai làm:** Sales Staff (User) hoặc Agent phụ trách khi phát hiện thông số vượt khung.
- **Trigger:** User gọi lệnh `/approve [nội dung đề xuất]` hoặc Agent tự động tạo khi Sales yêu cầu vượt chuẩn.
- **Các bước:**
  1. Xác định chính xác loại phê duyệt (Chiết khấu / Công nợ / HS Code / Hợp đồng).
  2. Điền đầy đủ thông tin vào Phiếu yêu cầu phê duyệt theo mẫu `templates/approval/approval-request-form.md`.
  3. Gắn mức ưu tiên (Khẩn cấp / Bình thường) dựa trên tính cấp thiết của lô hàng.
- **Output:** File `projects/[customer-name]/approval-request-PD-[YYYYMMDD]-[XXX].md`.

### BƯỚC 2: REVIEW CHUYÊN MÔN (CẤP 1)

- **Ai làm:** Agent chuyên trách theo ma trận (Agent 1, Agent 2, hoặc Agent 4).
- **Trigger:** Phiếu yêu cầu được tạo thành công.
- **Các bước:**
  1. Agent tự động kiểm tra tính chính xác của số liệu và mức độ rủi ro dựa trên cơ sở tri thức (`knowledge/`).
  2. Agent 4 áp dụng công thức đánh giá điểm tín dụng đối với hồ sơ xin công nợ. Agent 2 đối chiếu danh mục hàng cấm/hàng nhạy cảm đối với HS Code.
  3. Đưa ra khuyến nghị chuyên môn:
     - **Pass:** Khuyến nghị đồng ý phương án đề xuất.
     - **Sửa (Revision):** Đề xuất phương án an toàn hơn (ví dụ: giảm mức nợ từ 30 ngày xuống 15 ngày).
     - **Từ chối (Rejected):** Nêu rõ lý do rủi ro vượt ngưỡng an toàn doanh nghiệp.
- **SLA:** Tuân thủ đúng bảng SLA tốc độ kinh doanh.
- **Output:** Cập nhật ý kiến khuyến nghị và chữ ký số của Agent vào phiếu yêu cầu.

### BƯỚC 3: PHÊ DUYỆT CUỐI CÙNG (CẤP 2)

- **Ai làm:** GDKD / Sales Lead (User).
- **Trigger:** Đã có khuyến nghị chuyên môn từ Agent ở Bước 2.
- **Các bước:**
  1. User đánh giá đề xuất dựa trên khuyến nghị của Agent và chiến lược phát triển khách hàng.
  2. Đưa ra quyết định cuối cùng:
     - **Phê duyệt (Approved):** Chấp nhận hoàn toàn đề xuất.
     - **Phê duyệt có điều kiện:** Chấp nhận nhưng kèm ràng buộc (ví dụ: "Duyệt chiết khấu 15% cước nhưng khách phải thanh toán ngay lần 1 trong 24h").
     - **Yêu cầu sửa đổi:** Gửi feedback yêu cầu Agent tính toán lại phương án khác.
     - **Từ chối:** Không duyệt đề xuất, giữ nguyên chính sách tiêu chuẩn.
- **Output:** Cập nhật trạng thái phê duyệt cuối cùng trên phiếu.

### BƯỚC 4: THỰC THI & LƯU TRỮ

- **Ai làm:** Agent phụ trách chính.
- **Trigger:** Quyết định phê duyệt được đóng dấu.
- **Các bước:**
  1. Hệ thống tự động cập nhật tham số mới vào phương án báo giá/hợp đồng của lô hàng (ví dụ: Agent 1 áp dụng mức chiết khấu đã duyệt vào bảng báo giá cuối cùng gửi Sales).
  2. Lưu trữ phiếu phê duyệt hoàn chỉnh vào thư mục lịch sử khách hàng để phục vụ đối soát tài chính và làm giàu cơ sở tri thức (Knowledge Base).
- **Output:** Báo giá/Hợp đồng được xuất bản thành công với các điều khoản ưu đãi đã phê duyệt.

---

## Checklist Phê duyệt chuẩn chỉnh

- [ ] Phiếu yêu cầu điền đầy đủ các thông số bắt buộc (trường ★).
- [ ] Có kèm theo tài liệu chứng minh (Catalog hàng hóa, Lịch sử giao dịch của khách).
- [ ] Agent chuyên trách đã đưa ra khuyến nghị chuyên môn rõ ràng, có lý lẽ thuyết phục.
- [ ] Quyết định phê duyệt đúng thẩm quyền theo Ma trận quyền.
- [ ] Output cuối cùng của lô hàng được cập nhật chính xác theo nội dung đã phê duyệt.

---
*Approval Workflow v1.0 — Eureka Sales Agents Suite*
