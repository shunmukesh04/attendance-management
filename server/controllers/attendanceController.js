const Attendance = require('../models/Attendance');
const User = require('../models/User');
const calculateHours = require('../utils/calculateHours');
const { startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO, format } = require('date-fns');

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = startOfDay(new Date());

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: endOfDay(today) },
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const checkInTime = new Date();
    const isLate = checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0);

    let attendance;
    if (existingAttendance) {
      // Update existing record
      attendance = await Attendance.findByIdAndUpdate(
        existingAttendance._id,
        {
          checkInTime,
          status: isLate ? 'late' : 'present',
        },
        { new: true }
      );
    } else {
      // Create new record
      attendance = await Attendance.create({
        userId,
        date: today,
        checkInTime,
        status: isLate ? 'late' : 'present',
      });
    }

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = startOfDay(new Date());

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: endOfDay(today) },
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const totalHours = calculateHours(attendance.checkInTime, checkOutTime);

    // Determine if half-day (less than 4 hours)
    let status = attendance.status;
    if (totalHours < 4 && totalHours > 0) {
      status = 'half-day';
    } else if (totalHours >= 4) {
      status = attendance.status === 'late' ? 'late' : 'present';
    }

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = totalHours;
    attendance.status = status;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history?month=YYYY-MM
// @access  Private (Employee)
const getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = req.query.month || format(new Date(), 'yyyy-MM');
    const [year, monthNum] = month.split('-');
    const startDate = startOfMonth(new Date(year, monthNum - 1));
    const endDate = endOfMonth(new Date(year, monthNum - 1));

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my attendance summary
// @route   GET /api/attendance/my-summary?month=YYYY-MM
// @access  Private (Employee)
const getMySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const month = req.query.month || format(new Date(), 'yyyy-MM');
    const [year, monthNum] = month.split('-');
    const startDate = startOfMonth(new Date(year, monthNum - 1));
    const endDate = endOfMonth(new Date(year, monthNum - 1));

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const summary = {
      totalDays: attendance.length,
      present: attendance.filter((a) => a.status === 'present').length,
      late: attendance.filter((a) => a.status === 'late').length,
      absent: attendance.filter((a) => a.status === 'absent').length,
      halfDay: attendance.filter((a) => a.status === 'half-day').length,
      totalHours: attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
    };

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get today's attendance
// @route   GET /api/attendance/today
// @access  Private (Employee)
const getToday = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = startOfDay(new Date());

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: endOfDay(today) },
    });

    if (!attendance) {
      return res.json({
        checkedIn: false,
        checkedOut: false,
        status: 'absent',
      });
    }

    res.json({
      checkedIn: !!attendance.checkInTime,
      checkedOut: !!attendance.checkOutTime,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      status: attendance.status,
      totalHours: attendance.totalHours,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all attendance (Manager)
// @route   GET /api/attendance/all?employeeId=&date=&status=&department=
// @access  Private (Manager)
const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, department } = req.query;
    let query = {};

    // Build query
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) {
        query.userId = user._id;
      } else {
        return res.json([]);
      }
    }

    if (date) {
      const dateObj = parseISO(date);
      query.date = { $gte: startOfDay(dateObj), $lt: endOfDay(dateObj) };
    }

    if (status) {
      query.status = status;
    }

    if (department) {
      const users = await User.find({ department });
      query.userId = { $in: users.map((u) => u._id) };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1, createdAt: -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get employee attendance by ID
// @route   GET /api/attendance/employee/:id?month=YYYY-MM
// @access  Private (Manager)
const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const month = req.query.month || format(new Date(), 'yyyy-MM');
    const [year, monthNum] = month.split('-');
    const startDate = startOfMonth(new Date(year, monthNum - 1));
    const endDate = endOfMonth(new Date(year, monthNum - 1));

    const attendance = await Attendance.find({
      userId: id,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get attendance summary
// @route   GET /api/attendance/summary?from=&to=
// @access  Private (Manager)
const getSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = {};

    if (from && to) {
      query.date = { $gte: parseISO(from), $lte: parseISO(to) };
    }

    const attendance = await Attendance.find(query).populate('userId', 'name employeeId department');

    const summary = {
      totalRecords: attendance.length,
      present: attendance.filter((a) => a.status === 'present').length,
      late: attendance.filter((a) => a.status === 'late').length,
      absent: attendance.filter((a) => a.status === 'absent').length,
      halfDay: attendance.filter((a) => a.status === 'half-day').length,
      totalHours: attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
      byDepartment: {},
      byEmployee: {},
    };

    // Group by department
    attendance.forEach((a) => {
      const dept = a.userId?.department || 'Unknown';
      if (!summary.byDepartment[dept]) {
        summary.byDepartment[dept] = { present: 0, late: 0, absent: 0, halfDay: 0 };
      }
      summary.byDepartment[dept][a.status] = (summary.byDepartment[dept][a.status] || 0) + 1;
    });

    // Group by employee
    attendance.forEach((a) => {
      const empId = a.userId?.employeeId || 'Unknown';
      if (!summary.byEmployee[empId]) {
        summary.byEmployee[empId] = {
          name: a.userId?.name || 'Unknown',
          present: 0,
          late: 0,
          absent: 0,
          halfDay: 0,
          totalHours: 0,
        };
      }
      summary.byEmployee[empId][a.status] = (summary.byEmployee[empId][a.status] || 0) + 1;
      summary.byEmployee[empId].totalHours += a.totalHours || 0;
    });

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get today's status for all employees
// @route   GET /api/attendance/today-status
// @access  Private (Manager)
const getTodayStatus = async (req, res) => {
  try {
    const today = startOfDay(new Date());

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: endOfDay(today) },
    })
      .populate('userId', 'name email employeeId department')
      .sort({ createdAt: -1 });

    const allUsers = await User.find({ role: 'employee' });
    const statusMap = {};

    attendance.forEach((a) => {
      statusMap[a.userId._id.toString()] = a;
    });

    const result = allUsers.map((user) => {
      const att = statusMap[user._id.toString()];
      return {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          employeeId: user.employeeId,
          department: user.department,
        },
        checkedIn: att ? !!att.checkInTime : false,
        checkedOut: att ? !!att.checkOutTime : false,
        status: att ? att.status : 'absent',
        checkInTime: att?.checkInTime,
        checkOutTime: att?.checkOutTime,
        totalHours: att?.totalHours || 0,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Export attendance as CSV
// @route   GET /api/attendance/export?from=&to=
// @access  Private (Manager)
const exportAttendance = async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = {};

    if (from && to) {
      query.date = { $gte: parseISO(from), $lte: parseISO(to) };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    // Generate CSV
    let csv = 'Date,Employee ID,Name,Email,Department,Check In,Check Out,Status,Total Hours\n';

    attendance.forEach((a) => {
      const date = format(new Date(a.date), 'yyyy-MM-dd');
      const checkIn = a.checkInTime ? format(new Date(a.checkInTime), 'yyyy-MM-dd HH:mm:ss') : '';
      const checkOut = a.checkOutTime ? format(new Date(a.checkOutTime), 'yyyy-MM-dd HH:mm:ss') : '';
      csv += `${date},${a.userId?.employeeId || ''},${a.userId?.name || ''},${a.userId?.email || ''},${a.userId?.department || ''},${checkIn},${checkOut},${a.status},${a.totalHours || 0}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=attendance-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
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
};

