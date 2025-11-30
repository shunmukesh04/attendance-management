import { useSelector } from 'react-redux';
import Layout from '../../components/common/Layout';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout role="employee">
      <h1>My Profile</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2>Personal Information</h2>
        <div style={{ marginBottom: '16px' }}>
          <strong>Name:</strong> {user?.name}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Email:</strong> {user?.email}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Employee ID:</strong> {user?.employeeId}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Department:</strong> {user?.department}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Role:</strong> {user?.role}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

