import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_excel_workbook():
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet

    # Color Palette Definitions
    NAVY = '1B365D'
    BLUE_HEADER = '2C3E50'
    TEAL_HEADER = '0D5C75'
    ACCENT_LIGHT = 'F2F4F7'
    ACCENT_SUB = 'D9E1F2'
    YELLOW_SUMMARY = 'FFF2CC'
    GREEN_KPI = 'E2EFDA'
    GRAY_BORDER = 'D9D9D9'
    FORMULA_COLOR = '0D5C75'

    # Fonts
    font_title = Font(name='Segoe UI', size=15, bold=True, color='FFFFFF')
    font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='E0E6ED')
    font_sec_header = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
    font_table_header = Font(name='Segoe UI', size=9, bold=True, color='FFFFFF')
    font_bold = Font(name='Segoe UI', size=9.5, bold=True)
    font_regular = Font(name='Segoe UI', size=9.5)
    font_italic = Font(name='Segoe UI', size=9, italic=True)
    font_formula = Font(name='Consolas', size=9, italic=True, color=FORMULA_COLOR)

    # Fills
    fill_navy = PatternFill(start_color=NAVY, end_color=NAVY, fill_type='solid')
    fill_blue_hdr = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
    fill_teal_hdr = PatternFill(start_color=TEAL_HEADER, end_color=TEAL_HEADER, fill_type='solid')
    fill_accent_sub = PatternFill(start_color=ACCENT_SUB, end_color=ACCENT_SUB, fill_type='solid')
    fill_summary = PatternFill(start_color=YELLOW_SUMMARY, end_color=YELLOW_SUMMARY, fill_type='solid')
    fill_kpi = PatternFill(start_color=GREEN_KPI, end_color=GREEN_KPI, fill_type='solid')
    fill_light_gray = PatternFill(start_color=ACCENT_LIGHT, end_color=ACCENT_LIGHT, fill_type='solid')

    # Borders
    thin_side = Side(border_style='thin', color=GRAY_BORDER)
    double_bottom = Side(border_style='double', color=NAVY)
    thick_top = Side(border_style='medium', color=NAVY)

    border_cell = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)
    border_total = Border(top=thin_side, bottom=double_bottom, left=thin_side, right=thin_side)
    border_box = Border(left=thin_side, right=thin_side, top=thick_top, bottom=double_bottom)

    # Alignments
    align_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    align_left = Alignment(horizontal='left', vertical='center', wrap_text=True)
    align_right = Alignment(horizontal='right', vertical='center')

    # Number Formats
    FMT_VND = '#,##0 "₫"'
    FMT_NUM = '#,##0'
    FMT_USD = '$#,##0.00'
    FMT_RMB = '¥#,##0.00'
    FMT_PCT = '0.00%'
    FMT_INT_PCT = '0%'

    # =========================================================================
    # TAB 1: 01_Tong_Quan_He_Thong_1_So
    # =========================================================================
    ws1 = wb.create_sheet(title='01_Tong_Quan_He_Thong_1_So')
    ws1.views.sheetView[0].showGridLines = True

    # Title Block
    ws1.merge_cells('A1:E2')
    ws1['A1'] = 'BẢNG PHÂN TÍCH HỆ THỐNG TÍNH GIÁ & PHÂN BỔ 1 SỔ (EUREKA LOGISTICS)'
    ws1['A1'].font = font_title
    ws1['A1'].fill = fill_navy
    ws1['A1'].alignment = align_center

    ws1['A3'] = 'Tài liệu dành cho Kế toán: Phân tích Chi tiết Công thức, Cơ chế Phân bổ và Quy trình Hạch toán'
    ws1['A3'].font = Font(name='Segoe UI', size=10.5, bold=True, color=NAVY)

    # Overview text
    ws1['A5'] = '1. NGUYÊN TẮC PHÂN BỔ HỆ THỐNG 1 SỔ (EUREKA LOGISTICS)'
    ws1['A5'].font = Font(name='Segoe UI', size=11, bold=True, color=BLUE_HEADER)

    principles = [
        ('Mục tiêu Kế toán:', 'Tự động phân bổ chi phí cước vận chuyển quốc tế/nội địa, phí dịch vụ logistics, thuế hải quan cửa khẩu và VAT vào từng dòng sản phẩm nhập khẩu.'),
        ('Cơ chế 1 Sổ:', 'Hợp nhất toàn bộ dòng tiền mua hàng, cước VC, phí dịch vụ, thuế trực tiếp tại cửa khẩu và thuế VAT thành 1 bảng phân bổ duy nhất để xác định Giá thành Nhập kho và Doanh thu Xuất hóa đơn.'),
        ('Nguyên tắc Phân bổ C1:', 'Đa số các khoản phí (Cước VC, Phí Rủi ro, Phí Khác TQ/VN, Phí NĐ) được phân bổ theo TỶ LỆ GIÁ TRỊ HÀNG C1 (Ratio = C1_i / Tổng C1).'),
        ('Đặc thù Phí UT LCL:', 'Phí ủy thác hàng LCL phân bổ CHIA ĐỀU cho từng dòng mặt hàng (C3 = Tổng Phí UT / Số lượng mục hàng). Đối với FCL phân bổ theo C1.'),
        ('Đặc thù Phí Rủi Ro:', 'Phí Rủi ro (1%) chỉ áp dụng khi trị giá lô hàng vượt ngưỡng tiêu chuẩn (K × 100 triệu VND) và ĐƯỢC LOẠI BỎ KHỎI GIÁ CIF để tính thuế hải quan!')
    ]

    for r_idx, (label, val) in enumerate(principles, start=6):
        ws1.cell(row=r_idx, column=1, value=label).font = font_bold
        ws1.cell(row=r_idx, column=2, value=val).font = font_regular

    ws1['A12'] = '2. MA TRẬN CỘT THUẬT NGỮ & CÔNG THỨC CHUẨN KẾ TOÁN (C1 ĐẾN C17)'
    ws1['A12'].font = Font(name='Segoe UI', size=11, bold=True, color=BLUE_HEADER)

    # Terminology Table Header
    headers1 = ['Mã Cột', 'Tên Chỉ Tiêu / Thuật Ngữ', 'Mô Tả Ý Nghĩa Kế Toán', 'Công Thức Tính Toán Chi Tiết', 'Ghi Chú Phân Bổ']
    ws1.row_dimensions[13].height = 25
    for c_idx, h in enumerate(headers1, start=1):
        cell = ws1.cell(row=13, column=c_idx, value=h)
        cell.font = font_table_header
        cell.fill = fill_blue_hdr
        cell.alignment = align_center
        cell.border = border_cell

    terms_data = [
        ('C1', 'Giá trị hàng gốc (VND)', 'Trị giá hàng mua gốc tính bằng VND', 'C1 = Số lượng × Đơn giá RMB × Tỷ giá RMB', 'Đầu vào chính tính tỷ lệ phân bổ ratio_i = C1_i / Tổng C1'),
        ('C2', 'Cước VC TQ-VN (VND)', 'Tổng cước VC từ TQ về VN (đã trừ chiết khấu VIP)', 'C2 = (Tổng Cước VC - Chiết khấu VIP) × (C1 / Tổng C1)', 'Phân bổ theo tỷ lệ trị giá C1'),
        ('C3', 'Phí ủy thác (VND)', 'Phí dịch vụ ủy thác nhập khẩu', 'LCL: C3 = Tổng Phí UT / Số mục hàng (Chia đều)\nFCL: C3 = Tổng Phí UT × (C1 / Tổng C1)', 'LCL chia đều theo dòng hàng; FCL phân bổ theo C1'),
        ('C4', 'Phí rủi ro 1% (VND)', 'Phí bảo hiểm hàng hóa vượt ngưỡng tiêu chuẩn', 'C4 = Tổng Phí RR × (C1 / Tổng C1)\n[Phí RR = 1% × max(0, Trị giá - K×100tr)]', 'Phân bổ theo C1. Chú ý: LOẠI BỎ khỏi CIF!'),
        ('C5', 'Phí khác TQ/VN (VND)', 'Phí thủ tục, bốc xếp chặng TQ/VN', 'C5 = Tổng Phí Khác × (C1 / Tổng C1)', 'Phân bổ theo tỷ lệ trị giá C1'),
        ('C6', 'Phí VC TQ (Quốc tế)', 'Cước chặng quốc tế TQ (căn cứ tính CIF)', 'C6 = Tổng Phí VC TQ × (C1 / Tổng C1)\n[QC: 1tr/m³, BT: 700k/m³]', 'Phân bổ theo tỷ lệ trị giá C1'),
        ('C7', 'Phí VC VN (Nội địa)', 'Cước vận chuyển chặng nội địa Việt Nam', 'C7 = C2 - C6', 'Chênh lệch giữa C2 và C6'),
        ('C8', 'Phí khác VN (VND)', 'Các chi phí thủ tục bổ sung tại VN', 'C8 = Tổng Phí Khác VN × (C1 / Tổng C1)', 'Phân bổ theo tỷ lệ trị giá C1'),
        ('C9', 'Giá CIF / DAP (VND)', 'Trị giá hải quan làm căn cứ tính Thuế NK', 'C9 = C1 + C3 + C5 + C6 (Loại bỏ C4 Phí rủi ro)', 'Giá cơ sở tính Thuế NK & Thuế Khác'),
        ('C10', 'Thuế NK (%)', 'Tỷ lệ thuế nhập khẩu theo mã HS', 'Tra cứu Biểu thuế XK-NK theo mã HS', 'Căn cứ theo mã HS từng dòng hàng'),
        ('C11', 'Thuế Khác (%)', 'Tỷ lệ Thuế TTĐB, Thuế BVMT (nếu có)', 'Tra cứu quy định thuế chuyên ngành', 'Áp dụng trên (CIF + Thuế NK)'),
        ('C12/C13', 'Thuế trực tiếp (VND)', 'Tổng thuế nộp tại cửa khẩu hải quan (chưa VAT)', 'Thuế TT = CIF × Thuế NK + (CIF + CIF×Thuế NK) × Thuế Khác', 'Bút toán: Nợ 1561 / Có 3333, 3332'),
        ('C13/C14', 'Tiền thuế VAT (VND)', 'Tổng Thuế VAT đầu vào nộp cửa khẩu & dịch vụ', 'VAT = (Thuế TT + CIF) × VAT% + (Phí NĐ VN + Phí RR) × VAT%', 'Bút toán: Nợ 1331 / Có 33312, 331'),
        ('C14/C15', 'Tổng CP chưa VAT (VND)', 'Giá thành nhập kho thực tế của hàng hóa', 'C15 = C2 + C3 + C4 + C5 + C8 + Thuế Trực Tiếp', 'Bút toán: Nợ 1561 (Hàng hóa nhập kho)'),
        ('C15/C16', 'Doanh thu xuất HĐ (đã VAT)', 'Tổng giá trị hóa đơn tài chính xuất cho khách', 'C16 = VAT / VAT% + VAT (với VAT > 0)', 'Bút toán: Nợ 131 / Có 511, 33311'),
        ('C16/C17', 'Số tiền chuyển thêm (VND)', 'Khoản tiền khách thanh toán thêm ngoài giá mua hàng', 'C17 = C16 - C1', 'Dòng tiền chênh lệch khách chuyển thêm'),
    ]

    for idx, row in enumerate(terms_data, start=14):
        ws1.row_dimensions[idx].height = 26
        ws1.cell(row=idx, column=1, value=row[0]).alignment = align_center
        ws1.cell(row=idx, column=1).font = font_bold
        ws1.cell(row=idx, column=2, value=row[1]).font = font_bold
        ws1.cell(row=idx, column=3, value=row[2]).font = font_regular
        ws1.cell(row=idx, column=4, value=row[3]).font = font_formula
        ws1.cell(row=idx, column=5, value=row[4]).font = font_regular
        for c in range(1, 6):
            ws1.cell(row=idx, column=c).border = border_cell
            if c in [1, 2]:
                ws1.cell(row=idx, column=c).fill = fill_accent_sub

    # Tariff Config Table
    ws1['A31'] = '3. BẢNG CẤU HÌNH ĐƠN GIÁ ĐỊNH MỨC HỆ THỐNG (SYSTEM TARIFFS)'
    ws1['A31'].font = Font(name='Segoe UI', size=11, bold=True, color=BLUE_HEADER)

    ws1.merge_cells('A32:B32')
    ws1['A32'] = 'Chỉ Tiêu Định Mức'
    ws1['A32'].font = font_table_header
    ws1['A32'].fill = fill_teal_hdr
    ws1['A32'].alignment = align_center

    ws1['C32'] = 'Giá Trị Mặc Định'
    ws1['C32'].font = font_table_header
    ws1['C32'].fill = fill_teal_hdr
    ws1['C32'].alignment = align_center

    ws1['D32'] = 'Đơn Vị Tính'
    ws1['D32'].font = font_table_header
    ws1['D32'].fill = fill_teal_hdr
    ws1['D32'].alignment = align_center

    ws1['E32'] = 'Ghi Chú Kế Toán'
    ws1['E32'].font = font_table_header
    ws1['E32'].fill = fill_teal_hdr
    ws1['E32'].alignment = align_center

    tariffs = [
        ('Cước quốc tế Quảng Châu', 1000000, 'VND/m³', 'Đơn giá định mức chặng quốc tế QC'),
        ('Cước quốc tế Bằng Tường', 700000, 'VND/m³', 'Đơn giá định mức chặng quốc tế BT'),
        ('Phí Ủy thác gốc (LCL Base)', 400000, 'VND/mục', 'Mức phí UT định mức gốc cho 1 mặt hàng (400k/mục)'),
        ('Ngưỡng Bảo hiểm Tiêu chuẩn', 100000000, 'VND/K (m³)', 'Ngưỡng miễn phí rủi ro (K × 100 triệu)'),
        ('Tỷ lệ Phí Rủi Ro', 0.01, '%', '1% trên giá trị hàng vượt ngưỡng BH'),
        ('Hạng VIP Discount - Basic', 0.00, '%', 'Chiết khấu cước quốc tế 0%'),
        ('Hạng VIP Discount - Pro', 0.10, '%', 'Chiết khấu cước quốc tế 10%'),
        ('Hạng VIP Discount - Premium', 0.20, '%', 'Chiết khấu cước quốc tế 20%'),
        ('Hạng VIP Discount - Elite', 0.30, '%', 'Chiết khấu cước quốc tế 30%'),
    ]

    for idx, (name, val, unit, note) in enumerate(tariffs, start=33):
        ws1.row_dimensions[idx].height = 20
        ws1.merge_cells(start_row=idx, start_column=1, end_row=idx, end_column=2)
        ws1.cell(row=idx, column=1, value=name).font = font_bold
        c_val = ws1.cell(row=idx, column=3, value=val)
        c_val.font = font_bold
        if 'VND' in unit:
            c_val.number_format = FMT_VND
        elif '%' in unit:
            c_val.number_format = FMT_INT_PCT
        else:
            c_val.number_format = FMT_NUM
        c_val.alignment = align_right

        ws1.cell(row=idx, column=4, value=unit).font = font_regular
        ws1.cell(row=idx, column=4).alignment = align_center
        ws1.cell(row=idx, column=5, value=note).font = font_regular

        for c in range(1, 6):
            ws1.cell(row=idx, column=c).border = border_cell

    # =========================================================================
    # TAB 2: 02_Mo_Hinh_LCL_Hang_Gom
    # =========================================================================
    ws2 = wb.create_sheet(title='02_Mo_Hinh_LCL_Hang_Gom')
    ws2.views.sheetView[0].showGridLines = True

    # Title Block
    ws2.merge_cells('A1:Z2')
    ws2['A1'] = 'MÔ HÌNH TÍNH GIÁ & PHÂN BỔ CHI PHÍ HÀNG GOM CONT (LCL)'
    ws2['A1'].font = font_title
    ws2['A1'].fill = fill_navy
    ws2['A1'].alignment = align_center

    ws2['A3'] = 'Bảng phân bổ chi phí chi tiết từng mặt hàng LCL (C1 đến C17) tích hợp Công thức Excel Động'
    ws2['A3'].font = Font(name='Segoe UI', size=10, italic=True, color=NAVY)

    # Section A: Header Inputs
    ws2.merge_cells('A5:E5')
    ws2['A5'] = 'A. THAM SỐ THÔNG TIN LÔ HÀNG LCL (HEADER INPUTS)'
    ws2['A5'].font = font_sec_header
    ws2['A5'].fill = fill_blue_hdr
    ws2['A5'].alignment = align_left

    lcl_inputs = [
        ('Tỷ giá USD/VND', 25400, FMT_VND, 'USD Rate'),
        ('Tỷ giá RMB/VND', 3600, FMT_VND, 'RMB Rate'),
        ('Thể tích thực tế (CBM / m³)', 2.5, FMT_NUM, 'Volume (m³)'),
        ('Trọng lượng thực tế (kg)', 400, FMT_NUM, 'Weight (kg)'),
        ('Khối lượng quy đổi K (m³)', '=MAX(B8, B9/250)', FMT_NUM, 'K = max(CBM, kg/250)'),
        ('Kho nhận TQ', 'Quảng Châu', None, 'Quảng Châu hoặc Bằng Tường'),
        ('Hạng VIP Khách Hàng', 'Pro', None, 'Chiết khấu VIP 10%'),
        ('Tỷ lệ Chiết khấu VIP', 0.10, FMT_INT_PCT, 'VIP Discount Rate'),
        ('Cước VC TQ-VN gốc (VND)', 5000000, FMT_VND, 'Chưa trừ chiết khấu VIP'),
        ('Chiết khấu VIP Cước (VND)', '=IF(B11="Quảng Châu", B10*1000000, B10*700000)*B13', FMT_VND, 'Discount = Cước QT × VIP%'),
        ('Cước VC TQ-VN sau CK (VND)', '=B14-B15', FMT_VND, 'Tổng cước VC đã trừ CK'),
        ('Phí Ủy thác tổng (VND)', 1200000, FMT_VND, 'LCL chia đều cho từng mục (3 mục × 400k)'),
        ('Hạn mức Bảo hiểm tiêu chuẩn (VND)', '=B10*100000000', FMT_VND, 'K × 100 triệu VND'),
        ('Tổng trị giá mua gốc lô hàng (VND)', '=SUM(G27:G29)', FMT_VND, 'Tổng C1 của lô hàng'),
        ('Phí Rủi ro 1% (VND)', '=IF(B19>B18, (B19-B18)*0.01, 0)', FMT_VND, '1% trên trị giá vượt ngưỡng'),
        ('Phí khác TQ (VND)', 600000, FMT_VND, 'Phí thủ tục chặng TQ'),
        ('Phí VC TQ (Quốc tế) (VND)', '=IF(B11="Quảng Châu", B10*1000000, B10*700000)', FMT_VND, 'QC: 1tr/m³, BT: 700k/m³'),
        ('Phí VC VN (Nội địa) (VND)', '=B16-B22', FMT_VND, 'Chênh lệch Cước VC - Phí QT'),
        ('Phí khác VN (VND)', 300000, FMT_VND, 'Phí phụ trợ chặng VN'),
    ]

    for idx, (label, val, fmt, note) in enumerate(lcl_inputs, start=6):
        ws2.row_dimensions[idx].height = 19
        ws2.cell(row=idx, column=1, value=label).font = font_bold
        c_val = ws2.cell(row=idx, column=2, value=val)
        c_val.font = font_bold if str(val).startswith('=') else font_regular
        if fmt:
            c_val.number_format = fmt
        c_val.alignment = align_right if fmt else align_left
        ws2.cell(row=idx, column=3, value=note).font = font_italic
        for c in range(1, 4):
            ws2.cell(row=idx, column=c).border = border_cell
            if idx in [10, 15, 16, 20, 22, 23]:
                ws2.cell(row=idx, column=c).fill = fill_accent_sub

    # Section B: Line Items Table
    ws2.merge_cells('A25:Z25')
    ws2['A25'] = 'B. BẢNG PHÂN BỔ CHI TIẾT TỪNG MẶT HÀNG LCL (LINE ITEMS ALLOCATION TABLE)'
    ws2['A25'].font = font_sec_header
    ws2['A25'].fill = fill_navy
    ws2['A25'].alignment = align_left

    table_headers_lcl = [
        'STT', 'Tên Mặt Hàng', 'Số Lượng', 'Đơn Giá (RMB)', 'Tổng Giá Trị (RMB)', 'Tỷ Giá RMB',
        '(C1) Trị Giá Hàng (VND)', 'Tỷ Lệ Phân Bổ (Ratio)', '(C2) Cước VC TQ-VN', '(C3) Phí Ủy Thác',
        '(C4) Phí Rủi Ro', '(C5) Phí Khác TQ', '(C6) Phí VC TQ (QT)', '(C7) Phí VC VN (NĐ)',
        '(C8) Phí Khác VN', '(C9) Giá CIF/DAP', '(C10) Thuế NK (%)', '(C11) Thuế Khác (%)',
        '(C12) VAT (%)', '(C13) Thuế Trực Tiếp', '(C14) Tiền Thuế VAT', '(C15) Tổng CP Chưa VAT',
        '(C16) Xuất HĐ (Đã VAT)', '(C17) Khách Chuyển Thêm', 'Đơn Giá DAP ($)', 'Đơn Giá Xuất HĐ'
    ]

    ws2.row_dimensions[26].height = 28
    for c_idx, h in enumerate(table_headers_lcl, start=1):
        cell = ws2.cell(row=26, column=c_idx, value=h)
        cell.font = font_table_header
        cell.fill = fill_blue_hdr
        cell.alignment = align_center
        cell.border = border_cell

    items_data_lcl = [
        (1, 'Áo thun nam Cotton', 500, 30, 0.12, 0.00, 0.08),
        (2, 'Quần Jean nữ Denim', 300, 50, 0.12, 0.00, 0.08),
        (3, 'Giày Sneaker thể thao', 200, 80, 0.15, 0.00, 0.08),
    ]

    for r_offset, (stt, name, qty, price_rmb, t_nk, t_khac, vat) in enumerate(items_data_lcl):
        row = 27 + r_offset
        ws2.row_dimensions[row].height = 22

        ws2.cell(row=row, column=1, value=stt).alignment = align_center # A: STT
        ws2.cell(row=row, column=2, value=name).alignment = align_left   # B: Name
        ws2.cell(row=row, column=3, value=qty).number_format = FMT_NUM  # C: Qty
        ws2.cell(row=row, column=4, value=price_rmb).number_format = FMT_RMB # D: Price RMB
        
        # E: Total RMB = C * D
        c_e = ws2.cell(row=row, column=5, value=f'=C{row}*D{row}')
        c_e.number_format = FMT_RMB

        # F: Rate RMB = $B$7
        c_f = ws2.cell(row=row, column=6, value=f'=$B$7')
        c_f.number_format = FMT_VND

        # G: (C1) Value VND = E * F
        c_g = ws2.cell(row=row, column=7, value=f'=E{row}*F{row}')
        c_g.number_format = FMT_VND

        # H: Ratio = G / $G$30
        c_h = ws2.cell(row=row, column=8, value=f'=G{row}/$G$30')
        c_h.number_format = FMT_PCT

        # I: (C2) Cước VC = $B$16 * H
        c_i = ws2.cell(row=row, column=9, value=f'=$B$16*H{row}')
        c_i.number_format = FMT_VND

        # J: (C3) Phí UT = $B$17 / COUNTA($B$27:$B$29) (Chia đều)
        c_j = ws2.cell(row=row, column=10, value=f'=$B$17/COUNTA($B$27:$B$29)')
        c_j.number_format = FMT_VND

        # K: (C4) Phí RR = $B$20 * H
        c_k = ws2.cell(row=row, column=11, value=f'=$B$20*H{row}')
        c_k.number_format = FMT_VND

        # L: (C5) Phí khác TQ = $B$21 * H
        c_l = ws2.cell(row=row, column=12, value=f'=$B$21*H{row}')
        c_l.number_format = FMT_VND

        # M: (C6) Phí VC TQ (QT) = $B$22 * H
        c_m = ws2.cell(row=row, column=13, value=f'=$B$22*H{row}')
        c_m.number_format = FMT_VND

        # N: (C7) Phí VC VN = I - M
        c_n = ws2.cell(row=row, column=14, value=f'=I{row}-M{row}')
        c_n.number_format = FMT_VND

        # O: (C8) Phí khác VN = $B$24 * H
        c_o = ws2.cell(row=row, column=15, value=f'=$B$24*H{row}')
        c_o.number_format = FMT_VND

        # P: (C9) Giá CIF = G + J + L + M (Loại bỏ K - Phí rủi ro)
        c_p = ws2.cell(row=row, column=16, value=f'=G{row}+J{row}+L{row}+M{row}')
        c_p.number_format = FMT_VND

        # Q: (C10) Thuế NK %
        c_q = ws2.cell(row=row, column=17, value=t_nk)
        c_q.number_format = FMT_INT_PCT

        # R: (C11) Thuế Khác %
        c_r = ws2.cell(row=row, column=18, value=t_khac)
        c_r.number_format = FMT_INT_PCT

        # S: (C12) VAT %
        c_s = ws2.cell(row=row, column=19, value=vat)
        c_s.number_format = FMT_INT_PCT

        # T: (C13) Thuế trực tiếp = P*Q + (P+P*Q)*R
        c_t = ws2.cell(row=row, column=20, value=f'=P{row}*Q{row}+(P{row}+P{row}*Q{row})*R{row}')
        c_t.number_format = FMT_VND

        # U: (C14) Tiền thuế VAT = (T+P)*S + (N+O+K)*S
        c_u = ws2.cell(row=row, column=21, value=f'=(T{row}+P{row})*S{row}+(N{row}+O{row}+K{row})*S{row}')
        c_u.number_format = FMT_VND

        # V: (C15) Tổng CP chưa VAT = I+J+K+L+O+T
        c_v = ws2.cell(row=row, column=22, value=f'=I{row}+J{row}+K{row}+L{row}+O{row}+T{row}')
        c_v.number_format = FMT_VND

        # W: (C16) Xuất HĐ (Đã VAT) = IF(S>0, (U/S)+U, 0)
        c_w = ws2.cell(row=row, column=23, value=f'=IF(S{row}>0, (U{row}/S{row})+U{row}, 0)')
        c_w.number_format = FMT_VND

        # X: (C17) Khách chuyển thêm = W - G
        c_x = ws2.cell(row=row, column=24, value=f'=W{row}-G{row}')
        c_x.number_format = FMT_VND

        # Y: Đơn giá DAP ($) = P / C / $B$6
        c_y = ws2.cell(row=row, column=25, value=f'=P{row}/C{row}/$B$6')
        c_y.number_format = FMT_USD

        # Z: Đơn giá Xuất HĐ chưa VAT = (W - U) / C
        c_z = ws2.cell(row=row, column=26, value=f'=(W{row}-U{row})/C{row}')
        c_z.number_format = FMT_VND

        for c in range(1, 27):
            ws2.cell(row=row, column=c).border = border_cell
            ws2.cell(row=row, column=c).font = font_regular

    # Row 30: Total Row LCL
    ws2.row_dimensions[30].height = 24
    ws2.cell(row=30, column=1, value='TỔNG CỘNG LÔ HÀNG').font = font_bold
    ws2.cell(row=30, column=1).alignment = align_center

    total_cols_lcl = {
        5: (FMT_RMB, '=SUM(E27:E29)'),
        7: (FMT_VND, '=SUM(G27:G29)'),
        8: (FMT_PCT, '=SUM(H27:H29)'),
        9: (FMT_VND, '=SUM(I27:I29)'),
        10: (FMT_VND, '=SUM(J27:J29)'),
        11: (FMT_VND, '=SUM(K27:K29)'),
        12: (FMT_VND, '=SUM(L27:L29)'),
        13: (FMT_VND, '=SUM(M27:M29)'),
        14: (FMT_VND, '=SUM(N27:N29)'),
        15: (FMT_VND, '=SUM(O27:O29)'),
        16: (FMT_VND, '=SUM(P27:P29)'),
        20: (FMT_VND, '=SUM(T27:T29)'),
        21: (FMT_VND, '=SUM(U27:U29)'),
        22: (FMT_VND, '=SUM(V27:V29)'),
        23: (FMT_VND, '=SUM(W27:W29)'),
        24: (FMT_VND, '=SUM(X27:X29)'),
    }

    for c in range(1, 27):
        cell = ws2.cell(row=30, column=c)
        cell.border = border_total
        cell.fill = fill_summary
        if c in total_cols_lcl:
            fmt, formula = total_cols_lcl[c]
            cell.value = formula
            cell.number_format = fmt
            cell.font = font_bold
            cell.alignment = align_right

    # Section C: Costing & Profit Metrics LCL
    ws2.merge_cells('A32:E32')
    ws2['A32'] = 'C. PHÂN TÍCH GIÁ VỐN & LỢI NHUẬN GỘP DỊCH VỤ LOGISTICS (LCL PROFIT METRICS)'
    ws2['A32'].font = font_sec_header
    ws2['A32'].fill = fill_teal_hdr
    ws2['A32'].alignment = align_left

    costing_metrics_lcl = [
        ('Cước quốc tế định mức (Base Freight Cost)', '=B22', FMT_VND, 'CBM × Đơn giá QC/BT'),
        ('Phí Ủy thác định mức (Base Trustee Cost)', '=COUNTA(B27:B29)*400000', FMT_VND, 'Số dòng mặt hàng × 400.000đ'),
        ('Phí Rủi ro định mức (Base Risk Cost)', '=B20', FMT_VND, '1% trên giá trị vượt ngưỡng BH'),
        ('Phí Khác TQ định mức (Base Other CN Cost)', '=B21', FMT_VND, 'Phí thủ tục chặng TQ'),
        ('Phí Khác VN định mức (Base Other VN Cost)', '=B24', FMT_VND, 'Phí thủ tục chặng VN'),
        ('TỔNG GIÁ VỐN DỊCH VỤ (COST PRICE / GIÁ NỀN)', '=SUM(B34:B38)', FMT_VND, 'Tổng chi phí nền của nhà xe/logistics'),
        ('TỔNG DOANH THU DỊCH VỤ (SELLING PRICE / GIÁ BÁO GIÁ)', '=B16+B17+B20+B21+B24', FMT_VND, 'Tổng cước phí thu của khách hàng'),
        ('LỢI NHUẬN GỘP DỰ KIẾN (EXPECTED PROFIT)', '=B40-B39', FMT_VND, 'Doanh thu dịch vụ - Giá vốn dịch vụ'),
        ('TỶ SUẤT LỢI NHUẬN GỘP (PROFIT MARGIN %)', '=B41/B40', FMT_PCT, 'Lợi nhuận gộp / Doanh thu dịch vụ'),
    ]

    for idx, (label, val, fmt, note) in enumerate(costing_metrics_lcl, start=34):
        ws2.row_dimensions[idx].height = 20
        ws2.cell(row=idx, column=1, value=label).font = font_bold
        c_val = ws2.cell(row=idx, column=2, value=val)
        c_val.font = font_bold
        c_val.number_format = fmt
        c_val.alignment = align_right
        ws2.cell(row=idx, column=3, value=note).font = font_italic

        for c in range(1, 4):
            ws2.cell(row=idx, column=c).border = border_cell
            if idx in [39, 40, 41, 42]:
                ws2.cell(row=idx, column=c).fill = fill_kpi

    # =========================================================================
    # TAB 3: 03_Mo_Hinh_FCL_Nguyen_Cont
    # =========================================================================
    ws3 = wb.create_sheet(title='03_Mo_Hinh_FCL_Nguyen_Cont')
    ws3.views.sheetView[0].showGridLines = True

    # Title Block
    ws3.merge_cells('A1:Y2')
    ws3['A1'] = 'MÔ HÌNH TÍNH GIÁ & PHÂN BỔ CHI PHÍ HÀNG NGUYÊN CONT (FCL)'
    ws3['A1'].font = font_title
    ws3['A1'].fill = fill_navy
    ws3['A1'].alignment = align_center

    ws3['A3'] = 'Bảng phân bổ chi phí chi tiết từng mặt hàng FCL (C1 đến C16) tích hợp Công thức Excel Động'
    ws3['A3'].font = Font(name='Segoe UI', size=10, italic=True, color=NAVY)

    # Section A: Header Inputs FCL
    ws3.merge_cells('A5:E5')
    ws3['A5'] = 'A. THAM SỐ THÔNG TIN LÔ HÀNG FCL (HEADER INPUTS)'
    ws3['A5'].font = font_sec_header
    ws3['A5'].fill = fill_blue_hdr
    ws3['A5'].alignment = align_left

    fcl_inputs = [
        ('Tỷ giá USD/VND', 25400, FMT_VND, 'USD Rate'),
        ('Tỷ giá RMB/VND', 3600, FMT_VND, 'RMB Rate'),
        ('Phí Nội Địa TQ (VND)', 3500000, FMT_VND, 'Phí kéo cont & bốc xếp TQ'),
        ('Phí Nội Địa VN (VND)', 4000000, FMT_VND, 'Phí nâng hạ, THC & thủ tục VN'),
        ('Phí Ủy Thác (VND)', 2000000, FMT_VND, 'FCL phân bổ theo C1'),
        ('Phí QT + VC QT (VND)', 25000000, FMT_VND, 'Cước vận chuyển biển/bộ nguyên cont'),
        ('Phí VC VN (Nội địa) (VND)', 6000000, FMT_VND, 'Cước kéo container về kho khách'),
        ('Tổng Trị Giá Mua Gốc (VND)', '=SUM(G20:G21)', FMT_VND, 'Tổng C1 lô hàng FCL'),
    ]

    for idx, (label, val, fmt, note) in enumerate(fcl_inputs, start=6):
        ws3.row_dimensions[idx].height = 19
        ws3.cell(row=idx, column=1, value=label).font = font_bold
        c_val = ws3.cell(row=idx, column=2, value=val)
        c_val.font = font_bold if str(val).startswith('=') else font_regular
        if fmt:
            c_val.number_format = fmt
        c_val.alignment = align_right if fmt else align_left
        ws3.cell(row=idx, column=3, value=note).font = font_italic
        for c in range(1, 4):
            ws3.cell(row=idx, column=c).border = border_cell

    # Section B: Line Items Table FCL
    ws3.merge_cells('A18:Y18')
    ws3['A18'] = 'B. BẢNG PHÂN BỔ CHI TIẾT TỪNG MẶT HÀNG FCL (LINE ITEMS ALLOCATION TABLE)'
    ws3['A18'].font = font_sec_header
    ws3['A18'].fill = fill_navy
    ws3['A18'].alignment = align_left

    table_headers_fcl = [
        'STT', 'Tên Mặt Hàng', 'Số Lượng', 'Đơn Giá (RMB)', 'Tổng Giá Trị (RMB)', 'Tỷ Giá RMB',
        '(C1) Trị Giá Hàng (VND)', 'Tỷ Lệ Phân Bổ (Ratio)', '(C2) Phí NĐ TQ', '(C3) Phí NĐ VN',
        '(C4) Phí Ủy Thác', '(C5) Phí QT + VC QT', '(C6) Phí VC VN', '(C7) Giá EXW',
        '(C8) Giá CIF', '(C9) Thuế NK (%)', '(C10) Thuế Khác (%)', '(C11) VAT (%)',
        '(C12) Thuế Trực Tiếp', '(C13) Tiền Thuế VAT', '(C14) Tổng CP Chưa VAT',
        '(C15) Xuất HĐ (Đã VAT)', '(C16) Khách Chuyển Thêm', 'Đơn Giá EXW ($)', 'Đơn Giá Xuất HĐ'
    ]

    ws3.row_dimensions[19].height = 28
    for c_idx, h in enumerate(table_headers_fcl, start=1):
        cell = ws3.cell(row=19, column=c_idx, value=h)
        cell.font = font_table_header
        cell.fill = fill_blue_hdr
        cell.alignment = align_center
        cell.border = border_cell

    items_data_fcl = [
        (1, 'Máy đóng gói tự động', 2, 33333.33, 0.05, 0.00, 0.08),
        (2, 'Linh kiện phụ tùng thay thế', 50, 4444.44, 0.10, 0.00, 0.08),
    ]

    for r_offset, (stt, name, qty, price_rmb, t_nk, t_khac, vat) in enumerate(items_data_fcl):
        row = 20 + r_offset
        ws3.row_dimensions[row].height = 22

        ws3.cell(row=row, column=1, value=stt).alignment = align_center
        ws3.cell(row=row, column=2, value=name).alignment = align_left
        ws3.cell(row=row, column=3, value=qty).number_format = FMT_NUM
        ws3.cell(row=row, column=4, value=price_rmb).number_format = FMT_RMB

        # E: Total RMB = C * D
        c_e = ws3.cell(row=row, column=5, value=f'=C{row}*D{row}')
        c_e.number_format = FMT_RMB

        # F: Rate RMB = $B$7
        c_f = ws3.cell(row=row, column=6, value=f'=$B$7')
        c_f.number_format = FMT_VND

        # G: (C1) Value VND = E * F
        c_g = ws3.cell(row=row, column=7, value=f'=E{row}*F{row}')
        c_g.number_format = FMT_VND

        # H: Ratio = G / $G$22
        c_h = ws3.cell(row=row, column=8, value=f'=G{row}/$G$22')
        c_h.number_format = FMT_PCT

        # I: (C2) Phí NĐ TQ = $B$8 * H
        c_i = ws3.cell(row=row, column=9, value=f'=$B$8*H{row}')
        c_i.number_format = FMT_VND

        # J: (C3) Phí NĐ VN = $B$9 * H
        c_j = ws3.cell(row=row, column=10, value=f'=$B$9*H{row}')
        c_j.number_format = FMT_VND

        # K: (C4) Phí UT = $B$10 * H
        c_k = ws3.cell(row=row, column=11, value=f'=$B$10*H{row}')
        c_k.number_format = FMT_VND

        # L: (C5) Phí QT = $B$11 * H
        c_l = ws3.cell(row=row, column=12, value=f'=$B$11*H{row}')
        c_l.number_format = FMT_VND

        # M: (C6) Phí VC VN = $B$12 * H
        c_m = ws3.cell(row=row, column=13, value=f'=$B$12*H{row}')
        c_m.number_format = FMT_VND

        # N: (C7) Giá EXW = G + I + J + K
        c_n = ws3.cell(row=row, column=14, value=f'=G{row}+I{row}+J{row}+K{row}')
        c_n.number_format = FMT_VND

        # O: (C8) Giá CIF = N + L
        c_o = ws3.cell(row=row, column=15, value=f'=N{row}+L{row}')
        c_o.number_format = FMT_VND

        # P: (C9) Thuế NK %
        c_p = ws3.cell(row=row, column=16, value=t_nk)
        c_p.number_format = FMT_INT_PCT

        # Q: (C10) Thuế Khác %
        c_q = ws3.cell(row=row, column=17, value=t_khac)
        c_q.number_format = FMT_INT_PCT

        # R: (C11) VAT %
        c_r = ws3.cell(row=row, column=18, value=vat)
        c_r.number_format = FMT_INT_PCT

        # S: (C12) Thuế trực tiếp = O*P + (O+O*P)*Q
        c_s = ws3.cell(row=row, column=19, value=f'=O{row}*P{row}+(O{row}+O{row}*P{row})*Q{row}')
        c_s.number_format = FMT_VND

        # T: (C13) Tiền thuế VAT = (S+O)*R + M*R
        c_t = ws3.cell(row=row, column=20, value=f'=(S{row}+O{row})*R{row}+M{row}*R{row}')
        c_t.number_format = FMT_VND

        # U: (C14) Tổng CP chưa VAT = I+J+K+L+M+S
        c_u = ws3.cell(row=row, column=21, value=f'=I{row}+J{row}+K{row}+L{row}+M{row}+S{row}')
        c_u.number_format = FMT_VND

        # V: (C15) Xuất HĐ (Đã VAT) = IF(R>0, (T/R)+T, 0)
        c_v = ws3.cell(row=row, column=22, value=f'=IF(R{row}>0, (T{row}/R{row})+T{row}, 0)')
        c_v.number_format = FMT_VND

        # W: (C16) Khách chuyển thêm = V - G
        c_w = ws3.cell(row=row, column=23, value=f'=V{row}-G{row}')
        c_w.number_format = FMT_VND

        # X: Đơn giá EXW ($) = N / C / $B$6
        c_x = ws3.cell(row=row, column=24, value=f'=N{row}/C{row}/$B$6')
        c_x.number_format = FMT_USD

        # Y: Đơn giá Xuất HĐ chưa VAT = (V - T) / C
        c_y = ws3.cell(row=row, column=25, value=f'=(V{row}-T{row})/C{row}')
        c_y.number_format = FMT_VND

        for c in range(1, 26):
            ws3.cell(row=row, column=c).border = border_cell
            ws3.cell(row=row, column=c).font = font_regular

    # Row 22: Total Row FCL
    ws3.row_dimensions[22].height = 24
    ws3.cell(row=22, column=1, value='TỔNG CỘNG LÔ HÀNG').font = font_bold
    ws3.cell(row=22, column=1).alignment = align_center

    total_cols_fcl = {
        5: (FMT_RMB, '=SUM(E20:E21)'),
        7: (FMT_VND, '=SUM(G20:G21)'),
        8: (FMT_PCT, '=SUM(H20:H21)'),
        9: (FMT_VND, '=SUM(I20:I21)'),
        10: (FMT_VND, '=SUM(J20:J21)'),
        11: (FMT_VND, '=SUM(K20:K21)'),
        12: (FMT_VND, '=SUM(L20:L21)'),
        13: (FMT_VND, '=SUM(M20:M21)'),
        14: (FMT_VND, '=SUM(N20:N21)'),
        15: (FMT_VND, '=SUM(O20:O21)'),
        19: (FMT_VND, '=SUM(S20:S21)'),
        20: (FMT_VND, '=SUM(T20:T21)'),
        21: (FMT_VND, '=SUM(U20:U21)'),
        22: (FMT_VND, '=SUM(V20:V21)'),
        23: (FMT_VND, '=SUM(W20:W21)'),
    }

    for c in range(1, 26):
        cell = ws3.cell(row=22, column=c)
        cell.border = border_total
        cell.fill = fill_summary
        if c in total_cols_fcl:
            fmt, formula = total_cols_fcl[c]
            cell.value = formula
            cell.number_format = fmt
            cell.font = font_bold
            cell.alignment = align_right

    # Section C: Costing FCL
    ws3.merge_cells('A24:E24')
    ws3['A24'] = 'C. PHÂN TÍCH GIÁ VỐN & LỢI NHUẬN GỘP DỊCH VỤ LOGISTICS (FCL PROFIT METRICS)'
    ws3['A24'].font = font_sec_header
    ws3['A24'].fill = fill_teal_hdr
    ws3['A24'].alignment = align_left

    costing_metrics_fcl = [
        ('TỔNG GIÁ VỐN DỊCH VỤ (COST PRICE / GIÁ NỀN FCL)', '=B8+B9+B10+B11+B12', FMT_VND, 'Tổng chi phí thực tế các chặng FCL'),
        ('TỔNG DOANH THU DỊCH VỤ (SELLING PRICE / GIÁ BÁO GIÁ FCL)', '=B8+B9+B10+B11+B12', FMT_VND, 'Tổng phí thu dịch vụ FCL'),
        ('LỢI NHUẬN GỘP DỰ KIẾN (EXPECTED PROFIT)', '=B27-B26', FMT_VND, 'Doanh thu FCL - Giá vốn FCL'),
        ('TỶ SUẤT LỢI NHUẬN GỘP (PROFIT MARGIN %)', '=IF(B27>0, B28/B27, 0)', FMT_PCT, 'Lợi nhuận gộp / Doanh thu FCL'),
    ]

    for idx, (label, val, fmt, note) in enumerate(costing_metrics_fcl, start=26):
        ws3.row_dimensions[idx].height = 20
        ws3.cell(row=idx, column=1, value=label).font = font_bold
        c_val = ws3.cell(row=idx, column=2, value=val)
        c_val.font = font_bold
        c_val.number_format = fmt
        c_val.alignment = align_right
        ws3.cell(row=idx, column=3, value=note).font = font_italic

        for c in range(1, 4):
            ws3.cell(row=idx, column=c).border = border_cell
            if idx in [26, 27, 28, 29]:
                ws3.cell(row=idx, column=c).fill = fill_kpi

    # =========================================================================
    # TAB 4: 04_Dinh_Khoan_Va_So_Sanh
    # =========================================================================
    ws4 = wb.create_sheet(title='04_Dinh_Khoan_Va_So_Sanh')
    ws4.views.sheetView[0].showGridLines = True

    # Title Block
    ws4.merge_cells('A1:F2')
    ws4['A1'] = 'SƠ ĐỒ BÚT TOÁN KẾ TOÁN & SO SÁNH ĐẶC THÙ LCL / FCL'
    ws4['A1'].font = font_title
    ws4['A1'].fill = fill_navy
    ws4['A1'].alignment = align_center

    ws4['A3'] = 'Quy trình Hạch toán Kế toán chuẩn cho Hệ thống 1 Sổ & Hướng dẫn Kiểm soát Chứng từ'
    ws4['A3'].font = Font(name='Segoe UI', size=10, italic=True, color=NAVY)

    # Section A: Journal Entries Guide
    ws4['A5'] = '1. HƯỚNG DẪN BÚT TOÁN HẠCH TOÁN KẾ TOÁN THEO HỆ THỐNG 1 SỔ'
    ws4['A5'].font = Font(name='Segoe UI', size=11, bold=True, color=BLUE_HEADER)

    headers4_1 = ['STT', 'Nội Dung Bút Toán / Nghiệp Vụ', 'Tài Khoản Nợ', 'Tài Khoản Có', 'Số Tiền Hạch Toán', 'Chứng Từ Căn Cứ']
    ws4.row_dimensions[6].height = 24
    for c_idx, h in enumerate(headers4_1, start=1):
        cell = ws4.cell(row=6, column=c_idx, value=h)
        cell.font = font_table_header
        cell.fill = fill_blue_hdr
        cell.alignment = align_center
        cell.border = border_cell

    entries = [
        (1, 'Thanh toán tiền mua hàng chặng 1 cho NCC TQ', 'TK 331 (Phải trả NCC TQ)', 'TK 112 (Tiền gửi NH)', 'Giá trị tiền mua hàng (RMB × Tỷ giá)', 'Ủy nhiệm chi / Giấy báo Nợ NH'),
        (2, 'Nhập kho hàng hóa (Giá thành nhập kho C15/C14)', 'TK 1561 (Hàng hóa nhập kho)', 'TK 331 (Tiền hàng mua gốc C1)\nTK 3333 (Thuế NK C13/C12)\nTK 3332 (Thuế TTĐB nếu có)\nTK 331/338 (Phí Logistics/Cước)', 'Tổng Giá thành chưa VAT (C15 LCL / C14 FCL)', 'Tờ khai Hải quan nhập khẩu & Bảng Phân bổ 1 Sổ'),
        (3, 'Ghi nhận Thuế VAT hàng NK nộp cửa khẩu', 'TK 1331 (VAT được khấu trừ)', 'TK 33312 (Thuế VAT hàng NK)', 'Số tiền thuế VAT cửa khẩu', 'Thông báo nộp thuế / Biên lai nộp NSNN'),
        (4, 'Ghi nhận Thuế VAT phí dịch vụ logistics nội địa', 'TK 1331 (VAT được khấu trừ)', 'TK 331 / 338 (Công ty Logistics)', 'Số tiền thuế VAT trên hóa đơn GTGT dịch vụ', 'Hóa đơn GTGT của Công ty Logistics'),
        (5, 'Xuất hóa đơn tài chính bàn giao cho khách (1 Sổ)', 'TK 131 (Phải thu khách hàng)', 'TK 511 (Doanh thu bán hàng/DV)\nTK 33311 (Thuế VAT đầu ra)', 'Tổng giá trị xuất HĐ đã VAT (C16 LCL / C15 FCL)', 'Hóa đơn tài chính xuất trả cho khách hàng'),
        (6, 'Tất toán công nợ chênh lệch / Thu tiền Lần 2', 'TK 112 (Tiền gửi NH)', 'TK 131 (Phải thu khách hàng)', 'Số tiền chuyển thêm (C17 LCL / C16 FCL)', 'Ủy nhiệm chi / Giấy báo Có NH'),
    ]

    for idx, (stt, name, dr, cr, val_desc, doc) in enumerate(entries, start=7):
        ws4.row_dimensions[idx].height = 32
        ws4.cell(row=idx, column=1, value=stt).alignment = align_center
        ws4.cell(row=idx, column=2, value=name).font = font_bold
        ws4.cell(row=idx, column=3, value=dr).font = font_bold
        ws4.cell(row=idx, column=3).alignment = align_center
        ws4.cell(row=idx, column=4, value=cr).font = font_bold
        ws4.cell(row=idx, column=4).alignment = align_center
        ws4.cell(row=idx, column=5, value=val_desc).font = font_regular
        ws4.cell(row=idx, column=6, value=doc).font = font_italic

        for c in range(1, 7):
            ws4.cell(row=idx, column=c).border = border_cell
            if idx % 2 == 1:
                ws4.cell(row=idx, column=c).fill = fill_light_gray

    # Section B: Comparison Table LCL vs FCL
    ws4['A15'] = '2. BẢNG SO SÁNH ĐẶC THÙ PHÂN BỔ KẾ TOÁN GIỮA LCL VÀ FCL'
    ws4['A15'].font = Font(name='Segoe UI', size=11, bold=True, color=BLUE_HEADER)

    headers4_2 = ['Tiêu Chí So Sánh', 'Mô Hình Hàng Gom Cont (LCL)', 'Mô Hình Hàng Nguyên Cont (FCL)', 'Điểm Cần Lưu Ý Cho Kế Toán']
    ws4.row_dimensions[16].height = 24
    for c_idx, h in enumerate(headers4_2, start=1):
        cell = ws4.cell(row=16, column=c_idx, value=h)
        cell.font = font_table_header
        cell.fill = fill_teal_hdr
        cell.alignment = align_center
        cell.border = border_cell

    comps = [
        ('Phân bổ Phí Ủy Thác', 'Chia đều theo số lượng dòng mặt hàng (C3 = Tổng Phí UT / Số mục)', 'Phân bổ theo tỷ lệ giá trị hàng C1 (C4 = Tổng Phí UT × Ratio)', 'LCL bảo vệ các dòng hàng giá trị nhỏ không bị gánh quá nhiều phí UT gốc'),
        ('Tính toán Phí Rủi Ro', 'Có áp dụng phí rủi ro 1% khi trị giá > K × 100tr VND', 'Không áp dụng phí rủi ro riêng (đã tính trong gói cước cont)', 'Phí rủi ro LCL được phân bổ vào chi phí nhưng BỎ KHỎI GIÁ CIF'),
        ('Phần Cước VC Chịu VAT', 'Phí VC VN (C7) + Phí Khác VN (C8) + Phí RR (C4) chịu VAT 8/10%', 'Phí VC VN (C6) chịu thuế VAT 8/10%', 'Cước chặng quốc tế C6 (LCL) hoặc C5 (FCL) không chịu VAT nội địa'),
        ('Trị giá Hải quan (CIF)', 'C9 = C1 + C3 + C5 + C6', 'C8 = C7 + C5 = C1 + C2 + C3 + C4 + C5', 'Xác định chính xác để khớp với trị giá ghi trên Tờ khai Hải quan'),
        ('Cơ sở Tính Doanh Thu HĐ', 'C16 = VAT / VAT% + VAT', 'C15 = VAT / VAT% + VAT', 'Giá trị hóa đơn xuất ra đảm bảo khớp đúng tổng số thuế VAT nộp'),
    ]

    for idx, (crit, lcl_desc, fcl_desc, note) in enumerate(comps, start=17):
        ws4.row_dimensions[idx].height = 30
        ws4.cell(row=idx, column=1, value=crit).font = font_bold
        ws4.cell(row=idx, column=2, value=lcl_desc).font = font_regular
        ws4.cell(row=idx, column=3, value=fcl_desc).font = font_regular
        ws4.cell(row=idx, column=4, value=note).font = font_italic

        for c in range(1, 5):
            ws4.cell(row=idx, column=c).border = border_cell

    # Adjusting Column Widths automatically across all sheets
    for ws in [ws1, ws2, ws3, ws4]:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val_str = str(cell.value or '')
                if val_str.startswith('='):
                    max_len = max(max_len, 12)
                else:
                    lines = val_str.split('\n')
                    for l in lines:
                        max_len = max(max_len, len(l))
            ws.column_dimensions[col_letter].width = max(min(max_len + 4, 45), 12)

    # Specific overrides for beauty
    ws1.column_dimensions['A'].width = 14
    ws1.column_dimensions['B'].width = 28
    ws1.column_dimensions['C'].width = 38
    ws1.column_dimensions['D'].width = 45
    ws1.column_dimensions['E'].width = 42

    ws2.column_dimensions['A'].width = 6
    ws2.column_dimensions['B'].width = 25
    for c in range(3, 27):
        ws2.column_dimensions[get_column_letter(c)].width = 16

    ws3.column_dimensions['A'].width = 6
    ws3.column_dimensions['B'].width = 25
    for c in range(3, 26):
        ws3.column_dimensions[get_column_letter(c)].width = 16

    ws4.column_dimensions['A'].width = 6
    ws4.column_dimensions['B'].width = 32
    ws4.column_dimensions['C'].width = 22
    ws4.column_dimensions['D'].width = 22
    ws4.column_dimensions['E'].width = 30
    ws4.column_dimensions['F'].width = 35

    out_filepath = 'd:/AI AGENT THUY/AI agent Kinh doanh/website_test/Bang_Phan_Tich_Cong_Thuc_Tinh_Gia_1_So_Eureka_Logistics.xlsx'
    wb.save(out_filepath)
    print(f'Excel file successfully created at: {out_filepath}')

if __name__ == '__main__':
    build_excel_workbook()
