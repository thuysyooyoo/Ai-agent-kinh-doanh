@echo off
:: Thiết lập hiển thị tiếng Việt UTF-8
chcp 65001 > nul
title Dừng GitHub Auto-Sync

echo ==========================================
echo ĐANG DỪNG HỆ THỐNG TỰ ĐỘNG ĐỒNG BỘ GIT...
echo ==========================================

:: Tìm và tắt tiến trình PowerShell đang chạy file auto_sync.ps1
powershell -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*auto_sync.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"

echo.
echo [Thành công] Đã dừng toàn bộ hệ thống tự động đồng bộ ngầm!
echo.
pause
