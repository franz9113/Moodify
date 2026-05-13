import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';
import { X, BookOpen } from 'lucide-react';
import { getMoodImage, MOOD_TOOLS, type MoodKey } from '@/app/utils/moodConfig';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { deleteMoodEntry, mapEntryForEdit } from '@/app/utils/entryUtils';
import EntryFields from '@/app/components/MoodEntry/EntryFields';
import ToolRecommendation from '@/app/components/MoodEntry/ToolRecommendation';
import EntryActions from '@/app/components/MoodEntry/EntryActions';

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
      state: mapEntryForEdit(entry),
    });
  };

  const handleDelete = async () => {
    if (!entry?.id) return;
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      setIsDeleting(true);
      await deleteMoodEntry(entry.id);
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

            <EntryFields entry={entry} />

            <ToolRecommendation toolName={recommendedTool} />

            <EntryActions
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}