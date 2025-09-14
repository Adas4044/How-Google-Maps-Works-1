@echo off
echo Google Maps Explained - Local Deployment
echo ========================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo npm is not available. Please install npm.
    pause
    exit /b 1
)

echo Node.js and npm are installed
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed
echo.

echo Building the project...
npm run build

if %errorlevel% neq 0 (
    echo Build failed. Please check for errors above.
    pause
    exit /b 1
)

echo Build successful
echo.

vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
    
    if %errorlevel% neq 0 (
        echo Failed to install Vercel CLI
        echo Try running: npm install -g vercel
        echo Or use drag ^& drop method from DEPLOYMENT.md
        pause
        exit /b 1
    )
)

echo Vercel CLI is ready
echo.

echo Deploying to Vercel...
echo You may need to login to Vercel (browser will open)
echo.

vercel --prod

if %errorlevel% equ 0 (
    echo.
    echo Deployment successful!
    echo Analytics will be available in your Vercel dashboard
    echo Manage your deployment at: https://vercel.com/dashboard
) else (
    echo.
    echo Deployment failed
    echo Alternative methods available in DEPLOYMENT.md
    echo Try drag ^& drop: build folder -> vercel.com/new
)

echo.
echo Press any key to exit...
pause >nul 