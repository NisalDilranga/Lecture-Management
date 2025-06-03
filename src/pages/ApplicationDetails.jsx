import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../services/ApplicationServices";
import { getAllDepartments } from "../services/DepartmentServices";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [departments, setDepartments] = useState([]);

  const getDepartmentName = (departmentId) => {
    if (!departmentId) return "N/A";
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : departmentId;
  };

  const getMockApplicationData = (id) => {
    console.log("Using mock data for application ID:", id);
    return {
      id: id,
      fullName: "John Smith",
      nameWithInitials: "J.R. Smith",
      dateOfBirth: "1985-06-20",
      email: "admin@gmail.com",
      contactEmail: "admin@gmail.com",
      mobilePhone: "9876543210",
      officialPhone: "1234567890",
      postalAddress: "123 University Ave, Academic City",
      status: "approved",
      submittedAt: { seconds: Date.now() / 1000 - 86400 },
      updatedAt: { seconds: Date.now() / 1000 },
      authenticatedSubmission: false,
      contactPhone: "9876543210",
      academicQualifications: [
        {
          degree: "PhD in Computer Science",
          university: "MIT",
          date: "2020-06-24",
        },
        {
          degree: "MSc in Data Science",
          university: "Stanford",
          date: "2015-05-15",
        },
      ],
      preferredPlacements: [
        {
          place: "Computer Science Department",
          departmentId: "cs_dept",
          subjects: ["Machine Learning", "Data Structures"],
        },
      ],
      professionalQualifications: [
        {
          qualification: "Certified Data Scientist",
          institute: "Data Science Association",
          date: "2018-06-23",
        },
      ],
      otherQualifications:
        "Fluent in three programming languages. Published research in top-tier journals.",
      teachingExperience: [
        {
          institute: "Tech University",
          program: "Computer Science",
          subject: "Machine Learning",
          years: "3",
        },
      ],
      workExperience: {
        past: [
          {
            from: "2018-01-01",
            to: "2020-12-31",
            position: "Senior Developer",
            years: "3",
          },
          {
            from: "2015-01-01",
            to: "2017-12-31",
            position: "Junior Developer",
            years: "3",
          },
        ],
        present: {
          from: "2021-01-01",
          to: "2025-06-01",
          position: "Lead Data Scientist",
          years: "4",
        },
      },
      references: [
        {
          name: "Dr. Alice Johnson",
          position: "Department Chair",
          email: "alice@university.edu",
          phone: "1234567890",
          address: "University of Technology, Dept. of CS",
        },
        {
          name: "Prof. Robert Brown",
          position: "Senior Professor",
          email: "robert@university.edu",
          phone: "0987654321",
          address: "Science University, Faculty of Engineering",
        },
      ],
      feedback: "Excellent qualifications and experience. Highly recommended.",
    };
  };

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        let applicationData = await getApplicationById(id);

        if (!applicationData || !applicationData.fullName) {
          console.log(
            "Limited or no data returned from Firebase, using mock data"
          );
          applicationData = getMockApplicationData(id);
        }

        setApplication(applicationData);
        setNewStatus(applicationData.status || "");

        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);
      } catch (err) {
        console.error("Error fetching application details:", err);
        toast.error("Using demo data due to API error");

        const mockData = getMockApplicationData(id);
        setApplication(mockData);
        setNewStatus(mockData.status || "");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await updateApplicationStatus(id, newStatus, feedback);
      toast.success(`Status updated to ${newStatus}`);
      setApplication({ ...application, status: newStatus, feedback });
      setShowStatusModal(false);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      if (dateString.seconds) {
        const date = new Date(dateString.seconds * 1000);
        return new Intl.DateTimeFormat("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(date);
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
      default:
        return "bg-gray-100 text-gray-800";
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
            onClick={() => navigate("/Dashboard/applications")}
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
            onClick={() => navigate("/Dashboard/applications")}
            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Application Details</h1>

        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/Dashboard/applications")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Personal Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.preferredPlacements &&
                application.preferredPlacements.length > 0 ? (
                  application.preferredPlacements.map((placement, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {placement.place || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getDepartmentName(placement.departmentId) || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      className="px-6 py-4 text-center text-sm text-gray-500"
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Academic Qualifications
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Degree
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.academicQualifications &&
                application.academicQualifications.length > 0 ? (
                  application.academicQualifications.map(
                    (qualification, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {qualification.degree || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {qualification.university || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(qualification.date) || "N/A"}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-sm text-gray-500"
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Professional Qualifications
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.professionalQualifications &&
                application.professionalQualifications.length > 0 ? (
                  application.professionalQualifications.map(
                    (qualification, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {qualification.qualification || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {qualification.institute || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(qualification.date) || "N/A"}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-sm text-gray-500"
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Teaching Experience
          </h2>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institute
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Years
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.teachingExperience &&
                application.teachingExperience.length > 0 ? (
                  application.teachingExperience.map((experience, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experience.institute || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experience.program || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experience.subject || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {experience.years || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Work Experience
          </h2>
        </div>

        <div className="p-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Present Position
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Years
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.workExperience?.present ? (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.workExperience.present.position || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(application.workExperience.present.from) ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(application.workExperience.present.to) ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.workExperience.present.years || "N/A"}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No present work experience provided
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h3 className="text-md font-medium text-gray-700 mb-3">
            Past Positions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Years
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {application.workExperience?.past &&
                application.workExperience.past.length > 0 ? (
                  application.workExperience.past
                    .map((exp, index) =>
                      exp.position ? (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exp.position || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(exp.from) || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(exp.to) || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      className="px-6 py-4 text-center text-sm text-gray-500"
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-700">References</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {application.references && application.references.length > 0 ? (
              application.references.map((reference, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {reference.name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Position: {reference.position || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Email: {reference.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Update Application Status
            </h2>

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
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview Scheduled</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add feedback for the applicant..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={!newStatus}
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
