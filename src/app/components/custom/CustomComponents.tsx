import React from 'react';
import { THEME } from '@/app/utils/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'selected' | 'ghost';
  fullWidth?: boolean;
}

export const CustomButton = ({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 touch-manipulation select-none outline-none flex items-center justify-center text-center border-2';
  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  // Map variants to the Capstone Palette
  const variants = {
    // Solid Yellow (Continue)
    primary: `shadow-md border-transparent`,
    // Light Yellow Fill + Dark Border (Selected Emotion)
    selected: ``,
    // White Fill + Dark Border (Unselected Emotion)
    outline: `bg-white border-[#121715]`,
    // No Background
    ghost: `bg-transparent border-transparent`,
  };

  const dynamicStyles = {
    primary: {
      backgroundColor: THEME.colors.primary,
      color: THEME.colors.text,
    },
    selected: {
      backgroundColor: THEME.colors.primaryLight,
      borderColor: THEME.colors.primary,
      color: THEME.colors.text,
    },
    outline: { color: THEME.colors.text },
    ghost: { color: THEME.colors.text },
  }[variant];

  return (
    <button
      className={`${baseStyles} ${widthStyle} ${variants[variant]} ${className}`}
      style={dynamicStyles}
      {...props}
    >
      {children}
    </button>
  );
};
