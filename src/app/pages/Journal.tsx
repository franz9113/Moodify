import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { X } from 'lucide-react';
import { THEME } from '../utils/theme';

export default function Journal() {
  const navigate = useNavigate();
  const [journalText, setJournalText] = useState('');

  useEffect(() => {
    // If we're editing, pre-fill the text if it exists in the storage
    const savedData = localStorage.getItem('currentMoodEntry');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.journalText) setJournalText(parsed.journalText);
    }
  }, []);

  const handleFinish = (text: string) => {
    // Get everything collected from Questions.tsx
    const existingData = JSON.parse(
      localStorage.getItem('currentMoodEntry') || '{}',
    );

    // Merge in the journal text
    const updatedData = {
      ...existingData,
      journalText: text,
    };

    // Save the complete entry back to storage
    localStorage.setItem('currentMoodEntry', JSON.stringify(updatedData));

    // Move to Suggestions to trigger the Supabase save
    navigate('/app/suggestions');
  };

  return (
    <div
      className='h-screen flex flex-col'
      style={{ backgroundColor: THEME.colors.background }}
    >
      <div
        className='px-6 py-4 flex items-center justify-between border-b'
        style={{ borderColor: THEME.colors.neutral }}
      >
        <h1 className='text-xl font-bold'>Journal</h1>
        <button
          onClick={() => navigate('/app')}
          className='p-2 opacity-40 hover:opacity-100 transition-opacity'
        >
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-6 py-8'>
        <h2 className='text-2xl mb-2 font-bold'>Write about your feelings</h2>
        <p className='mb-8 leading-relaxed opacity-60'>
          Reflect on your emotions and experiences.
        </p>

        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder='Start writing...'
          className='w-full h-72 p-5 border-2 rounded-[24px] resize-none outline-none leading-relaxed'
          style={{
            backgroundColor: THEME.colors.white,
            borderColor: THEME.colors.neutral,
            color: THEME.colors.text,
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = THEME.colors.primary)
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = THEME.colors.neutral)
          }
        />
      </div>

      <div
        className='px-6 py-6'
        style={{
          backgroundColor: THEME.colors.white,
          borderTop: `1px solid ${THEME.colors.neutral}`,
        }}
      >
        <button
          onClick={() => handleFinish(journalText)}
          className='w-full py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95'
          style={{
            backgroundColor: THEME.colors.primary,
            color: THEME.colors.text,
          }}
        >
          {journalText ? 'Continue' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
}
