
#!/bin/bash

# Quick Git status overview

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}  EasyMeals Git Repository Status${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""

# Check if Git is initialized
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✗ Git not initialized${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git initialized${NC}"

# Check remote
if git remote get-url origin > /dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✓ Remote configured: ${NC}$REMOTE_URL"
else
    echo -e "${YELLOW}⚠ No remote configured${NC}"
    echo -e "  Run './setup-github.sh' to set up GitHub"
fi

# Check branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo -e "${BLUE}📍 Current branch: ${NC}$BRANCH"

# Check for uncommitted changes
if git diff --quiet && git diff --cached --quiet && ! git ls-files --others --exclude-standard | grep -q .; then
    echo -e "${GREEN}✓ Working directory clean${NC}"
else
    echo -e "${YELLOW}⚠ Uncommitted changes detected${NC}"
    
    # Show status
    echo ""
    echo "Modified files:"
    git status --short
fi

# Show last commit
echo ""
echo "Last commit:"
git log -1 --oneline 2>/dev/null || echo "  No commits yet"

# Show commits ahead/behind
if git remote get-url origin > /dev/null 2>&1; then
    echo ""
    AHEAD=$(git rev-list --count origin/$BRANCH..$BRANCH 2>/dev/null || echo "0")
    BEHIND=$(git rev-list --count $BRANCH..origin/$BRANCH 2>/dev/null || echo "0")
    
    if [ "$AHEAD" -gt 0 ]; then
        echo -e "${YELLOW}↑ $AHEAD commit(s) ahead of remote${NC}"
        echo "  Run './commit-and-push.sh' to push"
    fi
    
    if [ "$BEHIND" -gt 0 ]; then
        echo -e "${YELLOW}↓ $BEHIND commit(s) behind remote${NC}"
        echo "  Run 'git pull' to update"
    fi
    
    if [ "$AHEAD" -eq 0 ] && [ "$BEHIND" -eq 0 ]; then
        echo -e "${GREEN}✓ In sync with remote${NC}"
    fi
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo ""
