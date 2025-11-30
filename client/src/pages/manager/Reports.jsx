import { useEffect, useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/summary?from=${dateRange.from}&to=${dateRange.to}`);
      setSummary(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    fetchSummary();
  };

  const handleExport = async () => {
    try {
      const response = await api.get(`/attendance/export?from=${dateRange.from}&to=${dateRange.to}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance-${dateRange.from}-to-${dateRange.to}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <Layout role="manager">
        <Loading />
      </Layout>
    );
  }

  // Convert employee summary to array for chart
  const employeeArray = summary?.byEmployee
    ? Object.entries(summary.byEmployee)
        .map(([empId, data]) => ({
          name: data.name,
          present: data.present,
          late: data.late,
          absent: data.absent,
          halfDay: data.halfDay,
          totalHours: data.totalHours,
        }))
        .sort((a, b) => b.totalHours - a.totalHours)
        .slice(0, 10) // Top 10
    : [];

  // Convert department summary to array
  const deptArray = summary?.byDepartment
    ? Object.entries(summary.byDepartment).map(([dept, stats]) => ({
        department: dept,
        present: stats.present,
        late: stats.late,
        absent: stats.absent,
        halfDay: stats.halfDay,
      }))
    : [];

  return (
    <Layout role="manager">
      <h1>Reports</h1>
      <ErrorMessage message={error} />

      {/* Date Range Selector */}
      <div className="card">
        <h2>Date Range</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Input
            label="From Date"
            type="date"
            name="from"
            value={dateRange.from}
            onChange={handleDateChange}
          />
          <Input
            label="To Date"
            type="date"
            name="to"
            value={dateRange.to}
            onChange={handleDateChange}
          />
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <Button onClick={handleApply}>Apply</Button>
          <Button variant="success" onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      {/* Overall Summary */}
      {summary && (
        <div className="card">
          <h2>Overall Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Total Records:</strong> {summary.totalRecords}
            </div>
            <div>
              <strong>Present:</strong> {summary.present}
            </div>
            <div>
              <strong>Late:</strong> {summary.late}
            </div>
            <div>
              <strong>Absent:</strong> {summary.absent}
            </div>
            <div>
              <strong>Half Day:</strong> {summary.halfDay}
            </div>
            <div>
              <strong>Total Hours:</strong> {summary.totalHours.toFixed(1)}h
            </div>
          </div>
        </div>
      )}

      {/* Department Chart */}
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

      {/* Employee Performance */}
      {employeeArray.length > 0 && (
        <div className="card">
          <h2>Top 10 Employees by Total Hours</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={employeeArray} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalHours" fill="#007bff" name="Total Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Employee Details Table */}
      {summary?.byEmployee && (
        <div className="card">
          <h2>Employee Details</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Present</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Late</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Absent</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Half Day</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.byEmployee)
                  .sort((a, b) => b[1].totalHours - a[1].totalHours)
                  .map(([empId, data]) => (
                    <tr key={empId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{data.name}</td>
                      <td style={{ padding: '12px' }}>{data.present}</td>
                      <td style={{ padding: '12px' }}>{data.late}</td>
                      <td style={{ padding: '12px' }}>{data.absent}</td>
                      <td style={{ padding: '12px' }}>{data.halfDay}</td>
                      <td style={{ padding: '12px' }}>{data.totalHours.toFixed(1)}h</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;

