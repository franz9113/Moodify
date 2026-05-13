import { Sparkles } from 'lucide-react';
import { THEME } from '@/app/utils/theme';

interface SuggestionCardProps {
  title: string;
  description: string;
  recommendedTool: string;
}

export default function SuggestionCard({
  title,
  description,
  recommendedTool,
}: SuggestionCardProps) {
  return (
    <div className='bg-white rounded-[32px] p-6 shadow-sm border-b-4 border-black/5'>
      <div className='flex items-center gap-2 mb-3'>
        <Sparkles size={22} style={{ color: '#2BBAC7' }} />
        <h2
          className='font-black text-sm uppercase tracking-tight'
          style={{ color: THEME.colors.text }}
        >
          Personalized Suggestion
        </h2>
      </div>

      <h3
        className='font-black text-lg mb-1'
        style={{ color: THEME.colors.text }}
      >
        {title}
      </h3>
      <p
        className='text-xs font-bold opacity-60 leading-relaxed mb-6'
        style={{ color: THEME.colors.text }}
      >
        {description}
      </p>

      <div
        className='rounded-[24px] p-5 border-2'
        style={{
          backgroundColor: THEME.colors.primaryLight,
          borderColor: THEME.colors.primary,
        }}
      >
        <p
          className='text-[10px] font-black uppercase tracking-widest mb-1'
          style={{ color: THEME.colors.text, opacity: 0.4 }}
        >
          Recommended tool:
        </p>
        <p className='font-black text-[#1A7A82] text-lg underline underline-offset-4 decoration-2'>
          {recommendedTool}
        </p>
      </div>
    </div>
  );
}
