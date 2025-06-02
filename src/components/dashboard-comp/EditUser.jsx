import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getAllDepartments } from '../../services/DepartmentServices';

const EditUser = ({ user, onClose, onUserUpdated }) => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [subjects, setSubjects] = useState([{ name: '' }]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(user?.department || '');
  const [departmentSubjects, setDepartmentSubjects] = useState([]);
  const [userData, setUserData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Admin',
    hourlyRate: user?.hourlyRate || '',
    department: user?.department || '',
    departmentName: user?.departmentName || ''
  });

  // Initialize subjects if user is a lecturer
  useEffect(() => {
    if (user?.subjects?.length > 0) {
      setSubjects(user.subjects.map(subject => ({ name: subject })));
    }
    
    // Fetch departments
    fetchDepartments();
  }, [user]);

  const fetchDepartments = async () => {
    try {
      const departmentsList = await getAllDepartments();
      setDepartments(departmentsList);
      
      // If user has a department, get the subjects for that department
      if (user?.department) {
        const userDept = departmentsList.find(dept => dept.id === user.department);
        if (userDept && userDept.subjects) {
          setDepartmentSubjects(userDept.subjects);
        }
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index].name = value;
    setSubjects(updatedSubjects);
  };

  const addSubjectField = () => {
    setSubjects([...subjects, { name: '' }]);
  };

  const removeSubjectField = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    setError(''); // Clear any previous errors when user starts typing
  };

  const handleHourlyRateChange = (e) => {
    const { value } = e.target;
    setUserData({
      ...userData,
      hourlyRate: value
    });
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setUserData({
      ...userData,
      department: departmentId
    });
    
    // Find the selected department and get its subjects
    if (departmentId) {
      const department = departments.find(dept => dept.id === departmentId);
      if (department && department.subjects) {
        setDepartmentSubjects(department.subjects);
      } else {
        setDepartmentSubjects([]);
      }
    } else {
      setDepartmentSubjects([]);
    }
  };

  const handleSubjectSelection = (selectedSubject) => {
    // Check if subject already exists
    const exists = subjects.some(subject => subject.name === selectedSubject);
    if (!exists) {
      if (subjects.length === 1 && subjects[0].name === '') {
        // Replace the empty subject
        setSubjects([{ name: selectedSubject }]);
      } else {
        // Add to existing subjects
        setSubjects([...subjects, { name: selectedSubject }]);
      }
    }
  };

  const validateForm = () => {
    console.log("Validating form with data:", userData);
    
    if (!userData.name || !userData.email || !userData.role) {
      const missingFields = [];
      if (!userData.name) missingFields.push("name");
      if (!userData.email) missingFields.push("email");
      if (!userData.role) missingFields.push("role");
      
      const errorMessage = `The following fields are required: ${missingFields.join(", ")}`;
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      console.error("Invalid email format:", userData.email);
      setError('Please enter a valid email address');
      return false;
    }
      // Validate subjects and hourly rate for User role
    if (userData.role === 'User') {
      if (!userData.hourlyRate) {
        console.error("Missing hourly rate for User role");
        setError('Please enter an hourly rate');
        return false;
      }
      
      if (!userData.department) {
        console.error("No department selected for User role");
        setError('Please select a department');
        return false;
      }

      // Filter out any empty subjects
      const filteredSubjects = subjects.filter(subject => subject.name.trim() !== '');
      if (filteredSubjects.length === 0) {
        console.error("No subjects provided for User role");
        setError('Please add at least one subject');
        return false;
      }
    }
    
    console.log("Form validation successful");
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const updatedUserData = { ...userData };
      const isEmailChanged = updatedUserData.email !== user.email;
        // Include subjects only if role is User
      if (updatedUserData.role === 'User') {
        updatedUserData.subjects = subjects
          .filter(subject => subject.name.trim() !== '')
          .map(subject => subject.name);

        // Include department if selected
        if (selectedDepartment) {
          updatedUserData.department = selectedDepartment;
          // Find department name for display
          const selectedDeptObj = departments.find(dept => dept.id === selectedDepartment);
          if (selectedDeptObj) {
            updatedUserData.departmentName = selectedDeptObj.name;
          }
        }
      } else {
        // Remove subjects, hourlyRate, and department if not a User
        delete updatedUserData.subjects;
        delete updatedUserData.hourlyRate;
        delete updatedUserData.department;
        delete updatedUserData.departmentName;
      }
      
      console.log(`Updating user ${user.id} with data:`, updatedUserData);
      console.log("Email changed:", isEmailChanged ? "YES" : "NO");
      
      // Call the update function
      const updatedUser = await updateUser(user.id, updatedUserData);
      console.log("User updated successfully:", updatedUser);
      
      // Check if email update in Auth was required but failed
      if (updatedUser.authEmailUpdateFailed) {
        console.log("Auth email update failed. Manual update needed.");
        toast.warning(
          'User data updated, but could not update email in authentication system. ' +
          'The user will need to re-authenticate to fully update their email.'
        );
      } else if (isEmailChanged) {
        toast.info(
          'Email address updated. The user may need to verify their new email address.'
        );
      }
      
      setSuccess(true);
      toast.success('User updated successfully');
      
      // Notify parent component
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }
      
      // Close after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating user:", error);
      setError(`Failed to update user: ${error.message}`);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full my-8"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center">
              <FiAlertCircle className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm flex items-center">
              <FiCheckCircle className="mr-2 flex-shrink-0" />
              User updated successfully!
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  disabled
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-200"
                  placeholder="Enter email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div>
          </div>
            {userData.role === 'User' && (
            <>
              <div className="mb-6">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-900 mb-4">Subjects</h3>
                
                {selectedDepartment && departmentSubjects.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Subjects
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {departmentSubjects.map((subject, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSubjectSelection(subject)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200"
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {subjects.map((subject, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter subject"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeSubjectField(index)} 
                      className="ml-2 text-red-600 hover:text-red-900"
                      disabled={subjects.length === 1}
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addSubjectField} 
                  className="flex items-center text-blue-600 hover:text-blue-900"
                >
                  + Add Subject
                </button>
              </div>

              <div className="mb-6">
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  value={userData.hourlyRate}
                  onChange={handleHourlyRateChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter hourly rate"
                  min="0"
                  step="0.01"
                />
              </div>
            </>
          )}
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <span className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditUser;
