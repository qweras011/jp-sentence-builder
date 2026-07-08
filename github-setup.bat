@echo off
cd /d "%~dp0"
echo ========================================
echo  GitHub Upload Setup
echo ========================================
echo.

echo [1/4] Checking git...
git --version >nul 2>&1
if errorlevel 1 (
  echo Git is not installed. Install from https://git-scm.com
  pause
  exit /b 1
)

if not exist ".git" (
  echo Initializing git repository...
  git init
)

echo.
echo [2/4] Staging files...
git add .

echo.
echo [3/4] Creating commit...
git commit -m "Add Japanese sentence learning web app with homepage and SRS"
if errorlevel 1 (
  echo Nothing new to commit, or commit failed.
)

echo.
echo [4/4] GitHub upload...
gh --version >nul 2>&1
if errorlevel 1 (
  echo GitHub CLI ^(gh^) not found.
  echo.
  echo Manual steps:
  echo 1. Create repo at https://github.com/new
  echo 2. Name: jp-sentence-builder
  echo 3. Do NOT add README
  echo 4. Run these commands:
  echo    git remote add origin https://github.com/YOUR_USERNAME/jp-sentence-builder.git
  echo    git branch -M main
  echo    git push -u origin main
  pause
  exit /b 1
)

gh auth status >nul 2>&1
if errorlevel 1 (
  echo Please login to GitHub first:
  gh auth login
  pause
  exit /b 1
)

echo Creating GitHub repo and pushing...
gh repo create jp-sentence-builder --public --source=. --remote=origin --push
if errorlevel 1 (
  echo.
  echo Repo may already exist. Try:
  echo git remote add origin https://github.com/YOUR_USERNAME/jp-sentence-builder.git
  echo git branch -M main
  echo git push -u origin main
  pause
  exit /b 1
)

echo.
echo Done! Your repo is on GitHub.
gh repo view --web
pause
