# QUẢN LÝ KHIẾU NẠI & BỒI THƯỜNG (Complaint Resolution)

> **Policy Nội bộ** — Dành cho NVKD, TP, CSKH, Operations, Finance, GDKD
> **Policy KH tương ứng:** `customer/complaint-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 2.1

---

## PHÂN BIỆT VỚI POLICY KH

| Tiêu chí | Policy KH (`customer/complaint-policy.md`) | Policy Nội bộ (file này) |
|----------|--------------------------------------------|---------------------------|
| Mục đích | Cách gửi khiếu nại, điều kiện & mức bồi thường | Quy trình xử lý, tiền lệ, phê duyệt, Risk Registry |
| Nội dung | Kênh, điều kiện, mức bồi thường, SLA | Phân loại P1-P4, chuỗi bằng chứng, 2 luồng duyệt |
| Người đọc | Khách hàng | NVKD, TP, CSKH, Operations, Finance, GDKD |

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa quy trình xử lý khiếu nại nhanh nhất & chính xác nhất
- SLA phản hồi ≤ 1 ngày làm việc
- Xây dựng hệ thống xử lý theo tiền lệ (Precedent-based)
- Cảnh báo rủi ro vận chuyển tự động

### 1.2 KPI Mục tiêu 2026

| Metric | Target |
|--------|:------:|
| Tỷ lệ phản hồi trong 1 ngày | ≥ 95% |
| Tỷ lệ chốt khiếu nại ≤ 7 ngày | ≥ 90% |
| Tỷ lệ đơn phát sinh khiếu nại | < 2% |
| Thời gian xử lý trung bình | ≤ 2 ngày |

---

## 2. NGUYÊN TẮC BỒI THƯỜNG THEO LOẠI HÌNH

### 2.1 Hàng nguyên lô FCL/LCL từ NCC

| Điều kiện | Trách nhiệm | Bồi thường |
|-----------|-------------|:----------:|
| Hàng đóng từ NCC → giao thẳng KH | Eureka KHÔNG chịu trách nhiệm | Không |

### 2.2 Hàng đóng từ kho Eureka

| Điều kiện | Kết quả | Bồi thường |
|-----------|---------|:----------:|
| Check cam kho đóng hàng | Không có vấn đề | Không (lỗi bao bì) |
| Check cam kho đóng hàng | Có vấn đề | Theo giá trị khai báo |

### 2.3 Hàng gom (Consolidation) — Cascade

```
BƯỚC 1: Trích từ PHÍ ỦY THÁC
         ↓ (nếu chưa đủ)
BƯỚC 2: Trích từ PHÍ PHÒNG TRỪ RỦI RO
         ↓ (nếu vẫn chưa đủ)
