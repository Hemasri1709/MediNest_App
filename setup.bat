@echo off
echo.
echo 🏥 MediNest Hospital Management System - Setup Script
echo ======================================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local from .env.example...
    copy .env.example .env.local
    echo ✅ .env.local created!
    echo.
    echo ⚠️  IMPORTANT: Please update .env.local with your MongoDB connection string
    echo    Edit .env.local and replace 'your_mongodb_connection_string_here' with your actual MongoDB URI
    echo.
) else (
    echo ✅ .env.local already exists
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed!
    echo.
) else (
    echo ✅ Dependencies already installed
    echo.
)

echo 🎯 Next Steps:
echo 1. Update your MongoDB connection string in .env.local
echo 2. Run 'npm run seed' to populate the database with sample data
echo 3. Run 'npm run dev:all' to start both frontend and backend
echo.
echo Or run them separately:
echo - Frontend: npm run dev
echo - Backend: npm run server
echo.
echo 📚 For more information, see BACKEND_SETUP.md
echo.
pause
