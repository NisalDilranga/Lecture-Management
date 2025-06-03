import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/hello" />;
  }

  return children;
};

export default ProtectedRoute;
