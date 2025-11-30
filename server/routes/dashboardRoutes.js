const express = require('express');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { getEmployeeDashboard, getManagerDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/employee', protect, roleCheck('employee'), getEmployeeDashboard);
router.get('/manager', protect, roleCheck('manager'), getManagerDashboard);

module.exports = router;

