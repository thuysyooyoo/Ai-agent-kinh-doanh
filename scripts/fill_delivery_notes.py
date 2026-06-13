# -*- coding: utf-8 -*-
import openpyxl
from openpyxl.styles import Alignment
import os
import sys

# Set standard output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

TEMPLATE_PATH = r"D:\AI AGENT THUY\AI agent Kinh doanh\templates\biểu mẫu giấy tờ\5. BIÊN BẢN GIAO HÀNG LCL, FCL\Mẫu BB Giao Hàng Lẻ (Thúy duyệt).xlsx"
OUTPUT_DIR = r"D:\AI AGENT THUY\AI agent Kinh doanh\reports"

def generate_delivery_note(filename, doc_no, date_str, company_name, tax_code, comp_address, receiver_name, phone, cargo_name, quantity, delivery_address):
    if not os.path.exists(TEMPLATE_PATH):
        print(f"Error: Template not found at {TEMPLATE_PATH}")
        sys.exit(1)
        
    wb = openpyxl.load_workbook(TEMPLATE_PATH)
    sheet = wb.active
    
    # 1. Update general info headers
    sheet['A3'] = f"Số: {doc_no}"
    sheet['D3'] = f"Hà Nội, ngày {date_str}"
    
    # 2. Update receiver info
    sheet['A9'] = f"BÊN NHẬN HÀNG: {company_name} (MST: {tax_code})"
    sheet['C10'] = f"Địa chỉ: {comp_address}"
    sheet['C11'] = f"Liên hệ: {receiver_name} - {phone}"
    sheet['C12'] = f"Thời gian: {date_str}"
    
    # 3. Update cargo details
    sheet['A16'] = 1
    sheet['B16'] = cargo_name
    sheet['D16'] = quantity
    sheet['E16'] = delivery_address
    
    # Enable text wrapping on E16 so long addresses display correctly
    if sheet['E16'].alignment:
        orig_align = sheet['E16'].alignment
        sheet['E16'].alignment = Alignment(
            horizontal='left', # Left-align for long addresses is much cleaner
            vertical='center',
            wrap_text=True
        )
    else:
        sheet['E16'].alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    # Let's also make sure cargo name has wrapping if needed
    if sheet['B16'].alignment:
        sheet['B16'].alignment = Alignment(
            horizontal='center',
            vertical='center',
            wrap_text=True
        )

    # Make sure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, filename)
    wb.save(out_path)
    print(f"Successfully generated: {out_path}")

if __name__ == "__main__":
    print("Generating delivery notes for CÔNG TY TNHH THƯƠNG MẠI Y TẾ PHƯƠNG MAI...")
    
    # Common details
    company = "CÔNG TY TNHH THƯƠNG MẠI Y TẾ PHƯƠNG MAI"
    mst = "0110888973"
    reg_addr = "Số 22/34A/162 phố Đông Thiên, Phường Vĩnh Hưng, TP Hà Nội, Việt Nam"
    receiver = "Chị Trâm"
    phone_num = "0377990693"
    date_text = "12 tháng 06 năm 2026"
    
    # 1. HCMC Delivery
    generate_delivery_note(
        filename="BIEN_BAN_GIAO_NHAN_PhuongMai_HCM.xlsx",
        doc_no="1206-1/BBGN/2026",
        date_str=date_text,
        company_name=company,
        tax_code=mst,
        comp_address=reg_addr,
        receiver_name=receiver,
        phone=phone_num,
        cargo_name="Kiện hàng (Dán mã J723-1)",
        quantity=169,
        delivery_address="44/1 đường số 42, KP38, Phường Bình Trưng, Thành phố Hồ Chí Minh, Việt Nam"
    )
    
    # 2. Can Tho Delivery
    generate_delivery_note(
        filename="BIEN_BAN_GIAO_NHAN_PhuongMai_CanTho.xlsx",
        doc_no="1206-2/BBGN/2026",
        date_str=date_text,
        company_name=company,
        tax_code=mst,
        comp_address=reg_addr,
        receiver_name=receiver,
        phone=phone_num,
        cargo_name="Kiện hàng (Dán mã Thuy CT)",
        quantity=134,
        delivery_address="Số D26, đường số 2, KTDC TTVH Tây Đô, Phường Cái Răng, Thành phố Cần Thơ, Việt Nam"
    )
    
    print("Done!")
