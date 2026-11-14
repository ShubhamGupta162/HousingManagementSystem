Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   Starting EasyHousingSolution Microservices & Swagger" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Write-Host "Starting IdentityService (Port 5001)..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "$root\IdentityService\EasyHousingSolution.IdentityService.API"

Write-Host "Starting PropertyService (Port 5002)..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "$root\PropertyService\EasyHousingSolution.PropertyService.API"

Write-Host "Starting UserService (Port 5003)..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "$root\UserService\EasyHousingSolution.UserService.API"

Write-Host "Starting CartService (Port 5004)..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "$root\CartService\EasyHousingSolution.CartService.API"

Write-Host "Waiting 4 seconds for downstream services..." -ForegroundColor Gray
Start-Sleep -Seconds 4

Write-Host "Starting ApiGateway (Port 5000)..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run" -WorkingDirectory "$root\ApiGateway\EasyHousingSolution.ApiGateway"

Start-Sleep -Seconds 3
Write-Host "Opening Unified Swagger Portal..." -ForegroundColor Green
Start-Process "http://localhost:5000/swagger"

Write-Host "Done! Unified Swagger Portal running at http://localhost:5000/swagger" -ForegroundColor Green
