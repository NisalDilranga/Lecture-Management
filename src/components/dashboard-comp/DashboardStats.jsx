import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { getDashboardStats } from '../../services/DashboardServices';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    pendingCount: 0,
    interviewCount: 0,
    approvedCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await getDashboardStats();
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 5 minutes
    const intervalId = setInterval(fetchStats, 300000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-3 bg-gray-700 rounded-lg my-4">
        <p className="text-gray-300 text-sm text-center">Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 bg-gray-700 rounded-lg my-4">
        <p className="text-red-400 text-sm text-center">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 py-3 bg-gray-700 rounded-lg my-4"
    >
      <h3 className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-600 pb-2">Dashboard Stats</h3>
      
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiUsers className="text-blue-400 mr-2" />
            <span className="text-xs text-gray-300">Users</span>
          </div>
          <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full font-medium">
            {stats.usersCount}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiFileText className="text-yellow-400 mr-2" />
            <span className="text-xs text-gray-300">Pending</span>
          </div>
          <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded-full font-medium">
            {stats.pendingCount}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiCalendar className="text-purple-400 mr-2" />
            <span className="text-xs text-gray-300">Interviews</span>
          </div>
          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full font-medium">
            {stats.interviewCount}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiCheckCircle className="text-green-400 mr-2" />
            <span className="text-xs text-gray-300">Approved</span>
          </div>
          <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full font-medium">
            {stats.approvedCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardStats;
