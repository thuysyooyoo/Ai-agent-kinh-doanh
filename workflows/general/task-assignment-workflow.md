# Task Assignment Workflow (Quy trình Giao việc cho Tác tử)

## Mục đích

Quy trình giao việc, điều phối công việc liên Agent, theo dõi tiến độ và nghiệm thu kết quả trong hệ thống **Eureka Sales Agents Suite**. Đảm bảo nhiệm vụ phục vụ khách hàng được xử lý chính xác, đúng SLA và tối ưu hóa sự phối hợp tự động giữa 4 Agent chuyên trách.

## Khi nào sử dụng

- GDKD hoặc Nhân viên Sales (User) giao nhiệm vụ cụ thể cho một hoặc nhiều Agent.
- Phối hợp tự động liên Agent (ví dụ: Báo giá ➔ Hải quan ➔ Đàm phán ➔ Hợp đồng).
- Theo dõi tiến độ chuẩn bị báo giá, tư vấn HS Code, soạn hợp đồng và thu hồi công nợ cho từng lô hàng/khách hàng.

---

## Trạng thái nhiệm vụ

```
ASSIGNED ──→ IN_PROGRESS ──→ REVIEW ──→ DONE
                │               │
             BLOCKED         REVISION
                │               │
             (chờ nạp       (sửa phương án)
             thêm data)
```

| Trạng thái | Ý nghĩa | Ai cập nhật |
|------------|---------|-------------|
| **ASSIGNED** | Đã giao nhiệm vụ cho Agent, chờ Agent xác nhận | Người giao (User) / Agent phát động |
| **IN_PROGRESS** | Agent đang xử lý dữ liệu và tính toán | Agent được giao |
| **REVIEW** | Agent đã hoàn thành output, chờ User duyệt | Agent được giao |
| **DONE** | Kết quả đạt yêu cầu, đã nghiệm thu gửi khách | Người giao (User) |
| **BLOCKED** | Bị nghẽn do thiếu thông tin đầu vào từ khách | Agent được giao |
| **REVISION** | User yêu cầu điều chỉnh các tham số | Người giao (User) |

---

## Quy trình chi tiết

### BƯỚC 1: TẠO & GIAO NHIỆM VỤ

- **Ai làm:** GDKD / Nhân sự Sales (User) hoặc Agent điều phối cuộc họp.
- **Trigger:** User gọi `/task [mô tả yêu cầu]` hoặc hệ thống tự động sinh khi có yêu cầu mới từ khách hàng.
- **Các bước:**
  1. Xác định rõ mục tiêu của lô hàng / khách hàng (ví dụ: Soạn hợp đồng gom cont cho KH VIP).
  2. Xác định kết quả giao ngay cụ thể (ví dụ: Phụ lục chi phí đi kèm hợp đồng ủy thác).
  3. Chọn Agent chuyên trách phù hợp theo bảng phân công mặc định.
  4. Thiết lập thời hạn SLA (mặc định tốc độ phản hồi cực nhanh).
  5. Đăng ký thông tin vào Phiếu giao việc theo mẫu `templates/approval/task-assignment-form.md`.
- **Output:** File `projects/[customer-name]/task-assignment-TA-[YYYYMMDD]-[XXX].md`, trạng thái ban đầu: **ASSIGNED**

### BƯỚC 2: NHẬN NHIỆM VỤ (Tốc độ Agent)

- **Ai làm:** Agent được chỉ định chuyên trách.
- **Trigger:** File nhiệm vụ trạng thái **ASSIGNED** được khởi tạo.
- **Các bước:**
  1. Agent tự động quét thông tin đầu vào, phân tích tính đầy đủ của dữ liệu lô hàng.
  2. Nếu thiếu dữ liệu (ví dụ: báo giá thiếu cân nặng/thể tích, hoặc HS Code thiếu catalog sản phẩm) ➔ Agent ngay lập tức đánh dấu **BLOCKED** và yêu cầu User bổ sung.
  3. Nếu đầy đủ dữ liệu ➔ Agent xác nhận nhận việc và tự động chuyển trạng thái sang **IN_PROGRESS**.
- **SLA Phản hồi:** 
  - **Task Khẩn cấp:** Dưới 5 phút.
  - **Task Thường:** Dưới 15 phút.
- **Output:** Trạng thái chuyển thành **IN_PROGRESS**.

### BƯỚC 3: XỬ LÝ & THỰC HIỆN

- **Ai làm:** Agent được giao.
- **Các bước:**
  1. Thực hiện truy vấn cơ sở dữ liệu tri thức (`knowledge/`) và các công cụ bổ trợ (lõi cước `calc_quotation.py`, tra cứu HS Code, v.v.).
  2. Phối hợp tự động: Nếu nhiệm vụ cần chuyên môn bổ trợ, Agent chính sẽ tự động gửi yêu cầu con (sub-task) cho Agent liên quan (ví dụ: Agent 1 gọi Agent 2 để xin mã HS Code và thuế suất trước khi ra báo giá).
  3. Cập nhật bảng theo dõi nhiệm vụ `templates/approval/task-tracking-board.md`.
- **SLA xử lý:**
  - **Báo giá & Dòng tiền:** ≤ 3 phút.
  - **Tư vấn HS Code & Thuế:** ≤ 10 phút.
  - **Soạn Hợp đồng & Phụ lục:** ≤ 15 phút.
  - **Soạn Kịch bản đàm phán:** ≤ 10 phút.

### BƯỚC 4: REVIEW & DUYỆT PHƯƠNG ÁN

