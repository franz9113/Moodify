import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { THEME } from '@/app/utils/theme';
import { MOOD_CONTENT, MOOD_TOOLS, type MoodKey } from '@/app/utils/moodConfig';
import { saveMoodEntry } from '@/app/services/moodEntryService';
import SuggestionCard from '@/app/components/Suggestions/SuggestionCard';
import EntrySummary from '@/app/components/Suggestions/EntrySummary';

export default function Suggestions() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(true);
  const [entry, setEntry] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [randomDescription, setRandomDescription] = useState(""); 
  const saveAttempted = useRef(false);

  useEffect(() => {
    const savedData = localStorage.getItem('currentMoodEntry');
    if (savedData && !saveAttempted.current) {
      saveAttempted.current = true;
      const parsed = JSON.parse(savedData);
      setEntry(parsed);

      const moodKey = (parsed.mood in MOOD_CONTENT ? parsed.mood : 'Happy') as MoodKey;
      const content = MOOD_CONTENT[moodKey];
      
      const randomIndex = Math.floor(Math.random() * content.descriptions.length);
      const selectedDesc = content.descriptions[randomIndex] || content.descriptions[0] || "Take a moment for yourself.";
      setRandomDescription(selectedDesc);

      performSave(parsed);
    } else if (!savedData && !saveAttempted.current) {
      navigate('/app');
    }
  }, [navigate]);

  const performSave = async (data: any) => {
    try {
      await saveMoodEntry(data);
    } catch (err: any) {
      console.error('Save failed:', err.message);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div
        className='h-screen flex flex-col items-center justify-center p-6 text-center'
        style={{ backgroundColor: THEME.colors.background }}
      >
        <p className='text-red-500 font-bold mb-4'>Save Failed: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className='p-4 rounded-xl font-bold'
          style={{ backgroundColor: THEME.colors.neutral }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isSaving || !entry) {
    return (
      <div
        className='h-screen flex flex-col items-center justify-center'
        style={{ backgroundColor: THEME.colors.background }}
      >
        <Loader2
          className='animate-spin mb-4'
          size={40}
          style={{ color: THEME.colors.primary }}
        />
        <p className='font-bold opacity-50'>Syncing...</p>
      </div>
    );
  }

  const currentMoodKey = (entry?.mood in MOOD_CONTENT ? entry.mood : 'Happy') as MoodKey;
  const currentContent = MOOD_CONTENT[currentMoodKey];
  const recommendedTool = MOOD_TOOLS[currentMoodKey] || 'Mindfulness Meditation';

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: THEME.colors.primaryLight }}>
      <div className='pt-12 pb-8 px-6 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-[#22C55E] text-white rounded-full flex items-center justify-center mb-6 shadow-sm'>
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>
        <h1 className='text-3xl font-black mb-1' style={{ color: THEME.colors.text }}>
          {entry.id ? 'Entry Updated!' : 'Entry Saved!'}
        </h1>
        <p className='text-sm font-bold opacity-40' style={{ color: THEME.colors.text }}>
          Thank you for sharing your feelings today
        </p>
      </div>

      <div className='flex-1 px-5 space-y-6 pb-40'>
        <SuggestionCard
          title={currentContent.title}
          description={randomDescription}
          recommendedTool={recommendedTool}
        />
        <EntrySummary entry={entry} />
      </div>

      <div className='fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t' style={{ borderColor: THEME.colors.neutral }}>
        <button onClick={() => navigate('/app')} className={`w-full py-4 rounded-[24px] font-black text-lg shadow-lg ${THEME.interactive.activeScale}`} style={{ backgroundColor: THEME.colors.primary, color: THEME.colors.text, transition: THEME.interactive.transition }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}