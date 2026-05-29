# QUẢN LÝ ONBOARDING KHÁCH HÀNG MỚI (KH Onboarding Operations)

> **Policy Nội bộ** — Dành cho NVKD, TP, Operations, CSKH
> **Policy KH tương ứng:** `customer/onboarding-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa quy trình tiếp nhận và kích hoạt khách hàng mới
- Đảm bảo KH có trải nghiệm tốt ngay từ đơn đầu tiên
- Giảm thời gian từ lead → KH active
- Thu thập đầy đủ thông tin pháp lý và kinh doanh của KH

### 1.2 KPI Onboarding 2026

| Metric | Target |
|--------|:------:|
| Thời gian từ đăng ký → đơn đầu | ≤ 7 ngày |
| Tỷ lệ KH hoàn thành onboarding | ≥ 90% |
| CSAT sau đơn đầu | ≥ 4/5 |
| Tỷ lệ KH quay lại đơn 2 trong 30 ngày | ≥ 60% |

---

## 2. QUY TRÌNH ONBOARDING

```
LEAD CHUYỂN ĐỔI (đã có đơn đầu)
           ↓
BƯỚC 1: THU THẬP THÔNG TIN (NVKD)
  □ CCCD/ĐKKD
  □ Thông tin liên hệ (SĐT, Email, Zalo)
  □ Địa chỉ nhận hàng
  □ Ngành hàng kinh doanh
           ↓
BƯỚC 2: KYC & PHÁP LÝ (Legal + NVKD)
  □ Kiểm tra CCCD/ĐKKD hợp lệ
  □ Ký Hợp đồng nguyên tắc / Hợp đồng Ủy thác
  □ Xác định ngành hàng, chính sách nhập khẩu
           ↓
BƯỚC 3: SETUP HỆ THỐNG (NVKD + Admin)
  □ Tạo Account trong CRM
  □ Gán NVKD phụ trách
  □ Thiết lập hạn mức tín dụng ban đầu (hạng C/D)
  □ Gói VIP: Basic
           ↓
BƯỚC 4: ĐƠN ĐẦU TIÊN (NVKD + Operations)
  □ Tư vấn phương thức vận chuyển
  □ Báo giá đơn đầu
  □ Hướng dẫn KH gửi hàng về kho TQ
  □ Theo dõi sát sao, thông báo từng mốc
           ↓
BƯỚC 5: POST-DELIVERY (NVKD + CSKH)
  □ Gọi check sau khi giao hàng
  □ Gửi khảo sát CSAT
  □ Giới thiệu các dịch vụ khác
  □ Set lịch follow-up tiếp theo
           ↓
BƯỚC 6: REVIEW 30 NGÀY (TP)
  □ Đánh giá mức độ active của KH
  □ Xem xét nâng hạng nếu đủ điều kiện
  □ Quyết định phân bổ tiếp hay chuyển pool
```

---

## 3. CHECKLIST ONBOARDING

### NVKD

- [ ] Đã thu thập CCCD/ĐKKD
- [ ] Đã xác nhận SĐT/Email/Zalo KH
- [ ] Đã tư vấn chính sách hàng hóa (HS code, thuế, giấy phép)
- [ ] Đã ký Hợp đồng nguyên tắc (nếu cần)
- [ ] Đã tạo Account CRM
- [ ] Đã gửi báo giá đơn đầu
- [ ] Đã hướng dẫn KH cách gửi hàng về kho TQ
- [ ] Đã thông báo các mốc vận chuyển cho KH
- [ ] Đã gọi check sau giao hàng
- [ ] Đã gửi link khảo sát CSAT
- [ ] Đã set lịch follow-up tiếp theo

### Operations

- [ ] Đã nhận thông tin đơn hàng từ NVKD
- [ ] Đã xác nhận hàng về kho TQ
- [ ] Đã kiểm tra bao bì, chụp ảnh
- [ ] Đã cập nhật T1-T7 trên hệ thống
- [ ] Đã giao hàng + POD

---

## 4. PHÂN LOẠI KH MỚI

| Phân loại | Tiêu chí | Hành động |
|-----------|----------|-----------|
| **Tiềm năng cao** | Đơn đầu > 100tr hoặc KH có quy mô lớn | TP trực tiếp theo dõi, đề xuất gói Pro/Premium |
| **Tiêu chuẩn** | Đơn đầu 10-100tr | NVKD phụ trách, onboarding tiêu chuẩn |
| **Nhỏ lẻ** | Đơn đầu < 10tr | NVKD phụ trách, theo dõi sau 3 đơn |

---

## 5. KPI THEO DÕI ONBOARDING

| Chỉ số | Công thức | Target |
|--------|-----------|:------:|
| Time to First Order | Ngày từ đăng ký → đơn đầu | ≤ 7 ngày |
| Onboarding Completion | KH hoàn thành đủ 6 bước / Tổng KH mới | ≥ 90% |
| First Order CSAT | Điểm CSAT sau đơn đầu | ≥ 4/5 |
| 30-day Retention | KH có đơn thứ 2 trong 30 ngày | ≥ 60% |
| 90-day Activation | KH đạt Active trong 90 ngày | ≥ 50% |

---

## 6. ESCALATION

| Tình huống | Escalate đến | Thời gian |
|------------|-------------|-----------|
| KH từ chối cung cấp giấy tờ | Legal | 24h |
| Đơn đầu > 500 triệu | GDKD | Trước khi báo giá |
| KH phàn nàn sau đơn đầu | TP | Ngay lập tức |
| KH không active sau 30 ngày | TP review | — |

---

## 7. CRM FIELDS ONBOARDING

```
ONBOARDING RECORD:
├── KH ID
├── Ngày đăng ký
├── Loại KH (Cá nhân / Doanh nghiệp)
├── Ngành hàng
├── NVKD phụ trách
├── Trạng thái onboarding (Step 1-6)
├── Ngày đơn đầu
├── Giá trị đơn đầu
├── CSAT đơn đầu
├── Gói VIP khởi điểm
├── Hạng tín dụng khởi điểm
└── Ngày review 30 ngày
```

---

## 8. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Áp dụng cho mọi KH mới từ ngày ban hành
- TP chịu trách nhiệm giám sát onboarding
- Review định kỳ: **Hàng tháng** (tháng đầu), **Hàng quý** (sau đó)

---

*Version 1.0 | 08/05/2026 | Owner: Sales Manager + Operations*
