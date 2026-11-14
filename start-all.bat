@echo off
echo =========================================================
echo   Starting EasyHousingSolution Microservices ^& Swagger
echo =========================================================

echo Starting IdentityService (Port 5001)...
start "IdentityService (5001)" cmd /k "cd /d %~dp0IdentityService\EasyHousingSolution.IdentityService.API && dotnet run"

echo Starting PropertyService (Port 5002)...
start "PropertyService (5002)" cmd /k "cd /d %~dp0PropertyService\EasyHousingSolution.PropertyService.API && dotnet run"

echo Starting UserService (Port 5003)...
start "UserService (5003)" cmd /k "cd /d %~dp0UserService\EasyHousingSolution.UserService.API && dotnet run"

echo Starting CartService (Port 5004)...
start "CartService (5004)" cmd /k "cd /d %~dp0CartService\EasyHousingSolution.CartService.API && dotnet run"

echo Waiting 4 seconds for backend services to initialize...
timeout /t 4 /nobreak >nul

echo Starting ApiGateway (Port 5000)...
start "ApiGateway (5000)" cmd /k "cd /d %~dp0ApiGateway\EasyHousingSolution.ApiGateway && dotnet run"

echo Opening Unified Swagger Portal in your default browser...
timeout /t 3 /nobreak >nul
start http://localhost:5000/swagger

echo Done! Microservices and Unified Swagger UI are running.
