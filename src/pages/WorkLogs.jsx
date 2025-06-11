import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { addWorkLog, getUserWorkLogs, deleteWorkLog, updateWorkLog } from "../services/WorkLogServices";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiCheck, FiX, FiClock, FiBook, FiCalendar, FiFileText, FiPlusCircle } from "react-icons/fi";

const WorkLogs = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [workLogs, setWorkLogs] = useState([]);
  const initialFormState = {
    date: new Date().toISOString().split("T")[0],
    subject: "",
    hours: "",
    description: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetchWorkLogs();
  }, []);

  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      const logs = await getUserWorkLogs(currentUser.uid);
      setWorkLogs(logs);
    } catch (error) {
      toast.error("Failed to load work logs");
      console.error("Error fetching work logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.subject || !formData.hours) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const workLogData = {
        ...formData,
        userId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        date: new Date(formData.date),
        hours: parseFloat(formData.hours)
      };
      
      await addWorkLog(workLogData);
      toast.success("Work log added successfully");
      
      // Reset form and refresh logs
      setFormData(initialFormState);
      setShowForm(false);
      fetchWorkLogs();
    } catch (error) {
      toast.error("Failed to add work log");
      console.error("Error adding work log:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this work log?")) {
      try {
        setLoading(true);
        await deleteWorkLog(id);
        toast.success("Work log deleted successfully");
        fetchWorkLogs();
      } catch (error) {
        toast.error("Failed to delete work log");
        console.error("Error deleting work log:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleEdit = (log) => {
    // Convert date object to string format for input field
    const dateString = new Date(log.date).toISOString().split("T")[0];
    
    setFormData({
      date: dateString,
      subject: log.subject,
      hours: log.hours,
      description: log.description || ""
    });
    setEditingId(log.id);
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsEditing(false);
    setShowForm(false);
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.subject || !formData.hours) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const updatedData = {
        ...formData,
        date: new Date(formData.date),
        hours: parseFloat(formData.hours)
      };
      
      await updateWorkLog(editingId, updatedData);
      toast.success("Work log updated successfully");
      
      // Reset form and refresh logs
      setFormData(initialFormState);
      setEditingId(null);
      setIsEditing(false);
      setShowForm(false);
      fetchWorkLogs();
    } catch (error) {
      toast.error("Failed to update work log");
      console.error("Error updating work log:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Work Logs</h1>        <button
          onClick={() => {
            if (showForm && isEditing) {
              // Cancel editing if editing mode is active
              handleCancelEdit();
            } else {
              setShowForm(!showForm);
            }
          }}
          className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
            showForm ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {showForm ? (
            <>
              <FiX className="mr-2" /> Cancel
            </>
          ) : (
            <>
              <FiPlusCircle className="mr-2" /> Add New Work Log
            </>
          )}
        </button>
      </div>
        {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Work Log" : "Add New Work Log"}
          </h2>          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-gray-700 mb-1">
                  <FiCalendar className="mr-1" /> Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="flex items-center text-gray-700 mb-1">
                  <FiBook className="mr-1" /> Subject *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Subject name"
                    required
                  />
                  <FiBook className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="flex items-center text-gray-700 mb-1">
                  <FiClock className="mr-1" /> Hours Worked *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of hours"
                    step="0.5"
                    min="0.5"
                    required
                  />
                  <FiClock className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center text-gray-700 mb-1">
                  <FiFileText className="mr-1" /> Description
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details about the work done"
                    rows="3"
                  />
                  <FiFileText className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  <FiX className="mr-1" /> Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white rounded-lg transition-colors disabled:bg-gray-400 flex items-center ${
                  isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <>Saving...</>
                ) : isEditing ? (
                  <>
                    <FiCheck className="mr-1" /> Update
                  </>
                ) : (
                  <>
                    <FiPlusCircle className="mr-1" /> Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading && !showForm ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading work logs...</p>
        </div>
      ) : workLogs.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600">No work logs found. Add your first work log!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-500 mr-2" />
                      {formatDate(log.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FiBook className="text-gray-500 mr-2" />
                      {log.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <FiClock className="text-gray-500 mr-2" />
                      {log.hours} {log.hours === 1 ? "hour" : "hours"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    <div className="flex items-center">
                      <FiFileText className="text-gray-500 mr-2" />
                      {log.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleEdit(log)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-full transition-colors mr-1"
                        title="Edit Work Log"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-full transition-colors"
                        title="Delete Work Log"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkLogs;
