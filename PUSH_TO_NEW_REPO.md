# 🚀 Guide: Push Backend Code to New Repository

## Step-by-Step Instructions

### Option 1: Create New Repository and Add as Remote

1. **Create New GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `hostel-backend-production` (or any name you prefer)
   - Description: "Hostel Management System Backend API"
   - Make it **Public** or **Private** as per your choice
   - **DON'T** initialize with README
   - Click "Create repository"

2. **Add New Remote**
   ```bash
   cd "/Users/ashishpimple/Desktop/Hostel Manage/backend"
   
   # Add new remote (replace with your new repo URL)
   git remote add new-origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO_NAME.git
   
   # Push to new repository
   git push -u new-origin main
   ```

3. **Verify**
   ```bash
   # Check all remotes
   git remote -v
   
   # You should see:
   # origin       git@github.com:ashishpimple94/hostel-management-backend.git
   # new-origin   https://github.com/YOUR_USERNAME/YOUR_NEW_REPO_NAME.git
   ```

---

### Option 2: Replace Current Remote

If you want to completely change the remote repository:

1. **Create New GitHub Repository** (same as above)

2. **Remove Old Remote and Add New**
   ```bash
   cd "/Users/ashishpimple/Desktop/Hostel Manage/backend"
   
   # Remove old remote
   git remote remove origin
   
   # Add new remote
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO_NAME.git
   
   # Push to new repository
   git push -u origin main
   ```

---

### Option 3: Keep Both Remotes

If you want to push to both repositories:

```bash
cd "/Users/ashishpimple/Desktop/Hostel Manage/backend"

# Add second remote
git remote add backup https://github.com/YOUR_USERNAME/YOUR_NEW_REPO_NAME.git

# Push to both
git push origin main
git push backup main

# Or set up tracking to push to both
git push --all origin
git push --all backup
```

---

### Quick Commands Reference

```bash
# Check current remotes
git remote -v

# Add new remote
git remote add <name> <url>

# Remove remote
git remote remove <name>

# Rename remote
git remote rename <old-name> <new-name>

# Push to specific remote
git push <remote-name> main

# Push to all remotes
git push --all
```

---

### SSH vs HTTPS

Choose based on your GitHub setup:

**HTTPS:**
```bash
git remote add new-origin https://github.com/username/repo.git
```

**SSH:**
```bash
git remote add new-origin git@github.com:username/repo.git
```

---

## Need Help?

1. Check your GitHub SSH keys: `ssh -T git@github.com`
2. Verify repository exists on GitHub
3. Make sure you have push permissions to the repository
4. Check repository URL is correct (no typos)

