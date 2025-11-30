# Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env file in server directory)

Create a file named `.env` in the `server` directory with the following content:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important**: 
- For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Change `JWT_SECRET` to a strong, random string in production

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**Local MongoDB:**
```bash
# On Windows (if installed as service, it should start automatically)
# On Mac/Linux
mongod
```

**MongoDB Atlas:**
- No local setup needed, just use your connection string in `.env`

## Step 4: Seed the Database

From the `server` directory:

```bash
npm run seed
```

This creates:
- 1 Manager: `manager@company.com` / `manager123`
- 3 Employees: `alice@company.com`, `bob@company.com`, `carol@company.com` / `employee123`
- Sample attendance data for the last 30 days

## Step 5: Start the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Step 6: Access the Application

1. Open `http://localhost:3000` in your browser
2. Login with:
   - **Manager**: `manager@company.com` / `manager123`
   - **Employee**: `alice@company.com` / `employee123`

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist and connection string

### Port Already in Use
- Change `PORT` in `.env` (backend)
- Update proxy in `client/vite.config.js` if you change backend port

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### CORS Errors
- Ensure backend is running before frontend
- Check `cors` middleware in `server/server.js`

## Next Steps

- Register new users through the registration page
- Employees can check in/out and view their history
- Managers can view all attendance, generate reports, and export CSV

