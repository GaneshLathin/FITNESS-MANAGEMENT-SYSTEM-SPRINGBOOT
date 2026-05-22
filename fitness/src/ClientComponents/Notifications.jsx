// src/ClientComponents/Notifications.jsx
import { useEffect, useState } from "react";
import clientService from "../clientService";
import { 
  Bell, 
  Check, 
  AlertCircle, 
  Info, 
  Star, 
  Calendar, 
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  Search,
  MessageCircle,
  Trophy,
  Dumbbell,
  Heart
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    clientService.getNotifications().then((res) => setNotifications(res.data));
  }, []);

  const markRead = async (id) => {
    try {
      await clientService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await Promise.all(unreadIds.map(id => clientService.markNotificationRead(id)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotifications(newSelected);
  };

  const selectAll = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(new Set(visibleIds));
  };

  const clearSelection = () => {
    setSelectedNotifications(new Set());
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'reminder':
        return <Calendar className="w-6 h-6 text-blue-500" />;
      case 'alert':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'feedback':
        return <MessageCircle className="w-6 h-6 text-purple-500" />;
      case 'workout':
        return <Dumbbell className="w-6 h-6 text-green-500" />;
      case 'health':
        return <Heart className="w-6 h-6 text-pink-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getNotificationStyle = (type, read) => {
    const baseStyle = "transition-all duration-300 hover:shadow-lg";
    
    if (read) {
      return `${baseStyle} bg-white/60 border-gray-200 hover:bg-white/80`;
    }
    
    switch (type) {
      case 'achievement':
        return `${baseStyle} bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 hover:from-yellow-100 hover:to-amber-100`;
      case 'reminder':
        return `${baseStyle} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100`;
      case 'alert':
        return `${baseStyle} bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100`;
      case 'feedback':
        return `${baseStyle} bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 hover:from-purple-100 hover:to-violet-100`;
      case 'workout':
        return `${baseStyle} bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100`;
      case 'health':
        return `${baseStyle} bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 hover:from-pink-100 hover:to-rose-100`;
      default:
        return `${baseStyle} bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && !notification.read) ||
      (filterType === 'read' && notification.read) ||
      notification.type === filterType;
    
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const notificationTypes = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { value: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
    { value: 'feedback', label: 'Feedback', count: notifications.filter(n => n.type === 'feedback').length },
    { value: 'reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'reminder').length },
    { value: 'workout', label: 'Workouts', count: notifications.filter(n => n.type === 'workout').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      Notifications
                    </h1>
                    <p className="text-blue-100 text-lg">Stay connected with your fitness journey</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-white">{notifications.length}</div>
                  <div className="text-blue-100 text-sm">Total</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                  <div className="text-2xl font-bold text-white">{notifications.filter(n => !n.read).length}</div>
                  <div className="text-blue-100 text-sm">Unread</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {notificationTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setFilterType(type.value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                    filterType === type.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/60 text-gray-600 hover:bg-white/80'
                  }`}
                >
                  <span>{type.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    filterType === type.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {notifications.filter(n => !n.read).length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-white/60 text-gray-600 rounded-xl font-medium hover:bg-white/80 transition-all duration-200 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Workout Reminders', icon: Dumbbell, enabled: true },
                { label: 'Progress Updates', icon: Trophy, enabled: true },
                { label: 'Trainer Feedback', icon: MessageCircle, enabled: true },
                { label: 'Achievement Alerts', icon: Star, enabled: false },
                { label: 'Health Tips', icon: Heart, enabled: true },
                { label: 'Schedule Changes', icon: Calendar, enabled: false },
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <setting.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">{setting.label}</span>
                  </div>
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    setting.enabled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      setting.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Notifications List */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                {searchTerm || filterType !== 'all' ? 'No matching notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter to see more notifications.'
                  : 'You\'re all caught up! New notifications will appear here when you have updates.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`relative p-6 ${getNotificationStyle(notification.type, notification.read)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className={`font-semibold leading-relaxed ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(notification.createdAt || Date.now()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            
                            {!notification.read && (
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-sm">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                New
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markRead(notification.id)}
                              className="p-2 bg-white/80 hover:bg-white text-gray-600 hover:text-blue-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => toggleSelection(notification.id)}
                            className={`p-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                              selectedNotifications.has(notification.id)
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/80 hover:bg-white text-gray-600 hover:text-blue-600'
                            }`}
                            title="Select notification"
                          >
                            <input
                              type="checkbox"
                              checked={selectedNotifications.has(notification.id)}
                              onChange={() => {}}
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for unread notifications */}
                  {!notification.read && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-60"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              label: 'Today\'s Notifications', 
              value: notifications.filter(n => {
                const today = new Date();
                const notifDate = new Date(n.createdAt || Date.now());
                return notifDate.toDateString() === today.toDateString();
              }).length,
              icon: Calendar,
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              label: 'Achievements', 
              value: notifications.filter(n => n.type === 'achievement').length,
              icon: Trophy,
              color: 'from-yellow-500 to-orange-500'
            },
            { 
              label: 'Feedback Received', 
              value: notifications.filter(n => n.type === 'feedback').length,
              icon: MessageCircle,
              color: 'from-purple-500 to-pink-500'
            },
            { 
              label: 'Workout Reminders', 
              value: notifications.filter(n => n.type === 'reminder').length,
              icon: Dumbbell,
              color: 'from-green-500 to-emerald-500'
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;