# verify-admin-login.ps1
# Script to help verify and test admin login and token issues

$adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi11c2VyLTEyMyIsImVtYWlsIjoiYWRtaW5Ad2luZ3JveC5haSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzUwMDAwMDAwfQ.f9JmfkuLFwuKR5BmThz5PkxIPdMtiY3Xt_SYraEnkJA"

Write-Host "WinGroX Admin Login Verification Tool" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Create temporary HTML file with a more comprehensive debugging approach
$tempFile = [System.IO.Path]::GetTempFileName() + ".html"
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>WinGroX Admin Login Verification</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
        h1, h2 { color: #4F46E5; }
        pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .card { background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
        .success { background: #d1fae5; color: #065f46; padding: 10px; border-radius: 4px; }
        .error { background: #fee2e2; color: #991b1b; padding: 10px; border-radius: 4px; }
        button { background: #4F46E5; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
        button:hover { background: #4338CA; }
        .button-red { background: #DC2626; }
        .button-red:hover { background: #B91C1C; }
        .button-green { background: #10B981; }
        .button-green:hover { background: #059669; }
        .steps { background: #f3f4f6; padding: 15px; border-radius: 4px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid #e5e7eb; }
        th, td { padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; }
    </style>
</head>
<body>
    <h1>WinGroX Admin Login Verification</h1>
    
    <div class="card">
        <h2>Current Token Status</h2>
        <div id="tokenStatus">Checking token...</div>
        
        <div class="token-actions" style="margin-top: 15px;">
            <button id="setTokenBtn" class="button-green">Set Admin Token</button>
            <button id="removeTokenBtn" class="button-red">Remove Token</button>
            <button id="refreshBtn">Refresh Status</button>
        </div>
    </div>
    
    <div class="card">
        <h2>Admin Credentials</h2>
        <table>
            <tr>
                <th>Type</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Email</td>
                <td><code>admin@wingrox.ai</code></td>
            </tr>
            <tr>
                <td>Password</td>
                <td><code>admin123</code></td>
            </tr>
        </table>
        
        <div style="margin-top: 15px;">
            <button id="copyEmailBtn">Copy Email</button>
            <button id="copyPasswordBtn">Copy Password</button>
        </div>
    </div>
    
    <div class="card">
        <h2>Login Steps</h2>
        <ol>
            <li>Visit the <a href="http://localhost:3000/login" target="_blank">Login Page</a></li>
            <li>Enter admin credentials from the table above, OR</li>
            <li>Click the "Demo Admin Login" button on the login page</li>
            <li>After login, visit the <a href="http://localhost:3000/products" target="_blank">Products Page</a></li>
            <li>Scroll to the bottom to find the admin panel with "Add New Product" button</li>
        </ol>
    </div>
    
    <div class="card">
        <h2>Troubleshooting</h2>
        <div id="debugOutput"></div>
    </div>
    
    <script>
        // Function to check token status
        function checkToken() {
            const tokenStatus = document.getElementById('tokenStatus');
            const token = localStorage.getItem('token');
            const debugOutput = document.getElementById('debugOutput');
            
            if (!token) {
                tokenStatus.innerHTML = '<div class="error">❌ No token found in localStorage</div>';
                debugOutput.innerHTML = '<div class="error">Error: No JWT token found in localStorage</div>';
                return;
            }
            
            try {
                // Parse JWT token
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Invalid token format');
                }
                
                // Decode payload
                const payload = JSON.parse(atob(parts[1]));
                const now = Math.floor(Date.now() / 1000);
                const expiration = payload.exp;
                const isExpired = expiration < now;
                const isAdmin = payload.role === 'admin';
                const email = payload.email;
                
                // Build status display
                let statusHTML = '';
                if (isAdmin && !isExpired) {
                    statusHTML = '<div class="success">✅ Valid admin token found!</div>';
                } else {
                    statusHTML = '<div class="error">❌ Token issues detected!</div>';
                }
                
                statusHTML += '<pre>' + JSON.stringify(payload, null, 2) + '</pre>';
                statusHTML += '<p><strong>Token analysis:</strong></p>';
                statusHTML += '<ul>';
                statusHTML += '<li>Is admin role: <strong>' + (isAdmin ? '✅ Yes' : '❌ No') + '</strong></li>';
                statusHTML += '<li>Is expired: <strong>' + (isExpired ? '❌ Yes' : '✅ No') + '</strong></li>';
                statusHTML += '<li>Email: <strong>' + email + '</strong></li>';
                statusHTML += '<li>Expiration: <strong>' + new Date(expiration * 1000).toLocaleString() + '</strong></li>';
                statusHTML += '</ul>';
                
                tokenStatus.innerHTML = statusHTML;
                
                // Debug output
                let debugHTML = '<h3>Token Analysis</h3>';
                
                if (!isAdmin) {
                    debugHTML += '<div class="error">Error: Token does not have admin role</div>';
                    debugHTML += '<p>Solution: Use the "Set Admin Token" button above</p>';
                }
                
                if (isExpired) {
                    debugHTML += '<div class="error">Error: Token is expired</div>';
                    debugHTML += '<p>Solution: Use the "Set Admin Token" button above</p>';
                }
                
                if (email !== 'admin@wingrox.ai') {
                    debugHTML += '<div class="error">Error: Email in token doesn\'t match admin@wingrox.ai</div>';
                    debugHTML += '<p>Current email: ' + email + '</p>';
                    debugHTML += '<p>Solution: Use the "Set Admin Token" button above</p>';
                }
                
                if (isAdmin && !isExpired && email === 'admin@wingrox.ai') {
                    debugHTML += '<div class="success">✅ Token looks good! You should be able to see admin controls.</div>';
                    debugHTML += '<p>If you still don\'t see admin controls:</p>';
                    debugHTML += '<ol>';
                    debugHTML += '<li>Make sure you are logged in (try the Demo Admin Login button)</li>';
                    debugHTML += '<li>Check browser console for errors (F12 > Console tab)</li>';
                    debugHTML += '<li>Try clearing browser cache and reload</li>';
                    debugHTML += '<li>Make sure the app is running with the latest code</li>';
                    debugHTML += '</ol>';
                }
                
                debugOutput.innerHTML = debugHTML;
                
            } catch (e) {
                tokenStatus.innerHTML = '<div class="error">❌ Error decoding token: ' + e.message + '</div>';
                debugOutput.innerHTML = '<div class="error">Error: Failed to decode JWT token</div>';
                debugOutput.innerHTML += '<p>The token format is invalid. Use the "Set Admin Token" button above.</p>';
            }
        }
        
        // Check token on page load
        checkToken();
        
        // Add event listeners
        document.getElementById('setTokenBtn').addEventListener('click', () => {
            localStorage.setItem('token', '$adminToken');
            checkToken();
        });
        
        document.getElementById('removeTokenBtn').addEventListener('click', () => {
            localStorage.removeItem('token');
            checkToken();
        });
        
        document.getElementById('refreshBtn').addEventListener('click', checkToken);
        
        document.getElementById('copyEmailBtn').addEventListener('click', () => {
            navigator.clipboard.writeText('admin@wingrox.ai');
            alert('Email copied to clipboard!');
        });
        
        document.getElementById('copyPasswordBtn').addEventListener('click', () => {
            navigator.clipboard.writeText('admin123');
            alert('Password copied to clipboard!');
        });
    </script>
</body>
</html>
"@

Set-Content -Path $tempFile -Value $htmlContent

Write-Host "Created verification tool at: $tempFile" -ForegroundColor Green
Write-Host "Opening verification tool in default browser..." -ForegroundColor Yellow

# Open the file in default browser
Start-Process $tempFile

Write-Host "`nVerification Steps:" -ForegroundColor Cyan
Write-Host "1. Use the tool to check if your admin token is valid" -ForegroundColor White
Write-Host "2. If needed, use the 'Set Admin Token' button" -ForegroundColor White
Write-Host "3. Login with admin credentials:" -ForegroundColor White
Write-Host "   - Email: admin@wingrox.ai" -ForegroundColor White
Write-Host "   - Password: admin123" -ForegroundColor White
Write-Host "4. After login, visit the Products page to see admin controls" -ForegroundColor White
Write-Host "   - http://localhost:3000/products" -ForegroundColor White

Write-Host "`nIf you don't see admin controls after these steps:" -ForegroundColor Yellow
Write-Host "- Check browser console (F12) for errors" -ForegroundColor White
Write-Host "- Try clearing browser cache and cookies" -ForegroundColor White
Write-Host "- Ensure the React app is running with latest code" -ForegroundColor White
