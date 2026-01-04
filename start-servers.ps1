# PowerShell script to start both Backend and Frontend servers
# Usage: .\start-servers.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Doctor Online Platform - Starting" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend Server
Write-Host "[1/2] Starting Backend Server on port 5000..." -ForegroundColor Yellow
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; npm start"

Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "[2/2] Starting Frontend Server on port 3000..." -ForegroundColor Yellow
$frontendPath = Join-Path $projectRoot "dr-online"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm start"

Start-Sleep -Seconds 2

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Both servers have been started!" -ForegroundColor Green
Write-Host "`n  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "`n  Open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan
