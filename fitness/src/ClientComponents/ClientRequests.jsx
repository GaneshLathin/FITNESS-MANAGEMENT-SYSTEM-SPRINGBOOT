import { useState } from "react";
import api from "../api";
import { MessageCircle, ClipboardList, Sliders } from "lucide-react";

const ClientRequests = () => {
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [response, setResponse] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/client/chat/send", null, {
        params: { message },
      });
      setResponse(res.data);
      setMessage("");
    } catch (err) {
      setResponse("❌ Failed to send message");
    }
  };

  const handleRequestPlan = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/client/request/new-plan", null, {
        params: { notes },
      });
      setResponse(res.data);
      setNotes("");
    } catch (err) {
      setResponse("❌ Failed to request new plan");
    }
  };

  const handleDifficultyChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/client/request/difficulty", null, {
        params: { difficultyLevel: difficulty },
      });
      setResponse(res.data);
      setDifficulty("");
    } catch (err) {
      setResponse("❌ Failed to request difficulty change");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-blue-700">Client Requests</h2>

      {/* Send Message */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MessageCircle className="text-blue-600" /> Send Message to Trainer
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow hover:opacity-90"
        >
          Send
        </button>
      </form>

      {/* Request New Plan */}
      <form
        onSubmit={handleRequestPlan}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <ClipboardList className="text-green-600" /> Request New Workout Plan
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full border rounded-lg p-3 focus:ring focus:ring-green-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow hover:opacity-90"
        >
          Request Plan
        </button>
      </form>

      {/* Request Difficulty Change */}
      <form
        onSubmit={handleDifficultyChange}
        className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sliders className="text-purple-600" /> Request Difficulty Change
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border rounded-lg p-3 focus:ring focus:ring-purple-200"
        >
          <option value="">-- Select difficulty --</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow hover:opacity-90"
        >
          Request Difficulty Change
        </button>
      </form>

      {/* Response */}
      {response && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          {response}
        </div>
      )}
    </div>
  );
};

export default ClientRequests;
