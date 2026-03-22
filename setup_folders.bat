@echo off
REM Create all necessary folders
cd /d C:\Users\drmit\Desktop\cares4me-clean\src\app
if not exist "about" mkdir "about"
if not exist "faq" mkdir "faq"
if not exist "dashboard" mkdir "dashboard"
if not exist "blog" mkdir "blog"
if not exist "transparency" mkdir "transparency"
if not exist "contact" mkdir "contact"
echo Folders created successfully!
dir /B /AD
pause
