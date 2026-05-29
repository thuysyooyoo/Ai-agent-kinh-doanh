# QUẢN LÝ KHO BÃI (Warehouse Management)

> **Policy Nội bộ** — Dành cho Operations, Kho TQ, Kho VN, NVKD, GDKD
> **Đây là policy thuần nội bộ, không có policy KH tương ứng**
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa quy trình vận hành kho tại Trung Quốc và Việt Nam
- Đảm bảo an toàn hàng hóa, kiểm soát chất lượng
- Tối ưu thời gian lưu kho và chi phí

### 1.2 Hệ thống kho ERK

| Kho | Vị trí | Chức năng |
|-----|--------|-----------|
| **Kho TQ 1** | Quảng Châu | Tiếp nhận, kiểm tra, đóng gói, xuất hàng |
| **Kho TQ 2** | Bằng Tường | Trung chuyển biên giới |
| **Kho VN 1** | HCM | Tiếp nhận, phân phối |
| **Kho VN 2** | Hà Nội | Tiếp nhận, phân phối |

---

## 2. QUY TRÌNH NHẬN HÀNG (INBOUND)

```
① ĐĂNG KÝ: NVKD/Customer gửi thông tin hàng sắp về
② TIẾP NHẬN: Hàng về → Kiểm tra số kiện, đối chiếu với khai báo
③ KIỂM TRA: Check bao bì, số lượng, chất lượng bên ngoài
④ CHỤP ẢNH: Ảnh từng kiện + ảnh tổng thể → Upload CRM
⑤ NHẬP KHO: Cập nhật vị trí, gán mã lô → Sẵn sàng xuất
```

### Checklist nhận hàng

```
□ Số kiện khớp với thông báo
□ Bao bì nguyên vẹn, không rách/vỡ
□ Mã vận đơn / Tracking khớp
□ Chụp ảnh tối thiểu 3 góc
□ Cập nhật trạng thái T3 trên CRM
```

---

## 3. QUY TRÌNH ĐÓNG GÓI & XUẤT HÀNG (OUTBOUND)

```
① LỆNH XUẤT: Operations ra lệnh xuất kho
② PICKING: Lấy hàng theo danh sách
③ ĐÓNG GÓI: Gia cố, đóng thùng, dán nhãn
④ KIỂM TRA CUỐI: Camera ghi hình quá trình đóng hàng
⑤ XUẤT KHO: Bàn giao cho đơn vị vận chuyển
⑥ CẬP NHẬT: Status T4 trên CRM
```

### Tiêu chuẩn đóng gói

| Loại hàng | Yêu cầu đóng gói |
|-----------|-----------------|
| Hàng thường | Thùng carton 3-5 lớp, băng keo chắc chắn |
| Hàng dễ vỡ | Thùng carton + xốp/bọt khí + đánh dấu "DỄ VỠ" |
| Hàng nặng (> 30kg) | Thùng carton dày + dây đai + pallet nếu cần |
| Hàng giá trị cao | Đóng thùng gỗ, seal bảo mật |

---

## 4. KIỂM SOÁT CHẤT LƯỢNG (QC)

### 4.1 Các điểm kiểm tra

| Điểm QC | Mô tả | Người thực hiện |
|---------|-------|----------------|
| **QC Nhận hàng** | Kiểm tra số lượng, bao bì khi nhận | Nhân viên kho |
| **QC Đóng hàng** | Camera ghi hình lúc đóng gói | Nhân viên kho |
| **QC Trước xuất** | Kiểm tra lần cuối trước khi lên xe | Operations |

### 4.2 Xử lý hàng lỗi tại kho

| Tình huống | Hành động |
|-----------|-----------|
| Bao bì rách/hỏng | Chụp ảnh, báo NVKD, chờ ý kiến KH |
| Thiếu hàng so với khai báo | Báo Procurement/Sales ngay |
| Hàng sai quy cách | Chụp ảnh, đối chiếu đơn, báo KH |
| Hàng hư hỏng | Lập biên bản, truy nguyên nhân |

---

## 5. QUẢN LÝ CAMERA KHO

### 5.1 Yêu cầu camera

- Camera phủ toàn bộ khu vực nhận, đóng, xuất hàng
- Lưu trữ tối thiểu **90 ngày**
- Độ phân giải tối thiểu 1080p
- Có timestamp trên video

### 5.2 Sử dụng camera

| Mục đích | Khi nào |
|----------|---------|
| Bằng chứng đóng hàng | Mọi đơn hàng |
| Xử lý khiếu nại | Khi KH báo hư hỏng |
| Kiểm tra nội bộ | Định kỳ hoặc khi có sự cố |

---

## 6. LƯU KHO

### 6.1 Thời gian lưu kho miễn phí (theo gói VIP)

| Gói VIP | Lưu kho TQ | Lưu kho VN |
|---------|:---------:|:---------:|
| Basic | 5 ngày | 2 ngày |
| Pro | 10 ngày | 3 ngày |
| Premium | 15 ngày | 5 ngày |
| Elite | 1 tháng | 7 ngày |

### 6.2 Phí lưu kho quá hạn

| Kho | Phí / ngày |
|-----|:----------:|
| Kho TQ | 50.000đ / m³ / ngày |
| Kho VN | 100.000đ / m³ / ngày |

---

## 7. AN TOÀN KHO

| Yêu cầu | Mô tả |
|---------|-------|
| PCCC | Bình chữa cháy, lối thoát hiểm, tập huấn định kỳ |
| An ninh | Camera 24/7, khóa cửa, kiểm soát ra vào |
| Bảo hiểm kho | Bảo hiểm cháy nổ + trộm cắp |
| Vệ sinh | Dọn dẹp hàng ngày, không để hàng cản trở lối đi |

---

## 8. BÁO CÁO KHO

| Báo cáo | Nội dung | Tần suất |
|---------|----------|----------|
| Tồn kho | Hàng đang lưu tại các kho | Daily |
| Nhập/Xuất | Số lượng đơn nhập/xuất trong ngày | Daily |
| Sự cố | Hàng hư, thiếu, sai | Khi phát sinh |
| Hiệu suất | Thời gian xử lý TB, tỷ lệ lỗi | Monthly |

---

## 9. CẢNH BÁO & ESCALATION

| Trigger | Action |
|---------|--------|
| Hàng lưu kho quá hạn > 3 ngày | Báo NVKD + KH |
| Hàng lưu kho quá hạn > 7 ngày | Escalate TP |
| Camera kho ngừng hoạt động | Sửa ngay trong 24h |
| Sự cố mất hàng / trộm cắp | Báo GDKD + Công an |

---

## 10. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Áp dụng cho tất cả kho của ERK
- Operations chịu trách nhiệm quản lý + báo cáo
- Review định kỳ: **Monthly** (vận hành), **Quarterly** (policy)
- Owner: Operations Manager + GDKD

---

*Version 1.0 | 08/05/2026 | Owner: Operations Manager + GDKD*
