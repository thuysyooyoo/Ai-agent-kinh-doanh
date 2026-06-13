# -*- coding: utf-8 -*-
import openpyxl
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

hcm_path = r"D:\AI AGENT THUY\AI agent Kinh doanh\reports\BIEN_BAN_GIAO_NHAN_PhuongMai_HCM.xlsx"
cantho_path = r"D:\AI AGENT THUY\AI agent Kinh doanh\reports\BIEN_BAN_GIAO_NHAN_PhuongMai_CanTho.xlsx"

def verify_file(path, label):
    print(f"\n==========================================")
    print(f"VERIFYING: {label}")
    print(f"PATH: {path}")
    print(f"==========================================")
    if not os.path.exists(path):
        print("File does not exist!")
        return
        
    wb = openpyxl.load_workbook(path)
    sheet = wb.active
    
    print(f"A3 (Doc No): {sheet['A3'].value}")
    print(f"D3 (Date): {sheet['D3'].value}")
    print(f"A9 (Receiver): {sheet['A9'].value}")
    print(f"C10 (Address): {sheet['C10'].value}")
    print(f"C11 (Contact): {sheet['C11'].value}")
    print(f"C12 (Time): {sheet['C12'].value}")
    
    print("\nTable Rows (STT | Tên hàng | Số lượng | Địa chỉ giao hàng):")
    print(f"Row 16: {sheet['A16'].value} | {sheet['B16'].value} | {sheet['D16'].value} | {sheet['E16'].value}")
    print(f"Row 16 E16 Alignment - horizontal: {sheet['E16'].alignment.horizontal}, wrap_text: {sheet['E16'].alignment.wrap_text}")

verify_file(hcm_path, "HCMC Delivery Note")
verify_file(cantho_path, "Can Tho Delivery Note")
