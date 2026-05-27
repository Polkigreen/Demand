@echo off
chcp 65001 >nul

echo =============================================
echo   Demand - Mobilatkomst
echo =============================================
echo.

REM Hitta lokal IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do set IP=%%a
set IP=%IP: =%
echo Din lokala IP: %IP%
echo Port: 3000
echo.

REM Skapa admin-skript for brandvagg
set ADMIN_SCRIPT="%TEMP%\demand_firewall.bat"
echo @echo off > %ADMIN_SCRIPT%
echo netsh advfirewall firewall add rule name="Demand 3000" dir=in action=allow protocol=TCP localport=3000 ^>nul 2^>^&1
echo echo Brandvaggskonfiguration klar! >> %ADMIN_SCRIPT%
echo timeout /t 3 /nobreak ^>nul >> %ADMIN_SCRIPT%

REM Kopiera IP till urklipp
echo %IP%:3000 | clip
echo *** Din lokala IP (%IP%:3000) har kopierats till urklipp ***
echo.

:menu
echo Valj metod:
echo 1. LAN (kraver brandvagg - kor som administratör)
echo 2. Localtunnel (ingen installation, offentlig URL)
echo 3. Avbryt
echo.

set /p val="Val (1/2/3): "

if "%val%"=="1" goto :lan
if "%val%"=="2" goto :localtunnel
if "%val%"=="3" exit /b

:lan
echo.
echo Oppnar brandvaggskonfiguration...
echo Godkann UAC-popupen for att lagga till regel.
timeout /t 2 /nobreak >nul
powershell Start-Process cmd -ArgumentList "/c %ADMIN_SCRIPT%" -Verb RunAs
echo.
echo Forbind din telefon till samma natverk
echo och oppna http://%IP%:3000 i Chrome.
echo.
pause
exit /b

:localtunnel
echo.
echo Startar localtunnel...
echo URL: https://demandapp.loca.lt
echo.
echo OBS! Forsta gangen du besoker URL:en maste du
echo klicka "Click to Continue" pa sidan.
echo.
cmd /k "npx --yes localtunnel --port 3000 --subdomain demandapp"