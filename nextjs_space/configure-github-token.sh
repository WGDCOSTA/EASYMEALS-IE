
#!/bin/bash

# GitHub Token Configuration Script
# This will configure Git to use your Personal Access Token for authentication

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  GitHub Token Configuration${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""

# First, ensure repository exists on GitHub
echo -e "${YELLOW}Prerequisites Check:${NC}"
echo ""
echo "1. Have you created the repository on GitHub?"
echo "   Repository name: easymeals-ie"
echo "   URL: https://github.com/WGDCOSTA/easymeals-ie"
echo ""
echo "   If not, go to: https://github.com/new"
echo "   - Name: easymeals-ie"
echo "   - Public"
echo "   - Do NOT initialize with any files"
echo ""
read -p "Repository created? (y/n): " repo_created

if [[ ! $repo_created =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Please create the repository first, then run this script again.${NC}"
    exit 0
fi

echo ""
echo "2. Do you have a GitHub Personal Access Token?"
echo "   Token needs 'repo' scope."
echo ""
echo "   If not, create one at: https://github.com/settings/tokens/new"
echo "   - Note: EasyMeals DeepAgent"
echo "   - Expiration: No expiration (or your preference)"
echo "   - Select scope: ✓ repo (Full control)"
echo "   - Generate token"
echo "   - COPY THE TOKEN (you won't see it again!)"
echo ""
read -p "Do you have your token ready? (y/n): " token_ready

if [[ ! $token_ready =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Please create your token first, then run this script again.${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Enter your GitHub Personal Access Token:${NC}"
read -s GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}✗ Token cannot be empty${NC}"
    exit 1
fi

# Configure Git to use the token
echo ""
echo -e "${BLUE}Configuring Git...${NC}"

# Set up Git credential helper
git config --global credential.helper store

# Create credentials file with the token
GITHUB_USER="WGDCOSTA"
REPO_NAME="easymeals-ie"

# Update remote URL to use token
cd /home/ubuntu/easymeals_ie/nextjs_space

# Remove existing remote
git remote remove origin 2>/dev/null

# Add remote with token embedded
git remote add origin "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo -e "${GREEN}✓ Git configured with token authentication${NC}"

echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
echo ""

# Push to GitHub
if git push -u origin master 2>&1; then
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo ""
    echo "Your repository is now live at:"
    echo "  https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "Future commits will use the saved token automatically."
    echo "Use: ./commit-and-push.sh \"Your message\""
    echo ""
else
    echo ""
    echo -e "${RED}✗ Push failed${NC}"
    echo ""
    echo "This might be because:"
    echo "  1. The repository doesn't exist on GitHub"
    echo "  2. The token doesn't have 'repo' scope"
    echo "  3. The token has expired"
    echo ""
    echo "Please verify and try again."
fi
