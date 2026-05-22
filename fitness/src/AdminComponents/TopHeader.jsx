import React, { useState } from "react";
import { Menu, ChevronRight, Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const TopHeader = ({ toggleSidebar, currentView }) => {
  const { logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Dashboard";
      case "users":
        return "Users Management";
      case "create":
        return "Create User";
      case "assign":
        return "Assign Trainer";
      case "exercises":
        return "Exercise Management";
      case "analytics":
        return "Analytics & Reports";
      default:
        return "Dashboard";
    }
  };

  const getBreadcrumb = () => ["Admin", getPageTitle()];

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Breadcrumb + Sidebar toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumb().map((item, idx) => (
              <div key={idx} className="flex items-center">
                {idx > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                <span
                  className={
                    idx === getBreadcrumb().length - 1
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500"
                  }
                >
                  {item}
                </span>
              </div>
            ))}
          </nav>
        </div>

        {/* Search + Notifications + Profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-gray-50 transition-all duration-200"
            />
          </div>

          {/* Notification */}
          <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </button>

          {/* Profile with dropdown */}
          <div className="relative">
            <div
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            {openDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
