@echo off
REM Automated deployment script for Doctor Online
REM This script commits changes, pushes to main, builds React app, and deploys to gh-pages

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Doctor Online - Automated Deployment
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

echo [1/5] Checking git status...
cd /d "%PROJECT_ROOT%"
git status

echo.
echo [2/5] Staging all changes...
git add -A
if errorlevel 1 (
    echo ERROR: Failed to stage changes
    pause
    exit /b 1
)

echo.
echo Enter commit message (default: "Update: Deploy changes"):
set /p COMMIT_MSG="Commit message: "
if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update: Deploy changes

echo [3/5] Committing changes...
git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo WARNING: Nothing to commit or commit failed
)

echo.
echo [4/5] Pushing to main branch...
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to main
    pause
    exit /b 1
)

echo.
echo [5/5] Building React app and deploying to gh-pages...
cd /d "%PROJECT_ROOT%dr-online"

echo Building production bundle...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

cd /d "%PROJECT_ROOT%"

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
