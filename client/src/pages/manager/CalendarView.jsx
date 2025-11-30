import { useEffect, useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { getStatusColor } from '../../utils/helpers';

const CalendarView = () => {
  const [todayStatus, setTodayStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dateAttendance, setDateAttendance] = useState([]);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchDateAttendance();
    }
  }, [selectedDate]);

  const fetchTodayStatus = async () => {
    try {
      const response = await api.get('/attendance/today-status');
      setTodayStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load today\'s status');
    } finally {
      setLoading(false);
    }
  };

  const fetchDateAttendance = async () => {
    try {
      const response = await api.get(`/attendance/all?date=${selectedDate}`);
      setDateAttendance(response.data);
    } catch (err) {
      console.error('Failed to load date attendance:', err);
    }
  };

  if (loading) {
    return (
      <Layout role="manager">
        <Loading />
      </Layout>
    );
  }

  // Group by department
  const groupedByDept = {};
  todayStatus.forEach((item) => {
    const dept = item.user?.department || 'Unknown';
    if (!groupedByDept[dept]) {
      groupedByDept[dept] = [];
    }
    groupedByDept[dept].push(item);
  });

  return (
    <Layout role="manager">
      <h1>Team Calendar View</h1>
      <ErrorMessage message={error} />

      {/* Date Selector */}
      <div className="card">
        <Input
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Today's Status by Department */}
      <div className="card">
        <h2>Today's Status by Department</h2>
        {Object.entries(groupedByDept).map(([dept, items]) => (
          <div key={dept} style={{ marginBottom: '24px' }}>
            <h3>{dept}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${getStatusColor(item.status)}`,
                    padding: '12px',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{item.user?.name}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>{item.user?.employeeId}</div>
                  <div style={{ marginTop: '8px', color: getStatusColor(item.status) }}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                  {item.checkInTime && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      In: {format(new Date(item.checkInTime), 'HH:mm')}
                    </div>
                  )}
                  {item.checkOutTime && (
                    <div style={{ fontSize: '12px' }}>
                      Out: {format(new Date(item.checkOutTime), 'HH:mm')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Date Attendance */}
      {selectedDate !== format(new Date(), 'yyyy-MM-dd') && (
        <div className="card">
          <h2>Attendance for {format(parseISO(selectedDate), 'MMMM dd, yyyy')}</h2>
          {dateAttendance.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Employee ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Check In</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Check Out</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {dateAttendance.map((att) => (
                  <tr key={att._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{att.userId?.name || '-'}</td>
                    <td style={{ padding: '12px' }}>{att.userId?.employeeId || '-'}</td>
                    <td style={{ padding: '12px' }}>{att.userId?.department || '-'}</td>
                    <td style={{ padding: '12px', color: getStatusColor(att.status) }}>
                      {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {att.checkInTime ? format(new Date(att.checkInTime), 'HH:mm') : '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {att.checkOutTime ? format(new Date(att.checkOutTime), 'HH:mm') : '-'}
                    </td>
                    <td style={{ padding: '12px' }}>{att.totalHours?.toFixed(2) || 0}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No attendance records for this date
            </p>
          )}
        </div>
      )}
    </Layout>
  );
};

export default CalendarView;

