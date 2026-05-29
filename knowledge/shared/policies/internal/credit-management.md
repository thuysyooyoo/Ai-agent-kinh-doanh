# QUẢN LÝ RỦI RO TÍN DỤNG (Credit Risk Management)

> **Policy Nội bộ** — Dành cho NVKD, TP, Finance, GDKD
> **Policy KH tương ứng:** `customer/credit-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 2.1

---

## PHÂN BIỆT VỚI POLICY KH

| Tiêu chí | Policy KH (`customer/credit-policy.md`) | Policy Nội bộ (file này) |
|----------|----------------------------------------|---------------------------|
| Mục đích | Giới thiệu quyền lợi tín dụng cho KH | Kiểm soát rủi ro tín dụng nội bộ |
| Nội dung | Hạng, số ngày, cách cải thiện | Credit Score, 6 lớp bảo vệ, A/B, công thức |
| Người đọc | Khách hàng | NVKD, TP, Finance, GDKD |

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Thiết lập cơ chế tín dụng **định lượng**, dễ tính toán
- Linh hoạt theo **mùa vụ** và **tiềm năng** khách hàng
- **6 lớp bảo vệ** để ngăn ngừa nợ xấu
- Đảm bảo **công bằng** và **đồng nhất**

### 1.2 Phạm vi
- Tất cả khách hàng sử dụng dịch vụ ERK
- Áp dụng cho: Sale, Kế toán, Chứng từ, OPS, Kho, Legal

---

## 2. HỆ THỐNG CREDIT SCORE (0-100 điểm)

```
CREDIT SCORE = A + B + C + D + E

