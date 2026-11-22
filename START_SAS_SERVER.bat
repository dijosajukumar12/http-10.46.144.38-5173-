@echo off
echo ========================================================
echo  SAS (Student Attendance System) - Excel Engineering College
echo  Author: S. DIJO (Reg No: 730925104051)
echo ========================================================
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting SAS Development Server...
echo Open in browser: http://localhost:5173/
call npm run dev -- --host
pause
