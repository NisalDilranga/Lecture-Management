import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../services/ApplicationServices";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getAllDepartments } from "../services/DepartmentServices";
import emailjs from "emailjs-com";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewPlace, setInterviewPlace] = useState("");
  const [markValue, setMarkValue] = useState("");
  const [approvedDate, setApprovedDate] = useState("");
  const [approvedTime, setApprovedTime] = useState("");
  const [approvedPlace, setApprovedPlace] = useState("");

  const sendInterviewEmail = (
    applicantName,
    applicantEmail,
    interviewDetails,
    date,
    time,
    place
  ) => {
    try {
      const serviceId = "service_7adrs8a";
      const templateId = "template_mz8kw1t";
      const userId = "3oc7EHE9_86XJPWcr";

      const formattedMessage = `
You have been scheduled for an interview for your application.

Interview Details:
Date: ${date || "To be confirmed"}
Time: ${time || "To be confirmed"}
Location: ${place || "To be confirmed"}

${interviewDetails ? `\nAdditional Information:\n${interviewDetails}` : ""}
      `.trim();

      // Email template parameters
      const templateParams = {
        to_name: applicantName,
        to_email: applicantEmail,
        message: formattedMessage,
      };

      // Send the email
      emailjs
        .send(serviceId, templateId, templateParams, userId)
        .then((response) => {
          console.log(
            "Interview email notification sent successfully:",
            response
          );
          toast.success("Interview notification email sent to applicant");
        })
        .catch((err) => {
          console.error("Failed to send interview email notification:", err);
          toast.error("Failed to send interview notification email");
        });
    } catch (error) {
      console.error("Error in sendInterviewEmail function:", error);
    }
  };

  // Function to send approval notification email
  const sendApprovalEmail = (
    applicantName,
    applicantEmail,
    approvalDetails,
    date,
    time,
    place
  ) => {
    try {
      // EmailJS configuration - replace with your actual EmailJS credentials
      const serviceId = "service_7adrs8a";
      const templateId = "template_mz8kw1t";
      const userId = "3oc7EHE9_86XJPWcr";

      // Format the approval details message with date, time and place
      const formattedMessage = `
Congratulations! Your application has been approved.

You have been selected to join our institution. Please report on the following date and time:

Reporting Details:
Date: ${date || "To be confirmed"}
Time: ${time || "To be confirmed"}
Location: ${place || "To be confirmed"}

${approvalDetails ? `\nAdditional Information:\n${approvalDetails}` : ""}

Please bring all your original certificates and documents for verification.
      `.trim();

      // Email template parameters
      const templateParams = {
        to_name: applicantName,
        to_email: applicantEmail,
        message: formattedMessage,
      };

      // Send the email
      emailjs
        .send(serviceId, templateId, templateParams, userId)
        .then((response) => {
          console.log(
            "Approval email notification sent successfully:",
            response
          );
          toast.success("Approval notification email sent to applicant");
        })
        .catch((err) => {
          console.error("Failed to send approval email notification:", err);
          toast.error("Failed to send approval notification email");
        });
    } catch (error) {
      console.error("Error in sendApprovalEmail function:", error);
    }
  };

  // Function to get department name by ID
  const getDepartmentName = (departmentId) => {
    if (!departmentId) return "N/A";
    const department = departments.find((dept) => dept.id === departmentId);
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
          setNewStatus(applicationData.status || "");
        } else {
          console.error("Application not found or returned null");
          setError("Application not found");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError(err.message || "Failed to load application details");
        toast.error("Failed to load application details");
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchApplicationDetails();
    fetchDepartments();
  }, [id, currentUser]);
  const handleStatusUpdate = async () => {
    try {
      let interviewDetails = null;
      let marksDetails = null;
      let approvedDetails = null;

      if (newStatus === "interview") {
        interviewDetails = {
          date: interviewDate,
          time: interviewTime,
          place: interviewPlace,
        };
      }

      if (newStatus === "approved") {
        approvedDetails = {
          date: approvedDate,
          time: approvedTime,
          place: approvedPlace,
        };
      }

      if (newStatus === "marks" && markValue) {
        const mark = parseFloat(markValue);

        if (!isNaN(mark)) {
          marksDetails = {
            mark: mark.toFixed(2),
          };
        }
      }

      await updateApplicationStatus(
        id,
        newStatus,
        feedback,
        interviewDetails,
        marksDetails,
        approvedDetails
      );

      const updatedApplication = {
        ...application,
        status: newStatus,
        feedback,
      };

      if (interviewDetails) {
        updatedApplication.interviewDetails = interviewDetails;
      }

      if (approvedDetails) {
        updatedApplication.approvedDetails = approvedDetails;
      }

      if (marksDetails) {
        updatedApplication.marksDetails = marksDetails;
      }

      setApplication(updatedApplication);
      toast.success(`Status updated to ${newStatus}`);
      setShowStatusModal(false);

      if (newStatus === "interview") {
        const applicantName = application.fullName || "Applicant";
        const applicantEmail = application.email || application.contactEmail;

        if (applicantEmail) {
          sendInterviewEmail(
            applicantName,
            applicantEmail,
            feedback,
            interviewDate,
            interviewTime,
            interviewPlace
          );
        } else {
          toast.warning(
            "Could not send email notification: Applicant email not available"
          );
        }
      }

      if (newStatus === "approved") {
        const applicantName = application.fullName || "Applicant";
        const applicantEmail = application.email || application.contactEmail;

        if (applicantEmail) {
          sendApprovalEmail(
            applicantName,
            applicantEmail,
            feedback,
            approvedDate,
            approvedTime,
            approvedPlace
          );
        } else {
          toast.warning(
            "Could not send email notification: Applicant email not available"
          );
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const isFormValid = () => {
    if (!newStatus) return false;

    switch (newStatus) {
      case "interview":
        return interviewDate && interviewTime && interviewPlace;
      case "approved":
        return approvedDate && approvedTime && approvedPlace;
      case "marks":
        return markValue !== "";
      default:
        return true;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      if (typeof dateString === "object" && dateString !== null) {
        if (dateString.seconds) {
          const date = new Date(dateString.seconds * 1000);
          return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(date);
        }

        if (dateString instanceof Date) {
          return new Intl.DateTimeFormat("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(dateString);
        }
      }

      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "marks":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
          <p>{error}</p>
          <button
            onClick={() => navigate("/Dashboard/applications")}
            className="px-4 py-2 mt-3 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
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
        <div className="px-4 py-3 text-yellow-700 bg-yellow-100 border border-yellow-400 rounded">
          <p>Application not found</p>
          <button
            onClick={() => navigate("/Dashboard/applications")}
            className="px-4 py-2 mt-3 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-full p-6">
      {" "}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Application Details</h1>

        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/Dashboard/applications")}
            className="flex items-center px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>

          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
            Update Status
          </button>
        </div>
      </div>
      {/* Status Badge */}
      <div className="mb-6">
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusClass(
            application.status
          )}`}
        >
          Status: {application.status || "N/A"}
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
      {application.status === "interview" && application.interviewDetails && (
        <div className="p-4 mb-6 border-l-4 border-purple-500 rounded-md bg-purple-50">
          <h3 className="flex items-center mb-2 font-medium text-purple-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            Interview Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-sm text-gray-900">
                {application.interviewDetails.date || "To be confirmed"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-sm text-gray-900">
                {application.interviewDetails.time || "To be confirmed"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-sm text-gray-900">
                {application.interviewDetails.place || "To be confirmed"}
              </p>
            </div>
          </div>
          {application.interviewDetails.scheduledAt && (
            <p className="mt-2 text-xs text-gray-500">
              Interview scheduled on:{" "}
              {formatDate(application.interviewDetails.scheduledAt)}
            </p>
          )}
        </div>
      )}{" "}
      {/* Approved Details Banner - only shown when status is "approved" and details exist */}
      {application.status === "approved" && application.approvedDetails && (
        <div className="p-4 mb-6 border-l-4 border-green-500 rounded-md bg-green-50">
          <h3 className="flex items-center mb-2 font-medium text-green-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Application Approved
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Reporting Date
              </p>
              <p className="text-sm text-gray-900">
                {application.approvedDetails.date || "To be confirmed"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Reporting Time
              </p>
              <p className="text-sm text-gray-900">
                {application.approvedDetails.time || "To be confirmed"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Reporting Location
              </p>
              <p className="text-sm text-gray-900">
                {application.approvedDetails.place || "To be confirmed"}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Marks Details Banner - only shown when status is "marks" and details exist */}
      {application.status === "marks" && application.marksDetails && (
        <div className="p-4 mb-6 border-l-4 border-green-500 rounded-md bg-green-50">
          <h3 className="flex items-center mb-2 font-medium text-green-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Marks Details
          </h3>

          <div className="flex items-center">
            <div className="px-6 py-2 bg-white border border-green-300 rounded-full">
              <span className="text-2xl font-bold text-green-800">
                {" "}
                {parseFloat(application.marksDetails.mark).toString()}
              </span>
              <span className="text-sm text-gray-500">/100</span>
            </div>
          </div>

          {application.marksDetails.assignedAt && (
            <p className="mt-3 text-xs text-gray-500">
              Mark assigned on:{" "}
              {formatDate(application.marksDetails.assignedAt)}
            </p>
          )}
        </div>
      )}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
            <p className="mt-1 text-sm text-gray-900">
              {application.fullName || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Name with Initials
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {application.nameWithInitials || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(application.dateOfBirth) || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-sm text-gray-900">
              {application.email || application.contactEmail || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Mobile Phone</h3>
            <p className="mt-1 text-sm text-gray-900">
              {application.mobilePhone || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Official Phone
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {application.officialPhone || "N/A"}
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">
              Postal Address
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {application.postalAddress || "N/A"}
            </p>
          </div>
        </div>
      </div>
      {/* Preferred Placements */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Preferred Placements
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {" "}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Place
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Subjects
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {" "}
                {application.preferredPlacements &&
                application.preferredPlacements.length > 0 ? (
                  application.preferredPlacements
                    .filter(
                      (placement) =>
                        placement && (placement.place || placement.subjects)
                    )
                    .map((placement, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {placement.place || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {getDepartmentName(placement.departmentId) || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {Array.isArray(placement.subjects)
                            ? placement.subjects.join(", ")
                            : placement.subjects || "N/A"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No preferred placements provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Academic Qualifications */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Academic Qualifications
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Degree
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    University
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {" "}
                {application.academicQualifications &&
                application.academicQualifications.length > 0 ? (
                  application.academicQualifications
                    .filter((qual) => qual && (qual.degree || qual.university))
                    .map((qualification, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {qualification.degree || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {qualification.university || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {formatDate(qualification.date) || "N/A"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No academic qualifications provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Professional Qualifications */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Professional Qualifications
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Qualification
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Institute
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {" "}
                {application.professionalQualifications &&
                application.professionalQualifications.length > 0 ? (
                  application.professionalQualifications
                    .filter(
                      (qual) => qual && (qual.qualification || qual.institute)
                    )
                    .map((qualification, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {qualification.qualification || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {qualification.institute || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {formatDate(qualification.date) || "N/A"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No professional qualifications provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Other Qualifications */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Other Qualifications
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {application.otherQualifications || "None provided"}
          </p>
        </div>
      </div>
      {/* Teaching Experience */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Teaching Experience
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Institute
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Program
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Years
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {" "}
                {application.teachingExperience &&
                application.teachingExperience.length > 0 ? (
                  application.teachingExperience
                    .filter(
                      (exp) =>
                        exp && (exp.institute || exp.program || exp.subject)
                    )
                    .map((experience, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {experience.institute || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {experience.program || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {experience.subject || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {experience.years || "N/A"}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No teaching experience provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Work Experience */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Work Experience
          </h2>
        </div>

        <div className="p-6">
          <h3 className="mb-3 font-medium text-gray-700 text-md">
            Present Position
          </h3>
          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    From
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    To
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Years
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.workExperience?.present ? (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {application.workExperience.present.position || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(application.workExperience.present.from) ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(application.workExperience.present.to) ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {application.workExperience.present.years || "N/A"}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No present work experience provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="mb-3 font-medium text-gray-700 text-md">
            Past Positions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    From
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    To
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Years
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {" "}
                {application.workExperience?.past &&
                application.workExperience.past.length > 0 ? (
                  application.workExperience.past
                    .map((exp, index) =>
                      exp && exp.position && exp.position.trim() !== "" ? (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {exp.position || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {formatDate(exp.from) || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {formatDate(exp.to) || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {exp.years || "N/A"}
                          </td>
                        </tr>
                      ) : null
                    )
                    .filter(Boolean)
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-sm text-center text-gray-500"
                    >
                      No past work experience provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* References */}
      <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">References</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {" "}
            {application.references && application.references.length > 0 ? (
              application.references
                .filter((ref) => ref && (ref.name || ref.position || ref.email))
                .map((reference, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="mb-2 font-medium text-gray-800">
                      {reference.name || "N/A"}
                    </h3>
                    <p className="mb-1 text-sm text-gray-600">
                      Position: {reference.position || "N/A"}
                    </p>
                    <p className="mb-1 text-sm text-gray-600">
                      Email: {reference.email || "N/A"}
                    </p>
                    <p className="mb-1 text-sm text-gray-600">
                      Phone: {reference.phone || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Address: {reference.address || "N/A"}
                    </p>
                  </div>
                ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                No references provided
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Admin Feedback Section */}
      {application.feedback && (
        <div className="mb-6 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">Feedback</h2>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {application.feedback}
            </p>
          </div>
        </div>
      )}
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
          <div className="w-full max-w-md max-h-screen p-6 overflow-y-auto bg-white rounded-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Update Application Status
            </h2>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !newStatus ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="marks"> Marks</option>
                <option value="interview">Interview Scheduled</option>
              </select>
            </div>{" "}
            {/* Interview Details Fields - only show when status is "interview" */}
            {newStatus === "interview" && (
              <div className="p-4 mb-4 border border-blue-200 rounded bg-blue-50">
                <h3 className="mb-2 font-medium text-blue-800">
                  Interview Details
                </h3>
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Interview Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      newStatus === "interview" && !interviewDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Interview Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      newStatus === "interview" && !interviewTime
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                <div className="mb-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Interview Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewPlace}
                    onChange={(e) => setInterviewPlace(e.target.value)}
                    placeholder="Enter interview location"
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      newStatus === "interview" && !interviewPlace
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            )}
            {newStatus === "approved" && (
              <div className="p-4 mb-4 border border-green-200 rounded bg-green-50">
                <h3 className="mb-2 font-medium text-green-800">
                  Reporting Details
                </h3>
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Reporting Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={approvedDate}
                    onChange={(e) => setApprovedDate(e.target.value)}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      newStatus === "approved" && !approvedDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Reporting Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={approvedTime}
                    onChange={(e) => setApprovedTime(e.target.value)}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      newStatus === "approved" && !approvedTime
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>

                <div className="mb-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Reporting Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={approvedPlace}
                    onChange={(e) => setApprovedPlace(e.target.value)}
                    placeholder="Enter reporting location"
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      newStatus === "approved" && !approvedPlace
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            )}{" "}
            {/* Marks Details Fields - only show when status is "marks" */}
            {newStatus === "marks" && (
              <div className="p-4 mb-4 border border-green-200 rounded bg-green-50">
                <h3 className="mb-2 font-medium text-green-800">Assign Mark</h3>
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Mark (0-100) <span className="text-red-500">*</span>
                  </label>{" "}
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={markValue}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value)) {
                        setMarkValue("");
                      } else if (value < 0) {
                        setMarkValue("0");
                      } else if (value > 100) {
                        setMarkValue("100");
                      } else {
                        setMarkValue(e.target.value);
                      }
                    }}
                    placeholder="Enter mark between 0-100"
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      newStatus === "marks" && !markValue
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              {" "}
              <label className="block mb-1 text-sm font-medium text-gray-700">
                {newStatus === "interview"
                  ? "Additional Information (Optional)"
                  : newStatus === "marks"
                  ? "Feedback about marks (Optional)"
                  : newStatus === "approved"
                  ? "Additional Instructions (Optional)"
                  : "Feedback (Optional)"}
              </label>{" "}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder={
                  newStatus === "interview"
                    ? "Add any additional information about the interview..."
                    : newStatus === "marks"
                    ? "Add feedback or comments about the marks..."
                    : newStatus === "approved"
                    ? "Add any additional instructions or information for the selected applicant..."
                    : "Add feedback for the applicant..."
                }
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>{" "}
              <button
                onClick={handleStatusUpdate}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  isFormValid()
                    ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
                disabled={!isFormValid()}
                title={
                  !newStatus
                    ? "Please select a status"
                    : newStatus === "interview" &&
                      (!interviewDate || !interviewTime || !interviewPlace)
                    ? "Please fill in all interview details"
                    : newStatus === "approved" &&
                      (!approvedDate || !approvedTime || !approvedPlace)
                    ? "Please fill in all reporting details"
                    : newStatus === "marks" && !markValue
                    ? "Please enter a mark value"
                    : "Update application status"
                }
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
