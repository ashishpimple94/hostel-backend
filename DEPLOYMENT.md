# Backend Deployment Guide

## 🚀 Deploy on Render (Recommended - Free Tier)

### Step 1: Setup MongoDB Atlas (Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free M0 Sandbox)
4. Go to Database Access → Add Database User
   - Username: `hostel_admin`
   - Password: Generate secure password (save it!)
5. Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
6. Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://hostel_admin:<password>@cluster0.xxxxx.mongodb.net/hostel_management?retryWrites=true&w=majority`

### Step 2: Push to GitHub
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial backend deployment"

# Create GitHub repo and push
# Go to github.com → New Repository → Create "hostel-backend"
git remote add origin https://github.com/YOUR_USERNAME/hostel-backend.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render
1. Go to [Render](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `hostel-backend` repository
5. Configure:
   - **Name**: hostel-management-backend
   - **Region**: Singapore (or closest to you)
   - **Branch**: main
   - **Root Directory**: (leave blank if backend is root)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. Add Environment Variables (click "Advanced"):
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   JWT_EXPIRE=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   AUTH_RATE_LIMIT_MAX=5
   REQUEST_BODY_LIMIT=10kb
   ```

7. Click "Create Web Service"

### Step 4: Get Your Backend URL
- After deployment completes (2-3 minutes)
- Your backend URL will be: `https://hostel-management-backend.onrender.com`
- Test it: `https://hostel-management-backend.onrender.com/api/health`

---

## 🔧 Alternative: Deploy on Railway

### Step 1: Setup
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
railway init
railway up
```

### Step 3: Add Environment Variables
```bash
railway variables set MONGODB_URI="your_connection_string"
railway variables set JWT_SECRET="your_secret"
railway variables set NODE_ENV="production"
```

---

## 🔧 Alternative: Deploy on Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Create vercel.json
Already included in project.

### Step 3: Deploy
```bash
cd /Users/ashishpimple/Desktop/Hostel\ Manage/backend
vercel --prod
```

### Step 4: Add Environment Variables
Go to Vercel Dashboard → Project Settings → Environment Variables

---

## 📝 Post-Deployment

### 1. Update Frontend API URL
In your frontend `.env`:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Test Endpoints
```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Register test user
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "role": "student",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Seed Initial Data (Optional)
```bash
# SSH into your deployment or run locally pointing to production DB
node seed.js
```

---

## ⚠️ Important Notes

1. **MongoDB Atlas**: Must whitelist IPs (use 0.0.0.0/0 for development)
2. **JWT Secret**: Use strong random string (min 32 chars)
3. **CORS**: Update `server.js` CORS config to allow your frontend domain
4. **Rate Limiting**: Adjust limits based on your needs
5. **Free Tier Limits**:
   - Render: Sleeps after 15 mins of inactivity (first request slow)
   - MongoDB Atlas: 512MB storage limit
   - Railway: $5 free credit/month

---

## 🔒 Security Checklist

- ✅ MongoDB connection string in environment variables
- ✅ JWT secret is strong and secret
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ HPP protection
- ✅ Request body size limits

---

## 📊 Monitoring

- **Render**: Built-in logs and metrics
- **MongoDB Atlas**: Database monitoring dashboard
- **Uptime**: Use [UptimeRobot](https://uptimerobot.com) for free monitoring

---

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables
- Check Render/Railway logs

### Can't connect from frontend
- Check CORS configuration
- Verify API URL in frontend
- Check if backend is sleeping (Render free tier)

### Database connection failed
- Verify MongoDB Atlas IP whitelist
- Check username/password in connection string
- Ensure network access is configured

---

**Your backend will be live at**: `https://your-app-name.onrender.com`

Good luck! 🚀
