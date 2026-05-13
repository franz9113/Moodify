import { THEME } from '@/app/utils/theme';

const ENTRY_FIELDS = [
  { label: 'The Trigger', key: 'trigger' },
  { label: 'Your Response', key: 'action' },
  { label: 'Was it right?', key: 'was_it_right' },
  { label: 'Noticed Emotions', key: 'notice_emotions' },
  { label: 'Affected Decisions', key: 'affect_decisions' },
];

interface EntryFieldsProps {
  entry: any;
}

export default function EntryFields({ entry }: EntryFieldsProps) {
  return (
    <div className='grid grid-cols-1 gap-4'>
      {ENTRY_FIELDS.map((field, index) => {
        const value = entry[field.key];
        if (!value) return null;

        return (
          <div
            key={index}
            className='bg-white rounded-2xl p-5 border-2 shadow-sm'
            style={{ borderColor: THEME.colors.neutral }}
          >
            <p
              className='text-[10px] font-black uppercase tracking-widest mb-1 opacity-40'
              style={{ color: THEME.colors.text }}
            >
              {field.label}
            </p>
            <p className='font-bold text-base leading-tight' style={{ color: THEME.colors.text }}>
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
