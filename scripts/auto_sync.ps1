# Thiết lập mã hóa đầu ra sang UTF-8 để hiển thị tiếng Việt không bị lỗi font
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path $scriptPath

# Đường dẫn đến file cấu hình sync_config.txt
$configFile = Join-Path $scriptDir "..\sync_config.txt"
if (-not (Test-Path $configFile)) {
    Write-Host "Không tìm thấy file cấu hình sync_config.txt!" -ForegroundColor Red
    Exit
}

# Đọc cấu hình từ file
$config = @{}
Get-Content $configFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $config[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

$repoUrl = $config["GITHUB_REPO_URL"]
$interval = [int]$config["SYNC_INTERVAL_SECONDS"]
if (-not $interval) { $interval = 60 }

$workDir = (Get-Item $scriptDir).Parent.FullName
Set-Location $workDir

Write-Host "=== BẮT ĐẦU HỆ THỐNG TỰ ĐỘNG ĐỒNG BỘ GIT ===" -ForegroundColor Green
Write-Host "Thư mục làm việc: $workDir"
Write-Host "Kho GitHub: $repoUrl"
Write-Host "Chu kỳ kiểm tra: $interval giây"
Write-Host "=========================================" -ForegroundColor Green

# 1. Khởi tạo Git cục bộ nếu chưa có
if (-not (Test-Path ".git")) {
    Write-Host "[Git] Chưa có Git cục bộ. Đang khởi tạo..." -ForegroundColor Yellow
    git init
    # Thiết lập tên nhánh mặc định là main
    git checkout -b main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git branch -M main
    }
}

# 2. Cấu hình link repository GitHub
$remoteCheck = git remote get-url origin 2>$null
if ($null -eq $remoteCheck) {
    if ($repoUrl -and $repoUrl -notlike "*USERNAME*") {
        Write-Host "[Git] Đang liên kết với kho GitHub: $repoUrl" -ForegroundColor Yellow
        git remote add origin $repoUrl
    }
} elseif ($remoteCheck -ne $repoUrl -and $repoUrl -and $repoUrl -notlike "*USERNAME*") {
    Write-Host "[Git] Cập nhật link GitHub mới: $repoUrl" -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Vòng lặp chạy ngầm định kỳ
while ($true) {
    try {
        $currentRemote = git remote get-url origin 2>$null
        if ($null -ne $currentRemote -and $currentRemote -notlike "*USERNAME*") {
            
            # Kiểm tra xem có file nào thay đổi, thêm mới hoặc xóa không
            $status = git status --porcelain
            if ($status) {
                $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                Write-Host "[$time] Phát hiện thay đổi! Đang đồng bộ lên GitHub..." -ForegroundColor Cyan
                
                # Thực hiện add tất cả và commit
                git add -A
                git commit -m "Auto-sync: Cập nhật lúc $time"
                
                # Thực hiện đẩy (push) lên GitHub.
                # Sử dụng -u origin main để thiết lập luồng đẩy mặc định
                Write-Host "[$time] Đang tải lên GitHub..." -ForegroundColor Gray
                $pushError = git push -u origin main 2>&1
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[$time] ĐỒNG BỘ THÀNH CÔNG!" -ForegroundColor Green
                } else {
                    Write-Host "[$time] LỖI ĐỒNG BỘ! Chi tiết lỗi:" -ForegroundColor Red
                    Write-Host $pushError -ForegroundColor Red
                    Write-Host "[Gợi ý] Nếu đây là lần đầu tiên, hãy chạy file CMD để đăng nhập GitHub nếu có cửa sổ yêu cầu." -ForegroundColor Yellow
                }
            }
        }
    } catch {
        Write-Host "Lỗi hệ thống: $_" -ForegroundColor Red
    }
    
    # Nghỉ trong khoảng thời gian được cấu hình trước khi kiểm tra tiếp
    Start-Sleep -Seconds $interval
}
