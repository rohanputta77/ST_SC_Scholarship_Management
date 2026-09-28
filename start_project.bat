@echo off
echo Starting STSC Project...
echo Please wait while the development server starts...

cd /d "d:\DOWNLOADS\STSC"

:: Start the project in a new window
start "STSC Server" cmd /k "pnpm run dev"

:: Wait 7 seconds to ensure the Next.js server has time to start
timeout /t 7 /nobreak >nul

:: Open the localhost URL in the default web browser
start http://localhost:3000
