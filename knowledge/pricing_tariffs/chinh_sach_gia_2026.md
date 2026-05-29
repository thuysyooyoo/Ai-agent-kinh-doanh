# CHÍNH SÁCH GIÁ 2026 - EUREKA LOGISTICS

Bản cập nhật cơ chế báo giá cước vận chuyển và phí ủy thác chính ngạch hàng gom cont (LCL) tuyến Trung Quốc - Việt Nam.

---

## 1. MỤC TIÊU & ĐIỂM MỚI CỐT LÕI

- **Bù đắp chi phí**: Điều chỉnh bảng cước vận chuyển để bù đắp chi phí bến bãi, xăng dầu và thông quan biến động.
- **Quản trị rủi ro hàng giá trị cao**: Bổ sung phí quản trị rủi ro 1% chỉ thu trên phần giá trị hàng vượt mốc **100 triệu VND / khối áp dụng**.
- **Cơ chế quy đổi khối**: Công bằng đối với hàng nặng. Quy đổi khối: `1 tấn = 4 m³` (tức `Khối quy đổi = Cân nặng (kg) / 250`).
- **Thưởng trung thành & VIP**: Áp dụng cơ chế song song - tự động lấy giá tối ưu nhất giữa **Bảng giá linh hoạt** (tính theo lượng đơn hàng) và **Bảng giá cố định VIP** (Basic, Pro -10%, Premium -20%, Elite -30%).
- **Kiểm soát chiết khấu**: Khóa tính năng chiết khấu tự do của Sale; hoa hồng chỉ tính trên Phí ủy thác cố định (giá nền 100.000đ/mục hàng).
- **Cam kết SLA**: Xử lý khiếu nại đền bù nhanh gọn trong vòng **1–2 ngày**.

---

## 2. CÔNG THỨC VÀ THÀNH PHẦN PHÍ ỦY THÁC

Mỗi đơn hàng vận chuyển ủy thác bao gồm các khoản phí chính sau:

### 2.1. Phí Ủy thác Cố định (A)
- **Đơn giá**: **400.000 VND / mục hàng**.
- Áp dụng cố định cho mỗi danh mục sản phẩm khai báo trên tờ khai, không phụ thuộc vào giá trị hay khối lượng.

### 2.2. Phí Quản trị Rủi ro Hàng Giá trị Cao (B)
Chỉ áp dụng cho hàng hóa có giá trị cao vượt quá ngưỡng an toàn.
- **Khối quy đổi**: `Khối_Quy_Đổi = Cân_Nặng (kg) / 250`.
- **Khối áp dụng (K)**: `K = MAX(Khối_Thực_Tế, Khối_Quy_Đổi)`.
- **Ngưỡng giá trị cao**: **100.000.000 VND / khối áp dụng**.
- **Công thức tính Phí rủi ro B**:
  $$B = \max(0, \text{Trị giá khai báo} - K \times 100.000.000) \times 1\%$$

### 2.3. Tổng Phí Ủy thác & Rủi ro
$$\text{Tổng phí dịch vụ ủy thác} = A + B$$

---

## 3. BẢNG CƯỚC VẬN CHUYỂN

Eureka áp dụng song song 2 bảng cước phí, hệ thống sẽ tự động tính toán cả hai phương án và áp dụng cước phí thấp hơn:
$$\text{Giá cước áp dụng} = \min(\text{Giá\_LinhHoat}, \text{Giá\_VIP})$$

### A) Bảng giá linh hoạt theo mốc đơn hàng (Tính theo m³/kg)

| Tuyến vận chuyển | Hàng nhẹ: Dưới 1m³ | Từ 1m³ - <2m³ | Từ 2m³ - <5m³ | Từ 5m³ - <10m³ | Từ 10m³ - <20m³ | Từ 20m³ - <30m³ | >= 30m³ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Quảng Châu - Hà Nội** | 1.850.000 | 1.700.000 | 1.600.000 | 1.500.000 | 1.400.000 | 1.300.000 | Liên hệ |
| **Quảng Châu - HCM** | 2.600.000 | 2.200.000 | 2.100.000 | 2.000.000 | 1.900.000 | 1.800.000 | Liên hệ |
| **Bằng Tường - Hà Nội** | 1.450.000 | 1.400.000 | 1.300.000 | 1.200.000 | 1.100.000 | 1.000.000 | Liên hệ |
| **Bằng Tường - HCM** | 2.150.000 | 1.900.000 | 1.800.000 | 1.700.000 | 1.600.000 | 1.500.000 | Liên hệ |

