@echo off
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrator privileges...
    powershell Start-Process -FilePath "%~f0" -Verb RunAs
    exit /b
)
netsh advfirewall firewall add rule name="Demand Dev Server (3000)" dir=in action=allow protocol=TCP localport=3000
echo Firewall rule added! You can now access the dev server from your phone.
pause
