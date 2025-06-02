import React, { useState, useEffect } from 'react';
import {
  addDepartment,
  getAllDepartments,
  deleteDepartment,
  addSubjectToDepartment,
  removeSubjectFromDepartment
} from '../services/DepartmentServices';

const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSubjects, setNewSubjects] = useState({});

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);
        
        // Initialize newSubjects state
        const subjectsObj = {};
        departmentsData.forEach(dept => {
          subjectsObj[dept.id] = '';
        });
        setNewSubjects(subjectsObj);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handler for adding a new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartment.trim()) return;

    try {
      setLoading(true);
      const departmentId = await addDepartment(newDepartment);
      
      // Update local state
      setDepartments([
        ...departments,
        { id: departmentId, name: newDepartment, subjects: [], createdAt: new Date() }
      ]);
      
      // Update newSubjects state
      setNewSubjects(prev => ({
        ...prev,
        [departmentId]: ''
      }));
      
      setNewDepartment('');
    } catch (err) {
      console.error('Error adding department:', err);
      setError('Failed to add department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a department
  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteDepartment(departmentId);
      
      // Update local state
      setDepartments(departments.filter(dept => dept.id !== departmentId));
      
      // Update newSubjects state
      const updatedSubjects = { ...newSubjects };
      delete updatedSubjects[departmentId];
      setNewSubjects(updatedSubjects);
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Failed to delete department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for adding a new subject to a department
  const handleAddSubject = async (departmentId) => {
    const subjectName = newSubjects[departmentId];
    if (!subjectName.trim()) return;

    try {
      setLoading(true);
      await addSubjectToDepartment(departmentId, subjectName);
      
      // Update local state
      setDepartments(departments.map(dept => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            subjects: [...dept.subjects, subjectName]
          };
        }
        return dept;
      }));
      
      // Reset subject input
      setNewSubjects(prev => ({
        ...prev,
        [departmentId]: ''
      }));
    } catch (err) {
      console.error('Error adding subject:', err);
      setError('Failed to add subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for removing a subject from a department
  const handleRemoveSubject = async (departmentId, subjectName) => {
    try {
      setLoading(true);
      await removeSubjectFromDepartment(departmentId, subjectName);
      
      // Update local state
      setDepartments(departments.map(dept => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            subjects: dept.subjects.filter(subject => subject !== subjectName)
          };
        }
        return dept;
      }));
    } catch (err) {
      console.error('Error removing subject:', err);
      setError('Failed to remove subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for new subject
  const handleSubjectInputChange = (departmentId, value) => {
    setNewSubjects(prev => ({
      ...prev,
      [departmentId]: value
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Departments</h1>
      <p className="text-gray-600 mb-6">Add and manage departments and their subjects</p>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Department Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Department</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Department Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            />
          </div>
          
          <button
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddDepartment}
            disabled={loading || !newDepartment.trim()}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
            Add Department
          </button>
        </div>

        {/* Existing Departments List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Existing Departments</h2>
          
          {loading && departments.length === 0 ? (
            <div className="text-center py-4">
              <svg className="animate-spin mx-auto h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No departments added yet.</p>
          ) : (
            <div className="space-y-6">
              {departments.map((department) => (
                <div key={department.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{department.name}</h3>
                    <button
                      onClick={() => handleDeleteDepartment(department.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Department"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 font-medium">Subjects</p>
                    
                    <div className="mt-2">
                      {department.subjects && department.subjects.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {department.subjects.map((subject, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                              <span className="text-sm text-gray-700">{subject}</span>
                              <button
                                onClick={() => handleRemoveSubject(department.id, subject)}
                                className="ml-2 text-gray-500 hover:text-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic mb-3">No subjects added</p>
                      )}

                      <div className="flex">
                        <input
                          type="text"
                          className="flex-grow px-3 py-2 text-sm border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add new subject"
                          value={newSubjects[department.id] || ''}
                          onChange={(e) => handleSubjectInputChange(department.id, e.target.value)}
                        />
                        <button
                          onClick={() => handleAddSubject(department.id)}
                          disabled={!newSubjects[department.id]?.trim()}
                          className="bg-blue-600 text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsManagement;
