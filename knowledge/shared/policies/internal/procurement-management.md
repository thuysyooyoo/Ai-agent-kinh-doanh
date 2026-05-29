# QUẢN LÝ MUA HÀNG HỘ & TÌM NGUỒN HÀNG (Procurement Management)

> **Policy Nội bộ** — Dành cho NVKD, Procurement, Operations, Finance, Legal, TP, GDKD
> **Policy KH tương ứng:** `customer/procurement-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## PHÂN BIỆT VỚI POLICY KH

| Tiêu chí | Policy KH (`customer/procurement-policy.md`) | Policy Nội bộ (file này) |
|----------|----------------------------------------------|---------------------------|
| Mục đích | Giới thiệu dịch vụ, quy trình, chi phí | Kiểm soát toàn bộ hoạt động procurement |
| Nội dung | Quy trình 6 bước, phí, cam kết | Đánh giá NCC, thanh toán, xử lý sự cố, KPI cascade |
| Người đọc | Khách hàng | NVKD, Procurement, Operations, Finance, Legal, TP, GDKD |

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa hoạt động tìm nguồn hàng và mua hàng hộ cho khách hàng ERK Transport
- Đảm bảo minh bạch về giá, chất lượng và quy trình
- Bảo vệ quyền lợi KH và ERK trong giao dịch với NCC Trung Quốc

### 1.2 KPI Mục tiêu 2026

| Metric | Target |
|--------|:------:|
| Thời gian tìm NCC (từ lúc nhận yêu cầu) | ≤ 48h |
| Số NCC đề xuất mỗi yêu cầu | ≥ 3 |
| Tỷ lệ KH đồng ý mua hàng (sau khi có báo giá) | ≥ 70% |
| Mức tiết kiệm chi phí cho KH (so với giá KH tự tìm) | ≥ 5% |
| Tỷ lệ hàng lỗi phát hiện trước khi ship | ≥ 95% |
| Tỷ lệ NCC giao đúng hạn | ≥ 90% |

---

## 2. NGUYÊN TẮC CỐT LÕI

1. **Check trước - Mua sau**: Luôn kiểm tra mẫu/chất lượng trước khi đặt mua số lượng lớn
2. **Tối thiểu 3 báo giá**: Mỗi yêu cầu tìm nguồn cần so sánh ít nhất 3 NCC
3. **Minh bạch giá**: Báo giá cho KH rõ ràng: giá NCC + phí dịch vụ ERK
4. **Xác minh NCC trước khi giao dịch**: Kiểm tra giấy phép, lịch sử giao dịch
5. **Không cam kết những gì NCC không cam kết**: Về thời gian, chất lượng
6. **Bảo mật thông tin NCC**: Không tiết lộ NCC cho bên thứ 3 ngoài KH

---

## 3. QUY TRÌNH MUA HÀNG HỘ (7 BƯỚC)

```
① TIẾP NHẬN YÊU CẦU
   Sales gửi form → Procurement xác nhận trong 4h
   Làm rõ với Sales/KH nếu thông tin chưa đủ

② TÌM NCC
   Tra database NCC hiện có → Tìm NCC mới trên 1688/Taobao/Tmall/Alibaba
   → Gửi yêu cầu báo giá 3-5 NCC → So sánh giá, chất lượng, thời gian, uy tín

③ ĐỀ XUẤT
   Tổng hợp báo giá → Đánh giá ưu/nhược điểm từng NCC
   → Đề xuất NCC tốt nhất + 2 phương án dự phòng → Gửi Sales

④ ĐẶT HÀNG
   KH chốt NCC → Procurement đặt hàng → Đàm phán điều khoản
   Hợp đồng > 100 triệu: Legal review → Finance thanh toán đặt cọc

⑤ THEO DÕI SẢN XUẤT
   Theo dõi tiến độ NCC → Cập nhật cho Sales → Xử lý nếu chậm

⑥ KIỂM TRA TẠI KHO TQ
   Hàng về kho TQ → Operations kiểm tra số lượng + chất lượng
   → Chụp ảnh/video → Gửi KH xác nhận → KH OK → VC về VN

   ⚠️ LƯU Ý VỀ ĐẢM BẢO CHẤT LƯỢNG:
   ERK chỉ đảm bảo chất lượng hàng hóa khi KH đồng ý nhập mẫu test trước
   khi đặt hàng số lượng lớn. Nếu KH từ chối nhập mẫu test, ERK không
   chịu trách nhiệm về chất lượng — chỉ đảm bảo đúng mẫu mã, quy cách đã chốt.

⑦ ĐÓNG ĐƠN
   Hàng về VN, giao KH → Cập nhật NCC database → Đánh giá NCC
