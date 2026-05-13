import { Loader2, X } from 'lucide-react';
import { THEME } from '@/app/utils/theme';
import BodyMap from '@/app/components/custom/BodyMap';

interface BodyMapPageProps {
  selectedBodyParts: string[];
  onSelectBodyPart: (part: string) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export default function BodyMapPage({
  selectedBodyParts,
  onSelectBodyPart,
  onSubmit,
  onClose,
  isLoading = false,
}: BodyMapPageProps) {
  return (
    <div
      className='flex flex-col min-h-[100dvh]'
      style={{ backgroundColor: THEME.colors.background }}
    >
      <div
        className='px-6 py-4 flex items-center justify-between border-b'
        style={{ borderColor: THEME.colors.neutral }}
      >
        <h1 className='text-lg font-bold'>
          Focus on where your body is reacting
        </h1>
        <button onClick={onClose} className='p-2'>
          <X size={24} />
        </button>
      </div>

      <div className='flex-1 flex flex-col px-6 py-8 overflow-hidden'>
        <div className='flex-1 flex items-center justify-center py-4'>
          <BodyMap
            onSelect={onSelectBodyPart}
            selectedParts={selectedBodyParts}
          />
        </div>

        <div className='min-h-[64px] flex flex-wrap gap-2 justify-center mt-4 px-4'>
          {selectedBodyParts.map((part) => (
            <span
              key={part}
              className='min-w-[90px] h-[25px] px-4 rounded-full flex items-center justify-center text-[12px] font-bold border'
              style={{
                backgroundColor: THEME.colors.primaryLight,
                color: THEME.colors.text,
                borderColor: THEME.colors.primary,
              }}
            >
              {part}
            </span>
          ))}
        </div>
      </div>

      <div className='px-6 pb-10 pt-4'>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className='w-full py-5 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all'
          style={{
            backgroundColor: isLoading
              ? THEME.colors.neutral
              : THEME.colors.primary,
            color: THEME.colors.text,
          }}
        >
          {isLoading && <Loader2 className='animate-spin' size={20} />}
          <span>Continue to Journal</span>
        </button>
      </div>
    </div>
  );
}
