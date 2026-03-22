import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { X } from 'lucide-react';
import { MOODS } from '@/app/utils/moodConfig';
import { format } from 'date-fns';

const emotions = {
  Happy: ['Joyful', 'Excited', 'Content', 'Grateful', 'Proud'],
  Sad: ['Disappointed', 'Lonely', 'Hurt', 'Grief', 'Hopeless'],
  Mad: ['Frustrated', 'Irritated', 'Furious', 'Resentful', 'Annoyed'],
  Exhausted: ['Tired', 'Drained', 'Fatigued', 'Burned Out', 'Weary'],
  Calm: ['Peaceful', 'Relaxed', 'Serene', 'Balanced', 'Centered'],
};

export default function MoodSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  // Captures the date from Home.tsx state
  const targetDate = location.state?.date || format(new Date(), 'yyyy-MM-dd');

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [customEmotion, setCustomEmotion] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleContinue = () => {
    const finalEmotion =
      showCustomInput && customEmotion ? customEmotion : selectedEmotion;
    if (selectedMood && finalEmotion) {
      const moodData = {
        mood: selectedMood,
        emotion: finalEmotion,
        date: targetDate, // This is the key piece of data
      };
      localStorage.setItem('currentMoodEntry', JSON.stringify(moodData));
      navigate('/questions');
    }
  };

  return (
    <div className='h-full flex flex-col bg-white'>
      <div className='px-6 py-4 border-b border-gray-200 flex items-center justify-between'>
        <h1 className='text-xl'>How are you feeling?</h1>
        <button onClick={() => navigate('/')} className='p-2'>
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        <div className='mb-8 text-center'>
          <h2 className='text-lg mb-6'>What are you feeling today?</h2>
          <div className='flex justify-center items-center gap-4'>
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                onClick={() => {
                  setSelectedMood(mood.name);
                  setSelectedEmotion(null);
                }}
                className={`flex flex-col items-center gap-2 transition-all ${
                  selectedMood === mood.name ? 'scale-110' : 'opacity-70'
                }`}
              >
                <div
                  className={`${selectedMood === mood.name ? 'ring-4 ring-cyan-500 rounded-full' : ''}`}
                >
                  <img src={mood.image} alt={mood.name} className='w-16 h-16' />
                </div>
                <span className='text-xs font-medium'>{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedMood && (
          <div>
            <h2 className='text-lg mb-4'>What emotion are you experiencing?</h2>
            <div className='space-y-2'>
              {emotions[selectedMood as keyof typeof emotions].map(
                (emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setSelectedEmotion(emotion)}
                    className={`w-full py-3 px-4 rounded-lg border-2 transition-all ${
                      selectedEmotion === emotion
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    {emotion}
                  </button>
                ),
              )}
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`w-full py-3 px-4 rounded-lg border-2 transition-all ${
                  showCustomInput
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {showCustomInput ? 'Cancel' : 'Add Custom Emotion'}
              </button>
              {showCustomInput && (
                <input
                  type='text'
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  className='w-full py-3 px-4 rounded-lg border-2 border-gray-200 bg-white'
                  placeholder='Enter your emotion'
                />
              )}
            </div>
          </div>
        )}
      </div>

      {selectedMood && (selectedEmotion || customEmotion) && (
        <div className='px-6 py-4 border-t border-gray-200'>
          <button
            onClick={handleContinue}
            className='w-full py-3 bg-cyan-500 text-white rounded-lg font-bold'
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
