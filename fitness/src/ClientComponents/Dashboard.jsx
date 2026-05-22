// src/ClientComponents/Dashboard.jsx
import { useEffect, useState } from "react";
import clientService from "../clientService";
import { Link } from "react-router-dom";
import { User, Dumbbell, TrendingUp, Calendar } from "lucide-react";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    clientService.getProfile().then((res) => setProfile(res.data));
    clientService.getWorkoutPlan().then((res) => setPlan(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-slate-600">Track your fitness journey and stay motivated</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Today's Progress</p>
                <p className="text-2xl font-bold text-slate-800">85%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Workouts Done</p>
                <p className="text-2xl font-bold text-slate-800">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">This Week</p>
                <p className="text-2xl font-bold text-slate-800">5/7</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Streak</p>
                <p className="text-2xl font-bold text-slate-800">7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Profile Card */}
          {profile && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">Welcome back!</h2>
                    <p className="text-blue-100">{profile.name}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Email</span>
                    <span className="font-medium text-slate-800">{profile.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Status</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <Link
                  to="/client/profile"
                  className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          )}

          {/* Workout Plan Card */}
          {plan && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold">Your Workout Plan</h2>
                    <p className="text-green-100">Stay consistent</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">{plan.planName}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Plan Type</span>
                    <span className="font-medium text-slate-800">Strength Training</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Duration</span>
                    <span className="font-medium text-slate-800">8 weeks</span>
                  </div>
                </div>
                <Link
                  to="/client/workout-plan"
                  className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/client/workout-plan"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200"
            >
              <Dumbbell className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">Start Workout</span>
            </Link>
            <Link
              to="/client/all-progress"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200 border border-green-200"
            >
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">View Progress</span>
            </Link>
            <Link
              to="/client/trainer"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200"
            >
              <User className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-700">Contact Trainer</span>
            </Link>
            <Link
              to="/client/notifications"
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 border border-orange-200"
            >
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-700">Schedule</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
