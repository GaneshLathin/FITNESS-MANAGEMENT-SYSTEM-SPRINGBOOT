import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import clientService from "../clientService";
import { User, Mail, MessageCircle, Calendar, Star } from "lucide-react";

const MyTrainer = () => {
  const [trainer, setTrainer] = useState(null);
  const navigate = useNavigate(); // ✅ initialize

  useEffect(() => {
    clientService.getTrainer().then((res) => setTrainer(res.data));
  }, []);

  const handleSendMessage = () => {
    navigate("/client/requests"); // ✅ navigate to /requests
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center lg:text-left mb-8">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              My Trainer
            </h1>
          </div>
          <p className="text-slate-600">Your dedicated fitness professional</p>
        </div>

        {trainer ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Trainer Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{trainer.name}</h2>
                    <p className="text-blue-100">Personal Trainer</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-800 text-sm">{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-slate-800 text-sm">4.9 Rating</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-800 text-sm">5+ Years Experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trainer Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Card */}
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Contact Information</h2>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-800">Email</p>
                      <p className="text-slate-600">{trainer.email}</p>
                    </div>
                    <button
                      onClick={handleSendMessage} // ✅ navigate to /requests
                      className="mt-2 sm:mt-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                    >
                      Send Message
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-800">Schedule Session</p>
                      <p className="text-slate-600">Book your next training session</p>
                    </div>
                    <button className="mt-2 sm:mt-0 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 text-sm font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Specialties Card */}
              {/* ... rest remains unchanged ... */}
            </div>
          </div>
        ) : (
          /* No Trainer Card */
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-8 lg:p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Trainer Assigned</h2>
            <p className="text-slate-600 mb-6">You don't have a trainer assigned yet. Contact support to get matched with a professional trainer.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium">
              Request Trainer Assignment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrainer;
