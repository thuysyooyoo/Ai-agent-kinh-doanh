# QUẢN LÝ KHAI BÁO HẢI QUAN (Customs Declaration Management)

> **Policy Nội bộ** — Dành cho Operations, Documentation, NVKD, TP, GDKD
> **Đây là policy thuần nội bộ, không có policy KH tương ứng**
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa quy trình khai báo hải quan cho hàng hóa XNK
- Đảm bảo tuân thủ quy định hải quan Việt Nam - Trung Quốc
- Giảm thiểu rủi ro chậm trễ, phạt, giữ hàng tại cửa khẩu
- Tối ưu thời gian thông quan

### 1.2 KPI 2026

| Metric | Target |
|--------|:------:|
| Thời gian thông quan trung bình | ≤ 2 ngày |
| Tỷ lệ tờ khai bị reject | < 5% |
| Tỷ lệ hàng bị giữ (customs hold) | < 3% |
| Tỷ lệ HS code chính xác lần đầu | ≥ 95% |

---

## 2. PHÂN LOẠI HÀNG HÓA (HS CODE)

### 2.1 Nguyên tắc phân loại

- Áp dụng HS code theo biểu thuế Việt Nam mới nhất
- Tham khảo database HS code nội bộ (`data/hs-code-database.md`)
- Với hàng mới chưa có tiền lệ: tham vấn Customs & Tax Expert

### 2.2 Quy trình xác định HS code

```
Nhận thông tin hàng → Tra database nội bộ
→ Nếu có → Xác nhận, áp dụng
→ Nếu không → Customs Expert tra cứu → Đề xuất → Lưu vào database
```

### 2.3 Rủi ro sai HS code

| Mức | Hậu quả | Hành động |
|:---:|---------|-----------|
| Thấp | Chênh thuế < 5% | Điều chỉnh + nộp bổ sung |
| Trung bình | Chênh thuế 5-15% | Điều chỉnh + phạt hành chính |
| Cao | Cố ý sai, trốn thuế | Phạt nặng, giữ hàng, truy tố |

---

## 3. CHỨNG TỪ HẢI QUAN

### 3.1 Bộ chứng từ cơ bản

| Chứng từ | Bắt buộc? | Ghi chú |
|----------|:---------:|---------|
| Tờ khai hải quan (Customs Declaration) | Có | Điện tử qua VNACCS |
| Hóa đơn thương mại (Commercial Invoice) | Có | Song ngữ hoặc tiếng Anh |
| Vận đơn (Bill of Lading / Waybill) | Có | Theo loại hình VC |
| Hợp đồng Mua bán / Ủy thác | Có | Bản gốc hoặc scan |
| Packing List | Có | Chi tiết đóng gói |
| C/O (Certificate of Origin) | Tùy mặt hàng | Để hưởng FTA |
| Giấy phép chuyên ngành | Tùy mặt hàng | Thực phẩm, dược, hóa chất... |

### 3.2 Kiểm tra chứng từ trước khai

```
□ Tên hàng, HS code khớp với hợp đồng
□ Trị giá khai báo khớp với invoice
□ Số lượng, trọng lượng khớp với Packing List + Vận đơn
□ C/O hợp lệ (nếu có) — nước xuất xứ, mẫu C/O, chữ ký
□ Giấy phép còn hiệu lực (nếu cần)
```

---

## 4. QUY TRÌNH KHAI BÁO

```
① CHUẨN BỊ: Thu thập đủ bộ chứng từ
② KIỂM TRA: Đối chiếu chứng từ, phát hiện sai lệch
③ KHAI BÁO: Nhập tờ khai lên VNACCS
④ PHÂN LUỒNG: Nhận kết quả phân luồng (Xanh/Vàng/Đỏ)
⑤ XỬ LÝ:
   - Luồng Xanh → Thông quan ngay
   - Luồng Vàng → Kiểm tra hồ sơ giấy
   - Luồng Đỏ → Kiểm tra thực tế hàng hóa
⑥ THÔNG QUAN: Hoàn tất, cập nhật trạng thái
```

### SLA theo luồng

| Luồng | Mô tả | SLA |
|:-----:|-------|:---:|
| Xanh | Miễn kiểm tra | 1-2 giờ |
| Vàng | Kiểm tra hồ sơ | 4-8 giờ |
| Đỏ | Kiểm tra thực tế | 1-2 ngày |

---

## 5. QUẢN LÝ RỦI RO HẢI QUAN

### 5.1 Phân loại rủi ro

| Rủi ro | Mô tả | Biện pháp |
|--------|-------|-----------|
| **Sai HS code** | Phân loại sai, áp sai thuế | Double-check bởi Customs Expert |
| **Sai trị giá** | Khai báo trị giá không đúng | Đối chiếu invoice + hợp đồng |
| **Thiếu giấy phép** | Hàng cần GP nhưng không có | Checklist trước khi nhận đơn |
| **C/O không hợp lệ** | Không đủ điều kiện hưởng FTA | Kiểm tra C/O trước khai |
| **Hàng cấm / hạn chế** | Nhập hàng không được phép | Screening trước khi nhận đơn |

