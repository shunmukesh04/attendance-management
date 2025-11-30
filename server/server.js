const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.warn('No origin header - allowing request');
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://attendance-management-2-3z0t.vercel.app',
      'https://attendance-management-mauve-nine.vercel.app',
      'https://attendance-management-one-tan.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    // For debugging
    console.log('Incoming origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Check if origin is in allowedOrigins
    if (allowedOrigins.some(allowedOrigin => {
      if (!origin) return false;
      const normalizedOrigin = origin.toLowerCase();
      const normalizedAllowed = allowedOrigin.toLowerCase();
      return normalizedOrigin === normalizedAllowed ||
             normalizedOrigin.startsWith(normalizedAllowed.replace('https://', 'http://')) ||
             normalizedOrigin.startsWith(normalizedAllowed.replace('http://', 'https://'));
    })) {
      return callback(null, true);
    }
    
    console.error('CORS blocked for origin:', origin);
    return callback(new Error(`Not allowed by CORS. Origin: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
};

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

