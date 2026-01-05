#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated deployment script for Doctor Online
.DESCRIPTION
    This script commits changes and pushes to main branch only
.EXAMPLE
    .\deploy.ps1
    .\deploy.ps1 -Message "Fix: API bug"
#>

param(
    [string]$Message = "Update: Local changes"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Doctor Online - Git Commit & Push" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    # Check if git is installed
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }

    $PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $PROJECT_ROOT

    # Step 1: Check git status
    Write-Host "[1/3] Checking git status..." -ForegroundColor Yellow
    git status
    Write-Host ""

    # Step 2: Stage all changes
    Write-Host "[2/3] Staging all changes..." -ForegroundColor Yellow
    git add -A
    Write-Host "✓ Changes staged`n" -ForegroundColor Green

    # Step 3: Commit and push
    Write-Host "[3/3] Committing and pushing to main..." -ForegroundColor Yellow
    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = Read-Host "Enter commit message (default: 'Update: Local changes')"
        if ([string]::IsNullOrWhiteSpace($Message)) {
            $Message = "Update: Local changes"
        }
    }
    
    git commit -m $Message 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Changes committed`n" -ForegroundColor Green
    } else {
        Write-Host "⚠ Nothing to commit or commit failed (continuing...)`n" -ForegroundColor Yellow
    }

    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Pushed to main`n" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to push to main" -ForegroundColor Red
        exit 1
    }

    # Success message
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deployment Complete!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Changes pushed to main branch:" -ForegroundColor Cyan
    Write-Host "https://github.com/Majd-ping/Doctor-Online" -ForegroundColor White
    Write-Host "`n========================================`n" -ForegroundColor Cyan
    
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
