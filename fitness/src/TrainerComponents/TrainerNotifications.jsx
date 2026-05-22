import { useEffect, useState } from "react";
import api from "../api";

const TrainerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/trainer/notifications"); // ✅ calls backend
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching trainer notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 shadow-xl rounded-2xl p-8 border border-slate-100">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 shadow-xl rounded-2xl p-8 border border-slate-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 rounded-xl p-3 mr-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text">
          My Notifications
        </h2>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium text-lg">No notifications yet.</p>
          <p className="text-slate-400 text-sm mt-2">You'll see your latest updates here when they arrive.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n, index) => (
            <div
              key={n.id}
              className={`group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 ${
                index === 0 ? 'ring-2 ring-blue-100' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-3 h-3 mt-2 shadow-sm group-hover:shadow-md transition-shadow"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                    {n.message}
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-slate-500 font-medium">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    NEW
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerNotifications;