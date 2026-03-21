import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import { format } from "date-fns";
import { getMoodImage } from "@/app/utils/moodConfig";

export default function MoodEntry() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("viewMoodEntry");
    if (stored) {
      setEntry(JSON.parse(stored));
    }
  }, []);

  if (!entry) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl">Mood Entry</h1>
        <button onClick={() => {
          localStorage.removeItem("viewMoodEntry");
          navigate("/");
        }} className="p-2">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">{format(entry.timestamp, "MMMM d, yyyy 'at' h:mm a")}</p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={getMoodImage(entry.mood)} alt={entry.mood} className="w-20 h-20" />
            </div>
            <h2 className="text-2xl font-medium">{entry.mood}</h2>
            <p className="text-gray-600">{entry.emotion}</p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {entry.whatMadeYouFeel && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">What made you feel this way</p>
                <p className="font-medium">{entry.whatMadeYouFeel}</p>
              </div>
            )}

            {entry.whatDidYouDo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">What you did in response</p>
                <p className="font-medium">{entry.whatDidYouDo}</p>
              </div>
            )}

            {entry.wasItRight && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Did you think it was right?</p>
                <p className="font-medium">{entry.wasItRight}</p>
              </div>
            )}

            {entry.bodyParts && entry.bodyParts.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Where you felt it</p>
                <div className="flex flex-wrap gap-2">
                  {entry.bodyParts.map((part: string) => (
                    <span
                      key={part}
                      className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                    >
                      {part.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entry.journal && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Journal</p>
                <p className="whitespace-pre-wrap">{entry.journal}</p>
              </div>
            )}

            {entry.suggestion && (
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <p className="text-sm text-gray-600 mb-1">Recommended tool</p>
                <p className="font-medium text-cyan-700">{entry.suggestion}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}