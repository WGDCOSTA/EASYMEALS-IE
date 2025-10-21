
#!/bin/bash

# Auto-commit and push script for deployments
# This script will be called after each successful deployment

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

COMMIT_MSG="${1:-Automated deployment update}"

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}  GitHub Auto-Commit & Push${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Check if there are changes
if ! git diff --quiet || ! git diff --cached --quiet || git ls-files --others --exclude-standard | grep -q .; then
    echo -e "${BLUE}📝 Changes detected. Committing...${NC}"
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "$COMMIT_MSG - $TIMESTAMP"
    
    # Push to GitHub
    echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
    if git push origin master 2>&1; then
        echo -e "${GREEN}✓ Changes committed and pushed successfully${NC}"
        echo -e "${GREEN}  View at: https://github.com/WGDCOSTA/EASYMEALS-IE${NC}"
    else
        echo -e "${YELLOW}⚠ Push failed - check connection and credentials${NC}"
    fi
else
    echo -e "${BLUE}ℹ  No changes to commit${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
