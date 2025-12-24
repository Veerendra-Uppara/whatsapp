@echo off
echo.
echo === Starting Chat Application ===
echo.

REM Kill existing processes on ports 5000 and 3000
echo Checking for existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Stopping process on port 5000...
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping process on port 3000...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo Starting server on port 5000...
start "Chat Server" cmd /k "cd server && echo === Server Running on port 5000 === && node index.js"

timeout /t 3 /nobreak >nul

echo Starting React client on port 3000...
start "Chat Client" cmd /k "cd client && echo === React Client Starting on port 3000 === && set HOST=0.0.0.0 && npm start"

echo.
echo ========================================
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo Mobile: http://192.168.0.104:3000
echo ========================================
echo.
echo Two windows have been opened:
echo - Chat Server (port 5000)
echo - Chat Client (port 3000)
echo.
echo To stop: Run stop.bat or close both windows
echo.
pause