BƯỚC 3: Eureka cộng vào VÍ KHÁCH (phần còn lại)
```

---

## 3. THÔNG BÁO TRƯỚC ĐƠN HÀNG (Pre-Order Checklist)

Trước khi xác nhận đơn hàng, NVKD **bắt buộc** thông báo cho KH các yêu cầu về bằng chứng. Phải gửi **bằng văn bản** (email/Zalo) và lưu vào CRM.

| # | Nội dung thông báo | Mục đích |
|---|--------------------|----------|
| 1 | KH phải quay **video dỡ hàng A-Z** (từ lúc mở thùng đến khi kiểm hết hàng) | Điều kiện bắt buộc để được bồi thường chính thức |
| 2 | Nếu hàng có dấu hiệu hư hỏng → chụp ảnh chi tiết + giữ nguyên bao bì | Làm bằng chứng claim |
| 3 | Báo sự cố trong vòng **24h** kể từ khi nhận hàng | Đảm bảo thời hiệu claim |

> **Nếu NVKD không thông báo mà KH không có video → NVKD chịu 50% giá trị bồi thường khi KH khiếu nại.**

---

## 4. YÊU CẦU BẰNG CHỨNG

| Yêu cầu | Nếu không có |
|----------|-------------|
| **Video dỡ hàng A-Z** | KHÔNG đủ điều kiện bồi thường chính thức |
| Không có video | Sale và KH tự thỏa thuận chiết khấu |

---

## 5. QUY TRÌNH XÁC ĐỊNH NGUYÊN NHÂN

### 5.1 Chuỗi bằng chứng (theo thứ tự)

```
① Check cam kho TQ (Quảng Châu / Bằng Tường)
② Ảnh hàng tại cửa khẩu
③ Báo cáo tình hình hàng vỡ hỏng tại cửa khẩu (hệ thống)
④ Check cam kho VN
⑤ Video dỡ hàng của KH
```

### 5.2 Ma trận trách nhiệm

| Nguyên nhân | Trách nhiệm | Bồi thường |
|------------|-------------|------------|
| Hư từ NCC | NCC | Eureka hỗ trợ KH khiếu nại NCC |
| Hư trong đóng hàng tại kho Eureka | **Eureka** | Theo giá trị khai báo |
| Hư tại cửa khẩu/vận chuyển | **Eureka/Vendor** | Theo cascade |
| Hư do bao bì không đạt | **KH/NCC** | Không bồi thường |
| Không xác định được (thiếu bằng chứng) | Thỏa thuận | Sale + KH tự thỏa thuận |

---

## 6. HỆ THỐNG XỬ LÝ THEO TIỀN LỆ

### 5.1 Cách hoạt động

```
CSKH/Sale điền thông tin → Hệ thống gợi ý case tương tự
→ Sale đề xuất phương án dựa trên tiền lệ
→ Phê duyệt nhanh hơn vì đã có case tham chiếu
```

### 5.2 Matching tiền lệ (4 tiêu chí)

| Tiêu chí | Trọng số |
|----------|:------:|
| Cùng loại hàng | 40% |
| Cùng nguyên nhân | 30% |
| Cùng điều kiện bằng chứng | 20% |
| Cùng loại hình vận chuyển | 10% |

---

## 7. HỆ THỐNG CẢNH BÁO RỦI RO (Risk Item Registry)

| Mức | Điều kiện | Hành động bắt buộc |
|:---:|-----------|-------------------|
| 🟡 Lưu ý | 1 lần khiếu nại | Thông báo KH, đề xuất đóng bọc |
| 🟠 Cảnh báo | 2 lần khiếu nại | Yêu cầu KH gia cố + ký xác nhận rủi ro |
| 🔴 Cao | ≥ 3 lần khiếu nại | Bắt buộc đóng thùng gỗ + mua bảo hiểm |

---

## 8. QUY TRÌNH 10 BƯỚC

```
① TIẾP NHẬN → Log CRM, mã CMP-YYYYMMDD-XXX
② PHÂN LOẠI → Level (P1-P4) + Loại hình VC + Gói KH
③ ACKNOWLEDGE → Phản hồi KH trong SLA
④ KIỂM TRA TIỀN LỆ → Tra hệ thống case tương tự
⑤ XÁC ĐỊNH NGUYÊN NHÂN → Chuỗi bằng chứng
⑥ XÁC ĐỊNH TRÁCH NHIỆM → Theo chính sách loại hình VC
⑦ ĐỀ XUẤT PHƯƠNG ÁN → Dựa trên tiền lệ + chính sách
⑧ PHÊ DUYỆT → Fast Track (có tiền lệ) hoặc TP duyệt (case mới)
⑨ THỰC HIỆN + FOLLOW-UP
⑩ ĐÓNG CASE → Lưu tiền lệ + Cập nhật Risk Registry
```

---

## 9. SLA XỬ LÝ

| Level | Mô tả | Acknowledge | Resolution |
|:-----:|-------|:-----------:|:----------:|
| **P1** | Mất hàng, hư hỏng nặng | 1 giờ | 24 giờ |
| **P2** | Delay > 3 ngày, sai chứng từ | 4 giờ | 48 giờ |
| **P3** | Thắc mắc giá, thái độ NV | 24 giờ | 72 giờ |
| **P4** | Góp ý, đề xuất | 48 giờ | 7 ngày |

### Ưu tiên theo gói KH

| Gói | Hệ số SLA |
|-----|:--------:|
| Elite | × 0.5 |
| Premium | × 0.75 |
| Pro/Basic | × 1.0 |

---

## 10. PHÊ DUYỆT BỒI THƯỜNG

### Luồng 1 — CÓ tiền lệ (Fast Track)

```
Case có tiền lệ matching ≥ 70% → Sale đề xuất giống tiền lệ
→ TỰ ĐỘNG PHÊ DUYỆT → Thực hiện ngay
```

### Luồng 2 — KHÔNG có tiền lệ (TP Duyệt)

```
Case mới → Sale đề xuất → TP REVIEW & DUYỆT
→ Thực hiện → LƯU LÀM TIỀN LỆ
```

---

## 11. HÌNH THỨC BỒI THƯỜNG

| Hình thức | Khi nào |
|-----------|---------|
| Trích phí ủy thác → phí rủi ro → cộng ví | Hàng gom hư do kiểm hóa |
| Bồi thường theo giá trị khai báo | Lỗi đóng hàng Eureka (có bằng chứng) |
| Chiết khấu/giảm giá đơn tiếp | KH không có video, thỏa thuận |
| Miễn phí VC kiện thất lạc | Thất lạc không rõ nguyên nhân |

---

## 12. ESCALATION

| Trigger | Escalation đến |
|---------|:------------:|
| Không acknowledge trong SLA | TP |
| Case quá hạn resolution | TP → GDKD |
| KH Elite khiếu nại | TP ngay lập tức |
| Cùng KH khiếu nại ≥ 3 lần/quý | TP + GDKD |
| Case mới không tiền lệ | TP duyệt |

---

## 13. CHEAT SHEET CHO SALE/CSKH

| Tình huống | Eureka bồi thường? | Cách tính |
|-----------|:-----------------:|-----------|
| FCL/LCL từ NCC → thẳng KH | Không | — |
| Từ kho Eureka, cam OK | Không | — |
| Từ kho Eureka, cam có lỗi | Có | Giá trị khai báo |
| Hàng gom, hư do kiểm hóa | Có | Cascade |
| Vỡ hỏng, không video | Không chính thức | Sale+KH thỏa thuận |
| Thất lạc không rõ NN | Miễn phí VC | Không tính VC |
| Đòi bồi thường 100% | Có | Trả hàng về Eureka trước |

---

## 14. METRICS & REPORTING

| Metric | Target | Frequency |
|--------|:------:|-----------|
| Tỷ lệ phản hồi ≤ 1 ngày | ≥ 95% | Monthly |
| Tỷ lệ giải quyết ≤ 7 ngày | ≥ 90% | Monthly |
| Tỷ lệ đơn phát sinh khiếu nại | < 2% | Monthly |
| Tổng giá trị bồi thường | Track | Monthly |
| Số mặt hàng mới trong Risk Registry | Track | Monthly |

---

## 15. TRÁCH NHIỆM CÁC BÊN

| Vai trò | Trách nhiệm |
|---------|-------------|
| **NVKD/Sale** | Tiếp nhận, acknowledge, tra tiền lệ, đề xuất, follow-up |
| **CSKH** | Điền form khiếu nại, tra tiền lệ, hỗ trợ Sale |
| **NV Điều phối** | Check cam kho, điều tra nguyên nhân, cập nhật Risk Registry |
| **TP** | Giám sát SLA, phê duyệt case mới, escalation |
| **GDKD** | Xử lý KH chiến lược, quyết định case đặc biệt |
| **Finance** | Thực hiện bồi thường, trích phí, cộng ví KH |

---

## 16. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Training: Tất cả NVKD + OPS + CSKH
- Review định kỳ: **Quarterly**
- Owner: TP Team + Operations Manager + GDKD

---

*Version 2.2 | 09/05/2026 | Owner: TP Team + OPS Manager + GDKD*
