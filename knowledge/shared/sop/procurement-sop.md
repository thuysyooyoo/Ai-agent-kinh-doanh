# SOP: Thu mua & Tìm nguồn hàng (Procurement)

> Triển khai từ **Chính sách Thu mua & Tìm nguồn hàng** (`knowledge/shared/policies/procurement-policy.md`)

---

## THÔNG TIN

| Thông tin | Chi tiết |
|-----------|----------|
| **Tiêu đề SOP** | Thu mua & Tìm nguồn hàng |
| **Mã SOP** | SOP-PROC-001 |
| **Phòng ban** | Procurement & Sourcing |
| **Owner** | Procurement & Sourcing Specialist |
| **Ngày tạo** | 05/05/2026 |
| **Ngày hiệu lực** | 01/06/2026 |
| **Phiên bản** | 1.0 |

---

## 1. MỤC ĐÍCH

- Chuẩn hóa hoạt động tìm nguồn hàng và mua hàng hộ theo Procurement Policy
- Đảm bảo thời gian phản hồi ≤ 4h, tìm NCC ≤ 48h
- Tối thiểu 3 báo giá mỗi yêu cầu
- Đảm bảo tỷ lệ hàng lỗi phát hiện trước khi ship ≥ 95%

---

## 2. QUY TRÌNH CHUẨN

### Bước 1: Tiếp nhận yêu cầu (≤ 4h)

**Input:** Form yêu cầu tìm nguồn từ Sales Manager

| Trường thông tin | Bắt buộc? |
|-----------------|-----------|
| Tên sản phẩm | Có |
| Số lượng | Có |
| Ngân sách dự kiến | Có |
| Yêu cầu chất lượng | Có |
| Thời gian cần hàng | Có |
| Link tham khảo (nếu có) | Không |
| Yêu cầu đặc biệt (nhãn mác, bao bì) | Không |

**Hành động:**
1. Kiểm tra form đầy đủ thông tin
2. Xác nhận tiếp nhận với Sales trong 4h
3. Làm rõ với Sales/KH nếu thiếu thông tin

---

### Bước 2: Tìm NCC (≤ 48h)

**Hành động:**

1. **Tra database NCC hiện có** (`knowledge/data/supplier-database.md`)
2. **Tìm NCC mới** trên các nền tảng:
   - 1688.com (B2B nội địa TQ)
   - Taobao (bán buôn nhỏ)
   - Tmall (hàng chính hãng)
   - Alibaba.com (B2B quốc tế)
3. **Gửi yêu cầu báo giá** cho 3-5 NCC
4. **So sánh báo giá** theo ma trận đánh giá

**Ma trận đánh giá NCC:**

| NCC | Giá (30%) | Chất lượng (25%) | TG giao (20%) | Uy tín (15%) | Linh hoạt (10%) | Tổng |
|-----|-----------|-------------------|---------------|-------------|-----------------|------|
| NCC 1 | /5 | /5 | /5 | /5 | /5 | /5.0 |
| NCC 2 | /5 | /5 | /5 | /5 | /5 | /5.0 |
| NCC 3 | /5 | /5 | /5 | /5 | /5 | /5.0 |

---

### Bước 3: Đề xuất & Chốt

**Hành động:**
1. Tổng hợp báo giá → Bảng so sánh
2. Đánh giá ưu/nhược điểm từng NCC
3. Đề xuất NCC tốt nhất + 2 phương án dự phòng
4. Gửi Sales để KH quyết định
5. KH chốt → Xác nhận bằng văn bản (Zalo/Email)

---

### Bước 4: Đặt hàng

**Hành động:**
1. Đàm phán điều khoản cuối cùng với NCC
2. Ký hợp đồng mua bán:
   - Đơn ≤ 100 triệu: Procurement tự ký (dùng mẫu chuẩn)
   - Đơn > 100 triệu: Legal & Compliance review trước khi ký
3. Finance thanh toán đặt cọc theo phương thức đã duyệt

**Checklist trước khi đặt hàng:**
- [ ] Đã xác minh giấy phép kinh doanh NCC
- [ ] Đã kiểm tra mẫu/chất lượng (nếu là NCC mới)
- [ ] Điều khoản thanh toán rõ ràng
- [ ] Thời gian giao hàng được NCC cam kết bằng văn bản
- [ ] Điều khoản xử lý hàng lỗi rõ ràng
- [ ] Hợp đồng > 100 triệu đã được Legal review

---

### Bước 5: Theo dõi & Kiểm tra

**Theo dõi tiến độ NCC:**

| Mốc | Hành động |
|------|-----------|
| Sau đặt hàng 2 ngày | Check NCC đã bắt đầu SX chưa |
| 50% thời gian SX | Check tiến độ, yêu cầu ảnh bán thành phẩm |
| Trước ngày giao 3 ngày | Xác nhận lại ngày giao |
| Đến ngày giao | Xác nhận hàng đã gửi, lấy tracking/vận đơn |

**Kiểm tra tại kho TQ:**
1. Operations nhận hàng → kiểm tra số lượng, chất lượng
2. Procurement chụp ảnh/video
3. Gửi KH xác nhận
4. KH OK → Operations vận chuyển về VN
5. KH không OK → Xử lý theo Mục 4

---

## 3. QUY TRÌNH XỬ LÝ HÀNG LỖI

| Loại lỗi | Cách phát hiện | Hành động |
|----------|---------------|-----------|
| Sai mẫu/màu | So với mẫu đã duyệt | Chụp ảnh → gửi NCC → yêu cầu đổi/hoàn tiền |
| Thiếu số lượng | Kiểm đếm tại kho TQ | Chụp ảnh + biên bản → yêu cầu giao bổ sung |
| Hư hỏng | Kiểm tra ngoại quan | Chụp ảnh + video → yêu cầu bồi thường |
| Kém chất lượng | So với tiêu chuẩn đã thỏa thuận | Gửi bằng chứng → đàm phán giảm giá/trả hàng |

**Nguyên tắc:**
- Phát hiện tại kho TQ: Dễ xử lý nhất (đổi trả trong nội địa TQ)
- Đã gửi về VN: Tốn kém hơn nhiều → **Check kỹ trước khi ship**

---

## 4. BÁO CÁO

### Hàng ngày
- Cập nhật trạng thái các đơn mua đang mở
- Báo Sales/CSKH nếu có vấn đề

### Hàng tuần (gửi Sales Manager, Operations Manager)
- Số yêu cầu tìm nguồn mới
- Số NCC mới thêm vào database
- Tình trạng các đơn đang mua
- Vấn đề phát sinh

### Hàng tháng (gửi GDKD, Sales Manager, Data & BI)
- Tổng số đơn mua hàng hộ
- Tổng giá trị mua hàng
- Tỷ lệ hàng lỗi
- Tỷ lệ NCC giao đúng hạn
- Mức tiết kiệm chi phí cho KH
- Database NCC: số lượng mới, số lượng blacklist

---

## 5. CÔNG CỤ

- **1688.com / Taobao / Tmall**: Tìm NCC
- **Alibaba.com**: NCC B2B quốc tế
- **Alipay**: Thanh toán nội địa TQ
- **Database NCC**: `knowledge/data/supplier-database.md`
- **Zalo**: Trao đổi với Sales/KH
- **Google Translate / Baidu Translate**: Dịch giao tiếp với NCC TQ

---

*Procurement SOP v1.0 - 05/05/2026*
