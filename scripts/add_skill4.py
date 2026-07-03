# -*- coding: utf-8 -*-
import io

filepath = r"d:\AI AGENT THUY\AI agent Kinh doanh\agents\05_conformity_assessor.md"

new_skill_content = u"""### 📌 KỸ NĂNG 4: TƯ VẤN CÁC PHƯƠNG THỨC ĐÁNH GIÁ SỰ PHÙ HỢP (PT1 ĐẾN PT8) THEO THÔNG TƯ 14/2026/TT-BKHCN

Khi khách hàng hỏi về các phương thức đánh giá sự phù hợp hoặc cách lựa chọn phương thức tối ưu cho sản phẩm, bạn phải giải thích rõ ràng 8 phương thức theo quy định của Thông tư số 14/2026/TT-BKHCN như sau:

#### 1. Chi tiết 8 Phương thức đánh giá sự phù hợp
- **Phương thức 1: Thử nghiệm mẫu điển hình**
  * *Nội dung*: Chỉ thực hiện thử nghiệm một hoặc nhiều mẫu đại diện (mẫu điển hình) của sản phẩm để đánh giá chất lượng. Không đánh giá quy trình sản xuất của nhà máy.
  * *Thời hạn chứng nhận/công bố*: Hiệu lực tối đa 01 năm hoặc chỉ có giá trị đối với mẫu được thử nghiệm.
- **Phương thức 2: Thử nghiệm mẫu điển hình kết hợp đánh giá quá trình sản xuất; giám sát thông qua thử nghiệm mẫu lấy trên thị trường**
  * *Nội dung*: Thử nghiệm mẫu điển hình kết hợp đánh giá thực tế nhà máy sản xuất. Việc giám sát chất lượng định kỳ thực hiện bằng cách lấy mẫu ngẫu nhiên từ thị trường tự do về để thử nghiệm.
  * *Thời hạn chứng nhận/công bố*: Hiệu lực tối đa 03 năm.
- **Phương thức 3: Thử nghiệm mẫu điển hình kết hợp đánh giá quá trình sản xuất; giám sát thông qua thử nghiệm mẫu lấy tại nơi sản xuất kết hợp với đánh giá quá trình sản xuất**
  * *Nội dung*: Thử nghiệm mẫu kết hợp đánh giá nhà máy. Giám sát định kỳ bằng cách kiểm tra thực tế xưởng sản xuất và lấy mẫu ngay tại kho sản xuất để thử nghiệm.
  * *Thời hạn chứng nhận/công bố*: Hiệu lực tối đa 03 năm.
- **Phương thức 4: Thử nghiệm mẫu điển hình kết hợp đánh giá quá trình sản xuất; giám sát thông qua thử nghiệm mẫu lấy tại nơi sản xuất và trên thị trường kết hợp với đánh giá quá trình sản xuất**
  * *Nội dung*: Thử nghiệm kết hợp đánh giá nhà máy. Giám sát kép bằng cách lấy mẫu thử nghiệm ở cả nơi sản xuất và trên thị trường tiêu dùng.
  * *Thời hạn chứng nhận/công bố*: Hiệu lực tối đa 03 năm.
- **Phương thức 5: Thử nghiệm mẫu điển hình và đánh giá quá trình sản xuất; giám sát thông qua thử nghiệm mẫu lấy tại nơi sản xuất hoặc trên thị trường kết hợp với đánh giá quá trình sản xuất**
  * *Nội dung*: Phương thức kiểm soát toàn diện và chặt chẽ nhất đối với hàng sản xuất hàng loạt. Đánh giá kỹ lưỡng hệ thống kiểm soát chất lượng nhà máy (như ISO 9001) và thử nghiệm mẫu điển hình. Giám sát hàng năm bằng việc audit lại nhà máy và lấy mẫu ngẫu nhiên tại xưởng hoặc ngoài thị trường để test lại.
  * *Thời hạn chứng nhận/công bố*: Hiệu lực tối đa 03 năm.
- **Phương thức 6: Đánh giá và giám sát hệ thống quản lý**
  * *Nội dung*: Chỉ tập trung đánh giá, chứng nhận hệ thống quản lý chất lượng (ví dụ QMS). Không thử nghiệm mẫu sản phẩm trực tiếp (hoặc chỉ áp dụng khi mẫu sản phẩm không thể lấy để thử nghiệm phá hủy).
  * *Thời hạn chứng nhận/công bố*: Hiệu lực tối đa 03 năm.
- **Phương thức 7: Thử nghiệm và đánh giá lô sản phẩm, hàng hóa**
  * *Nội dung*: Lấy mẫu ngẫu nhiên theo phương pháp thống kê từ một lô hàng cụ thể để thử nghiệm chất lượng. Không đánh giá hệ thống sản xuất của nhà máy và không thực hiện giám sát sau đó.
  * *Thời hạn chứng nhận/công bố*: Giấy chứng nhận hợp quy chỉ có giá trị duy nhất đối với lô sản phẩm, hàng hóa cụ thể đó. Không ghi thời hạn hiệu lực theo năm.
- **Phương thức 8: Thử nghiệm hoặc kiểm định toàn bộ sản phẩm, hàng hóa**
  * *Nội dung*: Thực hiện thử nghiệm hoặc kiểm định chất lượng đối với 100% số lượng sản phẩm trong lô hàng. Thường áp dụng cho các thiết bị riêng lẻ, đơn chiếc có độ an toàn và giá trị cực cao.
  * *Thời hạn chứng nhận/công bố*: Chỉ có hiệu lực đối với từng sản phẩm cụ thể đã được kiểm định thành công.

#### 2. Bảng so sánh 8 Phương thức theo các tiêu chí cốt lõi

| Tiêu chí | PT 1 | PT 2 | PT 3 | PT 4 | PT 5 (Phổ biến) | PT 6 | PT 7 (Nhập lô) | PT 8 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Đánh giá nhà máy** | Không | Có | Có | Có | Có (Chặt chẽ) | Có (QMS) | Không | Không |
| **Lấy mẫu giám sát** | Không | Trên thị trường | Nơi sản xuất | Cả 2 nơi | Nơi SX hoặc thị trường | Không | Không | Không |
| **Thử nghiệm sản phẩm** | Mẫu điển hình | Mẫu điển hình | Mẫu điển hình | Mẫu điển hình | Mẫu điển hình | Không (chỉ đánh giá HT) | Theo lô thống kê | 100% sản phẩm |
| **Thời hạn hiệu lực** | Max 1 năm | Max 3 năm | Max 3 năm | Max 3 năm | Max 3 năm | Max 3 năm | Theo lô hàng cụ thể | Theo sản phẩm cụ thể |
| **Bên thực hiện đánh giá** | DN tự đánh giá hoặc TCCN | Tổ chức chứng nhận | Tổ chức chứng nhận | Tổ chức chứng nhận | Tổ chức chứng nhận | Tổ chức chứng nhận | DN tự đánh giá hoặc TCCN | Tổ chức kiểm định/chứng nhận |
| **Phù hợp nhất cho** | Hàng nhập lẻ ổn định thấp, DN tự công bố. | Hàng nội địa lưu thông thị trường lớn. | Hàng SX trong nước phân phối đại lý. | Hàng rủi ro cao, phân phối toàn quốc. | Hàng Nhóm 2 nhập khẩu ổn định, SX hàng loạt lớn. | Dịch vụ, phần mềm, hàng không lấy mẫu. | Lô hàng nhập khẩu đơn chiếc, hàng đi theo chuyến. | Thiết bị nâng, bình khí nén, nồi hơi giá trị lớn. |

---
"""

with io.open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target_anchor = u"## 🤖 CHỈ DẪN TRA CỨU TỰ ĐỘNG CHO AGENT 5"

if target_anchor in content:
    replacement = new_skill_content + u"\n\n" + target_anchor
    content = content.replace(target_anchor, replacement)
    print("SUCCESSFULLY INSERTED SKILL 4")
else:
    print("COULD NOT FIND ANCHOR")

with io.open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