### 5.2 Khi bị giữ hàng (Customs Hold)

```
Phát hiện → Xác định lý do → Chuẩn bị hồ sơ giải trình
→ Làm việc với Hải quan → Khắc phục (nếu lỗi ERK)
→ Thông quan → Ghi nhận bài học + cập nhật quy trình
```

| Lý do giữ hàng | Người xử lý | SLA |
|---------------|-------------|:---:|
| Sai HS code / trị giá | Documentation + Customs Expert | 24h |
| Thiếu giấy phép | Legal + Documentation | 48h |
| Nghi ngờ gian lận | GDKD + Legal | Ngay |
| Kiểm tra ngẫu nhiên | Documentation | 1-2 ngày |

---

## 6. KIỂM SOÁT GIÁ TRỊ KHAI BÁO (Declaration Value Control)

### 6.1 Nguyên tắc

Giá trị khai báo hải quan là cơ sở tính thuế. **Sai giá trị khai báo → sai thuế → truy thu + phạt.** NVKD là người đầu tiên tiếp nhận thông tin giá trị từ KH, do đó NVKD chịu trách nhiệm kiểm tra tính hợp lý trước khi chuyển cho Documentation.

### 6.2 Quy trình kiểm tra giá trị khai báo

```
① KH cung cấp thông tin hàng + giá trị
       ↓
② NVKD nhập vào CMS + kiểm tra thủ công:
   - Nếu KH cung cấp VND → NVKD quy đổi sang USD theo tỷ giá ngày
     → YÊU CẦU đồng nghiệp hoặc TP check lại phép quy đổi
   - Đối chiếu với lịch sử giá khai mặt hàng tương tự trong database
       ↓
③ Cảnh báo nếu chênh lệch > ±30% so với lịch sử
   → NVKD xác minh lại với KH
       ↓
④ NVKD tự kiểm tra trước khi gửi KH:
   □ Đơn giá × Số lượng = Tổng giá trị (đặc biệt kiểm tra dấu chấm/dấu phẩy)
   □ Đơn vị tiền tệ đúng (USD/VND)
   □ Tỷ giá quy đổi đúng (nếu KH cung cấp VND)
   □ Người check chéo ký xác nhận đã review
       ↓
⑤ Gửi KH xác nhận giá trị khai báo BẰNG VĂN BẢN (email/Zalo có phản hồi)
   → Form xác nhận ghi rõ: "Quý khách xác nhận giá trị khai báo trên.
     Mọi chênh lệch thuế phát sinh từ giá trị khai báo đã được xác nhận
     sẽ do bên khai báo chịu trách nhiệm."
       ↓
⑥ KH xác nhận → Chuyển Documentation làm tờ khai
```

### 6.3 Nghiêm cấm

- **NVKD tự ý thay đổi giá trị khai báo sau khi KH đã xác nhận**
- **Copy số liệu không kiểm tra dấu chấm/dấu phẩy**
- **Không đối chiếu với lịch sử giá khai trước khi gửi KH**

### 6.4 Phân định trách nhiệm khi sai thuế

| Tình huống | Người chịu | Mức chịu |
|-----------|:----------:|:--------:|
| KH xác nhận giá khai → sai thuế do giá khai | KH | 100% |
| NVKD tự ý thay đổi giá sau khi KH xác nhận | NVKD | 100% |
| Lỗi đánh máy (dấu chấm/phẩy, sai số) | NVKD | 100% |
| NVKD quy đổi VND→USD sai, người check chéo không phát hiện | NVKD + Người check | 70% + 30% |
| KH cung cấp sai số VND, NVKD nhập đúng | KH | 100% |
| Documentation khai sai so với thông tin đã duyệt | Documentation | 100% |

### 6.5 Xử lý đơn có tranh chấp thuế

```
Phát hiện sai thuế → Xác định nguyên nhân + bên chịu
→ Lập biên bản xác nhận (có chữ ký KH + NVKD + TP)
→ Phương án xử lý:
  - KH chịu → KH thanh toán ngay
  - NVKD chịu → NVKD hoàn trả trong 30 ngày
  - ERK chịu → Trích quỹ / Finance duyệt
→ TUYỆT ĐỐI NGHIÊM CẤM: Tự ý trừ lùi lợi nhuận đơn sau để bù
```

---

## 7. RỦI RO HẬU KIỂM (Post-Clearance Audit)

### 7.1 Vấn đề

Hải quan có quyền hậu kiểm trong thời hiệu **5 năm** kể từ ngày thông quan. Các quyết định hậu kiểm (tham vấn giá, phân tích phân loại, đổi HS code) có thể dẫn đến **truy thu thuế** sau khi hàng đã giao và đã thu tiền KH.

### 7.2 Đánh giá rủi ro trước khi nhận đơn