```

---

## 4. TIÊU CHUẨN ĐÁNH GIÁ NCC

| Tiêu chí | Trọng số | Thang điểm |
|----------|:--------:|------------|
| Giá cả | 30% | 1-5 (so với giá thị trường) |
| Chất lượng | 25% | 1-5 (dựa trên mẫu/ảnh/đánh giá) |
| Thời gian giao hàng | 20% | 1-5 (so với yêu cầu KH) |
| Uy tín | 15% | 1-5 (lịch sử + đánh giá nền tảng) |
| Linh hoạt | 10% | 1-5 (thanh toán, MOQ) |

### Red flags — Từ chối NCC nếu:

| Dấu hiệu | Hành động |
|----------|-----------|
| Không có giấy phép kinh doanh | Từ chối |
| Không chịu gửi mẫu | Từ chối |
| Yêu cầu thanh toán 100% trước với đơn > 50 triệu | Từ chối |
| Giá thấp bất thường (> 30% so với thị trường) | Điều tra thêm |
| Không có địa chỉ sản xuất rõ ràng | Từ chối |

---

## 5. THANH TOÁN CHO NCC

| Phương thức | Giá trị đơn | Điều kiện |
|-------------|:----------:|-----------|
| Alipay/Taobao | ≤ 20 triệu | NCC quen, có đánh giá tốt |
| T/T 30% trước | 20-100 triệu | Hợp đồng rõ ràng |
| T/T 30% trước | > 100 triệu | Có Legal review hợp đồng |
| L/C | > 500 triệu | Qua ngân hàng |

---

## 6. PHÊ DUYỆT MUA HÀNG

| Giá trị đơn | Người duyệt | Ghi chú |
|:-----------:|-------------|---------|
| ≤ 20 triệu | NVKD | Tự quyết |
| 20-50 triệu | NVKD + Procurement | Procurement xác nhận NCC |
| 50-100 triệu | TP | TP duyệt |
| 100-500 triệu | TP + Legal | Legal review hợp đồng |
| > 500 triệu | GDKD | GDKD duyệt + Legal + Finance |

---

## 7. XỬ LÝ SỰ CỐ VỚI NCC

| Sự cố | Hành động | SLA |
|--------|----------|:---:|
| NCC chậm hàng | Báo Sales/CSKH | 2h |
| NCC hết hàng | Đề xuất NCC thay thế | 24h |
| NCC đổi giá | Báo Sales + KH quyết định | 4h |
| Hàng lỗi | Gửi bằng chứng → yêu cầu NCC xử lý | 24h |
| Hàng sai quy cách | Kiểm tra lại → đối chiếu đơn → xử lý | 24h |
| NCC không hợp tác | Blacklist + báo Legal | Ngay |

---

## 8. QUẢN LÝ DATABASE NCC

### 8.1 Trạng thái NCC

| Trạng thái | Định nghĩa | Hành động |
|-----------|------------|-----------|
| **Active** | Đang giao dịch, đánh giá ≥ 3/5 | Tiếp tục hợp tác |
| **Inactive** | Không giao dịch > 6 tháng | Lưu trữ, có thể tái kích hoạt |
| **Blacklist** | Vi phạm (lừa đảo, hàng giả, không hợp tác) | Cấm giao dịch vĩnh viễn |

### 8.2 Cập nhật database

- Thêm NCC mới ngay sau giao dịch đầu tiên
- Cập nhật đánh giá sau mỗi giao dịch
- Review toàn bộ database hàng quý
- Tối thiểu 14 trường thông tin mỗi NCC (xem `data/supplier-database.md`)

---

## 9. PHÍ DỊCH VỤ & HOA HỒNG

| Loại KH | Phí DV mua hàng | Ghi chú |
|---------|:---------------:|---------|
| Basic/Chưa có gói | 3% | Tối thiểu 200.000đ |
| Pro | 2% | Tối thiểu 200.000đ |
| Premium | 1.5% | Tối thiểu 200.000đ |
| Elite | 1% | Tối thiểu 200.000đ |

> Hoa hồng cho NVKD: 10% phí dịch vụ thu được từ đơn procurement.

---

## 10. CẢNH BÁO & GIÁM SÁT

| Trigger | Action |
|---------|--------|
| Cùng NCC 2 lần giao trễ liên tiếp | Flag review, cân nhắc thay thế |
| Đơn procurement > 7 ngày chưa tìm được NCC | Escalate TP |
| KH hủy đơn sau khi đã đặt NCC > 3 lần/quý | Review KH + yêu cầu đặt cọc |
| Procurement KPI < 80% (2 tháng liên tiếp) | TP review + coaching |

---

## 11. CRM FIELDS

```
PROCUREMENT RECORD:
├── Mã yêu cầu (PRQ-YYYYMMDD-XXX)
├── Mã KH
├── Mặt hàng
├── Số lượng
├── Ngân sách dự kiến
├── Đã nhập mẫu test? (Yes/No)
├── Trạng thái (Requested → Sourcing → Quoting → KH_Approval → Ordered → QC → Shipped → Completed)
├── NCC được chọn (Mã NCC, giá, link SP)
├── Phí DV
├── Ngày đặt hàng
├── Ngày về kho TQ
├── Kết quả QC (Pass/Fail)
└── Đánh giá NCC sau giao dịch
```

---

## 12. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Áp dụng cho mọi yêu cầu mua hàng hộ từ ngày ban hành
- Procurement chịu trách nhiệm thực thi + báo cáo
- Review định kỳ: **Quarterly**
- Owner: Procurement Specialist + Sales Manager + GDKD

---

*Version 1.0 | 08/05/2026 | Owner: Procurement + Sales Manager + GDKD*
