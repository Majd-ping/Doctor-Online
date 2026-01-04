@echo off
REM Alternative batch file - starts servers in same window with tasklist menu

echo.
echo ========================================
echo   Doctor Online Platform - Starting
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server on port 5000...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm start"

timeout /t 3 /nobreak

REM Start Frontend Server  
echo [2/2] Starting Frontend Server on port 3000...
cd /d "%~dp0dr-online"
start "Frontend Server" cmd /k "npm start"

timeout /t 2 /nobreak

echo.
echo ========================================
echo   Both servers have been started!
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   Open http://localhost:3000 in your browser
echo ========================================
echo.
