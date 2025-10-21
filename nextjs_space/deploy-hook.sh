
#!/bin/bash

# This script is called after successful deployments
# It automatically commits and pushes changes to GitHub

CHECKPOINT_DESC="$1"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}  Post-Deployment: GitHub Sync${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Check if Git remote is configured
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ GitHub remote not configured${NC}"
    echo -e "${YELLOW}Run './setup-github.sh' to set up GitHub integration${NC}"
    exit 0
fi

# Check if there are changes
if ! git diff --quiet || ! git diff --cached --quiet || git ls-files --others --exclude-standard | grep -q .; then
    echo -e "${BLUE}📝 Changes detected, committing...${NC}"
    
    # Stage all changes
    git add .
    
    # Create commit message
    if [ -n "$CHECKPOINT_DESC" ]; then
        COMMIT_MSG="Deploy: $CHECKPOINT_DESC"
    else
        COMMIT_MSG="Deployment update"
    fi
    
    # Commit
    git commit -m "$COMMIT_MSG - $TIMESTAMP" || true
    
    # Push to GitHub
    echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
    if git push origin master 2>&1; then
        echo -e "${GREEN}✓ Successfully pushed to GitHub${NC}"
        echo -e "${GREEN}  View at: https://github.com/WGDCOSTA/easymeals-ie${NC}"
    else
        echo -e "${YELLOW}⚠ Push failed - you may need to pull first${NC}"
        echo -e "${YELLOW}  Run: git pull origin master --rebase && git push${NC}"
    fi
else
    echo -e "${BLUE}ℹ No changes to commit${NC}"
fi

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
