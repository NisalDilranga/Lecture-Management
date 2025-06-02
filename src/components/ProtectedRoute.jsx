import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  // If still loading, you might want to show a loading indicator
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // If route requires specific roles and user doesn't have permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to a default page based on their role
    return <Navigate to="/hello" />;
  }

  // If authenticated and has permission, render the children (protected content)
  return children;
};

export default ProtectedRoute;
