# 🔐 Login Credentials

**Important**: Database needs to be seeded first before you can login!

---

## 🎯 Quick Login Test

### Step 1: Seed Database First

You need to run the seed script to create users. Database is currently empty!

```bash
cd "/Users/ashishpimple/Desktop/Hostel Manage/backend"

# Run seed script
node seed.js
```

### Step 2: Use These Credentials

After seeding, you can login with:

#### 👨‍💼 Admin (Full Access)
```
Email: admin@hostel.com
Password: admin123
```

#### 👮 Warden
```
Email: warden@hostel.com
Password: warden123
```

#### 💰 Accountant
```
Email: accountant@hostel.com
Password: accountant123
```

#### 🔧 Maintenance
```
Email: maintenance@hostel.com
Password: maintenance123
```

#### 👨‍🎓 Student
```
Email: student@hostel.com
Password: student123
```

---

## 🧪 Test Login in Postman/Curl

### Postman Login Request

**Method**: `POST`  
**URL**: `https://hostel-backend-7lb7.onrender.com/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "email": "admin@hostel.com",
  "password": "admin123"
}
```

**Expected Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@hostel.com",
    "role": "admin"
  }
}
```

### CURL Command

```bash
curl -X POST https://hostel-backend-7lb7.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostel.com","password":"admin123"}'
```

---

## 🚀 Create Test User Manually

### Option 1: Using Register Endpoint

```bash
curl -X POST https://hostel-backend-7lb7.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "role": "admin"
  }'
```

Then login with:
```bash
curl -X POST https://hostel-backend-7lb7.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Option 2: Using Seed Script

```bash
# Local seeding (if you have local MongoDB)
cd backend
node seed.js
```

---

## ⚠️ Common Login Errors

### Error: "Invalid credentials"
- **Cause**: Wrong email or password
- **Solution**: Use correct credentials from above

### Error: "Account is deactivated"
- **Cause**: User account is inactive
- **Solution**: Contact admin to activate account

### Error: "Please provide email and password"
- **Cause**: Missing email or password in request
- **Solution**: Include both email and password in request body

### Error: "User already exists" (Registration)
- **Cause**: Email is already registered
- **Solution**: Use login instead of register

---

## 🔄 Reset Database

If you need to reset and reseed:

```bash
cd backend

# Clear all data and reseed
node seed.js
```

---

## 📝 Full Seed Script

For complete data with rooms, fees, etc:

```bash
# This creates everything: users, students, rooms, fees, etc.
node seedComplete.js
```

**Note**: seedComplete.js creates extensive test data (15 students, 36 rooms, fees, complaints, etc.)

---

## 🌐 Live API Test

Test if login works:

```bash
# Quick health check
curl https://hostel-backend-7lb7.onrender.com/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

---

## 📚 Related Documentation

- [STUDENT_API.md](./STUDENT_API.md) - Student API endpoints
- [API_URLS.md](./API_URLS.md) - All API URLs
- [POSTMAN_QUICK_START.md](./POSTMAN_QUICK_START.md) - Postman guide

---

**Database must be seeded before login will work!** ⚠️

If you're on Render, you need to run the seed script on the server or manually create users.

