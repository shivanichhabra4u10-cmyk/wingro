@echo off
echo Starting WinGroX API with MongoDB connection...
echo ==================================================

echo.
echo Starting API server...
echo This terminal must remain open for the API to work.
echo.

:: Set environment variables for the API
set MONGODB_URI=mongodb://127.0.0.1:27017/wingrox_db

:: Start the API server
node guaranteed-community-api.js
