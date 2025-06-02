import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiAlertCircle, FiEye, FiEyeOff, FiDollarSign, FiBook, FiSearch } from 'react-icons/fi';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import EditUser from './EditUser';
import { getAllDepartments } from '../../services/DepartmentServices';

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use by another account.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled in Firebase console.';
    case 'auth/weak-password':
      return 'The password is too weak. Use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

const AddUsers = () => {  
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subjects, setSubjects] = useState([{ name: '' }]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentSubjects, setDepartmentSubjects] = useState([]);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
    hourlyRate: '',
    subjects: [],
    department: ''
  });

  // Get auth functions from context
  const { createUser, createUserInFirestoreOnly, testFirestoreConnection, testAuth } = useAuth();
  
  // Test Firebase connection on component mount
  useEffect(() => {
    const runTest = async () => {
      try {
        // Test Firestore connection
        const firestoreResult = await testFirestoreConnection();
        console.log("Firestore connection test result:", firestoreResult ? "SUCCESS" : "FAILED");
        
        // Test Auth connection
        const authResult = await testAuth();
        console.log("Firebase Auth connection test result:", authResult ? "SUCCESS" : "FAILED");
        
        // Show error if either connection fails
        if (!firestoreResult) {
          toast.error("Failed to connect to the Firestore database. Check your network connection.");
        }
        
        if (!authResult) {
          toast.error("Failed to initialize Firebase Authentication. User creation may not work.");
        }
      } catch (error) {
        console.error("Error testing Firebase connections:", error);
        toast.error("Error connecting to Firebase services.");
      }
    };
    
    runTest();
  }, [testFirestoreConnection, testAuth]);

  // Fetch users and departments on component mount
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const departmentsList = await getAllDepartments();
      setDepartments(departmentsList);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setNewUser({
      ...newUser,
      department: departmentId
    });
    
    // Find the selected department and get its subjects
    if (departmentId) {
      const department = departments.find(dept => dept.id === departmentId);
      if (department && department.subjects) {
        setDepartmentSubjects(department.subjects);
        // Clear existing subjects
        setSubjects([{ name: '' }]);
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

  const handleHourlyRateChange = (e) => {
    const { value } = e.target;
    setNewUser({
      ...newUser,
      hourlyRate: value
    });
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Prepare user data
      const userData = { ...newUser };
      
      // Ensure email is included
      if (!userData.email) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      
      // Include subjects only if role is User
      if (userData.role === 'User') {
        // Make sure we extract just the name strings from the subject objects
        userData.subjects = subjects
          .filter(subject => subject.name.trim() !== '')
          .map(subject => subject.name.trim());
        
        // Ensure hourly rate is stored as a number
        if (userData.hourlyRate) {
          userData.hourlyRate = parseFloat(userData.hourlyRate);
        }
        
        // Include department if selected
        if (selectedDepartment) {
          userData.department = selectedDepartment;
          // Find department name for display
          const selectedDeptObj = departments.find(dept => dept.id === selectedDepartment);
          if (selectedDeptObj) {
            userData.departmentName = selectedDeptObj.name;
          }
        }
        
        console.log("User subjects prepared for storage:", userData.subjects);
        console.log("User hourly rate prepared for storage:", userData.hourlyRate);
        console.log("User department prepared for storage:", userData.department);
      } else {
        // Remove subjects, hourlyRate, and department if not a User
        delete userData.subjects;
        delete userData.hourlyRate;
        delete userData.department;
        delete userData.departmentName;
      }
        console.log("Submitting user data to create:", userData);
      
      try {
        // Always create users with Authentication first (preferred approach)
        console.log("Creating new user with authentication");
        const createdUser = await createUser(userData);
        console.log("User created successfully via Auth:", createdUser);
        
        // Clear form and close modal
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'Admin',
          hourlyRate: '',
          subjects: []
        });
        setSubjects([{ name: '' }]);
        setSelectedDepartment('');
        setDepartmentSubjects([]);
        setShowAddModal(false);
        
        // Refresh users list
        fetchUsers();
        toast.success('User added successfully');
      } catch (authError) {
        console.error("Error from Auth service:", authError);
        
        // If there's an auth error, try Firestore-only creation as a fallback (for testing only)
        if (process.env.NODE_ENV === 'development') {
          try {
            console.log("Auth creation failed, trying Firestore-only as fallback (dev mode)");
            // Remove password as it's not needed for Firestore-only creation
            const { password, ...firestoreUserData } = userData;
            
            console.log("Creating user directly in Firestore:", firestoreUserData);
            const createdUser = await createUserInFirestoreOnly(firestoreUserData);
            console.log("User created successfully in Firestore:", createdUser);
            
            // Clear form and close modal
            setNewUser({
              name: '',
              email: '',
              password: '',
              role: 'Admin',
              hourlyRate: '',
              subjects: []
            });
            setSubjects([{ name: '' }]);
            setSelectedDepartment('');
            setDepartmentSubjects([]);
            setShowAddModal(false);
            
            // Refresh users list
            fetchUsers();
            toast.success('User added successfully to database (Firestore only)');
          } catch (firestoreError) {
            console.error("Error creating user directly in Firestore:", firestoreError);
            let errorMessage = 'Failed to add user. ';
            
            // Handle Firebase auth specific errors from the original error
            errorMessage += getFirebaseErrorMessage(authError.code);
            
            setError(errorMessage);
            toast.error(errorMessage);
          }
        } else {
          let errorMessage = 'Failed to add user. ';
          
          // Handle Firebase auth specific errors
          errorMessage += getFirebaseErrorMessage(authError.code);
          
          setError(errorMessage);
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("General error adding user:", error);
      setError('Failed to add user. Please try again.');
      toast.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setLoading(true);
    try {
      // Delete document from Firestore
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
    setError(''); // Clear any previous errors when user starts typing
  };  

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  
  const handleUserUpdated = (updatedUser) => {
    // Update the user in the local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
    // Show success toast
    toast.success('User updated successfully');
  };

  const toggleUserDetails = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null); // collapse if already expanded
    } else {
      setExpandedUserId(userId); // expand this user's details
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      // Filter by department if a department filter is selected
      const departmentMatch = !filterDepartment || user.department === filterDepartment;
      
      // Filter by search query if there is one
      const query = searchQuery.toLowerCase().trim();
      const searchMatch = !query || 
        user.name?.toLowerCase().includes(query) || 
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query);
        
      return departmentMatch && searchMatch;
    });
  };

  const validateForm = () => {
    console.log("Validating form with data:", newUser);
    
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      const missingFields = [];
      if (!newUser.name) missingFields.push("name");
      if (!newUser.email) missingFields.push("email");
      if (!newUser.password) missingFields.push("password");
      if (!newUser.role) missingFields.push("role");
      
      const errorMessage = `The following fields are required: ${missingFields.join(", ")}`;
      console.error(errorMessage);
      setError(errorMessage);
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      console.error("Invalid email format:", newUser.email);
      setError('Please enter a valid email address');
      return false;
    }
    
    // Simple password validation (at least 6 characters)
    if (newUser.password.length < 6) {
      console.error("Password too short:", newUser.password.length);
      setError('Password must be at least 6 characters long');
      return false;
    }
      // Validate subjects and hourly rate for User role
    if (newUser.role === 'User') {
      if (!newUser.hourlyRate) {
        console.error("Missing hourly rate for User role");
        setError('Please enter an hourly rate');
        return false;
      }
      
      if (!selectedDepartment) {
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

  return (
    <div className="p-6">      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600">Manage system users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <FiPlus className="mr-2" /> Add New User
        </button>
      </div>
        {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or role..."
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="w-full md:w-64">
          <select
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Statistics */}
      {!loading && users.length > 0 && (
        <div className="text-sm text-gray-500 mb-4">
          Showing {getFilteredUsers().length} of {users.length} users
          {filterDepartment && (
            <span> in {departments.find(d => d.id === filterDepartment)?.name || 'selected department'}</span>
          )}
          {searchQuery && (
            <span> matching "{searchQuery}"</span>
          )}
          {(filterDepartment || searchQuery) && (
            <button 
              onClick={() => {setFilterDepartment(''); setSearchQuery('');}}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMAIL
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROLE
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DETAILS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      <span className="ml-2">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found. Add your first user to get started.
                  </td>
                </tr>
              ) : getFilteredUsers().length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users match your search criteria.
                  </td>
                </tr>
              ) : (
                getFilteredUsers().map(user => (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => toggleUserDetails(user.id)}
                          className="text-gray-600 hover:text-blue-700 transition-colors"
                          title={expandedUserId === user.id ? "Hide details" : "Show details"}
                        >
                          {expandedUserId === user.id ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => handleEditUser(user)}
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedUserId === user.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-4">
                          <div className="p-3 rounded-md bg-gray-100">
                            {user.role === 'User' && (
                              <>                                {user.departmentName && (
                                  <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 text-purple-600 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Department:</span>
                                    <span className={`ml-2 ${filterDepartment === user.department ? 'bg-yellow-100 px-2 py-1 rounded' : ''}`}>
                                      {user.departmentName}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center mb-2">
                                  <FiBook className="mr-2 text-blue-600" />
                                  <span className="font-medium">Subjects:</span>
                                  <div className="ml-2 flex flex-wrap gap-1">                                    {user.subjects && Array.isArray(user.subjects) && user.subjects.length > 0 ? (
                                      user.subjects.map((subject, index) => (
                                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                          {typeof subject === 'object' && subject.name ? subject.name : subject}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">No subjects assigned</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <FiDollarSign className="mr-2 text-green-600" />
                                  <span className="font-medium">Hourly Rate:</span>
                                  <span className="ml-2">${user.hourlyRate || 'Not set'}</span>
                                </div>
                              </>
                            )}
                            {user.role !== 'User' && (
                              <div className="text-gray-500">No additional details available for admin users.</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full my-8"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
              <button 
                onClick={() => setShowAddModal(false)}
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
                      value={newUser.name}
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
                      value={newUser.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={newUser.role}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                </div>
              </div>              {newUser.role === 'User' && (
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
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={addSubjectField} 
                      className="flex items-center text-blue-600 hover:text-blue-900"
                    >
                      <FiPlus className="mr-1" /> Add Subject
                    </button>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={newUser.hourlyRate}
                      onChange={handleHourlyRateChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"                      placeholder="Enter hourly rate"
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
                      Adding...
                    </span>
                  ) : (
                    'Add User'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUser 
          user={selectedUser} 
          onClose={() => setShowEditModal(false)} 
          onUserUpdated={handleUserUpdated} 
        />
      )}
    </div>
  );
};

export default AddUsers;