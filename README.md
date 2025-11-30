# Employee Attendance System

A full-stack employee attendance management system built with React, Node.js, Express, and MongoDB. The system supports two user roles: **Employee** and **Manager**, each with different permissions and features.

## Features

### Employee Features
- ✅ User registration and login
- ✅ Check-in/Check-out functionality
- ✅ View personal attendance history
- ✅ Calendar view with color-coded attendance
- ✅ Monthly attendance summary
- ✅ Dashboard with statistics and recent attendance

### Manager Features
- ✅ View all employees' attendance
- ✅ Filter attendance by employee, date, status, and department
- ✅ Team calendar view
- ✅ Attendance reports with date range filtering
- ✅ Export attendance data to CSV
- ✅ Dashboard with charts and statistics
- ✅ View late and absent employees

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **date-fns** - Date manipulation

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Chart library
- **Vite** - Build tool

## Project Structure

```
project/
├── server/                 # Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth and role middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── seeds/            # Seed script
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── package.json
│
└── client/                # Frontend
    ├── public/
    └── src/
        ├── components/   # Reusable components
        ├── pages/        # Page components
        ├── services/     # API service
        ├── store/        # Redux store
        ├── utils/        # Helper functions
        ├── App.jsx       # Main app component
        └── index.jsx     # Entry point
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd project
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Seed the Database

From the `server` directory:

```bash
npm run seed
```

This will create:
- 1 Manager account
- 3 Employee accounts
- Sample attendance data for the last 30 days

**Default Login Credentials:**

**Manager:**
- Email: `manager@company.com`
- Password: `manager123`

**Employees:**
- Email: `alice@company.com` / `bob@company.com` / `carol@company.com`
- Password: `employee123`

## Running the Application

### Start Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Employee Attendance
- `POST /api/attendance/checkin` - Check in (Employee only)
- `POST /api/attendance/checkout` - Check out (Employee only)
- `GET /api/attendance/my-history?month=YYYY-MM` - Get attendance history (Employee only)
- `GET /api/attendance/my-summary?month=YYYY-MM` - Get attendance summary (Employee only)
- `GET /api/attendance/today` - Get today's attendance (Employee only)

### Manager Attendance
- `GET /api/attendance/all?employeeId=&date=&status=&department=` - Get all attendance (Manager only)
- `GET /api/attendance/employee/:id?month=YYYY-MM` - Get employee attendance (Manager only)
- `GET /api/attendance/summary?from=&to=` - Get attendance summary (Manager only)
- `GET /api/attendance/today-status` - Get today's status for all employees (Manager only)
- `GET /api/attendance/export?from=&to=` - Export attendance as CSV (Manager only)

### Dashboards
- `GET /api/dashboard/employee` - Get employee dashboard data (Employee only)
- `GET /api/dashboard/manager` - Get manager dashboard data (Manager only)

## Usage

### For Employees

1. **Login/Register**: Use the login page to access your account or register a new one.
2. **Dashboard**: View your attendance statistics, recent records, and quick check-in/out.
3. **Mark Attendance**: Check in when you arrive and check out when you leave.
4. **History**: View your attendance history in calendar and table format with monthly filtering.
5. **Profile**: View your personal information.

### For Managers

1. **Login**: Use manager credentials to access the manager dashboard.
2. **Dashboard**: View overall statistics, charts, and lists of late/absent employees.
3. **All Attendance**: View and filter all employees' attendance records.
4. **Calendar View**: See team attendance organized by department.
5. **Reports**: Generate reports with date range filtering and export to CSV.

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "employee" | "manager",
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Model
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: "present" | "absent" | "late" | "half-day",
  totalHours: Number,
  createdAt: Date
}
```

## Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with role-based access control
- ✅ Input validation
- ✅ CORS configuration

## Development

### Backend Development
- Uses `nodemon` for auto-restart during development
- Environment variables loaded from `.env` file
- MongoDB connection with error handling

### Frontend Development
- Vite for fast development and hot module replacement
- Redux Toolkit for state management
- Axios interceptors for automatic token handling
- Protected routes with role checking

## Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
```

The production build will be in the `client/dist` directory.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change the `PORT` in `.env` file
- Update the proxy in `client/vite.config.js` if needed

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in backend `.env`
- Verify token expiration settings

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

For support, please open an issue in the repository.

---

**Note**: Remember to change the `JWT_SECRET` in production and use a strong, unique secret key.

