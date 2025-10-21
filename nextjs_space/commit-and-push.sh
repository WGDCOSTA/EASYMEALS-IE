
#!/bin/bash

# Auto-commit and push script for deployments
# This script will be called after each successful deployment

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

COMMIT_MSG="${1:-Automated deployment update}"

echo -e "${BLUE}Starting auto-commit and push...${NC}"

# Check if there are changes
if ! git diff --quiet || ! git diff --cached --quiet || git ls-files --others --exclude-standard | grep -q .; then
    echo -e "${BLUE}Changes detected. Committing...${NC}"
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    git commit -m "$COMMIT_MSG - $TIMESTAMP"
    
    # Push to GitHub
    echo -e "${BLUE}Pushing to GitHub...${NC}"
    git push origin master
    
    echo -e "${GREEN}✓ Changes committed and pushed successfully${NC}"
else
    echo -e "${BLUE}No changes to commit${NC}"
fi
