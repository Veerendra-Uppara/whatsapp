# Stop Chat Application
Write-Host "`n=== Stopping Chat Application ===" -ForegroundColor Red
Write-Host ""

# Stop processes on port 5000
Write-Host "Stopping processes on port 5000..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port5000) {
    $port5000 | ForEach-Object { 
        Write-Host "Killing process $_ on port 5000..." -ForegroundColor Yellow
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue 
    }
}

# Stop processes on port 3000
Write-Host "Stopping processes on port 3000..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($port3000) {
    $port3000 | ForEach-Object { 
        Write-Host "Killing process $_ on port 3000..." -ForegroundColor Yellow
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue 
    }
}

# Stop all Node.js processes (optional - uncomment if needed)
# Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
# Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ All processes stopped!" -ForegroundColor Green
Write-Host ""

