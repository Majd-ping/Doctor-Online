@echo off
REM Batch file to start both Backend and Frontend servers

echo.
echo ========================================
echo   Doctor Online Platform - Starting
echo ========================================
echo.

REM Change to backend directory and start the server
echo Starting Backend Server (Port 5000)...
start cmd /k "cd /d %~dp0backend && npm start"

timeout /t 2 /nobreak

REM Change to frontend directory and start the server
echo Starting Frontend Server (Port 3000)...
start cmd /k "cd /d %~dp0dr-online && npm start"

timeout /t 2 /nobreak

echo.
echo ========================================
echo   Servers Starting...
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to close this window...
pause
