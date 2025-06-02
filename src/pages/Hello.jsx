import React from 'react';
import { useAuth } from '../context/AuthContext';

const Hello = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Hello, {currentUser?.email}!
        </h1>
        <p className="text-gray-600 mb-6">
          This is a protected page. You're successfully logged in with Firebase Authentication.
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-[#8B0000] text-white rounded-md hover:bg-[#A52A2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0000]"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Hello;
