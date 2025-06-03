import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationById, updateApplicationStatus } from '../services/ApplicationServices';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAllDepartments } from '../services/DepartmentServices';
import emailjs from 'emailjs-com';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [departments, setDepartments] = useState([]);  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewPlace, setInterviewPlace] = useState('');
  const [markValue, setMarkValue] = useState('');
  const [approvedDate, setApprovedDate] = useState('');
  const [approvedTime, setApprovedTime] = useState('');
  const [approvedPlace, setApprovedPlace] = useState('');  // Function to send interview notification email
  const sendInterviewEmail = (applicantName, applicantEmail, interviewDetails, date, time, place) => {
    try {
      // EmailJS configuration - replace with your actual EmailJS credentials
      const serviceId = 'service_z2ibt8t';
      const templateId = 'template_3z7j8s9';
      const userId = 'RBbIDF9W6HXh8XpqB';

      // Format the interview details message with date, time and place
      const formattedMessage = `
You have been scheduled for an interview for your application.

Interview Details:
Date: ${date || 'To be confirmed'}
Time: ${time || 'To be confirmed'}
Location: ${place || 'To be confirmed'}

${interviewDetails ? `\nAdditional Information:\n${interviewDetails}` : ''}
      `.trim();

      // Email template parameters
      const templateParams = {
        to_name: applicantName,
        to_email: applicantEmail,
        message: formattedMessage
      };

      // Send the email
      emailjs.send(serviceId, templateId, templateParams, userId)
        .then(response => {
          console.log('Interview email notification sent successfully:', response);
          toast.success('Interview notification email sent to applicant');
        })
        .catch(err => {
          console.error('Failed to send interview email notification:', err);
          toast.error('Failed to send interview notification email');
        });
    } catch (error) {
      console.error('Error in sendInterviewEmail function:', error);
    }
  };
  
  // Function to send approval notification email
  const sendApprovalEmail = (applicantName, applicantEmail, approvalDetails, date, time, place) => {
    try {
      // EmailJS configuration - replace with your actual EmailJS credentials
      const serviceId = 'service_z2ibt8t';
      const templateId = 'template_3z7j8s9';
      const userId = 'RBbIDF9W6HXh8XpqB';

      // Format the approval details message with date, time and place
      const formattedMessage = `
Congratulations! Your application has been approved.

You have been selected to join our institution. Please report on the following date and time:

Reporting Details:
Date: ${date || 'To be confirmed'}
Time: ${time || 'To be confirmed'}
Location: ${place || 'To be confirmed'}

${approvalDetails ? `\nAdditional Information:\n${approvalDetails}` : ''}

Please bring all your original certificates and documents for verification.
      `.trim();

      // Email template parameters
      const templateParams = {
        to_name: applicantName,
        to_email: applicantEmail,
        message: formattedMessage
      };

      // Send the email
      emailjs.send(serviceId, templateId, templateParams, userId)
        .then(response => {
          console.log('Approval email notification sent successfully:', response);
          toast.success('Approval notification email sent to applicant');
        })
        .catch(err => {
          console.error('Failed to send approval email notification:', err);
          toast.error('Failed to send approval notification email');
        });
    } catch (error) {
      console.error('Error in sendApprovalEmail function:', error);
    }
  };
  
  // Function to get department name by ID
  const getDepartmentName = (departmentId) => {
    if (!departmentId) return 'N/A';
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : departmentId;
  };
  
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching application with ID:", id);
        console.log("Current user:", currentUser);
        
        // User email for verification (if not authenticated)
        const verificationEmail = currentUser ? currentUser.email : null;
        
        // Use the real Firebase data instead of mock data
        const applicationData = await getApplicationById(id, verificationEmail);
        console.log("Received application data:", applicationData);
        
        if (applicationData) {
          setApplication(applicationData);
          setNewStatus(applicationData.status || '');
        } else {
          console.error("Application not found or returned null");
          setError('Application not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setError(err.message || 'Failed to load application details');
        toast.error('Failed to load application details');
        setLoading(false);
      }
    };
    
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    
    fetchApplicationDetails();
    fetchDepartments();
  }, [id, currentUser]);    const handleStatusUpdate = async () => {
    try {
      // Prepare interview details if status is "interview"
      let interviewDetails = null;
      let marksDetails = null;
      let approvedDetails = null;
      
      if (newStatus === 'interview') {
        interviewDetails = {
          date: interviewDate,
          time: interviewTime,
          place: interviewPlace
        };
      }
      
      // Prepare approved details if status is "approved"
      if (newStatus === 'approved') {
        approvedDetails = {
          date: approvedDate,
          time: approvedTime,
          place: approvedPlace
        };
      }

      // Prepare marks details if status is "marks"
      if (newStatus === 'marks' && markValue) {
        const mark = parseFloat(markValue);
        
        if (!isNaN(mark)) {
          marksDetails = {
            mark: mark.toFixed(2)
          };
        }
      }
      
      // Update application status with details if applicable
      await updateApplicationStatus(id, newStatus, feedback, interviewDetails, marksDetails, approvedDetails);
      
      // Update local application state
      const updatedApplication = { 
        ...application, 
        status: newStatus, 
        feedback 
      };
      
      // Add interview details to local state if provided
      if (interviewDetails) {
        updatedApplication.interviewDetails = interviewDetails;
      }
      
      // Add approved details to local state if provided
      if (approvedDetails) {
        updatedApplication.approvedDetails = approvedDetails;
      }
      
      // Add marks details to local state if provided
      if (marksDetails) {
        updatedApplication.marksDetails = marksDetails;
      }
      
      setApplication(updatedApplication);
      toast.success(`Status updated to ${newStatus}`);
      setShowStatusModal(false);

      // Send interview email if status is updated to "interview"
      if (newStatus === 'interview') {
        const applicantName = application.fullName || 'Applicant';
        const applicantEmail = application.email || application.contactEmail;
        
        if (applicantEmail) {
          // Send the interview notification email with date, time and place
          sendInterviewEmail(
            applicantName, 
            applicantEmail, 
            feedback,
            interviewDate,
            interviewTime, 
            interviewPlace
          );
        } else {
          toast.warning('Could not send email notification: Applicant email not available');
        }
      }
      
      // Send approval email if status is updated to "approved"
      if (newStatus === 'approved') {
        const applicantName = application.fullName || 'Applicant';
        const applicantEmail = application.email || application.contactEmail;
        
        if (applicantEmail) {
          // Send the approval notification email with date, time and place
          sendApprovalEmail(
            applicantName, 
            applicantEmail, 
            feedback,
            approvedDate,
            approvedTime, 
            approvedPlace
          );
        } else {
          toast.warning('Could not send email notification: Applicant email not available');
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Handle Firestore timestamp objects
      if (typeof dateString === 'object' && dateString !== null) {
        if (dateString.seconds) {
          const date = new Date(dateString.seconds * 1000);
          return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).format(date);
        }
        
        if (dateString instanceof Date) {
          return new Intl.DateTimeFormat('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).format(dateString);
        }
      }
      
      // Handle normal date strings
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
    const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'marks':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/Dashboard/applications')} 
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }
  if (!application) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Application not found</p>
          <button 
            onClick={() => navigate('/Dashboard/applications')} 
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-full">      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Application Details</h1>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/Dashboard/applications')} 
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <button 
            onClick={() => setShowStatusModal(true)} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Update Status
          </button>
        </div>
      </div>
        {/* Status Badge */}
      <div className="mb-6">
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(application.status)}`}>
          Status: {application.status || 'N/A'}
        </span>
        <span className="ml-4 text-gray-600">
          Submitted: {formatDate(application.submittedAt)}
        </span>
        {application.updatedAt && (
          <span className="ml-4 text-gray-600">
            Last Updated: {formatDate(application.updatedAt)}
          </span>
        )}
      </div>
        {/* Interview Details Banner - only shown when status is "interview" and details exist */}
      {application.status === 'interview' && application.interviewDetails && (
        <div className="mb-6 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md">
          <h3 className="font-medium text-purple-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Interview Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-sm text-gray-900">{application.interviewDetails.date || 'To be confirmed'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-sm text-gray-900">{application.interviewDetails.time || 'To be confirmed'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-sm text-gray-900">{application.interviewDetails.place || 'To be confirmed'}</p>
            </div>
          </div>
          {application.interviewDetails.scheduledAt && (
            <p className="text-xs text-gray-500 mt-2">
              Interview scheduled on: {formatDate(application.interviewDetails.scheduledAt)}
            </p>
          )}
        </div>
      )}      {/* Approved Details Banner - only shown when status is "approved" and details exist */}
      {application.status === 'approved' && application.approvedDetails && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <h3 className="font-medium text-green-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Application Approved
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Reporting Date</p>
              <p className="text-sm text-gray-900">{application.approvedDetails.date || 'To be confirmed'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reporting Time</p>
              <p className="text-sm text-gray-900">{application.approvedDetails.time || 'To be confirmed'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reporting Location</p>
              <p className="text-sm text-gray-900">{application.approvedDetails.place || 'To be confirmed'}</p>
            </div>
          </div>
          
          <p className="text-sm text-green-700 mt-2 font-medium">
            Please bring all your original certificates and documents for verification.
          </p>
        </div>
      )}
      
      {/* Marks Details Banner - only shown when status is "assign marks" and details exist */}
      {application.status === 'assign marks' && application.marksDetails && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <h3 className="font-medium text-green-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Marks Details
          </h3>
          
          <div className="flex items-center">
            <div className="bg-white rounded-full py-2 px-6 border border-green-300">
              <span className="text-2xl font-bold text-green-800">{application.marksDetails.mark}</span>
              <span className="text-sm text-gray-500">/100</span>
            </div>
          </div>
          
          {application.marksDetails.assignedAt && (
            <p className="text-xs text-gray-500 mt-3">
              Mark assigned on: {formatDate(application.marksDetails.assignedAt)}
            </p>
          )}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
            <p className="mt-1 text-sm text-gray-900">{application.fullName || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name with Initials</h3>
            <p className="mt-1 text-sm text-gray-900">{application.nameWithInitials || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1 text-sm text-gray-900">{formatDate(application.dateOfBirth) || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-sm text-gray-900">{application.email || application.contactEmail || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Mobile Phone</h3>
            <p className="mt-1 text-sm text-gray-900">{application.mobilePhone || 'N/A'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Official Phone</h3>
            <p className="mt-1 text-sm text-gray-900">{application.officialPhone || 'N/A'}</p>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Postal Address</h3>
            <p className="mt-1 text-sm text-gray-900">{application.postalAddress || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {/* Preferred Placements */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Preferred Placements</h2>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">                {application.preferredPlacements && application.preferredPlacements.length > 0 ? (
                  application.preferredPlacements.filter(placement => placement && (placement.place || placement.subjects)).map((placement, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{placement.place || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getDepartmentName(placement.departmentId) || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {Array.isArray(placement.subjects) 
                          ? placement.subjects.join(', ') 
                          : (placement.subjects || 'N/A')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No preferred placements provided</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Academic Qualifications */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Academic Qualifications</h2>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">                {application.academicQualifications && application.academicQualifications.length > 0 ? (
                  application.academicQualifications.filter(qual => qual && (qual.degree || qual.university)).map((qualification, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qualification.degree || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qualification.university || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(qualification.date) || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No academic qualifications provided</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Professional Qualifications */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Professional Qualifications</h2>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">                {application.professionalQualifications && application.professionalQualifications.length > 0 ? (
                  application.professionalQualifications.filter(qual => qual && (qual.qualification || qual.institute)).map((qualification, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qualification.qualification || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{qualification.institute || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(qualification.date) || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No professional qualifications provided</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Other Qualifications */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Other Qualifications</h2>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-700 whitespace-pre-line">{application.otherQualifications || 'None provided'}</p>
        </div>
      </div>
      
      {/* Teaching Experience */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Teaching Experience</h2>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">              {application.teachingExperience && application.teachingExperience.length > 0 ? (
                  application.teachingExperience.filter(exp => exp && (exp.institute || exp.program || exp.subject)).map((experience, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{experience.institute || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{experience.program || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{experience.subject || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{experience.years || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No teaching experience provided</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Work Experience */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">Work Experience</h2>
        </div>
        
        <div className="p-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Present Position</h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.workExperience?.present ? (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.workExperience.present.position || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(application.workExperience.present.from) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(application.workExperience.present.to) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.workExperience.present.years || 'N/A'}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No present work experience provided</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <h3 className="text-md font-medium text-gray-700 mb-3">Past Positions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Years</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">                {application.workExperience?.past && application.workExperience.past.length > 0 ? (
                  application.workExperience.past.map((exp, index) => (
                    exp && exp.position && exp.position.trim() !== "" ? (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.position || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(exp.from) || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(exp.to) || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.years || 'N/A'}</td>
                      </tr>
                    ) : null
                  )).filter(Boolean)
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No past work experience provided</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* References */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">References</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">            {application.references && application.references.length > 0 ? (
              application.references.filter(ref => ref && (ref.name || ref.position || ref.email)).map((reference, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">{reference.name || 'N/A'}</h3>
                  <p className="text-sm text-gray-600 mb-1">Position: {reference.position || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mb-1">Email: {reference.email || 'N/A'}</p>
                  <p className="text-sm text-gray-600 mb-1">Phone: {reference.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Address: {reference.address || 'N/A'}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">No references provided</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Admin Feedback Section */}
      {application.feedback && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-700">Feedback</h2>
          </div>
          
          <div className="p-6">
            <p className="text-sm text-gray-700 whitespace-pre-line">{application.feedback}</p>
          </div>
        </div>
      )}
        {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Update Application Status</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="marks"> Marks</option>
                <option value="interview">Interview Scheduled</option>
              </select>
            </div>            {/* Interview Details Fields - only show when status is "interview" */}
            {newStatus === 'interview' && (
              <div className="border border-blue-200 bg-blue-50 rounded p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">Interview Details</h3>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Date
                  </label>
                  <input 
                    type="date" 
                    value={interviewDate} 
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Time
                  </label>
                  <input 
                    type="time" 
                    value={interviewTime} 
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Location
                  </label>
                  <input 
                    type="text" 
                    value={interviewPlace} 
                    onChange={(e) => setInterviewPlace(e.target.value)}
                    placeholder="Enter interview location"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            
            {/* Approved Details Fields - only show when status is "approved" */}
            {newStatus === 'approved' && (
              <div className="border border-green-200 bg-green-50 rounded p-4 mb-4">
                <h3 className="font-medium text-green-800 mb-2">Reporting Details</h3>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporting Date
                  </label>
                  <input 
                    type="date" 
                    value={approvedDate} 
                    onChange={(e) => setApprovedDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporting Time
                  </label>
                  <input 
                    type="time" 
                    value={approvedTime} 
                    onChange={(e) => setApprovedTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporting Location
                  </label>
                  <input 
                    type="text" 
                    value={approvedPlace} 
                    onChange={(e) => setApprovedPlace(e.target.value)}
                    placeholder="Enter reporting location"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}
              {/* Marks Details Fields - only show when status is "assign marks" */}
            {newStatus === 'assign marks' && (
              <div className="border border-green-200 bg-green-50 rounded p-4 mb-4">
                <h3 className="font-medium text-green-800 mb-2">Assign Mark</h3>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mark (0-100)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    value={markValue} 
                    onChange={(e) => setMarkValue(e.target.value)}
                    placeholder="Enter mark between 0-100"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">              <label className="block text-sm font-medium text-gray-700 mb-1">
                {newStatus === 'interview' 
                  ? 'Additional Information (Optional)' 
                  : newStatus === 'assign marks' 
                    ? 'Feedback about marks (Optional)'
                    : newStatus === 'approved'
                    ? 'Additional Instructions (Optional)'
                    : 'Feedback (Optional)'}
              </label>              <textarea 
                value={feedback} 
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder={newStatus === 'interview' 
                  ? "Add any additional information about the interview..." 
                  : newStatus === 'assign marks'
                    ? "Add feedback or comments about the marks..."
                    : newStatus === 'approved'
                    ? "Add any additional instructions or information for the selected applicant..."
                    : "Add feedback for the applicant..."}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>              <button 
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!newStatus || 
                  (newStatus === 'interview' && (!interviewDate || !interviewTime || !interviewPlace)) || 
                  (newStatus === 'approved' && (!approvedDate || !approvedTime || !approvedPlace)) || 
                  (newStatus === 'assign marks' && !markValue)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
