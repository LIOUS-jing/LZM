@echo off
echo Setting up portfolio project...

rem Copy main files
copy index.html portfolio\
copy styles.css portfolio\
copy script.js portfolio\

rem Copy images
if exist "images\profile.png" (
    copy "images\profile.png" "portfolio\images\"
)

echo Setup complete!
echo.
echo Next steps:
echo 1. Visit https://vercel.com and sign up/login
echo 2. Install Vercel CLI or use the web interface
echo 3. Deploy your portfolio folder
echo.
echo Your portfolio is ready to be deployed!
pause 