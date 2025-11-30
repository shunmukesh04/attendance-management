import { useEffect, useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '../../utils/helpers';
import AttendanceCalendar from '../../components/calendar/AttendanceCalendar';
import { format } from 'date-fns';

const History = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));

  useEffect(() => {
    fetchHistory();
    fetchSummary();
  }, [month]);

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/attendance/my-history?month=${month}`);
      setAttendance(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/attendance/my-summary?month=${month}`);
      setSummary(response.data);
    } catch (err) {
      console.error('Failed to load summary:', err);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setLoading(true);
  };

  if (loading) {
    return (
      <Layout role="employee">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout role="employee">
      <h1>My Attendance History</h1>
      <ErrorMessage message={error} />

      {/* Month Selector */}
      <div className="card">
        <Input
          label="Select Month"
          type="month"
          value={month}
          onChange={handleMonthChange}
        />
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="card">
            <h3>Present</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {summary.present}
            </div>
          </div>
          <div className="card">
            <h3>Late</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
              {summary.late}
            </div>
          </div>
          <div className="card">
            <h3>Absent</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
              {summary.absent}
            </div>
          </div>
          <div className="card">
            <h3>Half Day</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#17a2b8' }}>
              {summary.halfDay}
            </div>
          </div>
          <div className="card">
            <h3>Total Hours</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {summary.totalHours.toFixed(1)}h
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="card">
        <h2>Calendar View</h2>
        <AttendanceCalendar attendance={attendance} />
      </div>

      {/* Table View */}
      <div className="card">
        <h2>Detailed History</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Check In</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Check Out</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att._id} style={{ borderBottom: '1px solid #eee' }}>
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
        {attendance.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No attendance records for this month</p>
        )}
      </div>
    </Layout>
  );
};

export default History;

