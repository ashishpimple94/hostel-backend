# 📦 MongoDB Data Migration Guide

## Migrate Local Data to MongoDB Atlas (Production)

---

## 🎯 Step 1: Setup MongoDB Atlas

### 1.1 Create Free Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a new project: "Hostel Management"

### 1.2 Create Cluster
1. Click "Build a Cluster"
2. Choose **FREE** M0 Sandbox
3. Select region closest to you (e.g., Mumbai/Singapore)
4. Cluster Name: `Cluster0`
5. Click "Create Cluster" (takes 3-5 minutes)

### 1.3 Create Database User
1. Go to **Database Access** (left menu)
2. Click "+ ADD NEW DATABASE USER"
3. Authentication Method: Password
   - Username: `hostel_admin`
   - Password: Generate secure password (SAVE THIS!)
   - Example: `HostelSecure2024!@#`
4. Database User Privileges: **Read and write to any database**
5. Click "Add User"

### 1.4 Whitelist IP Address
1. Go to **Network Access** (left menu)
2. Click "+ ADD IP ADDRESS"
3. Click "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)
   - For production, use specific IPs only
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to **Database** (left menu)
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy connection string:
   ```
   mongodb+srv://hostel_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name:
   ```
   mongodb+srv://hostel_admin:HostelSecure2024!@#@cluster0.xxxxx.mongodb.net/hostel_management?retryWrites=true&w=majority
   ```

---

## 🚀 Step 2: Export Local Data

### Method 1: Using mongodump (Recommended)

```bash
# Export all data from local MongoDB
mongodump --uri="mongodb://localhost:27017/hostel_management" --out=/Users/ashishpimple/Desktop/hostel_backup

# You should see output like:
# 2024-10-26 exported hostel_management.students
# 2024-10-26 exported hostel_management.users
# etc.
```

---

## 📤 Step 3: Import to MongoDB Atlas

### Method 1: Using mongorestore (Recommended)

```bash
# Replace with YOUR connection string
mongorestore --uri="mongodb+srv://hostel_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hostel_management" /Users/ashishpimple/Desktop/hostel_backup/hostel_management

# You should see:
# preparing collections to restore from
# reading metadata for hostel_management.students
# restoring hostel_management.students
# finished restoring hostel_management.students (X documents)
```

### Method 2: Using MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to Atlas using connection string
3. Select database `hostel_management`
4. For each collection:
   - Click "ADD DATA" → "Import File"
   - Select JSON/CSV file
   - Click "Import"

---

## 🔄 Step 4: Alternative - Use Seed Script with Atlas

### 4.1 Update .env with Atlas connection

```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend

# Edit .env file
nano .env
```

Add/Update:
```env
MONGODB_URI=mongodb+srv://hostel_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hostel_management?retryWrites=true&w=majority
NODE_ENV=production
```

### 4.2 Run Seed Script

```bash
# Make sure you're in backend directory
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend

# Run seed script
node seedComplete.js

# This will create all demo data in Atlas
```

---

## ✅ Step 5: Verify Data Migration

### Test Connection
```bash
# Test with mongo shell
mongosh "mongodb+srv://hostel_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hostel_management"

# Then run:
show collections
db.students.countDocuments()
db.users.countDocuments()
```

### Or check in Atlas Dashboard
1. Go to Database → Browse Collections
2. Select `hostel_management` database
3. Check all collections have data

---

## 🔐 Step 6: Update Backend Environment

### For Local Testing (pointing to Atlas)
```bash
# backend/.env
MONGODB_URI=mongodb+srv://hostel_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hostel_management?retryWrites=true&w=majority
```

### For Production (Render/Railway/Vercel)
Add environment variable:
- Key: `MONGODB_URI`
- Value: Your Atlas connection string

---

## 📊 Step 7: Backup Strategy

### Regular Backups
```bash
# Backup script (run weekly)
mongodump --uri="mongodb+srv://hostel_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hostel_management" --out=/Users/ashishpimple/Desktop/backups/$(date +%Y%m%d)
```

### Automated Cloud Backups
- Atlas M10+ clusters have automatic backups
- Free M0 tier: Manual backups only

---

## 🆘 Troubleshooting

### Can't connect to Atlas
```bash
# Test connection
mongosh "YOUR_CONNECTION_STRING"

# Check:
# 1. Password is correct (no special chars issues)
# 2. IP whitelist includes 0.0.0.0/0
# 3. User has correct permissions
```

### mongodump/mongorestore not found
```bash
# Install MongoDB Database Tools
brew install mongodb-database-tools

# Or download from:
# https://www.mongodb.com/try/download/database-tools
```

### Connection timeout
- Check internet connection
- Verify cluster is running (not paused)
- Check firewall settings

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created and running
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Local data exported (mongodump)
- [ ] Data imported to Atlas (mongorestore)
- [ ] Data verified in Atlas dashboard
- [ ] Backend .env updated with Atlas URI
- [ ] Backend tested with Atlas connection

---

## 🎯 Quick Commands Reference

```bash
# Export local data
mongodump --uri="mongodb://localhost:27017/hostel_management" --out=./backup

# Import to Atlas
mongorestore --uri="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/hostel_management" ./backup/hostel_management

# Test Atlas connection
mongosh "mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/hostel_management"

# Count documents
db.students.countDocuments()
db.users.countDocuments()
```

---

**After migration, your data will be:**
- ✅ Live on cloud (accessible anywhere)
- ✅ Automatically replicated (3 copies)
- ✅ Fast global access
- ✅ Free up to 512MB

Good luck! 🚀
