# 🚀 Quick MongoDB Atlas Migration

## 5-Minute Guide to Deploy Your Data

---

## Option 1: Automated Script (Easiest) ⭐

### Step 1: Setup Atlas (2 minutes)
1. Visit: https://www.mongodb.com/cloud/atlas
2. Sign up → Create Free Cluster (M0)
3. Create Database User:
   - Username: `hostel_admin`
   - Password: `HostelSecure2024`
4. Network Access → Allow 0.0.0.0/0
5. Copy connection string:
   ```
   mongodb+srv://hostel_admin:HostelSecure2024@cluster0.xxxxx.mongodb.net/hostel_management
   ```

### Step 2: Run Migration Script (1 minute)
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
./migrate-to-atlas.sh
```

Follow prompts:
1. Confirm prerequisites: `y`
2. Paste your Atlas connection string
3. Wait for migration (30 seconds)
4. Update .env file: `y`

Done! ✅

---

## Option 2: Manual Migration (5 minutes)

### Install Tools (one-time)
```bash
brew install mongodb-database-tools
```

### Export Local Data
```bash
mongodump --uri="mongodb://localhost:27017/hostel_management" --out=/Users/ashishpimple/Desktop/hostel_backup
```

### Import to Atlas
```bash
# Replace with YOUR Atlas connection string
mongorestore --uri="mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/hostel_management" /Users/ashishpimple/Desktop/hostel_backup/hostel_management
```

### Update .env
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
nano .env
```

Add:
```
MONGODB_URI=mongodb+srv://hostel_admin:HostelSecure2024@cluster0.xxxxx.mongodb.net/hostel_management
```

---

## Option 3: Fresh Seed on Atlas (Fastest)

### Update .env First
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
nano .env
```

Add your Atlas URI:
```
MONGODB_URI=mongodb+srv://hostel_admin:YOUR_PASS@cluster0.xxxxx.mongodb.net/hostel_management
```

### Run Seed Script
```bash
node seedComplete.js
```

This creates all demo data directly on Atlas! 🎉

---

## Verify Migration

### Check in Atlas Dashboard
1. Go to https://cloud.mongodb.com
2. Database → Browse Collections
3. Select `hostel_management`
4. See all your data!

### Test Backend Connection
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
node server.js
```

Should connect to Atlas and show:
```
✅ Server running on port 5001
🌐 API: http://localhost:5001/api
💚 Health: http://localhost:5001/api/health
```

---

## Quick Commands

```bash
# Export from local
mongodump --uri="mongodb://localhost:27017/hostel_management" --out=./backup

# Import to Atlas (replace YOUR_ATLAS_URI)
mongorestore --uri="YOUR_ATLAS_URI" ./backup/hostel_management

# Test Atlas connection
mongosh "YOUR_ATLAS_URI"

# In mongo shell, verify:
show collections
db.students.countDocuments()
db.users.countDocuments()
```

---

## Troubleshooting

### mongodump not found?
```bash
brew install mongodb-database-tools
```

### Can't connect to Atlas?
- Check password (no special chars issues)
- Verify IP whitelist (0.0.0.0/0)
- Ensure cluster is running

### Need help?
Check detailed guide: `MIGRATE_DATA.md`

---

## What Gets Migrated?

All collections:
- ✅ Users (admin, students, etc.)
- ✅ Students (with all details)
- ✅ Rooms (allocation info)
- ✅ Fees (payment records)
- ✅ Complaints
- ✅ Attendance
- ✅ Visitors
- ✅ Notices

---

**Total Time: 5 minutes** ⏱️  
**Your data will be live on cloud!** ☁️

Ready? Run: `./migrate-to-atlas.sh` 🚀
