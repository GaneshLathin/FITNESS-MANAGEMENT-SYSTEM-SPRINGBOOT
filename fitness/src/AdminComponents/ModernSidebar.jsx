import React from "react";
import {
  Users,
  UserPlus,
  Link2,
  Dumbbell,
  LogOut,
  Settings,
  Home,
  BarChart3,
  X,
} from "lucide-react";

const menuItems = [
  { id: "dashboard", icon: Home, label: "Dashboard", color: "from-blue-500 to-indigo-600" },
  { id: "users", icon: Users, label: "Users", color: "from-purple-500 to-pink-600" },
  { id: "create", icon: UserPlus, label: "Create User", color: "from-green-500 to-emerald-600" },
  { id: "assign", icon: Link2, label: "Assign Trainer", color: "from-orange-500 to-red-600" },
  { id: "exercises", icon: Dumbbell, label: "Exercises", color: "from-teal-500 to-cyan-600" },
];

const ModernSidebar = ({ view, setView, onLogout, isOpen, toggleSidebar }) => {
  const handleMenuClick = (menuId) => {
    setView(menuId);
    // Add the toggleSidebar call here to close the sidebar
    // This will run after the view has been set
    if (toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative left-0 top-0 w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-transform duration-300 ease-in-out shadow-2xl z-50 overflow-hidden`}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>
        <div className="relative z-10 p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Management System</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm border border-slate-600/30 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="relative z-10 p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`group relative w-full flex items-center space-x-4 p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} shadow-lg shadow-blue-500/25`
                    : 'hover:bg-slate-800/50 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-md"></div>
                )}
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors duration-200`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                  {item.label}
                </span>
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
                )}
              </button>
            );
          })}
        </nav>
        <div className="relative z-10 p-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/30 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">Admin User</p>
              <p className="text-slate-400 text-xs truncate">admin@fitnesshub.com</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 p-4">
          <button
            onClick={onLogout}
            className="group w-full flex items-center space-x-4 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105"
          >
            <LogOut className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
            <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors duration-200">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ModernSidebar;