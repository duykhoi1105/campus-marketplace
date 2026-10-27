# Script Đóng Gói Đồ Án Cuối Kỳ Nộp Canvas
# Cú pháp đặt tên theo đề cương: MSSV1_MSSV2_MSSV3_Project.zip
# Sinh viên: Nguyễn Duy Khôi (MSSV: 1923050528)

$OutputZip = "1923050528_Project.zip"
Write-Host "=========================================================="
Write-Host "BẮT ĐẦU ĐÓNG GÓI DỰ ÁN NỘP CANVAS: $OutputZip"
Write-Host "=========================================================="

# 1. Chạy kiểm tra TypeScript và Test trước khi đóng gói
Write-Host "[1/4] Kiểm tra TypeScript Compiler..."
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript còn lỗi! Vui lòng sửa trước khi nén."
    exit 1
}

Write-Host "[2/4] Chạy toàn bộ bộ kiểm thử tự động..."
npx vitest run
if ($LASTEXITCODE -ne 0) {
    Write-Error "Test chưa PASS 100%! Vui lòng kiểm tra lại."
    exit 1
}

# 2. Xóa file zip cũ nếu có
if (Test-Path $OutputZip) {
    Remove-Item $OutputZip -Force
}

# 3. Tạo danh sách các file/thư mục cần đưa vào zip (loại bỏ node_modules, .expo, .git, cache)
Write-Host "[3/4] Đang nén mã nguồn và tài liệu..."
$IncludeList = @(
    "app",
    "backend",
    "components",
    "constants",
    "hooks",
    "services",
    "store",
    "types",
    "utils",
    "tests",
    "assets",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "app.json",
    "expo-env.d.ts",
    "eslint.config.js",
    "vitest.config.ts",
    ".gitignore",
    "README.md",
    "AI_LOG.md",
    "PROJECT_REQUIREMENTS_AUDIT.txt",
    "PROJECT_ROADMAP.txt",
    "IMAGE_COMPRESSION_REPORT.txt",
    "PRICE_NOTIFICATION_REPORT.txt",
    "ACCESSIBILITY_AUDIT_REPORT.txt",
    "FINAL_ACCEPTANCE_REPORT.txt",
    "DEMO_VIDEO_SCRIPT.txt",
    "SELF_ASSESSMENT_DRAFT.txt"
)

# Sử dụng Compress-Archive
Compress-Archive -Path $IncludeList -DestinationPath $OutputZip -CompressionLevel Optimal

# 4. Xác minh kích thước file zip
$ZipSize = (Get-Item $OutputZip).Length / 1MB
Write-Host "[4/4] ĐÓNG GÓI THÀNH CÔNG!"
Write-Host "File nộp Canvas: $OutputZip"
Write-Host "Dung lượng: $([math]::Round($ZipSize, 2)) MB (Không chứa node_modules)"
Write-Host "=========================================================="

