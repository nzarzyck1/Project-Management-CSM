@echo off
set "INSTALLED_APP=%LOCALAPPDATA%\Programs\LaunchPad\LaunchPad.exe"
if exist "%INSTALLED_APP%" (
  start "" "%INSTALLED_APP%"
  exit /b
)
set "APP_DIR=%~dp0dist\win-unpacked"
start "" "%APP_DIR%\LaunchPad.exe"
