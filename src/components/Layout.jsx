import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import { FiMenu, FiUser, FiBell } from 'react-icons/fi';
import { useState } from "react";
import UserProfileModal from "./UserProfileModal";


const Layout = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="flex flex-col justify-start w-full h-screen">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl ml-64 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">
         Lecture Management System
        </h1>
              <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none">
            <FiBell size={20} />
          </button>
          <button 
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <FiUser size={20} />
          </button>
        </div>
        <UserProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)}
        />
        {/* <LogoutButton className="bg-white text-blue-700 px-4 py-2 rounded-md hover:bg-gray-100" /> */}
      </div>
      <div className="flex h-full bg-gray-100">
        <SideNav />
        <div className="ml-64 flex-1 flex flex-col p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;