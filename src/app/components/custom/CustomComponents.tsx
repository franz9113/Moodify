import React from 'react';

// --- BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'selected';
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
    'py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 touch-manipulation select-none outline-none flex items-center justify-center text-center';
  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  const variants = {
    // Solid Cyan (Used for 'Continue')
    primary: 'bg-cyan-500 text-white shadow-lg shadow-cyan-100',
    // Light Cyan Fill (Used for 'Selected Emotion')
    selected: 'bg-cyan-50 border-2 border-cyan-500 text-cyan-600',
    // Simple Border (Used for 'Unselected Emotion')
    outline: 'bg-white border-2 border-gray-100 text-gray-400 font-medium',
    // No Background (Used for 'X' button)
    ghost: 'bg-transparent text-gray-400 hover:bg-gray-50',
  };

  return (
    <button
      className={`${baseStyles} ${widthStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- CARD COMPONENT ---
export const CustomCard = ({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm transition-all active:bg-gray-50/50 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- INPUT COMPONENT ---
// appearance-none removes the default iOS inner shadow
export const CustomInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>,
) => (
  <input
    {...props}
    className={`w-full py-4 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 outline-none focus:border-cyan-500 focus:bg-white transition-all text-center appearance-none placeholder:text-gray-400 ${props.className}`}
  />
);
