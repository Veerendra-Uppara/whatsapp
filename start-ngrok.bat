@echo off
echo ========================================
echo   Starting ngrok Tunnel
echo ========================================
echo.
echo This will create a public URL for your local server
echo.
echo If you see an error, try one of these:
echo 1. Run: npx ngrok http 5000
echo 2. Or download ngrok.exe from https://ngrok.com/download
echo 3. Or use: npm install -g localtunnel ^&^& lt --port 5000
echo.
echo Starting ngrok...
echo.

REM Try using npx first
npx ngrok http 5000

REM If npx doesn't work, try finding ngrok in npm global
if errorlevel 1 (
    echo.
    echo Trying alternative method...
    where ngrok >nul 2>&1
    if errorlevel 1 (
        echo.
        echo ngrok not found. Please:
        echo 1. Download ngrok.exe from https://ngrok.com/download
        echo 2. Place it in this folder or add to PATH
        echo 3. Run: ngrok http 5000
        echo.
        pause
    ) else (
        ngrok http 5000
    )
)

