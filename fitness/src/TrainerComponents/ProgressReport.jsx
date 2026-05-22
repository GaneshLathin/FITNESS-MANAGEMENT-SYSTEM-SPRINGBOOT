import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProgressReport = () => {
  const { auth } = useAuth();
  const { id: clientId, exerciseId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/trainer/client/${clientId}/exercise/${exerciseId}/report`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((res) => {
        const formatted = res.data.dailyProgress.map((dp) => ({
          date: dp.date,
          reps: dp.repsCompleted,
          weight: dp.weightLifted,
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch progress report:", err);
      });
  }, [clientId, exerciseId]);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Exercise Progress Over Time
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-600">No progress data available yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" label={{ value: 'Reps', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="reps" stroke="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProgressReport;
