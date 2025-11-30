import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { getStatusColor } from '../../utils/helpers';

const AttendanceCalendar = ({ attendance }) => {
  const today = new Date();
  const currentMonth = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: currentMonth, end: monthEnd });

  // Create a map of attendance by date
  const attendanceMap = {};
  attendance?.forEach((att) => {
    const dateKey = format(new Date(att.date), 'yyyy-MM-dd');
    attendanceMap[dateKey] = att;
  });

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get first day of week for the month
  const firstDayOfWeek = currentMonth.getDay();

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
        {dayNames.map((day) => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', padding: '8px' }}>
            {day}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} style={{ aspectRatio: '1', padding: '8px' }} />
        ))}
        {/* Days of the month */}
        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const att = attendanceMap[dateKey];
          const isToday = isSameDay(day, today);
          const statusColor = att ? getStatusColor(att.status) : '#e0e0e0';

          return (
            <div
              key={dateKey}
              style={{
                aspectRatio: '1',
                border: isToday ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px',
                backgroundColor: statusColor,
                color: att ? 'white' : '#666',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: isToday ? 'bold' : 'normal',
              }}
              title={att ? `${format(day, 'MMM dd')}: ${att.status}` : format(day, 'MMM dd')}
            >
              <div style={{ fontSize: '14px' }}>{format(day, 'd')}</div>
              {att && (
                <div style={{ fontSize: '10px', marginTop: '4px' }}>
                  {att.status === 'present' ? 'P' : att.status === 'late' ? 'L' : att.status === 'absent' ? 'A' : 'H'}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#28a745', borderRadius: '4px' }} />
          <span>Present</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#ffc107', borderRadius: '4px' }} />
          <span>Late</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#dc3545', borderRadius: '4px' }} />
          <span>Absent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#17a2b8', borderRadius: '4px' }} />
          <span>Half Day</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;

