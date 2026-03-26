import React from 'react';
import { THEME } from '../../utils/theme';

interface BodyPart {
  id: string;
  path: string;
  label: string;
}

const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    label: 'Head',
    path: 'M50,2 C45,2 41,6 41,11 C41,16 45,20 50,20 C55,20 59,16 59,11 C59,6 55,2 50,2',
  },
  { id: 'chest', label: 'Chest', path: 'M41,22 L59,22 L62,40 L38,40 Z' },
  { id: 'stomach', label: 'Stomach', path: 'M38,42 L62,42 L60,55 L40,55 Z' },
  { id: 'left-arm', label: 'Left Arm', path: 'M36,22 L30,45 L35,45 L39,22 Z' },
  {
    id: 'right-arm',
    label: 'Right Arm',
    path: 'M64,22 L70,45 L65,45 L61,22 Z',
  },
  { id: 'left-leg', label: 'Left Leg', path: 'M40,57 L38,98 L48,98 L49,57 Z' },
  {
    id: 'right-leg',
    label: 'Right Leg',
    path: 'M60,57 L62,98 L52,98 L51,57 Z',
  },
];

interface BodyMapProps {
  onSelect: (part: string) => void;
  selectedParts: string[];
}

export default function BodyMap({ onSelect, selectedParts }: BodyMapProps) {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <svg
        viewBox='0 0 100 100'
        className='w-full h-full max-h-[50vh] drop-shadow-xl'
        style={{ filter: 'drop-shadow(0px 12px 16px rgba(0, 0, 0, 0.12))' }}
      >
        {BODY_PARTS.map((part) => {
          const isSelected = selectedParts.includes(part.id);
          return (
            <path
              key={part.id}
              d={part.path}
              fill={isSelected ? THEME.colors.primary : THEME.colors.neutral}
              stroke={isSelected ? THEME.colors.primary : '#B4BFBA'}
              strokeWidth='0.8'
              className='transition-all duration-300 cursor-pointer'
              onClick={() => onSelect(part.id)}
            />
          );
        })}
      </svg>
    </div>
  );
}
