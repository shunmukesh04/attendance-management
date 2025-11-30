@echo off
echo Starting Employee Attendance System...
echo.
echo Starting Backend and Frontend servers...
echo.

start "Backend Server" cmd /k "cd server && if not exist node_modules (npm install) && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd client && if not exist node_modules (npm install) && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

