import { Sparkles } from 'lucide-react';
import { THEME } from '@/app/utils/theme';

interface ToolRecommendationProps {
  toolName: string;
}

export default function ToolRecommendation({ toolName }: ToolRecommendationProps) {
  return (
    <div
      className='rounded-2xl p-6 border-2 shadow-md flex items-start gap-4'
      style={{
        backgroundColor: `${THEME.colors.primary}20`,
        borderColor: THEME.colors.primary,
      }}
    >
      <Sparkles className='mt-1' style={{ color: THEME.colors.text }} />
      <div>
        <p
          className='text-[10px] font-black uppercase opacity-60 mb-1'
          style={{ color: THEME.colors.text }}
        >
          Recommended tool
        </p>
        <p
          className='text-lg font-black leading-tight'
          style={{ color: THEME.colors.text }}
        >
          {toolName}
        </p>
      </div>
    </div>
  );
}
