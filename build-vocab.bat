@echo off
cd /d "%~dp0"
echo Building N4/N3 essential vocabulary (600 + 900)...
echo This may take several minutes on first run.
echo.
call npm.cmd run build:vocab
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)
echo.
echo Done! Restart dev server if running.
pause