| Yếu tố rủi ro | Đánh giá | Hành động |
|---------------|:--------:|-----------|
| Mặt hàng lần đầu nhập, chưa có tiền lệ | **Cao** | Tham vấn Customs Expert + báo KH rủi ro |
| Giá khai thấp hơn giá tham chiếu CSDL hải quan | **Cao** | Yêu cầu KH giải trình + cam kết |
| HS code nhạy cảm (dễ bị phân tích phân loại) | **Cao** | Double-check + lưu hồ sơ đầy đủ |
| Hàng tiêu dùng, điện tử, thực phẩm chức năng | **Trung bình** | Cảnh báo KH |
| Hàng đã có lịch sử khai ổn định > 1 năm | **Thấp** | Quy trình bình thường |

### 7.3 Biện pháp bảo vệ

**Hợp đồng:** Trong Hợp đồng Ủy thác phải có điều khoản:

> "Bên thuê ủy thác (Khách hàng) chịu trách nhiệm đối với mọi khoản thuế, phí phát sinh từ quyết định hậu kiểm của cơ quan hải quan liên quan đến hàng hóa của mình, bao gồm nhưng không giới hạn: tham vấn giá, phân tích phân loại, điều chỉnh HS code, kể cả sau khi hàng đã được thông quan và giao nhận."

**Tài chính:** Với KH mới hoặc mặt hàng rủi ro cao, giữ **deposit 5-10%** trị giá thuế trong **90 ngày** sau thông quan.

**Cascade xử lý truy thu hậu kiểm:**

```
KHI CÓ QUYẾT ĐỊNH TRUY THU:
       ↓
BƯỚC 1: Thu từ KH (bao gồm deposit đã giữ + yêu cầu thanh toán bổ sung)
       ↓ (nếu KH không thanh toán / đã dừng hợp tác)
BƯỚC 2: Trích từ PHÍ ỦY THÁC của đơn hàng
       ↓ (nếu chưa đủ)
BƯỚC 3: Trích từ QUỸ PHÒNG TRỪ RỦI RO
       ↓ (nếu vẫn chưa đủ)
BƯỚC 4: ERK chịu phần còn lại
```

---

## 8. C/O & ƯU ĐÃI FTA

| FTA | Mẫu C/O | Thuế suất ưu đãi |
|-----|---------|:----------------:|
| ACFTA (ASEAN-Trung Quốc) | Form E | 0-5% |
| VKFTA (Việt-Hàn) | Form VK | 0-5% |

### Điều kiện hưởng FTA

- Hàng có xuất xứ từ nước thành viên FTA
- C/O hợp lệ (đúng mẫu, chữ ký, con dấu)
- Hàng được vận chuyển trực tiếp (hoặc qua nước thứ 3 có chứng từ)

---

## 9. PHÂN CÔNG TRÁCH NHIỆM

| Vai trò | Trách nhiệm |
|---------|-------------|
| **Documentation** | Chuẩn bị + kiểm tra chứng từ, khai báo |
| **Customs Expert** | Xác định HS code, tư vấn thuế suất, FTA |
| **Operations** | Phối hợp với kho, vận chuyển, cửa khẩu |
| **NVKD** | Cung cấp thông tin đơn hàng chính xác; kiểm tra mặt hàng có thuộc diện cấm/hạn chế/cần GP trước khi báo giá; kiểm tra giá trị khai báo + quy đổi VND→USD + đối chiếu lịch sử trước khi gửi KH xác nhận |
| **Legal** | Xử lý vướng mắc pháp lý, giấy phép |
| **TP** | Giám sát SLA thông quan |
| **GDKD** | Quyết định case phức tạp |

---

## 10. CẢNH BÁO & ESCALATION

| Trigger | Action |
|---------|--------|
| Tờ khai bị reject ≥ 3 lần/tháng từ cùng NV | Review + training |
| Hàng bị giữ > 3 ngày | Escalate GDKD |
| Phát hiện sai HS code hệ thống | Customs Expert review toàn bộ |
| Thay đổi quy định hải quan | Customs Expert cập nhật trong 48h |
| NVKD báo giá sai thuế do không check HS code/GP | Trừ P3 + Chịu toàn bộ chi phí phát sinh |
| NVKD quy đổi giá sai | Trừ P3 + Chịu toàn bộ chi phí phát sinh + check chéo bắt buộc 30 ngày |
| Phát hiện tự ý trừ lùi lợi nhuận để bù sai thuế | Escalate TP + anti-fraud xử lý |
| Có quyết định hậu kiểm truy thu | Alert GDKD + Finance + Legal trong 24h |

---

## 11. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Áp dụng cho mọi tờ khai hải quan của ERK
- Documentation + Customs Expert chịu trách nhiệm thực thi
- Review định kỳ: **Quarterly**
- Owner: Operations Manager + Customs Expert + GDKD

---

*Version 1.1 | 09/05/2026 | Owner: Operations + Customs Expert + GDKD*
