# QUẢN LÝ BẢO HIỂM HÀNG HÓA (Cargo Insurance Management)

> **Policy Nội bộ** — Dành cho NVKD, Operations, Finance, TP, GDKD
> **Policy KH tương ứng:** `customer/insurance-policy.md`
> Ngày ban hành: 08/05/2026 | Phiên bản: 1.0

---

## 1. TỔNG QUAN

### 1.1 Mục đích
- Chuẩn hóa quy trình tư vấn, bán và xử lý bảo hiểm hàng hóa
- Quản lý rủi ro tài chính từ hàng hóa hư hỏng/mất mát
- Đảm bảo quyền lợi KH và ERK khi có sự cố

### 1.2 Phạm vi

Chỉ áp dụng với **hàng hóa đóng gói từ kho của Eureka**. Hàng FCL/LCL từ NCC gửi thẳng KH không thuộc phạm vi bảo hiểm.

### 1.3 KPI 2026

| Metric | Target |
|--------|:------:|
| Tỷ lệ đơn mua bảo hiểm | ≥ 60% |
| Thời gian xử lý claim ≤ 15 ngày | ≥ 95% |
| Tỷ lệ claim được duyệt | ≥ 85% |
| Giá trị bồi thường / Tổng phí BH (Loss Ratio) | < 60% |

---

## 2. ĐỐI TÁC BẢO HIỂM

| Đối tác | Loại hình | Phạm vi |
|---------|-----------|---------|
| Bảo hiểm Bảo Việt | Hàng hóa đường bộ + biển | Trung Quốc → Việt Nam |
| Bảo hiểm PVI | Hàng hóa đường bộ + biển | Trung Quốc → Việt Nam |
| Bảo hiểm BIDV (BIC) | Hàng không | Toàn tuyến |

> **Nguyên tắc:** Luôn có ≥ 2 đối tác để so sánh và đảm bảo cạnh tranh.

---

## 3. BIỂU PHÍ BẢO HIỂM

| Loại hàng | Tỷ lệ phí BH | Ví dụ mặt hàng |
|-----------|:-----------:|----------------|
| Hàng dễ vỡ | 2 | Gốm sứ, kính, điện tử, đồng hồ, máy móc |
| Hàng đặc biệt | 4.5% | Pin, hóa chất, chất lỏng |

```
Phí BH = Giá trị khai báo × Tỷ lệ theo loại hàng
Phí BH tối thiểu: 50.000đ / đơn
```

> **Không phụ phí theo tuyến đường.** Chỉ phân biệt theo loại hàng hóa.

---

## 4. MỐI LIÊN HỆ VỚI PHÍ PHÒNG TRỪ RỦI RO

ERK đã thu **Phí phòng trừ rủi ro** (1% trên phần giá trị vượt 100 triệu/m³) từ tất cả đơn hàng — đây là quỹ dự phòng nội bộ, khác với bảo hiểm hàng hóa.

| Cơ chế | Bản chất | Bắt buộc? |
|--------|----------|:---------:|
| **Phí phòng trừ rủi ro** | Quỹ nội bộ ERK, xử lý sự cố nhỏ | Tự động nếu giá trị > 100tr/m³ |
| **Bảo hiểm hàng hóa** | Hợp đồng với đối tác BH bên ngoài | Tự nguyện |

> **Không bắt buộc KH mua bảo hiểm.** NVKD tư vấn và KH tự quyết định. Phí phòng trừ rủi ro đã là lớp bảo vệ cơ bản cho hàng giá trị cao.

---

## 5. QUY TRÌNH BÁN BẢO HIỂM

```
① TƯ VẤN: NVKD giới thiệu bảo hiểm khi KH gửi đơn
② KHAI BÁO: KH khai báo giá trị hàng hóa
③ TÍNH PHÍ: NVKD tính phí BH theo biểu phí
④ XÁC NHẬN: KH đồng ý → cộng phí BH vào hóa đơn
⑤ CẤP CHỨNG NHẬN: Gửi KH qua email/Zalo
⑥ LƯU HỒ SƠ: Lưu vào CRM
```

---

## 6. QUY TRÌNH XỬ LÝ CLAIM

```
① TIẾP NHẬN: KH báo sự cố → NVKD/CSKH ghi nhận
② THU THẬP BẰNG CHỨNG:
   □ Video dỡ hàng A-Z
   □ Hình ảnh hư hỏng chi tiết
   □ Biên bản ghi nhận (có chữ ký KH + NV giao)
   □ Hóa đơn / Tờ khai giá trị hàng
   □ Vận đơn / Bill of Lading
③ LẬP HỒ SƠ CLAIM: Operations tổng hợp → gửi đối tác BH
④ THEO DÕI: Operations follow-up định kỳ 3 ngày/lần
⑤ KẾT QUẢ: BH duyệt → Finance nhận tiền → chuyển KH
⑥ ĐÓNG CLAIM: Lưu hồ sơ + cập nhật CRM
```

---

## 7. SLA XỬ LÝ CLAIM

| Giai đoạn | SLA | Owner |
|-----------|:---:|-------|
| Tiếp nhận → Lập hồ sơ | 24h | Operations |
| Gửi hồ sơ lên BH | 48h | Operations |
| BH phản hồi kết quả | 7-15 ngày | Đối tác BH |
| Chi trả cho KH (sau khi BH duyệt) | 48h | Finance |

---

## 8. PHÊ DUYỆT & ỦY QUYỀN

| Hành động | Thẩm quyền |
|-----------|-----------|
| Bán BH ≤ 200 triệu | NVKD |
| Bán BH 200-500 triệu | TP |
| Bán BH > 500 triệu | GDKD |
| Ký hồ sơ claim | Operations Manager |
| Duyệt chi bồi thường (phần ERK chịu) | GDKD + Finance |

---

## 9. BÁO CÁO & GIÁM SÁT

| Báo cáo | Nội dung | Tần suất |
|---------|----------|----------|
| Claim log | Danh sách claim đang xử lý | Weekly |
| Loss ratio | Tỷ lệ bồi thường / phí thu | Monthly |
| BH penetration | Tỷ lệ đơn mua BH | Monthly |
| Top rủi ro | Mặt hàng, KH có claim nhiều | Quarterly |

---

## 10. CẢNH BÁO & ESCALATION

| Trigger | Action |
|---------|--------|
| Claim > 15 ngày chưa giải quyết | Escalate lên đối tác BH + TP |
| Claim bị từ chối | Legal review + GDKD quyết định |
| Loss ratio > 60% (3 tháng liên tiếp) | Review biểu phí + đối tác BH |

---

## 11. CRM FIELDS

```
INSURANCE RECORD:
├── Mã đơn hàng
├── Mã KH
├── Loại hàng (Thường / Dễ vỡ / Đặc biệt)
├── Giá trị khai báo
├── Phí BH
├── Mã số chứng nhận BH
├── Đối tác BH
├── Trạng thái claim (None / Pending / Approved / Rejected / Paid)
├── Ngày claim
├── Ngày giải quyết
├── Số tiền bồi thường
└── Ghi chú
```

---

## 12. ĐIỀU KHOẢN THI HÀNH

- Có hiệu lực từ **08/05/2026**
- Training: Tất cả NVKD + Operations + Finance
- Review định kỳ: **Quarterly**
- Owner: Operations Manager + Finance + GDKD

---

*Version 1.0 | 08/05/2026 | Owner: Operations + Finance + GDKD*
