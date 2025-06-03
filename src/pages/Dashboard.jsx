import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFileText, FiCalendar, FiCheckCircle, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { getDashboardStats } from '../services/DashboardServices';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    pendingCount: 0,
    interviewCount: 0,
    approvedCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await getDashboardStats();
        setStats(statsData);
        
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of system statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.usersCount}</h3>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Pending Applications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Applications</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingCount}</h3>
              )}
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiFileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        {/* Interview Applications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Scheduled Interviews</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.interviewCount}</h3>
              )}
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiCalendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Approved Applications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved Applications</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.approvedCount}</h3>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>      {/* Application Statistics and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Application Statistics</h3>
            <FiBarChart2 className="h-5 w-5 text-gray-500" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-64">
              {(stats.pendingCount + stats.interviewCount + stats.approvedCount) > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: stats.pendingCount },
                        { name: 'Interview', value: stats.interviewCount },
                        { name: 'Approved', value: stats.approvedCount },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#FCD34D" /> {/* Yellow for Pending */}
                      <Cell fill="#A78BFA" /> {/* Purple for Interview */}
                      <Cell fill="#10B981" /> {/* Green for Approved */}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} Applications`, name]} 
                      labelFormatter={() => ''} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No application data available</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Application Status Overview</h3>
            <FiTrendingUp className="h-5 w-5 text-gray-500" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-64">
              {(stats.pendingCount + stats.interviewCount + stats.approvedCount) > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Pending', value: stats.pendingCount, fill: '#FCD34D' },
                      { name: 'Interview', value: stats.interviewCount, fill: '#A78BFA' },
                      { name: 'Approved', value: stats.approvedCount, fill: '#10B981' },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} Applications`]} />
                    <Bar dataKey="value">
                      {[
                        { name: 'Pending', fill: '#FCD34D' },
                        { name: 'Interview', fill: '#A78BFA' },
                        { name: 'Approved', fill: '#10B981' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No application data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
