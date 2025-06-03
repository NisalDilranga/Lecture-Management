import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SideNav = () => {
  const { currentUser, logout } = useAuth();
    // Define navigation items by role
  const adminNavItems = [
    {
      path: "/Dashboard",
      title: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      path: "/Dashboard/add-users",
      title: "Add Users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3" 
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )
    },
    {
      path: "/Dashboard/applications",
      title: "View Applications",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      path: "/Dashboard/departments",
      title: "Manage Departments",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      path: "/Dashboard/timetable-management",
      title: "Assign Timetables",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const userNavItems = [

    {
      path: "/Dashboard/my-timetable",
      title: "My Timetable",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  // Determine which navigation items to show based on user role
  const navItems = currentUser?.role === 'Admin' ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 transform translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full bg-gray-800 text-white shadow-xl w-64">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-[17px] font-bold">Lecture Management System</span>
          </div>
        </div>        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <div className="flex flex-col min-w-[100px] gap-4">            {navItems.map((item, index) => (
              <NavLink
                key={index}
                className={({ isActive }) =>
                  `flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
                to={item.path}
                end={item.path === "/Dashboard"} // Only use exact matching for the Dashboard path
              >
                {item.icon}
                {item.title}              </NavLink>
            ))}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center">
                <span className="text-lg font-semibold text-white">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{currentUser?.email}</p>
              <p className="text-xs text-gray-400">{currentUser?.role || 'Role not set'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 w-full p-2 bg-red-700 hover:bg-red-800 text-white rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;