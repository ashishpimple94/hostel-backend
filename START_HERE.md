# 🎯 Start Here - Hostel Management Backend

**Quick links to get you started!**

---

## 🚀 Live API

**Base URL**: `https://hostel-backend-7lb7.onrender.com`

👉 **Test it now**: https://hostel-backend-7lb7.onrender.com/api/health

---

## 📚 Documentation Files

### For Postman Testing (NEW!)
1. **[POSTMAN_ROUTES.txt](./POSTMAN_ROUTES.txt)** - Copy-paste ready routes for Postman
2. **[POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md)** - Step-by-step Postman guide
3. **[API_ROUTES.md](./API_ROUTES.md)** - Complete API documentation with examples

### For Development
4. **[README.md](./README.md)** - Main project documentation
5. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to production
6. **[SECURITY.md](./SECURITY.md)** - Security features

### For Deployment
7. **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - Quick deploy guide
8. **[DEPLOY_STEPS.md](./DEPLOY_STEPS.md)** - Step-by-step deployment
9. **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Deployment checklist

### For Database
10. **[MIGRATE_DATA.md](./MIGRATE_DATA.md)** - Database migration guide
11. **[QUICK_MIGRATE.md](./QUICK_MIGRATE.md)** - Quick migration steps

### For Git
12. **[PUSH_TO_NEW_REPO.md](./PUSH_TO_NEW_REPO.md)** - Push to new repo guide
13. **[QUICK_PUSH_TO_NEW_REPO.md](./QUICK_PUSH_TO_NEW_REPO.md)** - Quick push guide

---

## 🎮 Quick Test in 3 Steps

### Step 1: Health Check
```bash
curl https://hostel-backend-7lb7.onrender.com/api/health
```

### Step 2: Login
```bash
curl -X POST https://hostel-backend-7lb7.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostel.com","password":"admin123"}'
```

**Save the token from response!**

### Step 3: Test API
```bash
curl https://hostel-backend-7lb7.onrender.com/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)

### Installation
```bash
# Clone repository
git clone https://github.com/ashishpimple94/hostel-backend.git
cd hostel-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI
nano .env

# Start server
npm run dev
```

Server will run on: `http://localhost:5001`

---

## 📡 All API Endpoints

### Authentication (4 routes)
- Register, Login, Get Current User, Update Password

### Students (6 routes)
- CRUD operations, Get Ledger

### Rooms (9 routes)
- CRUD, Available rooms, Allocate, Deallocate, Stats

### Fees (8 routes)
- CRUD, Pay Fee, Checkout, Get Student Fees

### Complaints (7 routes)
- CRUD, Assign, Update Status

### Attendance (7 routes)
- Mark, Bulk Mark, Stats, Today's Attendance

### Notices (5 routes)
- Full CRUD operations

### Dashboard (3 routes)
- Stats, Room Occupancy, Fee Collection

**Total: 44+ API endpoints!**

---

## 🔗 Useful Links

- **GitHub Repository**: https://github.com/ashishpimple94/hostel-backend.git
- **Live API**: https://hostel-backend-7lb7.onrender.com
- **API Docs**: https://github.com/ashishpimple94/hostel-backend/blob/main/API_ROUTES.md

---

## ⚡ Quick Commands

```bash
# Start server
npm start

# Development mode
npm run dev

# Clean start (kills port 5001 first)
./start.sh

# Kill port if stuck
npm run kill
```

---

## 🎯 What's Next?

1. ✅ **Testing?** → Open [POSTMAN_ROUTES.txt](./POSTMAN_ROUTES.txt)
2. ✅ **Deploying?** → Read [DEPLOY_NOW.md](./DEPLOY_NOW.md)
3. ✅ **Developing?** → Read [README.md](./README.md)
4. ✅ **Migrating?** → Read [QUICK_MIGRATE.md](./QUICK_MIGRATE.md)

---

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed setup
- Check [API_ROUTES.md](./API_ROUTES.md) for API documentation
- Check [PORT_FIX.md](./PORT_FIX.md) for port issues
- Check deployment guides for deployment issues

---

**Happy Coding! 🚀**

