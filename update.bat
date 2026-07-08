@echo off
cd /d "%~dp0"
echo ========================================
echo  GitHub Update (push)
echo ========================================
echo.

git --version >nul 2>&1
if errorlevel 1 (
  echo Git is not installed or not in PATH.
  pause
  exit /b 1
)

git status
echo.

git add .
git commit -m "Fix dark mode kanji visibility and remove broken level scaffold"
if errorlevel 1 (
  echo.
  echo Nothing to commit, or commit failed. Trying push anyway...
)

echo.
git push origin main
if errorlevel 1 (
  echo.
  echo Push failed. Run manually:
  echo   git push -u origin main
  pause
  exit /b 1
)

echo.
echo Done! Vercel will auto-deploy in 1-2 minutes.
echo https://jp-sentence-builder-inky.vercel.app/
pause
