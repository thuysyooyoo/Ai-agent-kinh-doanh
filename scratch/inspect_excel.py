# -*- coding: utf-8 -*-
import openpyxl
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

template_path = r"D:\AI AGENT THUY\AI agent Kinh doanh\templates\biểu mẫu giấy tờ\5. BIÊN BẢN GIAO HÀNG LCL, FCL\Mẫu BB Giao Hàng Lẻ (Thúy duyệt).xlsx"

wb = openpyxl.load_workbook(template_path)
sheet = wb.active

for col_idx in range(1, 6):
    cell = sheet.cell(row=16, column=col_idx)
    print(f"Cell {cell.coordinate}:")
    print(f"  Value: {repr(cell.value)}")
    print(f"  Font: {cell.font.name if cell.font else 'None'}, size={cell.font.size if cell.font else 'None'}, bold={cell.font.bold if cell.font else 'None'}")
    print(f"  Alignment: {cell.alignment.horizontal if cell.alignment else 'None'}, vertical={cell.alignment.vertical if cell.alignment else 'None'}")
    print(f"  Border: {cell.border if cell.border else 'None'}")
