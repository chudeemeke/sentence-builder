@echo off
REM Sentence Builder - Quick Start Script (Windows)
REM Makes it easy to start the development server

echo.
echo  Starting Sentence Builder...
echo ================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo  Installing dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo  Creating .env file...
    copy .env.example .env
    echo  Created .env file - configure API keys if needed
)

REM Kill any process using port 5173
echo  Checking for port conflicts...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a 2>nul

echo.
echo  Starting development server...
echo ================================
echo  Local:   http://localhost:5173
echo  Network: Will display after startup
echo ================================
echo.

REM Start the dev server
call npm run dev -- --host --open