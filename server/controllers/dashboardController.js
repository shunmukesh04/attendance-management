const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, format } = require('date-fns');

// @desc    Get employee dashboard data
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = startOfDay(new Date());
    const currentMonth = startOfMonth(new Date());
    const last30Days = subDays(new Date(), 30);

    // Today's attendance
    const todayAttendance = await Attendance.findOne({
      userId,
      date: { $gte: today, $lt: endOfDay(today) },
    });

    // Current month stats
    const monthAttendance = await Attendance.find({
      userId,
      date: { $gte: currentMonth, $lte: endOfMonth(new Date()) },
    });

    // Last 30 days stats
    const last30DaysAttendance = await Attendance.find({
      userId,
      date: { $gte: last30Days, $lte: new Date() },
    });

    // Calculate stats
    const monthStats = {
      present: monthAttendance.filter((a) => a.status === 'present').length,
      late: monthAttendance.filter((a) => a.status === 'late').length,
      absent: monthAttendance.filter((a) => a.status === 'absent').length,
      halfDay: monthAttendance.filter((a) => a.status === 'half-day').length,
      totalHours: monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
    };

    const last30DaysStats = {
      present: last30DaysAttendance.filter((a) => a.status === 'present').length,
      late: last30DaysAttendance.filter((a) => a.status === 'late').length,
      absent: last30DaysAttendance.filter((a) => a.status === 'absent').length,
      halfDay: last30DaysAttendance.filter((a) => a.status === 'half-day').length,
      totalHours: last30DaysAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
    };

    // Recent attendance (last 7 days)
    const recentAttendance = await Attendance.find({
      userId,
      date: { $gte: subDays(new Date(), 7), $lte: new Date() },
    })
      .sort({ date: -1 })
      .limit(7);

    res.json({
      today: {
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        status: todayAttendance?.status || 'absent',
        checkInTime: todayAttendance?.checkInTime,
        checkOutTime: todayAttendance?.checkOutTime,
        totalHours: todayAttendance?.totalHours || 0,
      },
      monthStats,
      last30DaysStats,
      recentAttendance: recentAttendance.map((a) => ({
        date: a.date,
        status: a.status,
        checkInTime: a.checkInTime,
        checkOutTime: a.checkOutTime,
        totalHours: a.totalHours,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get manager dashboard data
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
const getManagerDashboard = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const currentMonth = startOfMonth(new Date());
    const last30Days = subDays(new Date(), 30);

    // Total employees
    const totalEmployees = await User.countDocuments({ role: 'employee' });

    // Today's status
    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: endOfDay(today) },
    }).populate('userId', 'name employeeId department');

    const todayStats = {
      present: todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length,
      absent: totalEmployees - todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length,
      late: todayAttendance.filter((a) => a.status === 'late').length,
      checkedIn: todayAttendance.filter((a) => a.checkInTime).length,
      checkedOut: todayAttendance.filter((a) => a.checkOutTime).length,
    };

    // Current month stats
    const monthAttendance = await Attendance.find({
      date: { $gte: currentMonth, $lte: endOfMonth(new Date()) },
    });

    const monthStats = {
      present: monthAttendance.filter((a) => a.status === 'present').length,
      late: monthAttendance.filter((a) => a.status === 'late').length,
      absent: monthAttendance.filter((a) => a.status === 'absent').length,
      halfDay: monthAttendance.filter((a) => a.status === 'half-day').length,
      totalHours: monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
    };

    // Last 30 days trend
    const last30DaysAttendance = await Attendance.find({
      date: { $gte: last30Days, $lte: new Date() },
    });

    // Group by date for trend
    const trendData = {};
    last30DaysAttendance.forEach((a) => {
      const dateKey = format(new Date(a.date), 'yyyy-MM-dd');
      if (!trendData[dateKey]) {
        trendData[dateKey] = { present: 0, late: 0, absent: 0 };
      }
      if (a.status === 'present' || a.status === 'late') {
        trendData[dateKey].present++;
      } else if (a.status === 'absent') {
        trendData[dateKey].absent++;
      }
      if (a.status === 'late') {
        trendData[dateKey].late++;
      }
    });

    // Late employees today
    const lateToday = todayAttendance
      .filter((a) => a.status === 'late')
      .map((a) => ({
        name: a.userId?.name,
        employeeId: a.userId?.employeeId,
        department: a.userId?.department,
        checkInTime: a.checkInTime,
      }));

    // Absent employees today
    const allEmployees = await User.find({ role: 'employee' });
    const presentEmployeeIds = new Set(todayAttendance.map((a) => a.userId._id.toString()));
    const absentToday = allEmployees
      .filter((emp) => !presentEmployeeIds.has(emp._id.toString()))
      .map((emp) => ({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department,
      }));

    // Department-wise stats
    const departmentStats = {};
    monthAttendance.forEach((a) => {
      // We need to populate userId for department
    });

    // Get department stats properly
    const attendanceWithUsers = await Attendance.find({
      date: { $gte: currentMonth, $lte: endOfMonth(new Date()) },
    }).populate('userId', 'department');

    const deptStats = {};
    attendanceWithUsers.forEach((a) => {
      const dept = a.userId?.department || 'Unknown';
      if (!deptStats[dept]) {
        deptStats[dept] = { present: 0, late: 0, absent: 0, halfDay: 0 };
      }
      deptStats[dept][a.status] = (deptStats[dept][a.status] || 0) + 1;
    });

    res.json({
      totalEmployees,
      todayStats,
      monthStats,
      trendData,
      lateToday,
      absentToday,
      departmentStats: deptStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getEmployeeDashboard, getManagerDashboard };

