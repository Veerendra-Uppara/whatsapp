@echo off
echo.
echo === Stopping Chat Application ===
echo.

echo Stopping processes on port 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 5000...
    taskkill /F /PID %%a >nul 2>&1
)

echo Stopping processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 3000...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ✅ All processes stopped!
echo.
pause