├── A: Tuổi đời quan hệ (0-20 điểm)
├── B: Lịch sử thanh toán (0-30 điểm) ← QUAN TRỌNG NHẤT
├── C: Doanh số ổn định (0-20 điểm)
├── D: Hồ sơ pháp lý (0-15 điểm)
└── E: Tần suất giao dịch (0-15 điểm)
```

### 2.1 Điểm A: Tuổi đời quan hệ (0-20)

| Tháng có đơn hàng | Điểm |
|-------------------|:----:|
| < 3 tháng | 0 |
| 3-6 tháng | 5 |
| 6-12 tháng | 10 |
| 12-24 tháng | 15 |
| > 24 tháng | 20 |

### 2.2 Điểm B: Lịch sử thanh toán (0-30)

| % Đúng hạn | Điểm cơ bản |
|------------|:----------:|
| < 70% | 0 |
| 70-80% | 5 |
| 80-90% | 15 |
| 90-95% | 22 |
| 95-99% | 27 |
| 100% | 30 |

**Trừ điểm:** Mỗi lần quá hạn > 15 ngày: -5 điểm; Mỗi lần quá hạn > 30 ngày: -10 điểm

### 2.3 Điểm C: Doanh số ổn định (0-20)

| Biên độ dao động | Điểm |
|------------------|:----:|
| > 100% | 0 |
| 50-100% | 5 |
| 30-50% | 10 |
| 15-30% | 15 |
| ≤ 15% | 20 |

### 2.4 Điểm D: Hồ sơ pháp lý (0-15)

| Yếu tố | Điểm |
|--------|:----:|
| CCCD hợp lệ | +5 |
| Hợp đồng đã ký | +5 |
| Cam kết thanh toán | +5 |

### 2.5 Điểm E: Tần suất giao dịch (0-15)

| Đơn/tháng | Điểm |
|-----------|:----:|
| < 2 | 3 |
| 2-5 | 7 |
| 5-10 | 11 |
| > 10 | 15 |

---

## 3. PHÂN HẠNG TÍN DỤNG

| Hạng | Score | Tên gọi | Mô tả |
|:----:|-------|---------|-------|
| **AAA** | 90-100 | Xuất sắc | Đối tác chiến lược |
| **AA** | 80-89 | Rất tốt | Khách hàng ưu tiên |
| **A** | 70-79 | Tốt | Khách hàng tin cậy |
| **B** | 60-69 | Khá | Cần theo dõi |
| **C** | 50-59 | Trung bình | Giảm tín dụng |
| **D** | < 50 | Yếu | Không cấp tín dụng |

> Hạng Tín dụng (AAA-D) ĐỘC LẬP với Gói VIP (Basic/Pro/Premium/Elite)

---

## 4. MỨC ĐẶT CỌC THEO GÓI VIP

| Gói VIP | Mức đặt cọc |
|---------|:----------:|
| Basic | 100% |
| Pro | 90% |
| Premium | 80% |
| Elite | 70% |

---

## 5. HẠN MỨC TÍN DỤNG

### 5.1 Công thức

```
ACTUAL Limit = MIN(Calc Lmt, Hard Cap)
Calc Lmt = Base Limit × Season F × Potent F
```

### 5.2 Base Limit theo hạng

| Hạng | Multiplier |
|:----:|:----------:|
| AAA | 1.5× (150%) |
| AA | 1.2× (120%) |
| A | 1.0× (100%) |
| B | 0.7× (70%) |
| C | 0.5× (50%) |
| D | 0× (không cấp) |

**Base Limit = DS TB 3 tháng × Multiplier**

### 5.3 Season Factor

| Tháng | Hệ số | Lý do |
|-------|:----:|-------|
| 1-2 | 1.5 | Tết |
| 3-4 | 0.8 | Thấp điểm |
| 5-6 | 1.0 | Bình thường |
| 7-8 | 1.2 | Trung thu |
| 9-10 | 1.3 | Cuối năm |
| 11-12 | 1.5 | Black Friday |

### 5.4 Potential Factor

| Tiềm năng | Hệ số | Tiêu chí |
|-----------|:----:|----------|
| Cao | 1.3 | Tăng > 30% so với 6 tháng trước |
| TB | 1.0 | Ổn định ± 30% |
| Thấp | 0.8 | Giảm > 30% |

### 5.5 Hard Cap

| Hạng | Hard Cap |
|:----:|----------|
| AAA | 5 tỷ |
| AA | 2 tỷ |
| A | 1 tỷ |
| B | 500 triệu |
| C | 200 triệu |
| D | 0 |

---

## 6. SỐ NGÀY TÍN DỤNG

```
DAYS = MIN(Base Day + Bonus, 30)
```

| Hạng | Base Days | Bonus Max | Max Days |
|:----:|:---------:|:---------:|:--------:|
| AAA | 25 | +5 | 30 |
| AA | 20 | +6 | 26 |
| A | 15 | +6 | 21 |
| B | 10 | +6 | 16 |
| C | 5 | +6 | 11 |
| D | 0 | 0 | 0 |

**Bonus Days:** 100% đúng hạn +3 | DS > 200tr/tháng +2 | Hợp tác ≥ 12 tháng +1 | Tối đa +6

---

## 7. CƠ CHẾ KIỂM TRA A/B

```
A = Nợ hiện tại (công nợ đã giao hàng)
B = Giá trị hàng đang đi (trong kho/đang vận chuyển)
```

| Hạng | A/B tối đa | Khi vượt ngưỡng |
|:----:|:----------:|-----------------|
| AAA | 150% | Giới hạn xuống 70% hạn mức |
| AA | 120% | Giới hạn xuống 60% hạn mức |
| A | 110% | Giới hạn xuống 50% hạn mức |
| B/C | 100% | Phải trả hết nợ |

---

## 8. 6 LỚP BẢO VỆ

| Lớp | Tên | Điều kiện | Hành động |
|:---:|-----|-----------|-----------|
| 1 | Soft Lock | Nợ ≥ 80% hạn mức | Cảnh báo + xin duyệt KT trưởng |
| 2 | Hard Lock | Nợ ≥ 100% HOẶC quá hạn 5+ ngày HOẶC A/B > tỷ lệ | Khóa tín dụng, cọc 100% |
| 3 | Credit Reset | Quá hạn 10+ ngày KHÔNG cam kết | Hủy hạn mức, khóa 90 ngày |
| 4 | Giữ hàng | Quá hạn 15+ ngày | Giữ hàng = giá trị công nợ |
| 5 | Thanh lý | Quá hạn 60+ ngày + 3 cảnh báo | Bán hàng thu hồi nợ |
| 6 | Blacklist | Quá hạn 60+ ngày hoặc gian lận | Từ chối vĩnh viễn |

---

## 9. BẢNG TỔNG HỢP NHANH

| Hạng | Score | Base Days | Max Days | Multiplier | Hard Cap | A/B max |
|:----:|-------|:---------:|:--------:|:----------:|----------|:-------:|
| AAA | 90-100 | 25 | 30 | 1.5× | 5 tỷ | 150% |
| AA | 80-89 | 20 | 26 | 1.2× | 2 tỷ | 120% |
| A | 70-79 | 15 | 21 | 1.0× | 1 tỷ | 110% |
| B | 60-69 | 10 | 16 | 0.7× | 500tr | 100% |
| C | 50-59 | 5 | 11 | 0.5× | 200tr | 100% |
| D | < 50 | 0 | 0 | 0× | 0 | N/A |

---

## 10. PHẠT CHẬM THANH TOÁN

```
MỨC PHẠT: 0.05%/ngày trên số tiền chậm
```

---

## 11. TRÁCH NHIỆM NVKD TRONG QUẢN LÝ CÔNG NỢ

### 11.1 Nguyên tắc

NVKD là người trực tiếp làm việc với KH, do đó NVKD là **tuyến đầu** trong thu hồi công nợ. Mọi khoản nợ quá hạn phải được NVKD chủ động theo dõi và đôn đốc.

### 11.2 Trách nhiệm cụ thể

| Trách nhiệm | Mô tả |
|-------------|-------|
| **Đối chiếu công nợ** | Mỗi tuần, NVKD đối chiếu danh sách công nợ của KH mình với Finance |
| **Đôn đốc thanh toán** | Gọi/nhắn KH trước ngày đến hạn 3 ngày và ngay khi quá hạn 1 ngày |
| **Báo cáo dấu hiệu xấu** | KH có dấu hiệu chây ỳ, khó đòi → báo TP trong 24h |
| **Cam kết thu hồi** | Nợ quá hạn > 30 ngày → NVKD lập cam kết thu hồi với TP + Finance |

### 11.3 Xử lý KH có công nợ quá hạn

| Thời gian quá hạn | Hành động với đơn mới | Lý do |
|:-----------------:|-----------------------|-------|
| 1-15 ngày | Bình thường — nhắc nhở KH | Giai đoạn đôn đốc |
| 16-30 ngày | **Vẫn tạo đơn mới nhưng DỪNG HỖ TRỢ TÍN DỤNG → đặt cọc 100%** | Giữ đơn mới làm đòn bẩy đòi nợ, không cấp thêm tín dụng |
| > 30 ngày | Dừng tạo đơn + giữ hàng (nếu đang có hàng đi) | Nguy cơ nợ xấu cao |

### 11.4 Báo cáo công nợ hàng tuần

Finance gửi báo cáo công nợ đến từng NVKD + TP vào **thứ Hai hàng tuần**, bao gồm:
- Danh sách KH đang nợ + số ngày quá hạn
- Tổng nợ theo từng NVKD
- Cảnh báo KH sắp chạm hạn mức

### 11.5 Chế tài với NVKD

| Tình huống | Chế tài |
|-----------|---------|
| KH quá hạn > 30 ngày, NVKD không báo cáo | Trừ P3 + Cảnh cáo |
| Để KH vượt hạn mức vẫn tạo đơn có tín dụng | Trừ P3 + Chịu phí phạt chậm nộp (nếu có) |
| KH nợ xấu > 60 ngày do NVKD không đôn đốc | NVKD chịu 30% giá trị nợ xấu (trừ vào lương/thưởng) |
| Tự ý trừ lùi lợi nhuận đơn sau để bù công nợ đơn trước | Xử lý theo anti-fraud-management |

---

## 12. XỬ LÝ ĐƠN CÓ TRANH CHẤP THUẾ

### 12.1 Nguyên tắc

Đơn có tranh chấp về thuế (sai thuế do giá khai, sai HS code, truy thu hậu kiểm) **không được treo công nợ vô thời hạn**. Phải xử lý dứt điểm trong 7 ngày.

### 12.2 Quy trình

```
Phát sinh tranh chấp thuế
       ↓
