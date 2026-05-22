import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, Search, Filter, ChevronDown, Shield, Dumbbell, User, 
  Trash2, UserCheck, ChevronLeft, ChevronRight, ArrowUpDown,
  ArrowUp, ArrowDown, RefreshCw 
} from "lucide-react";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Sorting states
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const storedData = localStorage.getItem("jwtToken");
  let token = null;
  if (storedData) {
    try {
      token = JSON.parse(storedData).token;
    } catch (err) {
      console.error("Invalid token in localStorage", err);
    }
  }

  const api = axios.create({
    baseURL: "http://localhost:8080/api/admin",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  // Fetch users with pagination and sorting
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: sortBy,
        sortDir: sortDir
      };
      
      const res = await api.get("/users", { params });
      const data = res.data;
      
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("❌ Error fetching users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operations
  const handleDelete = async (role, id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    try {
      let endpoint;
      if (role === "TRAINER") {
        endpoint = `/delete-trainer/${id}`;
      } else if (role === "ADMIN") {
        endpoint = `/delete-admin/${id}`;
      } else if (role === "CLIENT") {
        endpoint = `/delete-client/${id}`;
      }

      if (endpoint) {
        await api.delete(endpoint);
        setMessage(`✅ ${role.toLowerCase()} deleted successfully`);
        // If we're on the last page and it becomes empty, go to previous page
        if (users.length === 1 && currentPage > 0) {
          setCurrentPage(prev => prev - 1);
        } else {
          fetchUsers();
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage(`❌ Error deleting ${role.toLowerCase()}`);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setCurrentPage(0); // Reset to first page when sorting
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page
  };

  // Clear all filters and reset pagination
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setCurrentPage(0);
    setSortBy("id");
    setSortDir("asc");
  };

  // Apply search and filter (client-side filtering for role)
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch = search === "" || 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, sortBy, sortDir]);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      case "TRAINER":
        return <Dumbbell className="w-4 h-4" />;
      case "CLIENT":
        return <UserCheck className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "TRAINER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "CLIENT":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDeleteButtonColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 focus:ring-blue-500";
      case "TRAINER":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 focus:ring-purple-500";
      case "CLIENT":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-500";
      default:
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 focus:ring-red-500";
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDir === "asc" 
      ? <ArrowUp className="w-4 h-4 text-indigo-600" />
      : <ArrowDown className="w-4 h-4 text-indigo-600" />;
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 0) {
      buttons.push(
        <button
          key={0}
          onClick={() => handlePageChange(0)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 1) {
        buttons.push(
          <span key="ellipsis1" className="px-3 py-2 text-sm text-gray-500 bg-white border-t border-b border-gray-300">
            ...
          </span>
        );
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border transition-colors ${
            i === currentPage
              ? "text-indigo-600 bg-indigo-50 border-indigo-500 z-10"
              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="px-3 py-2 text-sm text-gray-500 bg-white border-t border-b border-gray-300">
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
            User Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all users in your fitness platform
          </p>
        </div>

        {/* Alert Message */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl text-sm flex items-center space-x-2 shadow-sm animate-in slide-in-from-top-2 ${
            message.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            {message.includes("✅") ? (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message.replace(/✅|❌/g, "")}</span>
            <button 
              onClick={() => setMessage("")}
              className="ml-auto text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/20 overflow-hidden">
          {/* Controls Section */}
          <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Top Row: Search and Filter */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  />
                </div>

                {/* Role Filter */}
                <div className="lg:w-64 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admins Only</option>
                    <option value="TRAINER">Trainers Only</option>
                    <option value="CLIENT">Clients Only</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Page Size Selector */}
                <div className="lg:w-48 relative">
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="w-full px-3 py-3 text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer shadow-sm"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Results Info and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredUsers.length}</span> of{" "}
                  <span className="font-semibold">{totalElements}</span> users
                  {currentPage > 0 && (
                    <span className="ml-2">
                      (Page {currentPage + 1} of {totalPages})
                    </span>
                  )}
                </p>
                
                <div className="flex items-center gap-2">
                  {(search || roleFilter !== "ALL") && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors px-3 py-1 rounded-lg hover:bg-indigo-50"
                    >
                      Clear filters
                    </button>
                  )}
                  <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-600 font-medium">Loading users...</span>
              </div>
            </div>
          ) : (
            /* Table Content */
            <div className="overflow-x-auto">
              {filteredUsers.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>User</span>
                          {getSortIcon("name")}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Email</span>
                          {getSortIcon("email")}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Role</span>
                          {getSortIcon("role")}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Assigned Trainer
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((u, index) => (
                      <tr
                        key={u.id}
                        className={`hover:bg-gray-50 transition-colors duration-150 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        }`}
                      >
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${getRoleColor(u.role)}`}>
                              {getRoleIcon(u.role)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{u.name}</p>
                              <p className="text-sm text-gray-500">ID: #{u.id}</p>
                              <p className="text-sm text-gray-500 sm:hidden">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email - Hidden on small screens */}
                        <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                          <div className="max-w-xs truncate">{u.email}</div>
                        </td>

                        {/* Role Badge */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getRoleColor(u.role)}`}>
                            {getRoleIcon(u.role)}
                            <span>{u.role}</span>
                          </span>
                        </td>

                        {/* Assigned Trainer - Hidden on medium and smaller screens */}
                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                          {u.assignedTrainerId ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                              Trainer #{u.assignedTrainerId}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not assigned</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(u.role, u.id, u.name)}
                            className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm hover:shadow-md ${getDeleteButtonColor(u.role)}`}
                            title={`Delete ${u.role.toLowerCase()}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500 mb-6">
                    {search || roleFilter !== "ALL"
                      ? "Try adjusting your search terms or filters"
                      : "Users will appear here once they register"}
                  </p>
                  {(search || roleFilter !== "ALL") && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-200 rounded-lg hover:bg-indigo-200 transition-colors shadow-sm"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50/80 to-slate-50/80 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages} 
                  <span className="hidden sm:inline ml-2">
                    ({totalElements} total users)
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex">
                    {renderPaginationButtons()}
                  </div>

                  {/* Mobile Page Info */}
                  <div className="sm:hidden px-3 py-2 text-sm text-gray-500 bg-white border-t border-b border-gray-300">
                    {currentPage + 1} / {totalPages}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Footer */}
          {!loading && totalElements > 0 && (
            <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 px-8 py-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 justify-center sm:justify-start">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>
                    <span className="font-semibold text-blue-600">
                      {users.filter(u => u.role === 'ADMIN').length}
                    </span> Admins
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Dumbbell className="w-4 h-4 text-purple-600" />
                  <span>
                    <span className="font-semibold text-purple-600">
                      {users.filter(u => u.role === 'TRAINER').length}
                    </span> Trainers
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span>
                    <span className="font-semibold text-green-600">
                      {users.filter(u => u.role === 'CLIENT').length}
                    </span> Clients
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span>
                    <span className="font-semibold text-gray-800">
                      {totalElements}
                    </span> Total Users
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersTable;