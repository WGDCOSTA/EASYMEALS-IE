
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   EasyMeals GitHub Repository Setup       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Repository details
REPO_NAME="easymeals-ie"
REPO_URL="https://github.com/WGDCOSTA/${REPO_NAME}.git"

echo -e "${YELLOW}Step 1: Create GitHub Repository${NC}"
echo "Please create a new repository on GitHub:"
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: ${REPO_NAME}"
echo "  3. Description: EasyMeals.ie - Modern eCommerce platform for ready-made meals with AI-powered nutrition tracking"
echo "  4. Select: Public or Private (your choice)"
echo "  5. Do NOT initialize with README, .gitignore, or license"
echo "  6. Click 'Create repository'"
echo ""
read -p "Press Enter once you've created the repository..."

echo ""
echo -e "${YELLOW}Step 2: Configure Git Remote${NC}"

# Check if remote already exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "Remote 'origin' already exists. Removing..."
    git remote remove origin
fi

# Add the remote
git remote add origin "$REPO_URL"
echo -e "${GREEN}✓ Remote added: $REPO_URL${NC}"

echo ""
echo -e "${YELLOW}Step 3: Push existing commits${NC}"
git push -u origin master
echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

echo ""
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}  GitHub repository setup complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo "Your repository is now available at:"
echo "  https://github.com/WGDCOSTA/${REPO_NAME}"
