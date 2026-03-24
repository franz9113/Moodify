import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { MOODS } from '@/app/utils/moodConfig';
import {
  CustomButton,
  CustomInput,
} from '@/app/components/custom/CustomComponents';

const emotions = {
  Happy: ['Joyful', 'Excited', 'Content', 'Grateful', 'Proud'],
  Sad: ['Disappointed', 'Lonely', 'Hurt', 'Grief', 'Hopeless'],
  Mad: ['Frustrated', 'Irritated', 'Furious', 'Resentful', 'Annoyed'],
  Exhausted: ['Tired', 'Drained', 'Fatigued', 'Burned Out', 'Weary'],
  Calm: ['Peaceful', 'Relaxed', 'Serene', 'Balanced', 'Centered'],
};

export default function MoodSelection() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [customEmotion, setCustomEmotion] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleContinue = () => {
    const finalEmotion =
      showCustomInput && customEmotion ? customEmotion : selectedEmotion;

    if (selectedMood && (selectedEmotion || customEmotion)) {
      // Get the date we saved from the Home calendar
      const savedDate = localStorage.getItem('currentMoodDate');
      const currentDate = savedDate || new Date().toISOString().split('T')[0];

      const moodData = {
        mood: selectedMood,
        emotion: finalEmotion,
        date: currentDate,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('currentMoodEntry', JSON.stringify(moodData));
      navigate('/questions');
    }
  };

  return (
    <div className='h-full flex flex-col bg-white'>
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10'>
        <h1 className='text-xl font-bold text-gray-800'>
          How are you feeling?
        </h1>
        <button
          onClick={() => navigate('/')}
          className='p-2 hover:bg-gray-100 rounded-full text-gray-400'
        >
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-6'>
        {/* Mood Selection */}
        <div className='mb-10'>
          <h2 className='text-lg font-semibold mb-6 text-gray-700'>
            What are you feeling today?
          </h2>
          <div className='flex justify-between items-center gap-2'>
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                onClick={() => {
                  setSelectedMood(mood.name);
                  setSelectedEmotion(null);
                  setShowCustomInput(false);
                }}
                className={`flex flex-col items-center gap-2 transition-all flex-1 ${
                  selectedMood === mood.name
                    ? 'scale-110'
                    : 'opacity-40 grayscale-[50%]'
                }`}
              >
                <div
                  className={`p-1 rounded-full transition-all ${selectedMood === mood.name ? 'ring-4 ring-cyan-500' : 'ring-0'}`}
                >
                  <img
                    src={mood.image}
                    alt={mood.name}
                    className='w-14 h-14 object-contain'
                  />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${selectedMood === mood.name ? 'text-cyan-600' : 'text-gray-400'}`}
                >
                  {mood.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion Selection */}
        {selectedMood && (
          <div className='space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <h2 className='text-lg font-semibold mb-4 text-gray-700'>
              What emotion are you experiencing?
            </h2>

            {emotions[selectedMood as keyof typeof emotions].map((emotion) => (
              <CustomButton
                key={emotion}
                variant={
                  selectedEmotion === emotion && !showCustomInput
                    ? 'primary'
                    : 'outline'
                }
                onClick={() => {
                  setSelectedEmotion(emotion);
                  setShowCustomInput(false);
                }}
              >
                {emotion}
              </CustomButton>
            ))}

            <CustomButton
              variant={showCustomInput ? 'secondary' : 'outline'}
              className='border-dashed'
              onClick={() => {
                setShowCustomInput(!showCustomInput);
                setSelectedEmotion(null);
              }}
            >
              {showCustomInput ? 'Cancel Custom' : '+ Add Custom Emotion'}
            </CustomButton>

            {showCustomInput && (
              <CustomInput
                autoFocus
                value={customEmotion}
                onChange={(e) => setCustomEmotion(e.target.value)}
                placeholder='Type your emotion here...'
              />
            )}
          </div>
        )}
      </div>

      {/* Footer Continue Button */}
      {selectedMood && (selectedEmotion || customEmotion) && (
        <div className='px-6 py-6 border-t border-gray-50 bg-white'>
          <CustomButton onClick={handleContinue}>Continue</CustomButton>
        </div>
      )}
    </div>
  );
}
