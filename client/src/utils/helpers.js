import { format, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '-';
  try {
    return format(parseISO(date), 'yyyy-MM-dd');
  } catch {
    return format(new Date(date), 'yyyy-MM-dd');
  }
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    return format(parseISO(date), 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  }
};

export const formatTime = (date) => {
  if (!date) return '-';
  try {
    return format(parseISO(date), 'HH:mm');
  } catch {
    return format(new Date(date), 'HH:mm');
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'present':
      return '#28a745';
    case 'late':
      return '#ffc107';
    case 'absent':
      return '#dc3545';
    case 'half-day':
      return '#17a2b8';
    default:
      return '#6c757d';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'present':
      return 'Present';
    case 'late':
      return 'Late';
    case 'absent':
      return 'Absent';
    case 'half-day':
      return 'Half Day';
    default:
      return status;
  }
};

