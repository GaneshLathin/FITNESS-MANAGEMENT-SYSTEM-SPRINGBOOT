// src/ClientComponents/ExerciseHistory.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import clientService from "../clientService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Weight } from "lucide-react";

const ExerciseHistory = () => {
  const { exerciseId } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    clientService.getExerciseHistory(exerciseId).then((res) =>
      setLogs(
        res.data.map((l) => ({
          ...l,
          date: new Date(l.logTime).toLocaleDateString(),
        }))
      )
    );
  }, [exerciseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Exercise History
            </h1>
          </div>
          <p className="text-slate-600">Track your performance over time</p>
        </div>

        {/* Chart Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Performance Trends</h2>
            </div>
          </div>
          
          <div className="p-6 lg:p-8">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={logs} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
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

        {/* History List */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Workout History</h2>
            </div>
          </div>
          
          <div className="p-6">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Weight className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500">No workout history found</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {logs.map((l, index) => (
                  <li
                    key={l.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{l.date}</p>
                        <p className="text-sm text-slate-500">Workout #{logs.length - index}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {l.repsCompleted} reps
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
                        <Weight className="w-4 h-4" />
                        {l.weightLifted} kg
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseHistory;