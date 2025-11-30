import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceChart = ({ data }) => {
  if (!data) return <div>No data available</div>;

  const chartData = [
    {
      name: 'Present',
      value: data.present || 0,
    },
    {
      name: 'Late',
      value: data.late || 0,
    },
    {
      name: 'Absent',
      value: data.absent || 0,
    },
    {
      name: 'Half Day',
      value: data.halfDay || 0,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#007bff" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;

