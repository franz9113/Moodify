import { useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

export default function Journal() {
  const navigate = useNavigate();
  const [journalText, setJournalText] = useState("");

  const handleContinue = () => {
    const existingData = JSON.parse(localStorage.getItem("currentMoodEntry") || "{}");
    const updatedData = {
      ...existingData,
      journal: journalText,
    };
    localStorage.setItem("currentMoodEntry", JSON.stringify(updatedData));
    navigate("/suggestions");
  };

  const handleSkip = () => {
    const existingData = JSON.parse(localStorage.getItem("currentMoodEntry") || "{}");
    const updatedData = {
      ...existingData,
      journal: "",
    };
    localStorage.setItem("currentMoodEntry", JSON.stringify(updatedData));
    navigate("/suggestions");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl">Journal</h1>
        <button onClick={() => navigate("/")} className="p-2">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h2 className="text-2xl mb-2">Write about your feelings</h2>
        <p className="text-gray-600 mb-6">
          Take a moment to reflect on your emotions and what you're experiencing.
        </p>

        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-cyan-300 transition-colors"
        />
      </div>

      <div className="px-6 py-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleContinue}
          className="w-full py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          {journalText ? "Continue" : "Skip for now"}
        </button>
        {journalText && (
          <button
            onClick={handleSkip}
            className="w-full py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}