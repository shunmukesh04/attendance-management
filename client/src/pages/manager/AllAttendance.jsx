import { useEffect, useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '../../utils/helpers';

const AllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: '',
    date: '',
    status: '',
    department: '',
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      if (filters.date) params.append('date', filters.date);
      if (filters.status) params.append('status', filters.status);
      if (filters.department) params.append('department', filters.department);

      const response = await api.get(`/attendance/all?${params.toString()}`);
      setAttendance(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchAttendance();
  };

  const handleClearFilters = () => {
    setFilters({
      employeeId: '',
      date: '',
      status: '',
      department: '',
    });
    setTimeout(() => {
      fetchAttendance();
    }, 100);
  };

  if (loading) {
    return (
      <Layout role="manager">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout role="manager">
      <h1>All Employees Attendance</h1>
      <ErrorMessage message={error} />

      {/* Filters */}
      <div className="card">
        <h2>Filters</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Input
            label="Employee ID"
            name="employeeId"
            value={filters.employeeId}
            onChange={handleFilterChange}
            placeholder="e.g., EMP001"
          />
          <Input
            label="Date"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>
          <Input
            label="Department"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            placeholder="e.g., Engineering"
          />
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <h2>Attendance Records ({attendance.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
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
              {attendance.map((att) => (
                <tr key={att._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{formatDate(att.date)}</td>
                  <td style={{ padding: '12px' }}>{att.userId?.name || '-'}</td>
                  <td style={{ padding: '12px' }}>{att.userId?.employeeId || '-'}</td>
                  <td style={{ padding: '12px' }}>{att.userId?.department || '-'}</td>
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
        </div>
        {attendance.length === 0 && (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No attendance records found</p>
        )}
      </div>
    </Layout>
  );
};

export default AllAttendance;

