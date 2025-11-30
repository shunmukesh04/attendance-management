# Vercel Deployment Guide for Frontend

## Prerequisites

1. Backend deployed and accessible (Heroku, Railway, Render, etc.)
2. Vercel account (free tier works)
3. GitHub repository with your code

## Step 1: Update Frontend Code

The frontend code has been updated to use environment variables. The `api.js` file now uses `VITE_API_URL` environment variable.

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client` (if your repo has both frontend and backend)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Option B: Deploy via Vercel CLI

```bash
cd client
npm install -g vercel
vercel login
vercel
```

## Step 3: Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

### Required Environment Variable

**Variable Name:** `VITE_API_URL`

**Value:** Your deployed backend API URL

**Examples:**
- If backend is on Heroku: `https://your-app.herokuapp.com/api`
- If backend is on Railway: `https://your-app.railway.app/api`
- If backend is on Render: `https://your-app.onrender.com/api`
- If backend is on your own domain: `https://api.yourdomain.com/api`

**Important:**
- Include `/api` at the end
- Use `https://` (not `http://`)
- No trailing slash after `/api`

### Environment Variable Setup

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api`
   - **Environment:** Production, Preview, Development (select all)
5. Click **Save**

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL
2. Try to register/login
3. Check browser console for any API errors
4. Verify API calls are going to your backend

## Backend CORS Configuration

Make sure your backend allows requests from your Vercel domain:

**In `server/server.js`, update CORS:**

```javascript
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

Or for development, allow all origins:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
```

## Troubleshooting

### API Calls Failing

1. **Check Environment Variable:**
   - Verify `VITE_API_URL` is set correctly in Vercel
   - Make sure it includes `/api` at the end
   - Check it's using `https://` (not `http://`)

2. **Check Backend:**
   - Verify backend is deployed and accessible
   - Test backend URL directly: `https://your-backend.com/api/health`
   - Check CORS settings allow your Vercel domain

3. **Check Browser Console:**
   - Open browser DevTools → Console
   - Look for CORS errors or 404 errors
   - Check Network tab to see actual API requests

### Build Errors

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Check build logs for errors

2. **Common Issues:**
   - Missing dependencies in `package.json`
   - Build command incorrect
   - Output directory incorrect

### Environment Variables Not Working

1. **Redeploy after adding variables:**
   - Environment variables are only available after redeploy

2. **Check variable name:**
   - Must start with `VITE_` for Vite to expose it
   - Case-sensitive

3. **Check in code:**
   - Use `import.meta.env.VITE_API_URL` (not `process.env`)

## Example Vercel Configuration

Create `vercel.json` in the `client` directory (optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Quick Checklist

- [ ] Backend deployed and accessible
- [ ] `VITE_API_URL` environment variable set in Vercel
- [ ] Backend CORS configured to allow Vercel domain
- [ ] Frontend code updated to use `VITE_API_URL`
- [ ] Project redeployed after adding environment variables
- [ ] Tested registration/login functionality

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify backend is accessible
4. Test API endpoints directly

---

**Your Vercel deployment URL will be:** `https://your-project.vercel.app`

