@echo off
cd /d "%~dp0"
echo [1/4] Building...
call npm.cmd run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo.
echo [2/4] Git setup...
if not exist ".git" git init
git add .
git commit -m "Add Japanese sentence learning web app with homepage and SRS" 2>nul

echo.
echo [3/4] Deploying to Vercel...
echo Login may open in browser on first run.
call npx vercel --prod
if errorlevel 1 (
  echo.
  echo Vercel deploy failed.
  echo Try: npx vercel login
  pause
  exit /b 1
)

echo.
echo Done! Check the URL above.
pause
