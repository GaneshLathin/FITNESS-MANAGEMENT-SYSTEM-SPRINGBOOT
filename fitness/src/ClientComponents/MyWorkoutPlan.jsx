import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Dumbbell, Calendar, Target, TrendingUp, CheckCircle, Clock, Play } from "lucide-react";

const MyWorkoutPlan = () => {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get("/client/my-workout-plan");
        setPlan(res.data);
      } catch (err) {
        console.error("Error fetching workout plan:", err);
      }
    };
    fetchPlan();
  }, []);

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-700 font-medium">Loading workout plan...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {plan.planName}
            </h1>
          </div>
          <p className="text-slate-600">Your personalized fitness journey</p>
        </div>

        {/* Plan Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Days</p>
                <p className="text-xl font-bold text-slate-800">{plan.days?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Exercises</p>
                <p className="text-xl font-bold text-slate-800">
                  {plan.days?.reduce((total, day) => total + (day.exercises?.length || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-xl font-bold text-slate-800">
                  {plan.days?.reduce((total, day) => 
                    total + (day.exercises?.filter(ex => ex.completed).length || 0), 0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Progress</p>
                <p className="text-xl font-bold text-slate-800">73%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workout Days */}
        {plan.days && plan.days.length > 0 ? (
          <div className="space-y-6">
            {plan.days.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
                
                {/* Day Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{day.dayOfWeek}</h2>
                        <p className="text-indigo-100">
                          {day.exercises?.length || 0} exercises • 
                          {day.exercises?.filter(ex => ex.completed).length || 0} completed
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                        Day {dayIndex + 1}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exercises */}
                <div className="p-6">
                  {day.exercises && day.exercises.length > 0 ? (
                    <div className="grid gap-4">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div
                          key={exercise.id}
                          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {exerciseIndex + 1}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-800 mb-2">{exercise.name}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Target className="w-4 h-4 text-blue-500" />
                                  <span><strong>Sets:</strong> {exercise.sets}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  <span><strong>Reps:</strong> {exercise.reps}</span>
                                </div>
                              </div>
                              
                              {/* Status Badge */}
                              <div className="flex items-center gap-2">
                                {exercise.completed ? (
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    Completed ✅
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                    <Clock className="w-4 h-4" />
                                    Pending ⏳
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Link
                              to={`/client/exercise/${exercise.id}/log`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                            >
                              <Play className="w-4 h-4" />
                              Log Exercise
                            </Link>
                            <Link
                              to={`/client/exercise/${exercise.id}/progress`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                            >
                              <TrendingUp className="w-4 h-4" />
                              View Progress
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">No exercises assigned for this day</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Workout Days */
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8 lg:p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Workout Days Assigned</h2>
            <p className="text-slate-600 mb-6">Your trainer hasn't created your workout schedule yet. Contact your trainer to get started!</p>
            <Link
              to="/client/trainer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
            >
              <Dumbbell className="w-5 h-5" />
              Contact Trainer
            </Link>
          </div>
        )}

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">📊 Weekly Progress Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-white/60 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">5/7</p>
              <p className="text-blue-700">Days Completed</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-xl">
              <p className="text-2xl font-bold text-green-600">18/24</p>
              <p className="text-green-700">Exercises Done</p>
            </div>
            <div className="text-center p-4 bg-white/60 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">75%</p>
              <p className="text-purple-700">Weekly Goal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWorkoutPlan;