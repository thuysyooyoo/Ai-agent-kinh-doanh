# QUẢN LÝ PHÂN BỔ LEADS (Lead Allocation Management)

> **Policy Nội bộ** — Dành cho NVKD, TP, Marketing, GDKD
> **Đây là policy thuần nội bộ, không có policy KH tương ứng**
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.1

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Phân bổ leads công bằng giữa các NVKD
- Tối ưu tỷ lệ chuyển đổi
- Tránh xung đột về khách hàng
- Đảm bảo follow-up kịp thời

### 1.2 Phạm vi áp dụng
- Tất cả leads từ Marketing (MQL)
- Leads từ Events, Referral, Inbound (Website, Hotline)
- Self-prospected leads

---

## 2. PHÂN LOẠI LEADS

### 2.1 Theo nguồn

| Nguồn | Mô tả | Priority |
|-------|-------|:--------:|
| **Hotline/Zalo** | Inbound trực tiếp | Cao - Follow trong 2h |
| **FB Ads** | MQL từ Marketing | Cao - Follow trong 24h |
| **Website** | Form submission | TB - Follow trong 48h |
| **Event** | Từ sự kiện, networking | TB - Follow trong 48h |
| **Referral** | Giới thiệu từ KH hiện tại | Cao - Follow trong 24h |
| **Self-prospected** | NVKD tự tìm | NVKD owns |

### 2.2 Theo khu vực

| Khu vực | NVKD phụ trách | Ghi chú |
|---------|----------------|---------|
| **Hà Nội & Bắc** | Team 1 | 10 NVKD |
| **Miền Trung** | Team 2 | 8 NVKD |
| **Miền Nam** | Team 3 | 9 NVKD |

---

## 3. QUY TẮC PHÂN BỔ

### 3.1 Thứ tự ưu tiên

```
1. NVKD đã làm việc với KH trước đây (nếu có)
   ↓ (nếu không)
2. NVKD phụ trách khu vực địa lý của KH
   ↓ (nếu không match)
3. NVKD có chuyên môn ngành của KH
   ↓ (nếu nhiều NVKD eligible)
4. Round-robin trong pool NVKD eligible
   ↓ (xem xét capacity)
5. NVKD có workload thấp nhất được assign
```

### 3.2 Capacity Limits

| Level NVKD | Max leads active | Max opportunities active |
|------------|:---------------:|:------------------------:|
| Junior | 15 leads | 10 opportunities |
| Regular | 25 leads | 20 opportunities |
| Senior | 35 leads | 30 opportunities |
| TP Team | 20 leads | 15 opportunities |

> **Active Lead:** Lead đang trong trạng thái đang chăm sóc (chưa convert, chưa lost)

---

## 4. QUY TRÌNH PHÂN BỔ

### 4.1 Leads từ Marketing

```
MARKETING → Classify (Region/Industry) → Find eligible NVKD
→ Check capacity → Assign → Notify NVKD
```

### 4.2 Self-prospected Leads

- NVKD tự tìm được khách hàng → Register lead vào CRM
- Lead tự động thuộc NVKD đó
- **Điều kiện:** Phải register trước khi có contact từ nguồn khác

### 4.3 Referral Leads

- KH hiện tại giới thiệu → NVKD phụ trách KH ghi nhận
- Lead assign cho NVKD đó, hoặc NVKD khác nếu NVKD request

---

## 5. XỬ LÝ XUNG ĐỘT

| Tình huống | Xử lý |
|------------|-------|
| 2 NVKD cùng claim 1 lead | Ai register trước người đó owns |
| Lead đã từng làm việc với NVKD khác | NVKD cũ có quyền ưu tiên (trong 6 tháng) |
| KH yêu cầu NVKD cụ thể | Respect request của KH |
| NVKD nghỉ việc | Leads của họ được redistribute |

```
XUNG ĐỘT → TP Team review → Quyết định trong 24h
→ Nếu không giải quyết được → GDKD quyết định (final)
```

### 5.1 Chế tài hành vi lấn ranh KH

| Hành vi | Lần đầu | Tái phạm / Cố ý |
|---------|---------|-----------------|
| Cố tình liên hệ chào giá KH đã có owner | Khiển trách + Trả KH về owner cũ | Trừ P3 + Cảnh cáo + Giảm capacity |
| NVKD cũ tiếp tục liên hệ KH đã bàn giao | Khiển trách + Cảnh cáo | Trừ P3 + Tạm đình chỉ |
| Che giấu, không report khi phát hiện tranh chấp | Cảnh cáo | Trừ P3 |

---

## 6. LEAD RECLAMATION

| Điều kiện | Hành động |
|-----------|-----------|
| Lead không được follow trong 72h | Cảnh báo NVKD |
| Lead không được follow trong 5 ngày | Reassign cho NVKD khác |
| 3 lần miss follow-up/tháng | Giảm capacity, review |
| Lead không convert sau 30 ngày | Review, có thể recycle |
| Không log tương tác vào CRM trong 24h | Cảnh báo + nhắc nhở |
| 3 lần không log tương tác/tháng | Trừ P3 + Cảnh cáo |
| 5 lần không log tương tác/tháng | Trừ P3 + Giảm capacity + Review |

---

## 7. QUYỀN SỞ HỮU KHÁCH HÀNG (ACCOUNT OWNERSHIP)