| Tuyến vận chuyển | Hàng nặng: Dưới 300kg | Từ 300kg - <500kg | Từ 500kg - <1.5 Tấn | Từ 1.5 Tấn - <5 Tấn | Từ 5 Tấn - <10 Tấn | >= 10 Tấn |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Quảng Châu - Hà Nội** | 9.000 | 8.000 | 7.000 | 6.000 | 5.000 | Liên hệ |
| **Quảng Châu - HCM** | 12.500 | 11.500 | 10.500 | 9.500 | 8.500 | Liên hệ |
| **Bằng Tường - Hà Nội** | 9.000 | 8.000 | 7.000 | 6.000 | 5.000 | Liên hệ |
| **Bằng Tường - HCM** | 12.500 | 11.500 | 10.500 | 9.500 | 8.500 | Liên hệ |

### B) Bảng giá cố định theo hạng VIP (Không đổi theo mốc đơn hàng)

| Tuyến - Đơn vị | Hạng Basic | Hạng Pro (-10%) | Hạng Premium (-20%) | Hạng Elite (-30%) |
| :--- | :---: | :---: | :---: | :---: |
| **QC - HN (m³)** | 1.850.000 | 1.665.000 | 1.480.000 | 1.295.000 |
| **QC - HCM (m³)** | 2.600.000 | 2.340.000 | 2.080.000 | 1.820.000 |
| **QC - HN (kg)** | 9.000 | 8.100 | 7.200 | 6.300 |
| **QC - HCM (kg)** | 12.500 | 11.250 | 10.000 | 8.750 |
| **BT - HN (m³)** | 1.450.000 | 1.305.000 | 1.160.000 | 1.015.000 |
| **BT - HCM (m³)** | 2.150.000 | 1.935.000 | 1.720.000 | 1.505.000 |
| **BT - HN (kg)** | 9.000 | 8.100 | 7.200 | 6.300 |
| **BT - HCM (kg)** | 12.500 | 11.250 | 10.000 | 8.750 |

---

## 4. VÍ DỤ TÍNH CƯỚC MINH HỌA

### Case 1: Hàng giá trị trung bình nhẹ
- **Thông số**: Trị giá 120.000.000đ, Thể tích 1.0 m³, Nặng 150kg, 1 mục hàng.
- **Khối áp dụng**: `K = MAX(1.0, 150/250) = 1.0 m³`.
- **Phí rủi ro**: `B = MAX(0, 120.000.000 - 1.0 * 100.000.000) * 1% = 200.000đ`.
- **Tổng phí ủy thác & rủi ro**: `400.000 + 200.000 = 600.000đ`.

### Case 2: Hàng siêu giá trị
- **Thông số**: Trị giá 500.000.000đ, Thể tích 1.0 m³, Nặng 100kg, 1 mục hàng.
- **Khối áp dụng**: `K = MAX(1.0, 100/250) = 1.0 m³`.
- **Phí rủi ro**: `B = MAX(0, 500.000.000 - 1.0 * 100.000.000) * 1% = 4.000.000đ`.
- **Tổng phí ủy thác & rủi ro**: `400.000 + 4.000.000 = 4.400.000đ`.

### Case 3: Hàng rất nặng giá trị cao
- **Thông số**: Trị giá 600.000.000đ, Thể tích 0.8 m³, Nặng 1.000kg (1 tấn), 1 mục hàng.
- **Khối áp dụng**: `K = MAX(0.8, 1000/250) = 4.0 m³`.
- **Phí rủi ro**: `B = MAX(0, 600.000.000 - 4.0 * 100.000.000) * 1% = 2.000.000đ`.
- **Tổng phí ủy thác & rủi ro**: `400.000 + 2.000.000 = 2.400.000đ`. (Công bằng nhờ quy đổi khối nặng).

### Case 4: Hàng thông thường
- **Thông số**: Trị giá 90.000.000đ, Thể tích 1.0 m³, Nặng 100kg, 1 mục hàng.
- **Khối áp dụng**: `K = MAX(1.0, 100/250) = 1.0 m³`.
- **Phí rủi ro**: `B = MAX(0, 90.000.000 - 1.0 * 100.000.000) * 1% = 0đ` (Không vượt ngưỡng).
- **Tổng phí ủy thác & rủi ro**: `400.000 + 0 = 400.000đ`.