① NVKD báo TP + Finance trong 24h
       ↓
② Xác định bên chịu (KH / NVKD / ERK) — theo customs-declaration-management §6.4
       ↓
③ Lập biên bản xác nhận 3 bên (KH + NVKD + TP)
       ↓
④ Phương án thanh toán:
   - KH chịu → Xuất hóa đơn bổ sung, KH thanh toán trong 7 ngày
   - NVKD chịu → Trừ lương/thưởng, hoàn trả trong 30 ngày
   - ERK chịu → Finance duyệt chi
       ↓
⑤ Theo dõi đến khi tất toán — ĐÓNG TRẠNG THÁI TRANH CHẤP
```

### 12.3 Nghiêm cấm

- **Treo đơn tranh chấp không báo cáo TP/Finance**
- **Tự ý trừ lùi lợi nhuận đơn sau để bù khoản tranh chấp**
- **Để đơn treo > 30 ngày không xử lý**

### 12.4 Phí phạt chậm nộp

| Nguyên nhân chậm nộp | Người chịu phí phạt |
|----------------------|:------------------:|
| KH chậm thanh toán | KH |
| NVKD không đôn đốc | NVKD |
| Tranh chấp chưa giải quyết | Theo kết luận bên chịu trong tranh chấp |
| Lỗi hệ thống / vận hành | ERK |

> **Công ty KHÔNG tự động bỏ phí phạt.** Mọi đề nghị miễn phí phạt phải có văn bản trình GDKD duyệt, nêu rõ lý do.

---

## 13. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Ngoại lệ cần phê duyệt bằng văn bản của GDKD
- Review Credit Score: **Hàng tháng**
- Điều chỉnh hạn mức: **Hàng quý**

---

*Version 2.2 | 09/05/2026 | Owner: Finance + GDKD*
