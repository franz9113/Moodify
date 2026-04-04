import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Sparkles, Trash2, Edit2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { getMoodImage, MOOD_TOOLS, type MoodKey } from '@/app/utils/moodConfig';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { supabase } from '@/app/utils/supabaseClient';

export default function MoodEntry() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('viewMoodEntry');
    if (stored) {
      setEntry(JSON.parse(stored));
    }
  }, []);

  const handleEdit = () => {
    if (!entry) return;

    navigate('/app/questions', {
      state: {
        editId: entry.id,
        moodType: entry.mood,
        moodSubtype: entry.emotion,
        existingAnswers: {
          // KEY-VALUE MAPPING MUST MATCH Question IDs exactly
          whatMadeYouFeel: entry.trigger,    
          whatDidYouDo: entry.action,       
          was_it_right: entry.was_it_right, 
          notice_emotions: entry.notice_emotions,
          affect_decisions: entry.affect_decisions,
        },
        existingBodyParts: entry.body_parts || [],
        selectedDate: entry.date,
        existingJournal: entry.journal,
        moodValue: entry.mood_value
      },
    });
  };

  const handleDelete = async () => {
    if (!entry?.id) return;
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase.from('mood_entries').delete().eq('id', entry.id);
      if (error) throw error;
      localStorage.removeItem('viewMoodEntry');
      navigate('/app');
    } catch (err: any) {
      console.error('Delete failed:', err.message);
      alert('Failed to delete entry.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!entry) return <div className='h-full flex items-center justify-center font-bold'>Loading...</div>;

  const moodName = (entry.mood || entry.mood_type) as MoodKey;
  const recommendedTool = MOOD_TOOLS[moodName] || 'Mindfulness Meditation';

  return (
    <div className='h-full flex flex-col' style={{ backgroundColor: THEME.colors.background }}>
      <div className='px-6 py-4 flex items-center justify-between bg-white shadow-sm shrink-0'>
        <h1 className='text-xl font-bold' style={{ color: THEME.colors.text }}>Mood Entry</h1>
        <CustomButton variant='ghost' fullWidth={false} onClick={() => navigate('/app')} className='p-2'><X size={24} /></CustomButton>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-8'>
        <div className='max-w-md mx-auto space-y-6 pb-10'>
          <div className='text-center space-y-3 mb-8'>
            <p className='text-xs font-bold uppercase tracking-widest opacity-50' style={{ color: THEME.colors.text }}>
              {format(new Date(entry.created_at || entry.timestamp), "MMMM d, yyyy 'at' h:mm a")}
            </p>
            <div className='flex items-center justify-center'>
              <img src={getMoodImage(moodName)} alt={moodName} className='w-24 h-24 object-contain' />
            </div>
            <h2 className='text-3xl font-black' style={{ color: THEME.colors.text }}>{moodName}</h2>
            <p className='text-lg font-medium opacity-70' style={{ color: THEME.colors.text }}>{entry.emotion}</p>
          </div>

          <div className='space-y-4'>
            {entry.journal && (
              <div className='bg-white rounded-2xl p-6 border-2 shadow-sm border-dashed' style={{ borderColor: THEME.colors.primary }}>
                <div className='flex items-center gap-2 mb-3 opacity-40'>
                  <BookOpen size={14} /><p className='text-[10px] font-black uppercase tracking-widest'>Your Journal</p>
                </div>
                <p className='text-base leading-relaxed italic' style={{ color: THEME.colors.text }}>"{entry.journal}"</p>
              </div>
            )}

            {entry.body_parts?.length > 0 && (
              <div className='bg-white rounded-2xl p-5 border-2 shadow-sm' style={{ borderColor: THEME.colors.neutral }}>
                <p className='text-[10px] font-black uppercase tracking-widest mb-3 opacity-40'>Physical Sensations</p>
                <div className='flex flex-wrap gap-2'>
                  {entry.body_parts.map((part: string) => (
                    <span key={part} className='px-3 py-1.5 font-bold rounded-lg text-[10px] uppercase'
                      style={{ backgroundColor: `${THEME.colors.primary}30`, color: THEME.colors.text }}>{part}</span>
                  ))}
                </div>
              </div>
            )}

            <div className='grid grid-cols-1 gap-4'>
              {[
                { label: 'The Trigger', value: entry.trigger },
                { label: 'Your Response', value: entry.action },
                { label: 'Was it right?', value: entry.was_it_right },
                { label: 'Noticed Emotions', value: entry.notice_emotions },
                { label: 'Affected Decisions', value: entry.affect_decisions },
              ].map((item, index) => item.value && (
                <div key={index} className='bg-white rounded-2xl p-5 border-2 shadow-sm' style={{ borderColor: THEME.colors.neutral }}>
                  <p className='text-[10px] font-black uppercase tracking-widest mb-1 opacity-40'>{item.label}</p>
                  <p className='font-bold text-base leading-tight'>{item.value}</p>
                </div>
              ))}
            </div>

            <div className='rounded-2xl p-6 border-2 shadow-md flex items-start gap-4'
              style={{ backgroundColor: `${THEME.colors.primary}20`, borderColor: THEME.colors.primary }}>
              <Sparkles className='mt-1' style={{ color: THEME.colors.text }} />
              <div>
                <p className='text-[10px] font-black uppercase opacity-60 mb-1'>Recommended tool</p>
                <p className='text-lg font-black leading-tight'>{recommendedTool}</p>
              </div>
            </div>

            <div className='pt-6 space-y-3'>
              <button onClick={handleEdit} className='w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 shadow-lg bg-white'
                style={{ borderColor: THEME.colors.primary, color: THEME.colors.text }}>
                <Edit2 size={18} /> Edit This Entry
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className='w-full py-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm disabled:opacity-50'>
                <Trash2 size={18} /> {isDeleting ? 'Deleting...' : 'Delete Entry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}