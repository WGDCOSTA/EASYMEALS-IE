
# GitHub Repository Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Fill in the details**:
   - **Repository name**: `easymeals-ie`
   - **Description**: `EasyMeals.ie - Modern eCommerce platform for ready-made meals with AI-powered nutrition tracking`
   - **Visibility**: Choose Public or Private
   - **⚠️ IMPORTANT**: Do NOT check "Add a README file", "Add .gitignore", or "Choose a license"
3. **Click**: "Create repository"

### Step 2: Run Setup Script

After creating the repository on GitHub, run this command in your terminal:

```bash
cd /home/ubuntu/easymeals_ie/nextjs_space
./setup-github.sh
```

The script will:
- ✅ Configure the GitHub remote
- ✅ Push your existing code
- ✅ Set up the main branch

**That's it!** Your repository will be live at: `https://github.com/WGDCOSTA/easymeals-ie`

---

## Automatic Commits on Deployment

### How it Works

Every time you deploy the application (using `build_and_save_nextjs_project_checkpoint`), your changes will automatically be:
1. Committed to Git with a descriptive message
2. Pushed to GitHub
3. Tagged with the deployment timestamp

### Manual Commit & Push

You can also manually commit and push changes at any time:

```bash
cd /home/ubuntu/easymeals_ie/nextjs_space
./commit-and-push.sh "Your commit message here"
```

### View Your Repository

Once set up, you can view your code at:
**https://github.com/WGDCOSTA/easymeals-ie**

---

## Troubleshooting

### Issue: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/WGDCOSTA/easymeals-ie.git
```

### Issue: "Authentication failed"
Make sure you're logged into GitHub in your browser, or set up a personal access token:
1. Go to: https://github.com/settings/tokens
2. Generate a new token with "repo" scope
3. Use it when prompted for password:
   ```bash
   Username: WGDCOSTA
   Password: <your-token>
   ```

### Issue: "Push rejected"
If the remote has changes you don't have locally:
```bash
git pull origin master --rebase
git push origin master
```

---

## Project Status

- ✅ Git initialized
- ✅ .gitignore configured
- ⏳ Awaiting GitHub repository creation
- ⏳ Awaiting initial push

After you complete Step 1 and Step 2 above, everything will be ready!
