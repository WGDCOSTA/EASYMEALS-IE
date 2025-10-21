#!/bin/bash

# GitHub Push Script with Token Authentication
# This script will push your code to GitHub using token authentication

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  EasyMeals GitHub Push${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""

# GitHub credentials
GITHUB_USER="WGDCOSTA"
REPO_NAME="easymeals-ie"

# Check if repository exists locally
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✗ Not a git repository${NC}"
    exit 1
fi

# First, create the repository on GitHub manually
echo -e "${YELLOW}Step 1: Create Repository on GitHub${NC}"
echo ""
echo "Please complete these steps:"
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: ${REPO_NAME}"
echo "  3. Keep it Public"
echo "  4. Do NOT initialize with README"
echo "  5. Click 'Create repository'"
echo ""
read -p "Have you created the repository? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please create the repository first, then run this script again.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Step 2: Configure Git Remote${NC}"

# Remove existing remote if present
if git remote get-url origin > /dev/null 2>&1; then
    git remote remove origin
fi

# Add new remote with HTTPS
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo -e "${GREEN}✓ Remote configured${NC}"

echo ""
echo -e "${YELLOW}Step 3: Push to GitHub${NC}"
echo ""
echo "When prompted for credentials:"
echo "  Username: ${GITHUB_USER}"
echo "  Password: <your GitHub Personal Access Token>"
echo ""
echo "If you don't have a token, create one at:"
echo "  https://github.com/settings/tokens/new"
echo "  (Select 'repo' scope)"
echo ""
read -p "Press Enter to continue..."

# Push to GitHub
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════${NC}"
    echo ""
    echo "Your repository is now live at:"
    echo "  https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Push failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure you created the repository on GitHub"
    echo "  2. Use your Personal Access Token as password, not your GitHub password"
    echo "  3. Token must have 'repo' scope enabled"
    echo ""
fi
