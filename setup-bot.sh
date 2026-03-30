#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# Care4ME Discord Bot - DigitalOcean Setup Script
# ═══════════════════════════════════════════════════════════════════════════════

set -e

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  Care4ME Discord Bot - Setup Script"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

# Configuration
APP_DIR="${APP_DIR:-/root/cares4me-2026}"
SERVICE_NAME="care4me-bot"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# ───────────────────────────────────────────────────────────────────────────────
# Step 1: Check Node.js
# ───────────────────────────────────────────────────────────────────────────────

echo "Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
print_status "Node.js $(node -v) installed"

# ───────────────────────────────────────────────────────────────────────────────
# Step 2: Check dependencies
# ───────────────────────────────────────────────────────────────────────────────

echo ""
echo "Step 2: Installing dependencies..."
cd "$APP_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found in $APP_DIR"
    exit 1
fi

# Install dependencies
npm install discord.js sharp dotenv
print_status "Dependencies installed"

# ───────────────────────────────────────────────────────────────────────────────
# Step 3: Check environment variables
# ───────────────────────────────────────────────────────────────────────────────

echo ""
echo "Step 3: Checking environment variables..."

if [ ! -f ".env.local" ]; then
    print_warning ".env.local not found. Creating template..."
    cat > .env.local << EOF
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_MEDIA_CHANNEL_ID=1484953248560447703

# App Directory (optional, defaults to current directory)
APP_DIR=/root/cares4me-2026
EOF
    print_warning "Please edit .env.local and add your DISCORD_BOT_TOKEN"
    echo ""
    echo "  nano .env.local"
    echo ""
fi

# Verify token exists
if grep -q "your_bot_token_here" .env.local 2>/dev/null; then
    print_error "DISCORD_BOT_TOKEN not configured in .env.local"
    echo ""
    echo "  1. Go to https://discord.com/developers/applications"
    echo "  2. Select your bot → Bot → Copy Token"
    echo "  3. Paste it in .env.local"
    echo ""
    exit 1
fi
print_status "Environment variables configured"

# ───────────────────────────────────────────────────────────────────────────────
# Step 4: Create directories
# ───────────────────────────────────────────────────────────────────────────────

echo ""
echo "Step 4: Creating directories..."
mkdir -p "$APP_DIR/public/media-metadata"
mkdir -p "$APP_DIR/public/uploads"
chmod 755 "$APP_DIR/public/media-metadata"
chmod 755 "$APP_DIR/public/uploads"
print_status "Directories created"

# ───────────────────────────────────────────────────────────────────────────────
# Step 5: Setup systemd service
# ───────────────────────────────────────────────────────────────────────────────

echo ""
echo "Step 5: Setting up systemd service..."

# Copy service file
sudo cp care4me-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
print_status "Systemd service configured"

# ───────────────────────────────────────────────────────────────────────────────
# Step 6: Start the bot
# ───────────────────────────────────────────────────────────────────────────────

echo ""
echo "Step 6: Starting Discord bot..."
sudo systemctl restart $SERVICE_NAME

# Wait a moment for startup
sleep 3

# Check status
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    print_status "Bot is running!"
else
    print_error "Bot failed to start. Check logs:"
    echo ""
    echo "  sudo journalctl -u $SERVICE_NAME -f"
    echo ""
    exit 1
fi

# ───────────────────────────────────────────────────────────────────────────────
# Done!
# ───────────────────────────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "  Commands:"
echo "    View logs:    sudo journalctl -u $SERVICE_NAME -f"
echo "    Restart:      sudo systemctl restart $SERVICE_NAME"
echo "    Stop:         sudo systemctl stop $SERVICE_NAME"
echo "    Status:       sudo systemctl status $SERVICE_NAME"
echo ""
echo "  Test the bot by uploading an image to your Discord channel!"
echo ""
