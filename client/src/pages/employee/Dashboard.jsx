import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '../../utils/helpers';
import AttendanceChart from '../../components/charts/AttendanceChart';

const EmployeeDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/employee');
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      await api.post('/attendance/checkin');
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check in');
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    try {
      await api.post('/attendance/checkout');
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check out');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <Layout role="employee">
        <Loading />
      </Layout>
    );
  }

  if (error && !dashboardData) {
    return (
      <Layout role="employee">
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  const { today, monthStats, last30DaysStats, recentAttendance } = dashboardData || {};

  return (
    <Layout role="employee">
      <h1>Employee Dashboard</h1>
      <ErrorMessage message={error} />

      {/* Today's Status */}
      <div className="card">
        <h2>Today's Attendance</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <strong>Status:</strong>{' '}
            <span style={{ color: getStatusColor(today?.status) }}>
              {getStatusLabel(today?.status)}
            </span>
          </div>
          {today?.checkInTime && (
            <div>
              <strong>Check In:</strong> {formatTime(today.checkInTime)}
            </div>
          )}
          {today?.checkOutTime && (
            <div>
              <strong>Check Out:</strong> {formatTime(today.checkOutTime)}
            </div>
          )}
          {today?.totalHours > 0 && (
            <div>
              <strong>Total Hours:</strong> {today.totalHours.toFixed(2)}h
            </div>
          )}
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          {!today?.checkedIn && (
            <Button onClick={handleCheckIn} disabled={checking}>
              {checking ? 'Checking In...' : 'Check In'}
            </Button>
          )}
          {today?.checkedIn && !today?.checkedOut && (
            <Button variant="success" onClick={handleCheckOut} disabled={checking}>
              {checking ? 'Checking Out...' : 'Check Out'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <h3>This Month</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
            {monthStats?.present || 0}
          </div>
          <div>Present Days</div>
        </div>
        <div className="card">
          <h3>This Month</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
            {monthStats?.late || 0}
          </div>
          <div>Late Days</div>
        </div>
        <div className="card">
          <h3>This Month</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>
            {monthStats?.absent || 0}
          </div>
          <div>Absent Days</div>
        </div>
        <div className="card">
          <h3>Last 30 Days</h3>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {last30DaysStats?.totalHours?.toFixed(1) || 0}h
          </div>
          <div>Total Hours</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <h2>Attendance Overview (Last 30 Days)</h2>
        <AttendanceChart data={last30DaysStats} />
      </div>

      {/* Recent Attendance */}
      <div className="card">
        <h2>Recent Attendance</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Check In</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Check Out</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Hours</th>
            </tr>
          </thead>
          <tbody>
            {recentAttendance?.map((att, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{formatDate(att.date)}</td>
                <td style={{ padding: '12px', color: getStatusColor(att.status) }}>
                  {getStatusLabel(att.status)}
                </td>
                <td style={{ padding: '12px' }}>{att.checkInTime ? formatTime(att.checkInTime) : '-'}</td>
                <td style={{ padding: '12px' }}>{att.checkOutTime ? formatTime(att.checkOutTime) : '-'}</td>
                <td style={{ padding: '12px' }}>{att.totalHours?.toFixed(2) || 0}h</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!recentAttendance || recentAttendance.length === 0) && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No recent attendance records</p>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;

