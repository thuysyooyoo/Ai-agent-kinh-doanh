# Review Workflow (Quy trình Review chéo giữa các Tác tử)

## Mục đích

Quy trình review chéo tự động nhằm kiểm soát chất lượng dữ liệu, tính chính xác của các phép tính dòng tiền, tính pháp lý của điều khoản hợp đồng và mức độ rủi ro hải quan trước khi xuất bản phương án cuối cùng gửi cho GDKD/Sales Staff (User) và khách hàng.

## Khi nào sử dụng

- Sau khi Agent soạn thảo xong báo giá, phương án hải quan, hợp đồng hoặc kịch bản đàm phán quan trọng.
- Trước khi trình User phê duyệt các yêu cầu đặc duyệt (vượt khung).
- Nhằm thực hiện nguyên tắc **"Bốn mắt" (Four-Eyes Principle)** - không để một Agent tự đưa ra quyết định mà không có sự kiểm tra độc lập.

---

## Ma trận phân công Review chéo mặc định

Để đảm bảo tính khách quan và tận dụng tối đa chuyên môn chuyên sâu, các Agent sẽ thực hiện review chéo cho nhau theo ma trận sau:

| Agent soạn thảo (Tác giả) | Output cần review | Agent Reviewer mặc định | Trọng tâm kiểm tra (Focus Area) |
|---------------------------|-------------------|--------------------------|--------------------------------|
| **Agent 1** (Quotation) | Báo giá cước & Bảng tính dòng tiền 3 bước | **Agent 4** (Finance & Contract) | - Độ chính xác của các phép tính dòng tiền.<br>- Tính hợp lý của phân bổ dòng tiền 3 bước.<br>- Đối chiếu chính sách VIP. |
| **Agent 2** (Customs) | Phương án áp mã HS Code & Tư vấn chính sách thuế | **Agent 1** (Quotation) | - Khả năng tích hợp mã HS và thuế suất vào công cụ tính cước.<br>- Tính chính xác của thuế NK & VAT. |
| **Agent 3** (Communication)| Kịch bản đàm phán cước & Soạn thảo tin nhắn/email chốt sales | **Agent 4** (Finance) hoặc **Agent 1** | - Đảm bảo các cam kết đàm phán không vi phạm chính sách cước/công nợ.<br>- Brand voice của Eureka. |
| **Agent 4** (Finance/Contract)| Dự thảo hợp đồng ủy thác, phụ lục công nợ, công văn đòi nợ | **Agent 3** (Communication) hoặc **Agent 2** | - Sự nhất quán giữa điều khoản hợp đồng và những gì đã đàm phán.<br>- Tính thực thi pháp lý và rủi ro. |

---

## Quy trình thực hiện 4 bước

### BƯỚC 1: PHÁT ĐỘNG YÊU CẦU REVIEW

- **Ai làm:** Agent soạn thảo (Tác giả).
- **Trigger:** Hoàn thành bản thảo đầu tiên của output.
- **Các bước:**
  1. Tác giả đóng gói tài liệu/phương án dưới dạng markdown.
  2. Xác định Agent Reviewer phù hợp theo Ma trận phân công chéo.
  3. Gửi yêu cầu review kèm ngữ cảnh lô hàng và khách hàng.
- **SLA Phát động:** Ngay khi hoàn thành bản thảo.

### BƯỚC 2: REVIEW THEO CHECKLIST CHUYÊN MÔN

- **Ai làm:** Agent Reviewer.
- **Trigger:** Nhận được yêu cầu review từ Agent tác giả.
- **Các bước:**
  Reviewer quét tài liệu và đối chiếu nghiêm ngặt với 4 bộ tiêu chí kiểm định chất lượng:

#### 2.1. Tính Chính Xác (Accuracy)
- [ ] Số liệu tính toán cước phí, phụ phí, thuế hải quan hoàn toàn chính xác, khớp với lõi cước `calc_quotation.py`.
- [ ] Thông tin mã HS Code, thuế suất NK & VAT được đối chiếu từ nguồn tin cậy.

#### 2.2. Tính Nhất Quán (Consistency)
- [ ] Phù hợp với lịch sử giao dịch và hạng VIP của khách hàng.
- [ ] Nhất quán với cơ sở tri thức hiện hành (`knowledge/`).
- [ ] Không mâu thuẫn nội bộ giữa các điều khoản thanh toán và bàn giao.

#### 2.3. Tính Đầy Đủ (Completeness)
- [ ] Đầy đủ các phần theo mẫu chuẩn (ví dụ: Báo giá đủ 3 phần, có hướng dẫn dòng tiền 3 bước rõ ràng).
- [ ] Có ghi nhận đầy đủ các giả định và các điểm lưu ý đặc biệt cho Sales Staff.

#### 2.4. Tính Khả Thi & An Toàn (Feasibility & Safety)
- [ ] Phương án dòng tiền có khả thi cho doanh nghiệp thực hiện.
- [ ] Hạn mức công nợ nằm trong tầm kiểm soát rủi ro của Eureka.
- [ ] Các cam kết trong kịch bản đàm phán có thể thực hiện được về mặt vận hành.

- **SLA xử lý review:** ≤ 5 phút (tự động hóa hoàn toàn).

### BƯỚC 3: PHẢN HỒI KẾT QUẢ (FEEDBACK)

- **Ai làm:** Agent Reviewer.
- **Các bước:**
  Xuất bản feedback theo mẫu chuẩn dưới đây gửi lại Agent tác giả:

```markdown
# Review Feedback [Mã NV / Mã PD]

- Tác giả: [Agent X]
- Reviewer: [Agent Y]
- Kết quả đánh giá: ○ Approved (Duyệt) ○ Needs Revision (Cần sửa)

## Điểm mạnh của phương án
- [Ghi nhận điểm tốt]

## Các lỗi phát hiện cần khắc phục
### Khẩn cấp (Must Fix)
| Vấn đề phát hiện | Vị trí lỗi | Khuyến nghị sửa đổi |
|------------------|------------|---------------------|
| [Lỗi số liệu/chính sách] | [Dòng/Phần] | [Cách sửa chi tiết] |

### Góp ý thêm (Nice to Have)
- [Góp ý tối ưu từ ngữ, bố cục]
```

### BƯỚC 4: ĐIỀU CHỈNH & PHÊ DUYỆT (REVISION & SIGN-OFF)

- **Ai làm:** Agent tác giả + Agent Reviewer.
- **Các bước:**
  - Nếu kết quả là **Needs Revision**: Tác giả sửa đổi phương án theo khuyến nghị của Reviewer trong vòng 3 phút, sau đó gửi lại yêu cầu review nhanh.
  - Nếu kết quả là **Approved**: Reviewer ký xác nhận (Sign-off) duyệt phương án. Tác giả chuyển trạng thái nhiệm vụ sang **REVIEW** để trình GDKD/Sales Staff (User) phê duyệt hoặc xuất bản trực tiếp gửi khách hàng.

---

## Chỉ số đo lường chất lượng Review (Suite Metrics)

- **Thời gian review trung bình:** < 3 phút.
- **Số chu kỳ sửa đổi tối đa (Revision Loop):** Không quá 2 vòng lặp (đảm bảo không bị lặp vô hạn).
- **Tỷ lệ phát hiện lỗi trước khi gửi User:** > 98% (tuyệt đối không để xảy ra sai sót số liệu cước hoặc sai mã HS khi gửi cho Sales Staff).

---
*Review Workflow v1.0 — Eureka Sales Agents Suite*
