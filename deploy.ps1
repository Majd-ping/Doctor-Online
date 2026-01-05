#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Automated deployment script for Doctor Online
.DESCRIPTION
    This script commits changes, pushes to main, builds React app, and deploys to gh-pages
.EXAMPLE
    .\deploy.ps1
#>

param(
    [string]$Message = "Update: Deploy changes"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Doctor Online - Automated Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    # Check if git is installed
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
        exit 1
    }

    # Get project root
    $PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $PROJECT_ROOT

    # Step 1: Check git status
    Write-Host "[1/5] Checking git status..." -ForegroundColor Yellow
    git status
    Write-Host ""

    # Step 2: Stage all changes
    Write-Host "[2/5] Staging all changes..." -ForegroundColor Yellow
    git add -A
    Write-Host "✓ Changes staged`n" -ForegroundColor Green

    # Step 3: Commit changes
    Write-Host "[3/5] Committing changes..." -ForegroundColor Yellow
    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = Read-Host "Enter commit message (default: 'Update: Deploy changes')"
        if ([string]::IsNullOrWhiteSpace($Message)) {
            $Message = "Update: Deploy changes"
        }
    }
    
    git commit -m $Message 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Changes committed`n" -ForegroundColor Green
    } else {
        Write-Host "⚠ Nothing to commit or commit failed (continuing...)`n" -ForegroundColor Yellow
    }

    # Step 4: Push to main
    Write-Host "[4/5] Pushing to main branch..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Pushed to main`n" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to push to main" -ForegroundColor Red
        exit 1
    }

    # Step 5: Build and deploy
    Write-Host "[5/5] Building React app and deploying to gh-pages..." -ForegroundColor Yellow
    Set-Location "$PROJECT_ROOT\dr-online"
    
    Write-Host "Building production bundle..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed" -ForegroundColor Red
        exit 1
    }

    Set-Location $PROJECT_ROOT
    
    Write-Host "Force pushing to gh-pages..." -ForegroundColor Cyan
    git push -f origin main:gh-pages
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Deployed to gh-pages`n" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Failed to push to gh-pages" -ForegroundColor Red
        exit 1
    }

    # Success message
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deployment Complete!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Repository updated:" -ForegroundColor Cyan
    Write-Host "  - Main branch: https://github.com/Majd-ping/Doctor-Online" -ForegroundColor White
    Write-Host "  - Frontend:    https://majd-ping.github.io/Doctor-Online/" -ForegroundColor White
    Write-Host "`n========================================`n" -ForegroundColor Cyan
    
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
