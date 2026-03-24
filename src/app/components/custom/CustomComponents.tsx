import React from 'react';

// --- BUTTON COMPONENT ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const CustomButton = ({
  children,
  variant = 'primary',
  fullWidth = true,
  className = '',
  ...props
}: ButtonProps) => {
  const base =
    'py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 select-none flex items-center justify-center gap-2 touch-manipulation';

  const variants = {
    primary: 'bg-cyan-500 text-white shadow-md active:bg-cyan-600',
    secondary: 'bg-cyan-50 text-cyan-600 active:bg-cyan-100',
    outline:
      'border-2 border-gray-100 bg-white text-gray-700 active:border-gray-200',
    ghost: 'bg-transparent text-gray-500 active:bg-gray-50',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
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
