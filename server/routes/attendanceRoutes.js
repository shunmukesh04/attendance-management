const express = require('express');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getToday,
  getAllAttendance,
  getEmployeeAttendance,
  getSummary,
  getTodayStatus,
  exportAttendance,
} = require('../controllers/attendanceController');

const router = express.Router();

// Employee routes
router.post('/checkin', protect, roleCheck('employee'), checkIn);
router.post('/checkout', protect, roleCheck('employee'), checkOut);
router.get('/my-history', protect, roleCheck('employee'), getMyHistory);
router.get('/my-summary', protect, roleCheck('employee'), getMySummary);
router.get('/today', protect, roleCheck('employee'), getToday);

// Manager routes
router.get('/all', protect, roleCheck('manager'), getAllAttendance);
router.get('/employee/:id', protect, roleCheck('manager'), getEmployeeAttendance);
router.get('/summary', protect, roleCheck('manager'), getSummary);
router.get('/today-status', protect, roleCheck('manager'), getTodayStatus);
router.get('/export', protect, roleCheck('manager'), exportAttendance);

module.exports = router;

