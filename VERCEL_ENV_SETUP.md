# Vercel Environment Variable Setup

## Quick Fix for Render Backend

Your frontend on Vercel needs to point to your Render backend.

### Step 1: Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (attendance-management)
3. Go to **Settings** → **Environment Variables**
4. Add or update this variable:

**Variable Name:**
```
VITE_API_URL
```

**Value:**
```
https://attendance-management-2-nf9g.onrender.com/api
```

**Important:**
- ✅ Include `https://`
- ✅ Include `/api` at the end
- ✅ No trailing slash after `/api`
- ✅ Select all environments: Production, Preview, Development

### Step 2: Redeploy

After adding/updating the environment variable:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 3: Verify

1. Open your Vercel app
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Try to register/login
5. Check **Network** tab - requests should go to:
   `https://attendance-management-2-nf9g.onrender.com/api/auth/register`

## Current Configuration

**Frontend (Vercel):** Your Vercel domain
**Backend (Render):** `https://attendance-management-2-nf9g.onrender.com`

**Environment Variable:**
```
VITE_API_URL=https://attendance-management-2-nf9g.onrender.com/api
```

## Troubleshooting

### Still Getting 404 Errors

1. **Check Environment Variable:**
   - Verify `VITE_API_URL` is set correctly
   - Make sure it includes `/api` at the end
   - Check it's set for all environments

2. **Redeploy:**
   - Environment variables only take effect after redeploy
   - Make sure you redeployed after setting the variable

3. **Check Backend:**
   - Verify Render backend is running: `https://attendance-management-2-nf9g.onrender.com/api/health`
   - Should return: `{ "message": "Server is running" }`

4. **Check CORS:**
   - Make sure Render backend allows your Vercel domain
   - Update `FRONTEND_URL` in Render to your Vercel domain

### CORS Errors

If you see CORS errors, update your Render backend:

1. Go to Render Dashboard → Your Service → Environment
2. Add/update:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy Render service

## Quick Checklist

- [ ] `VITE_API_URL` set in Vercel: `https://attendance-management-2-nf9g.onrender.com/api`
- [ ] Environment variable set for all environments (Production, Preview, Development)
- [ ] Vercel project redeployed after setting variable
- [ ] Render backend is running and accessible
- [ ] CORS configured in Render backend for Vercel domain
- [ ] Test registration/login functionality

