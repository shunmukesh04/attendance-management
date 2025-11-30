# Quick Start Guide

Get your Employee Attendance System up and running in 5 minutes!

## Prerequisites Check

- ✅ Node.js installed (v16+)
- ✅ MongoDB running (local or Atlas)
- ✅ Terminal/Command Prompt ready

## Step-by-Step Setup

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure Environment

Create `server/.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**For MongoDB Atlas:**
- Get your connection string from Atlas dashboard
- Replace `MONGODB_URI` with your Atlas connection string
- Example: `mongodb+srv://username:password@cluster.mongodb.net/attendance-system`

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- 1 Manager: `manager@company.com` / `manager123`
- 3 Employees: `alice@company.com`, `bob@company.com`, `carol@company.com` / `employee123`
- Sample attendance data

### 4. Start the Application

**Option A: Use Batch Files (Windows)**
```bash
# Double-click or run:
start-all.bat
```

**Option B: Manual Start**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the Application

Open your browser and go to: **http://localhost:3000**

## Login Credentials

### Manager Account
- **Email:** `manager@company.com`
- **Password:** `manager123`
- **Access:** Full system access, view all employees, generate reports

### Employee Accounts
- **Email:** `alice@company.com` (or bob@company.com, carol@company.com)
- **Password:** `employee123`
- **Access:** Personal attendance, check-in/out, view history

## Verify Setup

Run the verification script:
```bash
node verify-setup.js
```

This checks:
- ✅ All required files exist
- ✅ Dependencies installed
- ✅ Environment variables configured

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Start MongoDB: `mongod` (or start MongoDB service on Windows)
- Check MongoDB is running: `mongosh` or `mongo`
- Verify `MONGODB_URI` in `.env` file

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
- Change `PORT` in `server/.env` to another port (e.g., 5001)
- Update `client/vite.config.js` proxy target if needed

### Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running before frontend
- Check backend is on port 5000
- Verify proxy in `client/vite.config.js`

## First Time Usage

### As Employee:
1. Login with employee credentials
2. Go to Dashboard
3. Click "Check In" when you arrive
4. Click "Check Out" when you leave
5. View your attendance history

### As Manager:
1. Login with manager credentials
2. View dashboard with team statistics
3. Check "All Attendance" to see everyone's records
4. Use "Reports" to generate and export CSV files
5. View "Calendar View" for team overview

## Next Steps

- Register new employees through the registration page
- Customize departments and employee IDs
- Set up your own JWT secret for production
- Configure MongoDB Atlas for cloud deployment

## Need Help?

- Check `README.md` for detailed documentation
- Review `SETUP.md` for detailed setup instructions
- Check console logs for error messages

---

**Happy Tracking! 🎉**

