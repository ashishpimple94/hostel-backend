# 🚀 Hostel Management API Routes

**Base URL**: `https://hostel-backend-7lb7.onrender.com`

---

## 🔐 Authentication Routes

### Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // admin, warden, student, accountant, maintenance
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here"
}
```

### Get Current User (Protected)
```
GET /api/auth/me
Headers: 
  Authorization: Bearer <token>
```

### Update Password (Protected)
```
PUT /api/auth/updatepassword
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

---

## 👥 Student Routes

### Get All Students (Admin/Warden/Accountant)
```
GET /api/students
Headers: 
  Authorization: Bearer <token>
```

### Create Student (Admin/Warden)
```
POST /api/students
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
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

### Get Student by ID
```
GET /api/students/:id
Headers: 
  Authorization: Bearer <token>
```

### Update Student (Admin/Warden)
```
PUT /api/students/:id
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "Updated Name",
  // ... other fields
}
```

### Delete Student (Admin Only)
```
DELETE /api/students/:id
Headers: 
  Authorization: Bearer <token>
```

### Get Student Ledger
```
GET /api/students/:id/ledger
Headers: 
  Authorization: Bearer <token>
```

---

## 🏠 Room Routes

### Get All Rooms
```
GET /api/rooms
Headers: 
  Authorization: Bearer <token>
```

### Get Available Rooms
```
GET /api/rooms/available
Headers: 
  Authorization: Bearer <token>
```

### Get Room Availability Stats
```
GET /api/rooms/availability-stats
Headers: 
  Authorization: Bearer <token>
```

### Create Room (Admin/Warden)
```
POST /api/rooms
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "roomNumber": "101",
  "floor": 1,
  "building": "A",
  "type": "AC", // or "Non-AC"
  "capacity": 3,
  "currentOccupancy": 0,
  "amenities": ["WiFi", "Cooler", "Furniture"]
}
```

### Get Room by ID
```
GET /api/rooms/:id
Headers: 
  Authorization: Bearer <token>
```

### Update Room (Admin/Warden)
```
PUT /api/rooms/:id
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "capacity": 4,
  "amenities": ["WiFi", "Cooler", "Furniture", "AC"]
}
```

### Delete Room (Admin Only)
```
DELETE /api/rooms/:id
Headers: 
  Authorization: Bearer <token>
```

### Allocate Room (Admin/Warden)
```
POST /api/rooms/:id/allocate
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "studentId": "student_id_here"
}
```

### Deallocate Room (Admin/Warden)
```
POST /api/rooms/:id/deallocate
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "studentId": "student_id_here"
}
```

---

## 💰 Fee Routes

### Get All Fees
```
GET /api/fees
Headers: 
  Authorization: Bearer <token>
```

### Create Fee (Admin/Accountant)
```
POST /api/fees
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "studentId": "student_id_here",
  "month": "2024-01",
  "roomRent": 5000,
  "messCharges": 3000,
  "fine": 500,
  "otherCharges": 200
}
```

### Get Fee by ID
```
GET /api/fees/:id
Headers: 
  Authorization: Bearer <token>
```

### Update Fee (Admin/Accountant)
```
PUT /api/fees/:id
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "roomRent": 5500,
  "messCharges": 3500
}
```

### Delete Fee (Admin Only)
```
DELETE /api/fees/:id
Headers: 
  Authorization: Bearer <token>
```

### Pay Fee (Student/Admin/Accountant)
```
PUT /api/fees/:id/pay
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "paymentMode": "Cash", // or "Online", "Cheque"
  "transactionId": "TXN123456"
}
```

### Checkout (Admin/Accountant)
```
POST /api/fees/:feeId/checkout
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "remarks": "Checkout completed"
}
```

### Get Student Fees
```
GET /api/fees/student/:studentId
Headers: 
  Authorization: Bearer <token>
```

---

## 📋 Complaint Routes

### Get All Complaints
```
GET /api/complaints
Headers: 
  Authorization: Bearer <token>
```

### Create Complaint
```
POST /api/complaints
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "Water Leakage",
  "description": "Severe water leakage in bathroom",
  "priority": "high", // low, medium, high, urgent
  "category": "maintenance" // maintenance, cleaning, electrical, plumbing, other
}
```

### Get Complaint by ID
```
GET /api/complaints/:id
Headers: 
  Authorization: Bearer <token>
```

### Update Complaint (Admin/Warden/Maintenance)
```
PUT /api/complaints/:id
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "description": "Updated description"
}
```

### Delete Complaint (Admin/Warden)
```
DELETE /api/complaints/:id
Headers: 
  Authorization: Bearer <token>
