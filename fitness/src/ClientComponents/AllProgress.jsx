import { useEffect, useState } from "react";
import clientService from "../clientService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from "recharts";

const AllProgress = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    clientService.getAllProgress().then((res) =>
      setLogs(
        res.data.map((l) => ({
          ...l,
          date: new Date(l.logTime).toLocaleDateString(),
        }))
      )
    );
  }, []);

  // Calculate statistics
  const totalReps = logs.reduce((sum, log) => sum + (log.repsCompleted || 0), 0);
  const totalWeight = logs.reduce((sum, log) => sum + (log.weightLifted || 0), 0);
  const avgWeight = logs.length > 0 ? (totalWeight / logs.length).toFixed(1) : 0;
  const totalWorkouts = logs.length;

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Progress Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Comprehensive overview of your fitness journey with advanced analytics and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-400 text-xl">💪</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{totalReps.toLocaleString()}</h3>
            <p className="text-blue-300 text-xs sm:text-sm">Total Reps</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-400 text-xl">🏋️</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{totalWeight.toLocaleString()}</h3>
            <p className="text-green-300 text-xs sm:text-sm">Total Weight (kg)</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-400 text-xl">📊</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{avgWeight}</h3>
            <p className="text-purple-300 text-xs sm:text-sm">Avg Weight (kg)</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg border border-orange-500/30 rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-400 text-xl">🎯</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{totalWorkouts}</h3>
            <p className="text-orange-300 text-xs sm:text-sm">Total Workouts</p>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Enhanced Bar Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Performance Overview</h3>
              </div>
              <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                <span className="text-blue-300 text-xs font-medium">Bar Chart</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={logs} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                      color: '#f1f5f9'
                    }}
                  />
                  <Bar
                    dataKey="repsCompleted"
                    fill="url(#blueGradient)"
                    radius={[4, 4, 0, 0]}
                    name="Reps Completed"
                  />
                  <Bar
                    dataKey="weightLifted"
                    fill="url(#greenGradient)"
                    radius={[4, 4, 0, 0]}
                    name="Weight Lifted (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-gradient-to-b from-green-400 to-cyan-500 rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Progress Trend</h3>
              </div>
              <div className="px-3 py-1 bg-green-500/20 rounded-full">
                <span className="text-green-300 text-xs font-medium">Area Chart</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={logs} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#06d6a0" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                      color: '#f1f5f9'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="repsCompleted"
                    stroke="#06d6a0"
                    strokeWidth={3}
                    fill="url(#areaGradient)"
                    name="Reps Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Weight Progression</h3>
              </div>
              <div className="px-3 py-1 bg-purple-500/20 rounded-full">
                <span className="text-purple-300 text-xs font-medium">Line Chart</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={logs} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weightLifted"
                    stroke="#a855f7"
                    strokeWidth={3}
                    dot={{ fill: '#a855f7', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: '#c084fc' }}
                    name="Weight Lifted (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Combined Chart */}
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Combined Analysis</h3>
              </div>
              <div className="px-3 py-1 bg-orange-500/20 rounded-full">
                <span className="text-orange-300 text-xs font-medium">Multi-Line</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/30">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={logs} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid #475569',
                      borderRadius: '12px',
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                      color: '#f1f5f9'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="repsCompleted"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    name="Reps Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="weightLifted"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Weight Lifted (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm">Live Data • Updated in Real Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProgress;