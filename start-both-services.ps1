# Start the backend API server
$backendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\products-api'; node index.js" -PassThru

# Start the frontend
$frontendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm start" -PassThru

Write-Host "Services started. Press Ctrl+C to stop all services."

try {
    # Keep the script running
    Wait-Process -Id $backendJob.Id -ErrorAction SilentlyContinue
}
catch {
    # If we get here, the user probably hit Ctrl+C
    Write-Host "Shutting down services..."
}
finally {
    # Cleanup
    if (-not $backendJob.HasExited) { 
        Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue 
        Write-Host "Backend stopped."
    }
    
    if (-not $frontendJob.HasExited) { 
        Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue 
        Write-Host "Frontend stopped."
    }
}
