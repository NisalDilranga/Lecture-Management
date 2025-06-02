import Home from "./pages/Home";
import Login from "./pages/Login";
import Hello from "./pages/Hello";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/LayOut";
import AddUsers from "./components/dashboard-comp/AddUsers";
import ApplicationsManagement from "./pages/ApplicationsManagement";
// Import the fixed version of ApplicationDetails
import ApplicationDetails from "./pages/ApplicationDetails_fixed";
import DepartmentsManagement from "./pages/DepartmentsManagement";
import TimetableManagement from "./pages/TimetableManagement";
import UserTimetable from "./pages/UserTimetable";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hello" element={
          <ProtectedRoute>
            <Hello />
          </ProtectedRoute>
        } />
     
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Admin-only routes */}
          <Route 
            index 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AddUsers/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="add-users" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AddUsers/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="departments" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <DepartmentsManagement/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="timetable-management" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <TimetableManagement/>
              </ProtectedRoute>
            } 
          />
          
          {/* Routes accessible by both Admin and User */}
          <Route 
            path="applications" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ApplicationsManagement/>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="applications/:id" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <ApplicationDetails/>
              </ProtectedRoute>
            } 
          />
          
          {/* User-only routes */}
          <Route 
            path="my-timetable" 
            element={
              <ProtectedRoute allowedRoles={['User']}>
                <UserTimetable/>
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
