# Force Set Admin Token and Test Admin Controls
$adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA"

Write-Host "WinGroX Admin Token Force-Set Tool" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Create temporary HTML file that sets the token and redirects to the products page
$tempFile = [System.IO.Path]::GetTempFileName() + ".html"
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>WinGroX Admin Token Force-Set</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; }
        h1 { color: #4F46E5; }
        button { background: #4F46E5; color: white; border: none; padding: 12px 20px; 
                 font-size: 16px; border-radius: 4px; cursor: pointer; margin: 20px 0; }
        pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .success { background: #d1fae5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; }
        .token { word-break: break-all; font-family: monospace; font-size: 11px; }
        .countdown { font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <h1>WinGroX Admin Token Force-Set</h1>
    <p>This tool will force-set an admin token and redirect you to the products page.</p>
    
    <div class="success">
        <p><strong>✅ Setting admin token in localStorage...</strong></p>
        <p>Token details:</p>
        <div class="token">$adminToken</div>
    </div>
    
    <p>You will be automatically redirected to the Products page in <span id="countdown">5</span> seconds...</p>
    
    <div>
        <button id="goNowBtn">Go Now</button>
        <button id="debugBtn" style="background: #818CF8;">Show Token Debug</button>
    </div>
    
    <div id="debugInfo" style="display: none; margin-top: 20px;"></div>
    
    <script>
        // Force set the admin token
        localStorage.setItem('token', '$adminToken');
        
        // Decode and display token info when debug button is clicked
        document.getElementById('debugBtn').addEventListener('click', function() {
            const debugDiv = document.getElementById('debugInfo');
            debugDiv.style.display = 'block';
            
            try {
                const token = localStorage.getItem('token');
                const parts = token.split('.');
                const payload = JSON.parse(atob(parts[1]));
                
                debugDiv.innerHTML = '<h3>Token Debug Info</h3>';
                debugDiv.innerHTML += '<pre>' + JSON.stringify(payload, null, 2) + '</pre>';
                debugDiv.innerHTML += '<p>Token expiration: ' + new Date(payload.exp * 1000).toLocaleString() + '</p>';
                debugDiv.innerHTML += '<p>Current time: ' + new Date().toLocaleString() + '</p>';
                debugDiv.innerHTML += '<p>Admin role: ' + (payload.role === 'admin' ? '✅ Yes' : '❌ No') + '</p>';
                
                // Add cookie check
                debugDiv.innerHTML += '<h3>Cookie Check</h3>';
                debugDiv.innerHTML += '<p>Cookie count: ' + document.cookie.split(';').length + '</p>';
                
                // Add storage check
                debugDiv.innerHTML += '<h3>Local Storage Items</h3>';
                let storageItems = '<ul>';
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    storageItems += '<li>' + key + (key === 'token' ? ' ✅' : '') + '</li>';
                }
                storageItems += '</ul>';
                debugDiv.innerHTML += storageItems;
                
            } catch (e) {
                debugDiv.innerHTML = '<p>Error decoding token: ' + e.message + '</p>';
            }
        });
        
        // Handle direct navigation
        document.getElementById('goNowBtn').addEventListener('click', function() {
            window.location.href = 'http://localhost:3000/products';
        });
        
        // Countdown and redirect
        let seconds = 5;
        const countdownEl = document.getElementById('countdown');
        
        const countdownTimer = setInterval(function() {
            seconds--;
            countdownEl.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(countdownTimer);
                window.location.href = 'http://localhost:3000/products';
            }
        }, 1000);
    </script>
</body>
</html>
"@

Set-Content -Path $tempFile -Value $htmlContent

Write-Host "📣 IMPORTANT INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣ We're opening a special page that will:" -ForegroundColor White
Write-Host "   - Force-set the admin token with the correct values" -ForegroundColor White
Write-Host "   - Automatically redirect you to the Products page in 5 seconds" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣ After redirection, you should see:" -ForegroundColor White
Write-Host "   - 'Admin Controls Active' green box at the bottom of the page" -ForegroundColor White
Write-Host "   - 'ADD NEW PRODUCT' button in the admin section" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣ If you still don't see admin controls:" -ForegroundColor White
Write-Host "   - Click the 'Show Token Debug' button before redirection" -ForegroundColor White 
Write-Host "   - Open browser console (F12) and look for AdminControl messages" -ForegroundColor White
Write-Host "   - Ensure the React app is running on http://localhost:3000" -ForegroundColor White
Write-Host ""

# Open the page in default browser
Write-Host "Opening admin token setter in your default browser..." -ForegroundColor Cyan
Start-Process $tempFile

Write-Host ""
Write-Host "✅ Remember: You must be logged in as admin and have the token set to see admin controls!" -ForegroundColor Green
