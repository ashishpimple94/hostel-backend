# 🚀 Postman Quick Start Guide

**Base URL**: `https://hostel-backend-7lb7.onrender.com`

---

## 🎯 Step 1: Test Health Check

```
GET https://hostel-backend-7lb7.onrender.com/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`

---

## 🔐 Step 2: Register & Login

### Register
```
POST https://hostel-backend-7lb7.onrender.com/api/auth/register

Body (JSON):
{
  "name": "Admin User",
  "email": "admin@hostel.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```
POST https://hostel-backend-7lb7.onrender.com/api/auth/login

Body (JSON):
{
  "email": "admin@hostel.com",
  "password": "admin123"
}
```

**Copy the `token` from response** - you'll need it for all other requests!

---

## 🔑 Step 3: Set Authorization Header

In Postman:
1. Go to **Headers** tab
2. Add new header:
   - **Key**: `Authorization`
   - **Value**: `Bearer YOUR_TOKEN_HERE`

Or use **Authorization** tab:
1. Type: **Bearer Token**
2. Token: Paste your JWT token

---

## 📋 Quick Test Commands

### Get All Students
```
GET https://hostel-backend-7lb7.onrender.com/api/students
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get All Rooms
```
GET https://hostel-backend-7lb7.onrender.com/api/rooms
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Available Rooms
```
GET https://hostel-backend-7lb7.onrender.com/api/rooms/available
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get Dashboard Stats
```
GET https://hostel-backend-7lb7.onrender.com/api/dashboard/stats
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get All Fees
```
GET https://hostel-backend-7lb7.onrender.com/api/fees
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get All Complaints
```
GET https://hostel-backend-7lb7.onrender.com/api/complaints
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get All Notices
```
GET https://hostel-backend-7lb7.onrender.com/api/notices
Headers: Authorization: Bearer YOUR_TOKEN
```

### Get All Attendance
```
GET https://hostel-backend-7lb7.onrender.com/api/attendance
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 🏗️ Create Test Data

### Create Room
```
POST https://hostel-backend-7lb7.onrender.com/api/rooms
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body (JSON):
{
  "roomNumber": "101",
  "floor": 1,
  "building": "A",
  "type": "AC",
  "capacity": 3,
  "amenities": ["WiFi", "Cooler", "Furniture"]
}
```

### Create Student
```
POST https://hostel-backend-7lb7.onrender.com/api/students
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body (JSON):
{
  "name": "John Doe",
  "email": "john@student.com",
  "phone": "1234567890",
  "dob": "2000-01-01",
  "bloodGroup": "O+",
  "department": "Computer Science",
  "course": "BE",
  "year": 3,
  "semester": 5,
  "guardianName": "Father Name",
  "guardianPhone": "9876543210",
  "guardianRelation": "Father"
}
```

### Create Fee
```
POST https://hostel-backend-7lb7.onrender.com/api/fees
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body (JSON):
{
  "studentId": "PASTE_STUDENT_ID_HERE",
  "month": "2024-01",
  "roomRent": 5000,
  "messCharges": 3000,
  "fine": 0,
  "otherCharges": 0
}
```

### Create Complaint
```
POST https://hostel-backend-7lb7.onrender.com/api/complaints
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body (JSON):
{
  "title": "Water Leakage",
  "description": "Severe water leakage in bathroom",
  "priority": "high",
  "category": "plumbing"
}
```

### Create Notice
```
POST https://hostel-backend-7lb7.onrender.com/api/notices
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json

Body (JSON):
{
  "title": "Hostel Meeting",
  "description": "All students must attend the meeting on Sunday at 6 PM",
  "category": "general",
  "priority": "high",
  "targetAudience": "all"
}
```

---

## 🎨 Postman Environment Variables

Create a Postman Environment:

### Variables
```
baseUrl = https://hostel-backend-7lb7.onrender.com
token = (will be set automatically)
```

### Script to Auto-Save Token

**Add to Login request → Tests tab:**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("token", jsonData.token);
        console.log("Token saved!");
    }
}
```

Then use `{{token}}` in Authorization headers!

---

## 🔍 Test Flow Example

1. ✅ Test health check
2. ✅ Register admin user
3. ✅ Login and save token
4. ✅ Create a room
5. ✅ Create a student
6. ✅ Get all students
7. ✅ Get all rooms
8. ✅ Create fee for student
9. ✅ Get dashboard stats
10. ✅ Create complaint
11. ✅ Create notice

---

## ⚡ Postman Collection URL

Import this in Postman to get pre-configured collection:
(Coming soon - create collection and share URL)

---

## 📚 Full Documentation

See [API_ROUTES.md](./API_ROUTES.md) for complete list of all endpoints.

---

## 🐛 Troubleshooting

### 401 Unauthorized
- Check if token is valid
- Make sure "Bearer " prefix is included
- Try logging in again to get new token

### 403 Forbidden  
- Your role doesn't have permission
- Admin users have full access

### 404 Not Found
- Check URL spelling
- Make sure resource ID exists

### Empty Response
- Check if you're logged in
- Verify MongoDB connection on server

---

Happy Testing! 🎉

