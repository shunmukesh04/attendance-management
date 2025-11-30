import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/authSlice';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Employee pages
import EmployeeDashboard from './pages/employee/Dashboard';
import MarkAttendance from './pages/employee/MarkAttendance';
import History from './pages/employee/History';
import Profile from './pages/employee/Profile';

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard';
import AllAttendance from './pages/manager/AllAttendance';
import CalendarView from './pages/manager/CalendarView';
import Reports from './pages/manager/Reports';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Employee routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['employee', 'manager']}>
            {user?.role === 'employee' ? (
              <Navigate to="/employee/dashboard" replace />
            ) : (
              <Navigate to="/manager/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/history"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Manager routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <AllAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/calendar"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <CalendarView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

