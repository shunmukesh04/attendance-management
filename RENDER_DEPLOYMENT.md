# Render Deployment Guide for Backend Server

## Prerequisites

1. GitHub repository with your code
2. Render account (free tier works)
3. MongoDB Atlas connection string (already configured)

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:
- All server files are in the `server/` directory
- `.env` file is NOT committed (should be in `.gitignore`)
- `package.json` is in the `server/` directory

## Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your project

## Step 3: Configure Render Service

### Basic Settings:

- **Name:** `attendance-system-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** `server` (important!)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Environment Variables:

Click **"Environment"** tab and add these variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

**Important Notes:**
- Render automatically sets `PORT` - you can use `process.env.PORT || 5000` in your code
- Don't include quotes around values
- Replace `your_mongodb_atlas_connection_string` with your actual Atlas connection string
- Replace `your_jwt_secret_key` with a strong secret (use the one from your .env or generate new)

### Advanced Settings (Optional):

- **Auto-Deploy:** `Yes` (deploys on every push to main branch)
- **Health Check Path:** `/api/health` (if you have a health check endpoint)

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your service will be available at: `https://your-service-name.onrender.com`

## Step 5: Update Backend Code for Render

Make sure your `server.js` uses the PORT from environment:

```javascript
const PORT = process.env.PORT || 5000;
```

This is already in your code, so you're good!

## Step 6: Update CORS for Frontend

Update your `server/server.js` to allow your frontend domain:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    'https://your-frontend-domain.com'
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

Or for development/testing:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
```

## Step 7: Verify Deployment

1. Check your service URL: `https://your-service-name.onrender.com/api/health`
2. Should return: `{ "message": "Server is running" }`
3. Test API endpoint: `https://your-service-name.onrender.com/api/auth/register`

## Environment Variables Reference

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |

### Optional Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |

## Render-Specific Considerations

### Free Tier Limitations:

- **Spins down after 15 minutes of inactivity**
- **Takes 30-60 seconds to wake up** when first request comes in
- **512 MB RAM limit**
- **No persistent storage** (use MongoDB Atlas for data)

### To Keep Service Awake (Free Tier):

You can use a service like:
- [UptimeRobot](https://uptimerobot.com/) - Free monitoring
- [Cron-job.org](https://cron-job.org/) - Free cron jobs
- Set up a ping every 5-10 minutes to keep service awake

### Health Check Endpoint:

Your server already has `/api/health` endpoint, which is perfect for monitoring.

## Troubleshooting

### Build Fails

1. **Check Build Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for error messages

2. **Common Issues:**
   - Wrong root directory (should be `server`)
   - Missing `package.json` in server directory
   - Build command incorrect

### Service Crashes

1. **Check Runtime Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for runtime errors

2. **Common Issues:**
   - MongoDB connection string incorrect
   - Missing environment variables
   - Port configuration issue

### API Not Responding

1. **Check Service Status:**
   - Should be "Live" (green)
   - If "Sleeping", wait for it to wake up (30-60 seconds)

2. **Check CORS:**
   - Verify frontend URL is in CORS allowed origins
   - Check browser console for CORS errors

3. **Test Directly:**
   - Try accessing API directly: `https://your-service.onrender.com/api/health`
   - Use Postman or curl to test endpoints

### MongoDB Connection Issues

1. **Verify Connection String:**
   - Check MongoDB Atlas connection string is correct
   - Ensure database user has proper permissions
   - Verify IP whitelist in Atlas (Render IPs are dynamic)

2. **Atlas Network Access:**
   - Add `0.0.0.0/0` to allow all IPs (for development)
   - Or add Render's IP ranges (check Render docs)

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created in Render
- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables added:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI` (your Atlas connection string)
  - [ ] `JWT_SECRET` (your secret key)
  - [ ] `JWT_EXPIRE=7d`
- [ ] Service deployed successfully
- [ ] Health check endpoint working
- [ ] CORS updated for frontend domain
- [ ] Frontend `VITE_API_URL` updated to Render URL

## Example Render Configuration

**Service Name:** `attendance-system-api`

**Settings:**
- Root Directory: `server`
- Environment: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

**Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-system?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.vercel.app
```

**Service URL:** `https://attendance-system-api.onrender.com`

**API Base URL:** `https://attendance-system-api.onrender.com/api`

## After Deployment

1. **Update Frontend:**
   - Set `VITE_API_URL` in Vercel to: `https://your-service.onrender.com/api`

2. **Test:**
   - Register a new user
   - Login
   - Test all features

3. **Monitor:**
   - Check Render logs regularly
   - Set up uptime monitoring
   - Monitor MongoDB Atlas usage

## Support

If you encounter issues:
1. Check Render deployment logs
2. Check Render runtime logs
3. Verify environment variables
4. Test API endpoints directly
5. Check MongoDB Atlas connection

---

**Your Render service URL will be:** `https://your-service-name.onrender.com`

