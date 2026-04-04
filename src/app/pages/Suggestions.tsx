import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/app/utils/supabaseClient';
import { THEME } from '@/app/utils/theme';
import { MOOD_CONTENT, MOOD_TOOLS, type MoodKey } from '@/app/utils/moodConfig';

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

      saveToSupabase(parsed);
    } else if (!savedData && !saveAttempted.current) {
      navigate('/app');
    }
  }, [navigate]);

  const saveToSupabase = async (data: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Auth required');
        return navigate('/login');
      }

      const payload = {
        user_id: session.user.id,
        mood: data.mood || 'Neutral',
        emotion: data.emotion || '',
        mood_value: data.moodValue || 0,
        date: data.date || new Date().toISOString().split('T')[0],
        body_parts: data.bodyParts || [],
        trigger: data.whatMadeYouFeel || data.trigger || '',
        action: data.whatDidYouDo || data.action || '',
        was_it_right: data.was_it_right ?? 'Not sure',
        notice_emotions: data.notice_emotions || '', 
        affect_decisions: data.affect_decisions || '',
        journal: data.journalText || data.journal || '',
      };

      const { error: dbError } = data.id
        ? await supabase.from('mood_entries').update(payload).eq('id', data.id)
        : await supabase.from('mood_entries').insert([payload]);

      if (dbError) throw dbError;
      localStorage.removeItem('currentMoodEntry');
    } catch (err: any) {
      console.error('Save failed:', err.message);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
      <div className='h-screen flex flex-col items-center justify-center p-6 text-center' style={{ backgroundColor: THEME.colors.background }}>
        <p className='text-red-500 font-bold mb-4'>Save Failed: {error}</p>
        <button onClick={() => window.location.reload()} className='p-4 rounded-xl font-bold' style={{ backgroundColor: THEME.colors.neutral }}>
          Retry
        </button>
      </div>
    );
  }

  if (isSaving || !entry) {
    return (
      <div className='h-screen flex flex-col items-center justify-center' style={{ backgroundColor: THEME.colors.background }}>
        <Loader2 className='animate-spin mb-4' size={40} style={{ color: THEME.colors.primary }} />
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
        <div className='bg-white rounded-[32px] p-6 shadow-sm border-b-4 border-black/5'>
          <div className='flex items-center gap-2 mb-3'>
            <Sparkles size={22} style={{ color: '#2BBAC7' }} />
            <h2 className='font-black text-sm uppercase tracking-tight' style={{ color: THEME.colors.text }}>
              Personalized Suggestion
            </h2>
          </div>

          <h3 className='font-black text-lg mb-1' style={{ color: THEME.colors.text }}>
            {currentContent.title}
          </h3>
          <p className='text-xs font-bold opacity-60 leading-relaxed mb-6' style={{ color: THEME.colors.text }}>
            {randomDescription}
          </p>

          <div className='rounded-[24px] p-5 border-2' style={{ backgroundColor: THEME.colors.primaryLight, borderColor: THEME.colors.primary }}>
            <p className='text-[10px] font-black uppercase tracking-widest mb-1' style={{ color: THEME.colors.text, opacity: 0.4 }}>
              Recommended tool:
            </p>
            <p className='font-black text-[#1A7A82] text-lg underline underline-offset-4 decoration-2'>
              {recommendedTool}
            </p>
          </div>
        </div>

        <div className='bg-white rounded-[32px] p-8 shadow-sm border-b-4 border-black/5'>
          <h2 className='font-black text-sm uppercase tracking-tight mb-6' style={{ color: THEME.colors.text }}>
            Your Entry Summary
          </h2>

          <div className='space-y-6'>
            <div>
              <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>Mood</p>
              <p className='font-black text-lg' style={{ color: THEME.colors.text }}>
                {entry.mood} - {entry.emotion}
              </p>
            </div>

            {entry.whatMadeYouFeel && (
              <div>
                <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>What made you feel this way</p>
                <p className='font-black text-sm' style={{ color: THEME.colors.text }}>{entry.whatMadeYouFeel}</p>
              </div>
            )}
            {entry.was_it_right !== undefined && (
              <div>
                <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>
                  Was it the right response?
                </p>
                <p className='font-black text-sm' style={{ color: THEME.colors.text }}>
                  {entry.was_it_right === true || entry.was_it_right === 'true' || entry.was_it_right === 'Yes' 
                    ? 'Yes' 
                    : entry.was_it_right === false || entry.was_it_right === 'false' || entry.was_it_right === 'No'
                    ? 'No'
                    : 'Not sure'}
                </p>
              </div>
            )}

            {entry.notice_emotions && (
              <div>
                <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>Noticed Emotions</p>
                <p className='font-black text-sm' style={{ color: THEME.colors.text }}>{entry.notice_emotions}</p>
              </div>
            )}

            {entry.affect_decisions && (
              <div>
                <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>Affected Decisions</p>
                <p className='font-black text-sm' style={{ color: THEME.colors.text }}>{entry.affect_decisions}</p>
              </div>
            )}

            {entry.bodyParts && entry.bodyParts.length > 0 && (
              <div>
                <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-2'>Body sensations</p>
                <div className='flex flex-wrap gap-2'>
                  {entry.bodyParts.map((part: string) => (
                    <span key={part} className='px-4 py-2 rounded-xl text-xs font-black' style={{ backgroundColor: THEME.colors.background, color: THEME.colors.text }}>
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t' style={{ borderColor: THEME.colors.neutral }}>
        <button onClick={() => navigate('/app')} className={`w-full py-4 rounded-[24px] font-black text-lg shadow-lg ${THEME.interactive.activeScale}`} style={{ backgroundColor: THEME.colors.primary, color: THEME.colors.text, transition: THEME.interactive.transition }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}