### 7.1 Phân loại khách hàng theo nguồn

| Loại KH | Định nghĩa | Quyền sở hữu |
|---------|------------|--------------|
| **KH tự khai thác** | KH do NVKD chủ động tìm kiếm, liên hệ và phát triển — không từ nguồn công ty/quản lý cung cấp | Thuộc về NVKD khai thác. Được ghi nhận trên CRM và hồ sơ thành tích cá nhân. Nếu tiếp tục chăm sóc: hưởng hoa hồng theo cơ chế. Nếu không muốn tiếp tục: bàn giao cho NVKD khác, quyền lợi theo quy định từng thời kỳ |
| **KH được phân công** | KH do công ty, phòng ban, hoặc quản lý trực tiếp phân công cho NVKD chăm sóc | Thuộc tài sản chung của công ty/phòng ban. NVKD chỉ có quyền lợi trong thời gian được phân công chăm sóc. Khi luân chuyển: quyền phân công lại do công ty/phòng ban quyết định |

> **Lưu ý:** "Khách hàng cá nhân khi tính lương" là KH mà NVKD trực tiếp tư vấn và chốt đơn từ bước đầu tiên (bao gồm cả KH mới và KH tái mua), không phụ thuộc vào nguồn cung cấp.

### 7.2 Nguyên tắc chung

- Mỗi Account chỉ có 1 Owner duy nhất
- Owner có quyền hoa hồng cho tất cả đơn hàng từ Account đó

| Tình huống | Xử lý |
|------------|-------|
| KH request đổi NVKD | Approve, chuyển owner |
| NVKD không phục vụ tốt | TP review, có thể chuyển |
| NVKD nghỉ việc | Chuyển owner cho NVKD mới |
| Promote/KH lớn hơn | Có thể upgrade owner |

---

## 8. LUÂN CHUYỂN NỘI BỘ & BÀN GIAO KHÁCH HÀNG

### 8.1 Hình thức luân chuyển

| Hình thức | Mô tả |
|-----------|-------|
| **Cùng cấp** | Chuyển đổi giữa các vị trí tương đương (cùng/phòng khác) |
| **Thăng chức** | Lên vị trí cao hơn khi đạt tiêu chí |
| **Hạ cấp** | Xuống vị trí thấp hơn khi không đáp ứng yêu cầu sau đào tạo, nhắc nhở |
| **Khác bộ phận** | Chuyển sang bộ phận khác do tái cấu trúc hoặc nguyện vọng cá nhân |

### 8.2 Bàn giao khách hàng khi luân chuyển

Nhân sự luân chuyển có trách nhiệm:
- Bàn giao đầy đủ hồ sơ, thông tin tình trạng, lịch sử giao dịch, cam kết, deal đang xử lý
- Không tự ý giữ liên hệ riêng tư, khai thác ngoài luồng với KH đã bàn giao
- Không được tự ý trì hoãn hoặc từ chối bàn giao

### 8.3 Quy trình bàn giao khách hàng

```
① Lập Biên bản Bàn giao Khách hàng:
   - Danh sách khách hàng
   - Tình trạng hiện tại
   - Các deal đang xử lý
   - Các lưu ý đặc biệt

② Ký xác nhận 3 bên:
   - Người bàn giao
   - Người nhận bàn giao
   - Quản lý trực tiếp

③ Cập nhật CRM + Lưu vào hồ sơ nhân sự
```

### 8.4 Hành vi bị nghiêm cấm khi luân chuyển

| Hành vi | Chế tài |
|---------|---------|
| Ôm khách, chiếm đoạt KH công ty để làm việc riêng/kinh doanh ngoài | Kỷ luật → Sa thải + Bồi thường |
| Gây khó khăn, cản trở bàn giao | Kỷ luật + Phạt tài chính |
| Không bàn giao đầy đủ, gây thất thoát | Bồi thường thiệt hại + Kỷ luật |

---

## 9. METRICS & BÁO CÁO

### 8.1 Monitoring

| Metric | Target | Frequency |
|--------|:------:|-----------|
| Time to first contact | < 24h (95% leads) | Daily |
| Lead distribution balance | Không NVKD > 150% average | Weekly |
| Conflict rate | < 2% | Monthly |
| Recycle rate | < 10% | Monthly |
| Reassignment rate | Track | Weekly |

### 8.2 CRM Fields Required

```
LEAD RECORD:
├── Source (Nguồn)
├── Region (Khu vực)
├── Industry (Ngành)
├── Owner (NVKD phụ trách)
├── Assigned Date
├── First Contact Date
├── Status
├── Last Activity
└── Notes
```

---

## 10. AUTOMATION RULES

| Rule | Trigger | Action |
|------|---------|--------|
| Auto-assign by region | New lead có địa chỉ | Assign cho NVKD phụ trách region |
| Alert if no follow-up | 24h không có activity | Alert cho NVKD + TP |
| Auto-reassign | 72h không có activity | Move về pool, notify TP |
| Capacity check | Before assign | Verify NVKD capacity |

---

## 11. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Sales Coordinator: TP Team hoặc person được assign
- Review định kỳ: **Monthly**
- Điều chỉnh: **Quarterly**
- Owner: Sales Manager + Marketing Manager + GDKD

---

*Version 1.2 | 09/05/2026 | Owner: Sales Manager + Marketing Manager + GDKD*
