import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllApplications } from "../services/ApplicationServices";
import { getAllDepartments } from "../services/DepartmentServices";
import { useNavigate } from "react-router-dom";

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [filteredApplications, setFilteredApplications] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Real implementation using Firebase
    const fetchData = async () => {
      try {
        setLoading(true);
        const [applicationsData, departmentsData] = await Promise.all([
          getAllApplications(),
          getAllDepartments()
        ]);
        setApplications(applicationsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        
        // Fallback to mock data if there's an error
        const mockApplications = [
          {
            id: "app1",
            fullName: "John Doe",
            preferredPlacements: [{ 
              place: "Computer Science Department", 
              departmentId: "cs_dept", 
              subjects: ["Programming", "Web Development"] 
            }],
            submittedAt: { seconds: Date.now() / 1000 },
            status: "pending"
          },
          {
            id: "app2",
            fullName: "Jane Smith",
            preferredPlacements: [{ 
              place: "Mathematics Department", 
              departmentId: "math_dept", 
              subjects: ["Calculus", "Linear Algebra"] 
            }],
            submittedAt: { seconds: (Date.now() - 3*24*60*60*1000) / 1000 },
            status: "approved"
          },
          {
            id: "app3",
            fullName: "Robert Johnson",
            preferredPlacements: [{ 
              place: "Physics Department", 
              departmentId: "phys_dept", 
              subjects: ["Mechanics", "Electromagnetism"] 
            }],
            submittedAt: { seconds: (Date.now() - 5*24*60*60*1000) / 1000 },
            status: "rejected"
          }
        ];
        setApplications(mockApplications);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters whenever applications, searchTerm, or selectedDepartment changes
    let filtered = [...applications];
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.fullName?.toLowerCase().includes(lowercasedSearch) || 
        app.preferredPlacements?.[0]?.place?.toLowerCase().includes(lowercasedSearch) ||
        app.preferredPlacements?.[0]?.subjects?.some(subject => 
          subject.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
    
    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(app => 
        app.preferredPlacements?.[0]?.departmentId === selectedDepartment
      );
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, selectedDepartment]);

  const viewApplicationDetails = (id) => {
    // Navigate to application details page
    navigate(`/Dashboard/applications/${id}`);
  };
  
  const formatDate = (dateObj) => {
    if (!dateObj) return 'N/A';
    
    try {
      // Handle Firestore timestamp
      if (dateObj.seconds) {
        return new Date(dateObj.seconds * 1000).toLocaleDateString();
      }
      return new Date(dateObj).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';
      case 'approved':
        return 'bg-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-200 text-red-800';
      case 'marks':
        return 'bg-blue-200 text-blue-800';
      case 'interview':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  const getDepartmentName = (departmentId) => {
    if (!departmentId) return 'Unknown';
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  };
  return (
    <div className="p-6 max-w-full">
      <h1 className="text-2xl font-semibold mb-6">Applications Management</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-end">

        <div className="md:w-1/4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Applicant</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Position/Subject</th>
                <th className="py-3 px-4 text-left">Submission Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Marks</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-100">                    <td className="py-3 px-4">{app.fullName || 'Unknown'}</td>
                    <td className="py-3 px-4">{getDepartmentName(app.preferredPlacements[0]?.departmentId) || 'Unknown'}</td>
                    <td className="py-3 px-4">                      {app.preferredPlacements && app.preferredPlacements[0] ? 
                        `${app.preferredPlacements[0].place || ''} - ${Array.isArray(app.preferredPlacements[0].subjects) 
                          ? app.preferredPlacements[0].subjects.join(', ') 
                          : app.preferredPlacements[0].subjects || ''}` : 
                        'Not specified'}
                    </td>
                    <td className="py-3 px-4">{formatDate(app.submittedAt)}</td>
                    <td className="py-3 px-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(app.status)}`}
                      >
                        {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
                      </span>
                    </td>                     <td className="py-3 px-4">
                      {app.marksDetails ? 
                        <span className="font-medium text-blue-600">{app.marksDetails.mark ? 
        parseFloat(app.marksDetails.mark).toString() : 
        '-'}</span> : 
                        '-'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => viewApplicationDetails(app.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))              ) : (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                    {applications.length > 0 
                      ? "No matching applications found. Try adjusting your search or filter."
                      : "No applications found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;