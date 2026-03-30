@echo off
echo ===========================================
echo   Care4ME DigitalOcean Droplet Setup Script
echo ===========================================
echo.
echo This script will help you set up your server.
echo Make sure you have:
echo - Your Droplet IP address
echo - SSH key added to DigitalOcean
echo - Project pushed to GitHub
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 1: Connect to your server
echo Command: ssh root@YOUR_DROPLET_IP
echo (Replace YOUR_DROPLET_IP with your actual IP)
echo.
echo After connecting, run these commands on your server:
echo.

echo STEP 2: Update system
echo sudo apt update ^&^& sudo apt upgrade -y
echo sudo apt install -y curl wget git htop ufw
echo.

echo STEP 3: Configure firewall
echo sudo ufw allow ssh
echo sudo ufw allow 80
echo sudo ufw allow 443
echo sudo ufw enable
echo sudo ufw status
echo.

echo STEP 4: Install Node.js
echo curl -fsSL https://deb.nodesource.com/setup_20.x ^| sudo -E bash -
echo sudo apt-get install -y nodejs
echo node --version
echo npm --version
echo.

echo STEP 5: Install PM2
echo sudo npm install -g pm2
echo.

echo STEP 6: Clone project
echo git clone https://github.com/yourusername/cares4me.git
echo cd cares4me
echo npm install
echo.

echo STEP 7: Create environment file
echo nano .env.local
echo (Add your DISCORD_BOT_TOKEN and save with Ctrl+X, Y, Enter)
echo.

echo STEP 8: Build application
echo npm run build
echo.

echo STEP 9: Setup Nginx
echo sudo apt install -y nginx
echo sudo nano /etc/nginx/sites-available/cares4me
echo (Paste the Nginx config and save)
echo sudo ln -s /etc/nginx/sites-available/cares4me /etc/nginx/sites-enabled/
echo sudo nginx -t
echo sudo systemctl restart nginx
echo.

echo STEP 10: Start services
echo pm2 start npm --name "cares4me-web" -- start
echo pm2 start npm --name "cares4me-bot" -- run bot
echo pm2 save
echo pm2 startup
echo.

echo STEP 11: Verify setup
echo pm2 status
echo.

echo ===========================================
echo NGNIX CONFIGURATION (copy this):
echo ===========================================
echo server {
echo     listen 80;
echo     server_name YOUR_DROPLET_IP;
echo.
echo     location / {
echo         proxy_pass http://localhost:3000;
echo         proxy_http_version 1.1;
echo         proxy_set_header Upgrade $http_upgrade;
echo         proxy_set_header Connection 'upgrade';
echo         proxy_set_header Host $host;
echo         proxy_set_header X-Real-IP $remote_addr;
echo         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo         proxy_set_header X-Forwarded-Proto $scheme;
echo         proxy_cache_bypass $http_upgrade;
echo     }
echo }
echo ===========================================
echo.
echo TROUBLESHOOTING COMMANDS:
echo pm2 status
echo pm2 logs cares4me-web --lines 10
echo pm2 logs cares4me-bot --lines 10
echo sudo systemctl status nginx
echo netstat -tlnp ^| grep :3000
echo.
echo Your site will be at: http://YOUR_DROPLET_IP
echo.
echo Setup complete! Press any key to exit.
pause >nul