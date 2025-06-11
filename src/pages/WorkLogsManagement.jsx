import React, { useState, useEffect } from "react";
import { getAllWorkLogs } from "../services/WorkLogServices";
import { toast } from "react-toastify";

const WorkLogsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [workLogs, setWorkLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filter, setFilter] = useState({
    userName: "",
    subject: "",
    dateFrom: "",
    dateTo: ""
  });
  
  useEffect(() => {
    fetchWorkLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, workLogs]);

  const fetchWorkLogs = async () => {
    try {
      setLoading(true);
      const logs = await getAllWorkLogs();
      setWorkLogs(logs);
      setFilteredLogs(logs);
    } catch (error) {
      toast.error("Failed to load work logs");
      console.error("Error fetching work logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...workLogs];
    
    if (filter.userName) {
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(filter.userName.toLowerCase())
      );
    }
    
    if (filter.subject) {
      filtered = filtered.filter(log => 
        log.subject.toLowerCase().includes(filter.subject.toLowerCase())
      );
    }
    
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      filtered = filtered.filter(log => new Date(log.date) >= fromDate);
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999); // Set to end of day
      filtered = filtered.filter(log => new Date(log.date) <= toDate);
    }
    
    setFilteredLogs(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilter({
      userName: "",
      subject: "",
      dateFrom: "",
      dateTo: ""
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total hours by user and subject
  const calculateStats = () => {
    const userStats = {};
    const subjectStats = {};
    
    filteredLogs.forEach(log => {
      // By user
      if (!userStats[log.userName]) {
        userStats[log.userName] = 0;
      }
      userStats[log.userName] += log.hours;
      
      // By subject
      if (!subjectStats[log.subject]) {
        subjectStats[log.subject] = 0;
      }
      subjectStats[log.subject] += log.hours;
    });
    
    return { userStats, subjectStats };
  };

  const { userStats, subjectStats } = calculateStats();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Work Logs Management</h1>

      {/* Work Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Work Logs {filteredLogs.length > 0 ? `(${filteredLogs.length})` : ""}
          </h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading work logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No work logs found matching the criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lecturer
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.hours} {log.hours === 1 ? "hour" : "hours"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {log.description || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkLogsManagement;
