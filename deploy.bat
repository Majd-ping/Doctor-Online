@echo off
REM Automated deployment script for Doctor Online
REM This script commits changes and pushes to main branch

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Doctor Online - Git Commit & Push
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    pause
    exit /b 1
)

REM Get current directory
set PROJECT_ROOT=%~dp0

echo [1/3] Checking git status...
cd /d "%PROJECT_ROOT%"
git status

echo.
echo [2/3] Staging all changes...
git add -A
if errorlevel 1 (
    echo ERROR: Failed to stage changes
    pause
    exit /b 1
)

echo.
echo Enter commit message (default: "Update: Local changes"):
set /p COMMIT_MSG="Commit message: "
if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update: Local changes

echo [3/3] Committing and pushing to main...
git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo WARNING: Nothing to commit or commit failed
)

git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to main
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Changes pushed to main branch
echo Repository: https://github.com/Majd-ping/Doctor-Online
echo.
echo ========================================
echo.
pause

echo Force pushing to gh-pages...
git push -f origin main:gh-pages
if errorlevel 1 (
    echo ERROR: Failed to push to gh-pages
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Repository updated:
echo   - Main branch: https://github.com/Majd-ping/Doctor-Online
echo   - Frontend:    https://majd-ping.github.io/Doctor-Online/
echo.
echo ========================================
echo.
pause
