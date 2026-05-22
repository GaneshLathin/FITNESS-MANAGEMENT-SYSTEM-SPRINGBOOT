
// src/ClientComponents/ClientLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogOut, User, Dumbbell, Bell, Home, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";
import { ClipboardList } from "lucide-react";

const ClientLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    { name: 'Dashboard', href: '/client', icon: Home },
    { name: 'My Profile', href: '/client/profile', icon: User },
    { name: 'My Trainer', href: '/client/trainer', icon: Dumbbell },
    { name: 'Workout Plan', href: '/client/workout-plan', icon: Dumbbell },
    { name: 'Notifications', href: '/client/notifications', icon: Bell },
    { name: 'All Progress', href: '/client/all-progress', icon: BarChart3 },
    { name: 'Requests', href: '/client/requests', icon: ClipboardList }, // ✅ new

  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-lg border border-white/20"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative w-72 h-full bg-white/95 backdrop-blur-sm shadow-2xl border-r border-white/20 flex flex-col transition-transform duration-300 ease-in-out z-40`}>
        
        {/* Header */}
        <div className="p-6 lg:p-8 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FitnessPro
              </h1>
              <p className="text-xs text-slate-500">Client Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 lg:p-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-slate-700 hover:text-blue-600'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 lg:p-6 border-t border-slate-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;

