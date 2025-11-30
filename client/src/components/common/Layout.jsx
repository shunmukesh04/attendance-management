import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import Button from './Button';

const Layout = ({ children, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const employeeNav = [
    { path: '/employee/dashboard', label: 'Dashboard' },
    { path: '/employee/attendance', label: 'Mark Attendance' },
    { path: '/employee/history', label: 'History' },
    { path: '/employee/profile', label: 'Profile' },
  ];

  const managerNav = [
    { path: '/manager/dashboard', label: 'Dashboard' },
    { path: '/manager/attendance', label: 'All Attendance' },
    { path: '/manager/calendar', label: 'Calendar View' },
    { path: '/manager/reports', label: 'Reports' },
  ];

  const navItems = role === 'employee' ? employeeNav : managerNav;

  return (
    <div>
      <nav style={{
        background: '#007bff',
        color: 'white',
        padding: '16px 0',
        marginBottom: '24px',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Attendance System</h2>
            <small>{user?.name} ({user?.role})</small>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ color: 'white', textDecoration: 'none', padding: '8px 12px' }}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="secondary" onClick={handleLogout} style={{ marginLeft: '16px' }}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <div className="container">{children}</div>
    </div>
  );
};

export default Layout;

