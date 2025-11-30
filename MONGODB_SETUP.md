# MongoDB Setup Guide

## Quick Fix: Use MongoDB Atlas (Recommended - 5 minutes)

### Step 1: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)

### Step 2: Get Connection String
1. In Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 3: Update .env File
1. Open `server/.env`
2. Replace the MONGODB_URI line with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/attendance-system?retryWrites=true&w=majority
   ```
3. **Important:** Replace `<username>` and `<password>` with your Atlas database user credentials
4. Add `/attendance-system` before the `?` to specify the database name

### Step 4: Configure Database User
1. In Atlas, go to "Database Access"
2. Create a database user (if not already created)
3. Set username and password
4. Use these credentials in your connection string

### Step 5: Whitelist IP Address
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

### Step 6: Restart Server
- The backend server will auto-restart (nodemon watches for file changes)
- Check the backend window for "MongoDB Connected" message

---

## Alternative: Install Local MongoDB

### Windows Installation:
1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Run the installer
3. Install as a Windows Service
4. MongoDB will start automatically
5. Keep `MONGODB_URI=mongodb://localhost:27017/attendance-system` in .env

### Verify Local MongoDB:
```bash
mongosh
# or
mongo
```

---

## Test Connection

After updating .env, test the connection:
```bash
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.log('❌ Error:', err.message); process.exit(1); });"
```

---

## Troubleshooting

### "Authentication failed"
- Check username/password in connection string
- Verify database user exists in Atlas

### "IP not whitelisted"
- Add your IP to Atlas Network Access
- Or use "Allow Access from Anywhere" for development

### "Connection timeout"
- Check internet connection
- Verify connection string is correct
- Check Atlas cluster is running

---

**Once MongoDB is connected, you can:**
1. Seed the database: `cd server && npm run seed`
2. Login at http://localhost:3000
3. Use the application!

