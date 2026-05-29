# QUẢN LÝ BẢO MẬT DỮ LIỆU (Data Security Management)

> **Policy Nội bộ** — Dành cho tất cả nhân viên, IT, GDKD
> **Đây là policy thuần nội bộ, không có policy KH tương ứng**
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Bảo vệ dữ liệu khách hàng, NCC và nội bộ công ty
- Phòng chống rò rỉ, mất mát, đánh cắp thông tin
- Tuân thủ quy định bảo mật thông tin

### 1.2 Phạm vi
- Tất cả dữ liệu số và vật lý của ERK Transport
- Tất cả nhân viên, cộng tác viên, vendor có truy cập dữ liệu

---

## 2. PHÂN LOẠI DỮ LIỆU

| Cấp độ | Mô tả | Ví dụ |
|:------:|-------|-------|
| **Mật** | Tuyệt đối bảo mật, chỉ GDKD+Manager | Chiến lược KD, M&A, lương |
| **Nội bộ** | Chỉ nhân viên ERK được truy cập | CRM, giá NCC, quy trình nội bộ |
| **Hạn chế** | Theo phòng ban | Dữ liệu từng phòng |
| **Công khai** | Có thể chia sẻ ra ngoài | Catalogue, policy KH |

---

## 3. BẢO MẬT DỮ LIỆU KHÁCH HÀNG

### Dữ liệu cần bảo vệ

- Thông tin liên hệ (SĐT, Email, Zalo, địa chỉ)
- CCCD/ĐKKD của KH
- Lịch sử giao dịch, doanh số
- Thông tin NCC của KH (nếu có)

### Quy tắc

| Hành vi | Được phép? |
|---------|:----------:|
| Chia sẻ data KH cho bên thứ 3 | Cấm |
| Mang data KH ra khỏi công ty | Cần TP approve |
| Gửi data KH qua kênh không bảo mật | Cấm |
| Tra cứu data KH của NVKD khác | Cần lý do chính đáng + TP approve |
| Lưu data KH trên thiết bị cá nhân | Cấm (trừ khi được phép) |

---

## 4. BẢO MẬT DỮ LIỆU NCC

- Danh sách NCC và giá mua là **bí mật kinh doanh**
- Chỉ Procurement + GDKD + TP được truy cập đầy đủ
- NVKD chỉ xem NCC đã được phân công
- Cấm tiết lộ NCC cho đối thủ hoặc bên thứ 3

---

## 5. BẢO MẬT HỆ THỐNG

### 5.1 Tài khoản & Mật khẩu

| Yêu cầu | Mô tả |
|---------|-------|
| Mật khẩu tối thiểu | 8 ký tự, gồm chữ + số + ký tự đặc biệt |
| Đổi mật khẩu | Mỗi 90 ngày |
| 2FA | Bắt buộc với CRM, Email, Banking |
| Khóa tài khoản | Sau 5 lần đăng nhập sai |
| Revoke access | Ngay khi nhân viên nghỉ việc |

### 5.2 Thiết bị

- Máy tính công ty phải có password/pin
- Không cài phần mềm lạ, crack
- Cập nhật antivirus định kỳ
- Không dùng USB lạ cắm vào máy công ty

---

## 6. XỬ LÝ SỰ CỐ BẢO MẬT

```
Phát hiện → Báo IT/Manager NGAY
→ Cô lập (khóa tài khoản, ngắt kết nối)
→ Điều tra nguyên nhân + phạm vi ảnh hưởng
→ Khắc phục + thông báo bên liên quan
→ Báo cáo sự cố + bài học
```

### Phân loại sự cố

| Mức | Mô tả | Hành động |
|:---:|-------|-----------|
| **Thấp** | Lộ thông tin không nhạy cảm | Cảnh báo + training |
| **Trung bình** | Lộ thông tin KH nội bộ | Điều tra + kỷ luật |
| **Cao** | Lộ thông tin ra bên ngoài | GDKD + Legal + Công an (nếu cần) |

---

## 7. BACKUP & KHÔI PHỤC

| Dữ liệu | Tần suất backup | Lưu trữ |
|---------|:--------------:|---------|
| CRM | Daily | Cloud + Local |
| Email | Daily | Cloud |
| Tài chính | Daily | Cloud + Local |
| Hợp đồng | Realtime | Cloud |

- Backup được mã hóa
- Test khôi phục: **Hàng quý**
- Thời gian khôi phục tối đa (RTO): 24h

---

## 8. ĐÀO TẠO & NHẬN THỨC

| Hoạt động | Tần suất |
|-----------|----------|
| Training bảo mật cho NV mới | Tuần đầu |
| Nhắc nhở bảo mật toàn công ty | Hàng quý |
| Diễn tập phishing | 6 tháng/lần |
| Cập nhật chính sách | Khi có thay đổi |

---

## 9. TRÁCH NHIỆM

| Vai trò | Trách nhiệm |
|---------|-------------|
| **GDKD** | Chủ sở hữu chính sách bảo mật |
| **IT/Admin** | Triển khai kỹ thuật, backup, giám sát |
| **TP các phòng** | Đảm bảo team tuân thủ |
| **Tất cả NV** | Tuân thủ chính sách, báo cáo sự cố |

---

## 10. CHẾ TÀI VI PHẠM

| Vi phạm | Chế tài |
|---------|---------|
| Chia sẻ thông tin KH cho bên ngoài | Kỷ luật → Sa thải + Pháp lý |
| Truy cập trái phép dữ liệu | Kỷ luật + Cảnh cáo |
| Dùng thiết bị cá nhân không phép | Nhắc nhở → Cảnh cáo |
| Không báo cáo sự cố bảo mật | Kỷ luật |

---

## 11. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Tất cả nhân viên phải ký cam kết bảo mật
- Review định kỳ: **6 tháng/lần**
- Owner: GDKD + IT

---

*Version 1.0 | 08/05/2026 | Owner: GDKD + IT*
