# 🔧 Port 5001 Issue - Quick Fix

## Problem
Backend server shows: `Error: listen EADDRINUSE: address already in use :::5001`

---

## ✅ Quick Solutions (Choose One)

### Method 1: Use Clean Start Script (Recommended)
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
./start.sh
```
This automatically kills any process on port 5001 and starts the server.

---

### Method 2: Use npm script
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend

# Kill port first
npm run kill

# Then start
npm start
```

---

### Method 3: Manual Kill
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Then start server
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
node server.js
```

---

### Method 4: Use Different Port
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend

# Start on port 5002
PORT=5002 node server.js
```
Then update frontend to use port 5002.

---

## 🎯 Permanent Fix

### Add to your .zshrc (one-time setup)
```bash
echo 'alias killport="lsof -ti:5001 | xargs kill -9"' >> ~/.zshrc
source ~/.zshrc
```

Now you can just run:
```bash
killport
```

---

## 🔍 Check What's Using the Port
```bash
lsof -i:5001
```

This shows which process is using port 5001.

---

## 💡 Why This Happens

1. Server crashed but process didn't terminate
2. Multiple terminal tabs running server
3. Previous `node server.js` still running
4. Nodemon didn't exit properly

---

## 🚀 Best Practice

**Always use the clean start script:**
```bash
cd backend
./start.sh
```

Or use the npm script:
```bash
npm run start:clean
```

This ensures port is free before starting! ✅
