# fix-admin-login.ps1
# Script to help fix admin login issues in WinGroX

Write-Host "WinGroX Admin Login Fixer" -ForegroundColor Cyan
Write-Host "------------------------" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit
}

# Create a directory for admin tools if it doesn't exist
if (-not (Test-Path -Path "admin-tools")) {
    New-Item -ItemType Directory -Path "admin-tools"
    Write-Host "📁 Created admin-tools directory" -ForegroundColor Yellow
}

# Create a simple package.json for the admin tools
$packageJson = @"
{
  "name": "wingrox-admin-tools",
  "version": "1.0.0",
  "description": "Admin tools for WinGroX",
  "dependencies": {
    "jsonwebtoken": "^8.5.1"
  }
}
"@
Set-Content -Path "admin-tools/package.json" -Value $packageJson
Write-Host "📄 Created package.json" -ForegroundColor Yellow

# Create the admin token generator
$tokenGenerator = @"
// AdminTokenGenerator.js
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Secret key for signing JWT - in a real app, this would be in an env variable
const JWT_SECRET = 'wingrox-super-secret-key-for-development';

// Create a token that expires in 7 days
const token = jwt.sign(
  {
    sub: 'admin-user-id',
    name: 'Admin User',    email: 'admin@wingrox.ai',
    role: 'admin',
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);

console.log('\nGenerated Admin Token:');
console.log('====================');
console.log(token);
console.log('====================');
console.log('\nTo use this token:');
console.log('1. Open your browser console on the WinGroX app');
console.log('2. Run: localStorage.setItem("token", "' + token + '")');
console.log('3. Reload the page\n');

// Also create a simple HTML file that users can open to set the token
const htmlContent = \`<!DOCTYPE html>
<html>
<head>
  <title>WinGroX Admin Token Setter</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #3949ab; }
    .token { word-break: break-all; background: #f0f4ff; padding: 15px; border-radius: 5px; font-family: monospace; }
    button { background: #3949ab; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin: 10px 0; }
    button:hover { background: #303f9f; }
    .success { color: green; font-weight: bold; }
    .instructions { background: #f5f5f5; padding: 15px; border-left: 5px solid #3949ab; }
  </style>
</head>
<body>
  <h1>WinGroX Admin Token Setter</h1>
  <p>This tool will set an admin token in your browser's localStorage to give you admin access.</p>
  
  <div class="token" id="tokenDisplay">\${token}</div>
  
  <button id="setToken">Set Admin Token</button>
  <p id="status"></p>
  
  <div class="instructions">
    <h3>Instructions:</h3>
    <ol>
      <li>Click the "Set Admin Token" button above</li>
      <li>Open the WinGroX application in the same browser</li>
      <li>You should now have admin access and see the "ADD NEW PRODUCT" button</li>
    </ol>
    <p><strong>Note:</strong> This token will expire in 7 days.</p>
  </div>
  
  <script>
    document.getElementById('setToken').addEventListener('click', function() {
      localStorage.setItem('token', '\${token}');
      document.getElementById('status').innerHTML = '<span class="success">✅ Admin token set successfully!</span>';
    });
  </script>
</body>
</html>\`;

fs.writeFileSync('set-admin-token.html', htmlContent);
console.log('Created set-admin-token.html - open this file in your browser to easily set the token\n');
"@
Set-Content -Path "admin-tools/AdminTokenGenerator.js" -Value $tokenGenerator
Write-Host "📄 Created AdminTokenGenerator.js" -ForegroundColor Yellow

# Navigate to the admin-tools directory and install dependencies
Write-Host ""
Write-Host "🔄 Installing dependencies..." -ForegroundColor Cyan
Set-Location -Path "admin-tools"
npm install

# Run the generator
Write-Host ""
Write-Host "🔑 Generating admin token..." -ForegroundColor Cyan
node AdminTokenGenerator.js

# Open the HTML file
Write-Host ""
Write-Host "🌐 Opening token setter in browser..." -ForegroundColor Cyan
Invoke-Item "set-admin-token.html"

# Instructions
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Instructions:" -ForegroundColor Yellow
Write-Host "1. Use the browser page that just opened to set your admin token" -ForegroundColor White
Write-Host "2. Visit your WinGroX application in the same browser" -ForegroundColor White
Write-Host "3. You should now see the ADD NEW PRODUCT button on the Products page" -ForegroundColor White
Write-Host ""
Write-Host "If you still don't see the button, check the browser console for errors." -ForegroundColor White
Write-Host ""

# Return to original directory
Set-Location -Path ".."
