@echo off
set ROOT=%~dp0
set NODEJS=C:\Program Files\nodejs
set PNPM=%USERPROFILE%\AppData\Roaming\npm\pnpm.cmd
set PATH=%NODEJS%;%PATH%

if "%1"=="backend" goto :backend
if "%1"=="frontend" goto :frontend
if "%1"=="cap:android" goto :capandroid
if "%1"=="cap:ios" goto :capios

echo === Bygger workspace-paket ===
cd /d "%ROOT%"
call "%PNPM%" --filter=@demand/shared build
if errorlevel 1 exit /b 1
call "%PNPM%" --filter=@demand/database build
if errorlevel 1 exit /b 1
call "%PNPM%" --filter=@demand/backend build
if errorlevel 1 exit /b 1

echo === Startar backend (port 4000) ===
start "Demand Backend" cmd /c "set PATH=%NODEJS%;%%PATH%% && cd /d %ROOT%packages\backend && ""%NODEJS%\node.exe"" dist\main.js"

timeout /t 3 /nobreak >nul

echo === Startar frontend (port 3000) ===
start "Demand Frontend" cmd /c "set PATH=%NODEJS%;%%PATH%% && cd /d %ROOT% && call ""%PNPM%"" --filter=@demand/web dev"

echo.
echo Demand har startats:
echo   Backend:  http://localhost:4000
echo   Frontend: http://localhost:3000
echo Stang konsolfonstren for att stoppa.
goto :eof

:backend
cd /d "%ROOT%packages\backend"
echo Backend pa http://localhost:4000
"%NODEJS%\node.exe" dist\main.js
goto :eof

:frontend
cd /d "%ROOT%"
echo Frontend pa http://localhost:3000
call "%PNPM%" --filter=@demand/web dev
goto :eof

:capandroid
cd /d "%ROOT%"
set CAPACITOR=true
echo Bygger webb for Android...
call "%PNPM%" --filter=@demand/web build
if errorlevel 1 exit /b 1
echo Laggar till Android-platform...
call "%PNPM%" exec cap add android
call "%PNPM%" exec cap sync
echo Oppnar Android Studio...
call "%PNPM%" exec cap open android
goto :eof

:capios
cd /d "%ROOT%"
set CAPACITOR=true
echo Bygger webb for iOS...
call "%PNPM%" --filter=@demand/web build
if errorlevel 1 exit /b 1
echo Laggar till iOS-platform...
call "%PNPM%" exec cap add ios
call "%PNPM%" exec cap sync
echo Oppnar Xcode...
call "%PNPM%" exec cap open ios
goto :eof
