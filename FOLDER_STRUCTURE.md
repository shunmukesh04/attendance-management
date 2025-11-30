# Project Folder Structure

## Backend (`server/`)
```
server/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model
│   └── Attendance.js        # Attendance model
├── controllers/
│   ├── authController.js    # Register, login, me
│   ├── attendanceController.js  # Check-in/out, history, etc.
│   └── dashboardController.js   # Dashboard stats
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── attendanceRoutes.js  # Attendance endpoints
│   └── dashboardRoutes.js   # Dashboard endpoints
├── middleware/
│   ├── auth.js              # JWT verification
│   └── roleCheck.js         # Role-based authorization
├── utils/
│   ├── generateToken.js     # JWT token generation
│   └── calculateHours.js    # Calculate work hours
├── seeds/
│   └── seedData.js          # Seed script
├── .env                     # Environment variables
├── .env.example             # Example env file
├── server.js                # Express app entry point
└── package.json
```

## Frontend (`client/`)
```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── charts/
│   │   │   └── AttendanceChart.jsx
│   │   └── calendar/
│   │       └── AttendanceCalendar.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── employee/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MarkAttendance.jsx
│   │   │   ├── History.jsx
│   │   │   └── Profile.jsx
│   │   └── manager/
│   │       ├── Dashboard.jsx
│   │       ├── AllAttendance.jsx
│   │       ├── CalendarView.jsx
│   │       └── Reports.jsx
│   ├── store/
│   │   ├── authSlice.js     # Redux Toolkit slice
│   │   └── store.js         # Redux store
│   ├── services/
│   │   └── api.js           # Axios instance + API calls
│   ├── utils/
│   │   └── helpers.js       # Helper functions
│   ├── App.jsx              # Main app with routing
│   ├── index.jsx            # Entry point
│   └── index.css            # Global styles
├── package.json
└── .env
```

