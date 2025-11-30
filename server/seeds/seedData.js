const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const connectDB = require('../config/database');
const { startOfDay, subDays, format } = require('date-fns');

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Creating users...');

    // Create Manager
    const manager = await User.create({
      name: 'John Manager',
      email: 'manager@company.com',
      password: 'manager123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management',
    });

    console.log('Manager created:', manager.email);

    // Create Employees
    const employees = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP001',
        department: 'Engineering',
      },
      {
        name: 'Bob Smith',
        email: 'bob@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'Engineering',
      },
      {
        name: 'Carol Williams',
        email: 'carol@company.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'Sales',
      },
    ]);

    console.log('Employees created:', employees.length);

    // Create sample attendance data for the last 30 days
    console.log('Creating attendance records...');

    const attendanceRecords = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      for (const employee of employees) {
        const dateStart = startOfDay(date);
        
        // Randomly decide if employee is present (80% chance)
        const isPresent = Math.random() > 0.2;

        if (isPresent) {
          // Check-in time between 8:00 AM and 10:00 AM
          const checkInHour = 8 + Math.floor(Math.random() * 2);
          const checkInMinute = Math.floor(Math.random() * 60);
          const checkInTime = new Date(dateStart);
          checkInTime.setHours(checkInHour, checkInMinute, 0, 0);

          // Determine if late (after 9:00 AM)
          const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMinute > 0);

          // Check-out time between 5:00 PM and 7:00 PM
          const checkOutHour = 17 + Math.floor(Math.random() * 2);
          const checkOutMinute = Math.floor(Math.random() * 60);
          const checkOutTime = new Date(dateStart);
          checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);

          // Calculate total hours
          const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

          // Determine status
          let status = isLate ? 'late' : 'present';
          if (totalHours < 4) {
            status = 'half-day';
          }

          attendanceRecords.push({
            userId: employee._id,
            date: dateStart,
            checkInTime,
            checkOutTime,
            status,
            totalHours: Math.round(totalHours * 100) / 100,
          });
        } else {
          // Absent
          attendanceRecords.push({
            userId: employee._id,
            date: dateStart,
            status: 'absent',
            totalHours: 0,
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`Created ${attendanceRecords.length} attendance records`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Manager:');
    console.log('  Email: manager@company.com');
    console.log('  Password: manager123');
    console.log('\nEmployees:');
    console.log('  Email: alice@company.com / bob@company.com / carol@company.com');
    console.log('  Password: employee123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedUsers();

