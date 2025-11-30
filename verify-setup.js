/**
 * Setup Verification Script
 * Run this to check if everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Employee Attendance System Setup...\n');

let hasErrors = false;

// Check backend files
console.log('📁 Checking Backend Files...');
const backendFiles = [
  'server/server.js',
  'server/package.json',
  'server/config/database.js',
  'server/models/User.js',
  'server/models/Attendance.js',
  'server/controllers/authController.js',
  'server/controllers/attendanceController.js',
  'server/controllers/dashboardController.js',
  'server/routes/authRoutes.js',
  'server/routes/attendanceRoutes.js',
  'server/routes/dashboardRoutes.js',
  'server/middleware/auth.js',
  'server/middleware/roleCheck.js',
  'server/utils/generateToken.js',
  'server/utils/calculateHours.js',
  'server/seeds/seedData.js',
];

backendFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check frontend files
console.log('\n📁 Checking Frontend Files...');
const frontendFiles = [
  'client/package.json',
  'client/vite.config.js',
  'client/index.html',
  'client/src/index.jsx',
  'client/src/App.jsx',
  'client/src/store/store.js',
  'client/src/store/authSlice.js',
  'client/src/services/api.js',
  'client/src/pages/auth/Login.jsx',
  'client/src/pages/auth/Register.jsx',
  'client/src/pages/employee/Dashboard.jsx',
  'client/src/pages/employee/MarkAttendance.jsx',
  'client/src/pages/employee/History.jsx',
  'client/src/pages/employee/Profile.jsx',
  'client/src/pages/manager/Dashboard.jsx',
  'client/src/pages/manager/AllAttendance.jsx',
  'client/src/pages/manager/CalendarView.jsx',
  'client/src/pages/manager/Reports.jsx',
];

frontendFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check .env file
console.log('\n🔐 Checking Environment Configuration...');
if (fs.existsSync('server/.env')) {
  console.log('  ✅ server/.env exists');
  const envContent = fs.readFileSync('server/.env', 'utf8');
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  requiredVars.forEach((varName) => {
    if (envContent.includes(varName)) {
      console.log(`  ✅ ${varName} is set`);
    } else {
      console.log(`  ⚠️  ${varName} might be missing`);
    }
  });
} else {
  console.log('  ⚠️  server/.env not found - create it from the template in README.md');
}

// Check node_modules
console.log('\n📦 Checking Dependencies...');
if (fs.existsSync('server/node_modules')) {
  console.log('  ✅ Backend dependencies installed');
} else {
  console.log('  ⚠️  Backend dependencies not installed - run: cd server && npm install');
}

if (fs.existsSync('client/node_modules')) {
  console.log('  ✅ Frontend dependencies installed');
} else {
  console.log('  ⚠️  Frontend dependencies not installed - run: cd client && npm install');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup verification found some issues. Please fix them before running the application.');
  process.exit(1);
} else {
  console.log('✅ Setup verification complete!');
  console.log('\n📝 Next Steps:');
  console.log('  1. Create server/.env file (see README.md for template)');
  console.log('  2. Install dependencies: cd server && npm install');
  console.log('  3. Install frontend dependencies: cd client && npm install');
  console.log('  4. Seed database: cd server && npm run seed');
  console.log('  5. Start backend: cd server && npm run dev');
  console.log('  6. Start frontend: cd client && npm run dev');
  console.log('\n   Or use: start-all.bat (Windows)');
  process.exit(0);
}

