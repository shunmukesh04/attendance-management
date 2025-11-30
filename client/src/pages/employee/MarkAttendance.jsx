import { useEffect, useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import { formatTime, getStatusColor, getStatusLabel } from '../../utils/helpers';

const MarkAttendance = () => {
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const response = await api.get('/attendance/today');
      setTodayData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load today\'s attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    setError(null);
    setMessage(null);
    try {
      await api.post('/attendance/checkin');
      setMessage('Successfully checked in!');
      await fetchTodayData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check in');
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    setError(null);
    setMessage(null);
    try {
      await api.post('/attendance/checkout');
      setMessage('Successfully checked out!');
      await fetchTodayData();
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

  return (
    <Layout role="employee">
      <h1>Mark Attendance</h1>
      <ErrorMessage message={error} />
      {message && <div className="success">{message}</div>}

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Today's Attendance</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <strong>Status:</strong>{' '}
            <span style={{ color: getStatusColor(todayData?.status), fontSize: '18px', fontWeight: 'bold' }}>
              {getStatusLabel(todayData?.status)}
            </span>
          </div>
          {todayData?.checkInTime && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Check In Time:</strong> {formatTime(todayData.checkInTime)}
            </div>
          )}
          {todayData?.checkOutTime && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Check Out Time:</strong> {formatTime(todayData.checkOutTime)}
            </div>
          )}
          {todayData?.totalHours > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Total Hours:</strong> {todayData.totalHours.toFixed(2)} hours
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {!todayData?.checkedIn && (
            <Button onClick={handleCheckIn} disabled={checking} style={{ padding: '12px 32px', fontSize: '18px' }}>
              {checking ? 'Checking In...' : 'Check In'}
            </Button>
          )}
          {todayData?.checkedIn && !todayData?.checkedOut && (
            <Button variant="success" onClick={handleCheckOut} disabled={checking} style={{ padding: '12px 32px', fontSize: '18px' }}>
              {checking ? 'Checking Out...' : 'Check Out'}
            </Button>
          )}
          {todayData?.checkedOut && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#28a745' }}>
              <strong>You have completed today's attendance!</strong>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MarkAttendance;

