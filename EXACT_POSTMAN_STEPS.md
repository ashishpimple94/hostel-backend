# 📮 Exact Postman Steps - Copy Paste

**✅ Login is working!** Here are the EXACT steps to test in Postman:

---

## 🎯 Step-by-Step Postman Instructions

### Step 1: Create New Request
1. Open Postman
2. Click "New" → "HTTP Request"
3. Name it: "Login Test"

### Step 2: Setup Request
4. Method: Select **POST**
5. URL: Copy and paste this EXACT URL:
   ```
   https://hostel-backend-7lb7.onrender.com/api/auth/login
   ```

### Step 3: Add Headers
6. Click **Headers** tab
7. Click "Add Header"
   - Key: `Content-Type`
   - Value: `application/json`

### Step 4: Add Body
8. Click **Body** tab
9. Select **raw**
10. Select **JSON** from dropdown
11. Paste this EXACT body:
```json
{
  "email": "test@test.com",
  "password": "test123"
}
```

### Step 5: Send Request
12. Click **Send** button
13. You should see response like:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6908e47984d6ebf181f52cdc",
    "email": "test@test.com",
    "role": "admin"
  }
}
```

---

## 🔑 Step 6: Use the Token

### Get Current User (Protected)
1. Create new request
2. Method: **GET**
3. URL: 
   ```
   https://hostel-backend-7lb7.onrender.com/api/auth/me
   ```
4. Headers tab:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE` (copy from login response)

5. Click **Send**

---

## 📋 Quick Test Checklist

- [ ] Postman installed
- [ ] Method: POST selected
- [ ] URL is correct
- [ ] Content-Type header added
- [ ] Body is JSON
- [ ] Email and password are correct
- [ ] Clicked Send

---

## ⚠️ Common Mistakes

❌ Wrong URL: `localhost:5001` instead of live URL  
✅ Correct: `https://hostel-backend-7lb7.onrender.com/api/auth/login`

❌ Missing Header: No Content-Type  
✅ Add: `Content-Type: application/json`

❌ Wrong Method: GET instead of POST  
✅ Use: POST

❌ Wrong Body Type: form-data or x-www-form-urlencoded  
✅ Use: raw JSON

❌ Extra spaces in email/password  
✅ Use exact: `test@test.com` and `test123`

---

## 🧪 Alternative Test Methods

### Method 1: Browser (Get Token)
Open in browser:
```
https://hostel-backend-7lb7.onrender.com/api/auth/login
```
Not recommended for POST, only for GET requests.

### Method 2: Terminal/Curl
```bash
curl -X POST https://hostel-backend-7lb7.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Method 3: Test Script
```bash
cd backend
./TEST_LOGIN.sh
```

---

## 📸 Expected Screenshot

**Before Send:**
- Method: POST
- URL: https://hostel-backend-7lb7.onrender.com/api/auth/login
- Headers: Content-Type: application/json
- Body: {"email":"test@test.com","password":"test123"}

**After Send:**
- Status: 200 OK
- Response: {"success":true,"token":"...","user":{...}}

---

## 🆘 Still Not Working?

1. **Check internet connection**
2. **Verify URL is correct** (copy-paste, don't type)
3. **Check Postman version** (latest recommended)
4. **Clear Postman cache**
5. **Try curl command** to verify server is working

---

## ✅ Verified Working

Test completed:
- ✅ Health check: OK
- ✅ Login: SUCCESS
- ✅ Get Me: SUCCESS
- ✅ Token generated
- ✅ API responding

**Login is 100% working!** If you're still having issues, send screenshot of Postman.

