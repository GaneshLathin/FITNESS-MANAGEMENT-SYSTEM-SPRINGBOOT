// src/ClientComponents/MyProfile.jsx
import { useEffect, useState } from "react";
import clientService from "../clientService";
import { User, Mail, Edit3, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clientService.getProfile().then((res) => {
      setProfile(res.data);
      setEditData({ name: res.data.name, email: res.data.email });
    });
  }, []);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await clientService.updateProfile(editData);
      setProfile(res.data);
      toast.success("✅ Profile updated successfully!");
    } catch (error) {
      toast.error("❌ Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center lg:text-left mb-8">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              My Profile
            </h1>
          </div>
          <p className="text-slate-600">Manage your personal information</p>
        </div>

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                    <p className="text-blue-100">{profile.email}</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Status</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Member Since</span>
                    <span className="font-medium text-slate-800">Jan 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Workouts</span>
                    <span className="font-medium text-slate-800">24</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8 space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <User className="w-4 h-4 text-blue-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Mail className="w-4 h-4 text-green-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save size={20} />
                    )}
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">ℹ️ Profile Information</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• Your profile information is used to personalize your fitness experience</li>
            <li>• Email changes may require verification</li>
            <li>• Keep your information updated for the best service</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