- **Ai làm:** GDKD / Nhân sự Sales (User) hoặc Agent Review chéo.
- **Trigger:** Agent hoàn thành phương án và chuyển trạng thái sang **REVIEW**.
- **Các bước:**
  1. User kiểm tra kết quả so với tiêu chí chấp nhận đã đề ra.
  2. Thực hiện quy trình review nhanh (tham chiếu `workflows/general/review-workflow.md`).
  3. Quyết định:
     - **Chấp nhận (Approved):** Chuyển sang Bước 5.
     - **Cần sửa đổi (Revision):** Chuyển trạng thái sang **REVISION**, ghi rõ các điểm cần sửa (ví dụ: "Áp lại giá cước đi đường biển thay vì đường bộ"). Agent sẽ tự động xử lý lại từ Bước 3.
- **SLA Review:** Hỗ trợ tức thì hoặc trong vòng 30 phút từ khi nhận thông báo.
- **Output:** Ghi nhận quyết định phê duyệt.

### BƯỚC 5: ĐÓNG NHIỆM VỤ (DONE)

- **Ai làm:** Người giao (User) hoặc hệ thống tự động sau khi xuất bản output gửi khách hàng.
- **Các bước:**
  1. Chuyển trạng thái nhiệm vụ thành **DONE**.
  2. Lưu trữ tài liệu hoàn thiện vào thư mục dự án khách hàng.
  3. Cập nhật bảng theo dõi nhiệm vụ `task-tracking-board.md`.
- **Output:** Nhiệm vụ đóng, cập nhật chỉ số hiệu suất của Suite.

---

## Phối hợp liên Agent tự động (Cross-Agent Coordination)

Hệ thống Eureka Sales Agents Suite vận hành theo cơ chế phối hợp song song để giải phóng sức lao động của Sales:

```
                  ┌── [Agent 2: Hải quan] (Cung cấp HS Code & Thuế)
                  │
[User: Sales] ────┼── [Agent 1: Báo giá] (Tính cước & Dòng tiền 3 bước)
                  │
                  ├── [Agent 3: Giao tiếp] (Soạn kịch bản & Email chào hàng)
                  │
                  └── [Agent 4: Hợp đồng & Tài chính] (Lập hợp đồng & Kiểm soát công nợ)
```

1. **Luồng phối hợp mẫu:**
   - Sales yêu cầu báo giá trọn gói cho khách hàng mới ➔ **Agent 1** tiếp nhận chính.
   - **Agent 1** gửi yêu cầu HS Code sang **Agent 2** ➔ **Agent 2** trả kết quả thuế suất NK & VAT.
   - **Agent 1** tính toán dòng tiền 3 bước, gửi phương án sang **Agent 4** ➔ **Agent 4** đánh giá tín dụng khách hàng và đề xuất chính sách công nợ phù hợp.
   - **Agent 1** tổng hợp báo giá, gửi sang **Agent 3** ➔ **Agent 3** soạn kèm kịch bản đàm phán cước và chốt sale gửi Sales Staff.
2. **Nguyên tắc phối hợp:**
   - Không được tự ý đưa ra số liệu nằm ngoài phạm vi phụ trách (ví dụ: Agent 1 không tự bịa HS Code, Agent 2 không tự ý sửa chính sách chiết khấu cước).
   - Mọi giao tiếp liên Agent phải ghi nhận rõ mã nhiệm vụ phụ thuộc (Dependencies).

---

## Escalation (Xử lý sự cố chậm SLA)

| Thời gian trễ | Hành động khắc phục | Người can thiệp |
|---------------|---------------------|-----------------|
| **> 10 phút** | Hệ thống tự động gửi nhắc nhở ưu tiên cao cho Agent | Tự động |
| **> 30 phút** | Agent báo cáo lý do nghẽn cụ thể (Block do thiếu KB hoặc lỗi hệ thống) | Agent / User |
| **> 2 giờ** | Chuyển quyền xử lý hoặc yêu cầu User can thiệp thủ công | GDKD / Sales Lead |

---

## Bảng phân công mặc định cho 4 Eureka Sales Agents

| Nhiệm vụ / Chủ đề | Agent chuyên trách chính | Agent hỗ trợ chéo |
|-------------------|--------------------------|-------------------|
| **Tính cước, báo giá gom cont (LCL), lập dòng tiền 3 bước** | **Agent 1** (Quotation Assistant) | Agent 4 (Finance), Agent 2 (Customs) |
| **Tra cứu HS Code, kiểm tra chính sách nhập khẩu, tư vấn thuế** | **Agent 2** (Customs Consultant) | Agent 1 (Quotation Assistant) |
| **Kịch bản đàm phán, xử lý từ chối, soạn tin nhắn/email gửi khách** | **Agent 3** (Communication Expert) | Agent 1 (Quotation Assistant) |
| **Soạn hợp đồng ủy thác, phụ lục chi phí, thỏa thuận công nợ, thu hồi nợ** | **Agent 4** (Contract & Finance) | Agent 2 (Customs), Agent 3 (Communication) |

---

## Checklist Giao việc thành công

- [ ] Lô hàng đã xác định rõ các thông số vật lý (cân nặng, thể tích, số mục hàng).
- [ ] Xác định đúng Agent chuyên trách chính để giao việc.
- [ ] Ghi rõ kết quả giao ngay cần đạt được (ví dụ: "File báo giá chuẩn gửi Zalo").
- [ ] Xác nhận Agent đã nhận nhiệm vụ và chuyển sang `IN_PROGRESS` trong thời gian SLA.
- [ ] Cập nhật đầy đủ vào Bảng theo dõi nhiệm vụ của Suite.

---
*Task Assignment Workflow v1.0 — Eureka Sales Agents Suite*
