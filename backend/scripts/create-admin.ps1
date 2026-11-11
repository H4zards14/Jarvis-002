
$BaseUrl = "http://localhost:5000"

Write-Host "`n=== JARVIS-002 PRIVATE ACCOUNT SETUP ===" -ForegroundColor Cyan

$Username = Read-Host "Choose your username"
$Password = Read-Host "Choose your account password" -AsSecureString

$PasswordPlain = [System.Net.NetworkCredential]::new("", $Password).Password

# Read AUTH_SETUP_SECRET directly from backend/.env
$EnvFile = Join-Path $PSScriptRoot "..\.env"
$EnvLine = Get-Content $EnvFile | Where-Object { $_ -match '^AUTH_SETUP_SECRET=' } | Select-Object -First 1

if (-not $EnvLine) {
    Write-Host "AUTH_SETUP_SECRET was not found in .env." -ForegroundColor Red
    exit
}

$SetupSecretPlain = $EnvLine.Substring("AUTH_SETUP_SECRET=".Length).Trim().Trim('"').Trim("'")

$Body = @{
    username = $Username
    password = $PasswordPlain
} | ConvertTo-Json

try {
    $Response = Invoke-RestMethod `
        -Uri "$BaseUrl/api/auth/setup" `
        -Method Post `
        -Headers @{ "x-setup-secret" = $SetupSecretPlain } `
        -ContentType "application/json" `
        -Body $Body

    Write-Host "`nSUCCESS: Your private account has been created!" -ForegroundColor Green
    Write-Host "Username: $($Response.user.username)"
}
catch {
    Write-Host "`nAccount setup failed." -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
    else {
        Write-Host $_.Exception.Message
    }
}
finally {
    $SetupSecretPlain = $null
    $PasswordPlain = $null
    $Body = $null
    $Password = $null
}
