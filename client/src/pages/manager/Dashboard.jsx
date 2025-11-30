import { useEffect, useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatTime, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/manager');
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout role="manager">
        <Loading />
      </Layout>
    );
  }

  if (error && !dashboardData) {
    return (
      <Layout role="manager">
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  const { totalEmployees, todayStats, monthStats, trendData, lateToday, absentToday, departmentStats } = dashboardData || {};

  // Convert trend data to array for chart
  const trendArray = Object.entries(trendData || {})
    .map(([date, stats]) => ({
      date: date.split('-')[2], // Day of month
      present: stats.present,
      absent: stats.absent,
      late: stats.late,
    }))
    .sort((a, b) => parseInt(a.date) - parseInt(b.date));

  // Convert department stats to array
  const deptArray = Object.entries(departmentStats || {}).map(([dept, stats]) => ({
    department: dept,
    present: stats.present,
    late: stats.late,
    absent: stats.absent,
    halfDay: stats.halfDay,
  }));

  return (
    <Layout role="manager">
      <h1>Manager Dashboard</h1>
      <ErrorMessage message={error} />

      {/* Today's Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <h3>Total Employees</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalEmployees || 0}</div>
        </div>
        <div className="card">
          <h3>Present Today</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            {todayStats?.present || 0}
          </div>
        </div>
        <div className="card">
          <h3>Absent Today</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {todayStats?.absent || 0}
          </div>
        </div>
        <div className="card">
          <h3>Late Today</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
            {todayStats?.late || 0}
          </div>
        </div>
        <div className="card">
          <h3>Checked In</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {todayStats?.checkedIn || 0}
          </div>
        </div>
        <div className="card">
          <h3>Checked Out</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {todayStats?.checkedOut || 0}
          </div>
        </div>
      </div>

      {/* Month Stats */}
      <div className="card">
        <h2>This Month's Statistics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <strong>Present:</strong> {monthStats?.present || 0}
          </div>
          <div>
            <strong>Late:</strong> {monthStats?.late || 0}
          </div>
          <div>
            <strong>Absent:</strong> {monthStats?.absent || 0}
          </div>
          <div>
            <strong>Half Day:</strong> {monthStats?.halfDay || 0}
          </div>
          <div>
            <strong>Total Hours:</strong> {monthStats?.totalHours?.toFixed(1) || 0}h
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      {trendArray.length > 0 && (
        <div className="card">
          <h2>Attendance Trend (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#28a745" name="Present" />
              <Line type="monotone" dataKey="absent" stroke="#dc3545" name="Absent" />
              <Line type="monotone" dataKey="late" stroke="#ffc107" name="Late" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Department Stats */}
      {deptArray.length > 0 && (
        <div className="card">
          <h2>Department-wise Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#28a745" name="Present" />
              <Bar dataKey="late" fill="#ffc107" name="Late" />
              <Bar dataKey="absent" fill="#dc3545" name="Absent" />
              <Bar dataKey="halfDay" fill="#17a2b8" name="Half Day" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Late Employees Today */}
      <div className="card">
        <h2>Late Employees Today</h2>
        {lateToday && lateToday.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Employee ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Check In Time</th>
              </tr>
            </thead>
            <tbody>
              {lateToday.map((emp, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{emp.name}</td>
                  <td style={{ padding: '12px' }}>{emp.employeeId}</td>
                  <td style={{ padding: '12px' }}>{emp.department}</td>
                  <td style={{ padding: '12px' }}>{formatTime(emp.checkInTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No late employees today</p>
        )}
      </div>

      {/* Absent Employees Today */}
      <div className="card">
        <h2>Absent Employees Today</h2>
        {absentToday && absentToday.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Employee ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
              </tr>
            </thead>
            <tbody>
              {absentToday.map((emp, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{emp.name}</td>
                  <td style={{ padding: '12px' }}>{emp.employeeId}</td>
                  <td style={{ padding: '12px' }}>{emp.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>All employees are present today</p>
        )}
      </div>
    </Layout>
  );
};

export default ManagerDashboard;

