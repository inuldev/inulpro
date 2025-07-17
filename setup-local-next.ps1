# Script untuk memindahkan .next ke drive lokal untuk performa lebih baik
# Jalankan sebagai Administrator

param(
    [string]$LocalPath = "C:\temp\inulpro-next"
)

Write-Host "Setting up local .next folder for better performance..." -ForegroundColor Green

# Buat folder lokal jika belum ada
if (!(Test-Path $LocalPath)) {
    New-Item -ItemType Directory -Path $LocalPath -Force
    Write-Host "Created local directory: $LocalPath" -ForegroundColor Yellow
}

# Hapus .next yang ada jika ada
if (Test-Path ".next") {
    if ((Get-Item ".next").LinkType -eq "SymbolicLink") {
        Write-Host "Removing existing symbolic link..." -ForegroundColor Yellow
        Remove-Item ".next" -Force
    } else {
        Write-Host "Moving existing .next to backup..." -ForegroundColor Yellow
        if (Test-Path ".next-backup") {
            Remove-Item ".next-backup" -Recurse -Force
        }
        Move-Item ".next" ".next-backup"
    }
}

# Buat symbolic link
try {
    New-Item -ItemType SymbolicLink -Path ".next" -Target $LocalPath
    Write-Host "Successfully created symbolic link: .next -> $LocalPath" -ForegroundColor Green
    
    # Test write access
    $testFile = Join-Path $LocalPath "test-write.txt"
    "test" | Out-File $testFile
    Remove-Item $testFile
    Write-Host "Write access confirmed!" -ForegroundColor Green
    
} catch {
    Write-Host "Error creating symbolic link: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure to run this script as Administrator" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nSetup complete! Your .next folder is now on local drive for better performance." -ForegroundColor Green
Write-Host "You can now run 'npm run dev' with improved filesystem performance." -ForegroundColor Cyan
