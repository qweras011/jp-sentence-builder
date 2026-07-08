@echo off
cd /d "%~dp0"
echo Stopping any old server on port 5173 is recommended (Ctrl+C in terminal).
echo.
echo Starting dev server...
call npm.cmd run dev
pause