```

### Assign Complaint (Admin/Warden)
```
PUT /api/complaints/:id/assign
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "assignedTo": "user_id_here"
}
```

### Update Complaint Status (Admin/Warden/Maintenance)
```
PUT /api/complaints/:id/status
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "resolved" // pending, in-progress, resolved, closed
}
```

---

## ✅ Attendance Routes

### Get All Attendance (Admin/Warden)
```
GET /api/attendance
Headers: 
  Authorization: Bearer <token>
```

### Mark Attendance (Admin/Warden)
```
POST /api/attendance
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "studentId": "student_id_here",
  "date": "2024-01-15",
  "status": "present", // present, absent, leave
  "remarks": "On time"
}
```

### Bulk Mark Attendance (Admin/Warden)
```
POST /api/attendance/bulk
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "attendance": [
    {"studentId": "id1", "status": "present"},
    {"studentId": "id2", "status": "absent"}
  ],
  "date": "2024-01-15"
}
```

### Get Attendance Stats (Admin/Warden)
```
GET /api/attendance/stats
Headers: 
  Authorization: Bearer <token>
```

### Get Today's Attendance (Admin/Warden)
```
GET /api/attendance/today
Headers: 
  Authorization: Bearer <token>
```

### Get Student Attendance
```
GET /api/attendance/student/:studentId
Headers: 
  Authorization: Bearer <token>
```

### Update Attendance (Admin/Warden)
```
PUT /api/attendance/:id
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "status": "present",
  "remarks": "Updated"
}
```

---

## 📢 Notice Routes

### Get All Notices
```
GET /api/notices
Headers: 
  Authorization: Bearer <token>
```

### Create Notice (Admin/Warden)
```
POST /api/notices
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "Important Announcement",
  "description": "Hostel meeting on Sunday",
  "category": "general", // general, urgent, maintenance, fee, other
  "priority": "high",
  "targetAudience": ["students", "staff"] // or "all"
}
```

### Get Notice by ID
```
GET /api/notices/:id
Headers: 
  Authorization: Bearer <token>
```

### Update Notice (Admin/Warden)
```
PUT /api/notices/:id
Headers: 
  Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "description": "Updated description"
}
```

### Delete Notice (Admin/Warden)
```
DELETE /api/notices/:id
Headers: 
  Authorization: Bearer <token>
```

---

## 📊 Dashboard Routes

### Get Dashboard Stats
```
GET /api/dashboard/stats
Headers: 
  Authorization: Bearer <token>
```

### Get Room Occupancy Report (Admin/Warden)
```
GET /api/dashboard/room-occupancy
Headers: 
  Authorization: Bearer <token>
```

### Get Fee Collection Report (Admin/Accountant)
```
GET /api/dashboard/fee-collection
Headers: 
  Authorization: Bearer <token>
```

---

## ❤️ Health Check

### Server Health
```
GET /api/health

Response:
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🔒 Authentication Requirements

Most routes require authentication. Include JWT token in headers:
```
Authorization: Bearer <your_jwt_token>
```

Get token from `/api/auth/login` endpoint.

---

## 👤 User Roles

- **admin**: Full access
- **warden**: Manage students, rooms, complaints, notices
- **student**: View own data, create complaints
- **accountant**: Manage fees, view reports
- **maintenance**: Handle complaints

---

## 📝 Notes

- All dates should be in `YYYY-MM-DD` format
- All timestamps are in ISO 8601 format
- Rate limiting is applied to all API routes
- Use HTTPS in production
- Content-Type should be `application/json` for POST/PUT requests

---

## 🚀 Postman Collection Setup

1. Create new collection in Postman
2. Set base URL: `https://hostel-backend-7lb7.onrender.com`
3. Create collection variable: `token`
4. Add Pre-request Script to auth routes:
   ```javascript
   pm.request.headers.add({
       key: 'Authorization',
       value: 'Bearer ' + pm.collectionVariables.get('token')
   });
   ```
5. Save login token automatically:
   ```javascript
   pm.collectionVariables.set('token', pm.response.json().token);
   ```

---

## ⚠️ Common Errors

### 401 Unauthorized
- Missing or invalid token
- Token expired (login again)

### 403 Forbidden
- Insufficient permissions for your role

### 404 Not Found
- Invalid endpoint or resource ID

### 429 Too Many Requests
- Rate limit exceeded, wait before retrying

### 500 Internal Server Error
- Server issue, check logs

---

Made with ❤️ for Hostel Management System

