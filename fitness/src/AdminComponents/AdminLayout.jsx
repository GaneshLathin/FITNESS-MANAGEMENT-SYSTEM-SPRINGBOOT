import React, { useState, useEffect } from "react";
import ModernSidebar from "./ModernSidebar";
import TopHeader from "./TopHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // ✅ import AuthContext

const AdminLayout = () => {
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ get logout from context

  const handleSetView = (menu) => {
    setView(menu);
    if (menu === "users") navigate("/admin");
    if (menu === "create") navigate("/admin/createuser");
    if (menu === "assign") navigate("/admin/assignuser");
    if (menu === "exercises") navigate("/admin/createexercise");
    if (menu === "dashboard") navigate("/admin");
    if (menu === "analytics") navigate("/admin/analytics");
  };

  const handleLogout = () => {
    logout();        // ✅ clears auth + token
    navigate("/login", { replace: true }); // ✅ redirect to login
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <ModernSidebar
        view={view}
        setView={handleSetView}
        onLogout={handleLogout} // ✅ pass updated logout
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <TopHeader toggleSidebar={toggleSidebar} currentView={view} />
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2024 Fitness Hub Admin. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
