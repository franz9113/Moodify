import { THEME } from '@/app/utils/theme';

interface EntrySummaryProps {
  entry: any;
}

export default function EntrySummary({ entry }: EntrySummaryProps) {
  return (
    <div className='bg-white rounded-[32px] p-8 shadow-sm border-b-4 border-black/5'>
      <h2 className='font-black text-sm uppercase tracking-tight mb-6' style={{ color: THEME.colors.text }}>
        Your Entry Summary
      </h2>

      <div className='space-y-6'>
        {/* Mood & Emotion */}
        <div>
          <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>Mood</p>
          <p className='font-black text-lg' style={{ color: THEME.colors.text }}>
            {entry.mood} - {entry.emotion}
          </p>
        </div>

        {/* What made you feel this way */}
        {entry.whatMadeYouFeel && (
          <div>
            <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>
              What made you feel this way
            </p>
            <p className='font-black text-sm' style={{ color: THEME.colors.text }}>
              {entry.whatMadeYouFeel}
            </p>
          </div>
        )}

        {/* Was it the right response */}
        {entry.was_it_right !== undefined && (
          <div>
            <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>
              Was it the right response?
            </p>
            <p className='font-black text-sm' style={{ color: THEME.colors.text }}>
              {entry.was_it_right === true ||
              entry.was_it_right === 'true' ||
              entry.was_it_right === 'Yes'
                ? 'Yes'
                : entry.was_it_right === false ||
                    entry.was_it_right === 'false' ||
                    entry.was_it_right === 'No'
                  ? 'No'
                  : 'Not sure'}
            </p>
          </div>
        )}

        {/* Noticed Emotions */}
        {entry.notice_emotions && (
          <div>
            <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>
              Noticed Emotions
            </p>
            <p className='font-black text-sm' style={{ color: THEME.colors.text }}>
              {entry.notice_emotions}
            </p>
          </div>
        )}

        {/* Affected Decisions */}
        {entry.affect_decisions && (
          <div>
            <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-1'>
              Affected Decisions
            </p>
            <p className='font-black text-sm' style={{ color: THEME.colors.text }}>
              {entry.affect_decisions}
            </p>
          </div>
        )}

        {/* Body Sensations */}
        {entry.bodyParts && entry.bodyParts.length > 0 && (
          <div>
            <p className='text-[10px] font-black opacity-30 uppercase tracking-widest mb-2'>
              Body sensations
            </p>
            <div className='flex flex-wrap gap-2'>
              {entry.bodyParts.map((part: string) => (
                <span
                  key={part}
                  className='px-4 py-2 rounded-xl text-xs font-black'
                  style={{
                    backgroundColor: THEME.colors.background,
                    color: THEME.colors.text,
                  }}
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
