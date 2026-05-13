import { THEME } from '@/app/utils/theme';

interface StatusAlertProps {
  status: {
    message: string;
    type: 'error' | 'success' | '';
  };
}

export default function StatusAlert({ status }: StatusAlertProps) {
  if (!status.message) return null;

  return (
    <div
      className={`p-4 rounded-2xl text-sm font-bold transition-all animate-in fade-in slide-in-from-top-2 ${
        status.type === 'error'
          ? 'bg-red-50 text-red-500'
          : 'bg-emerald-50 text-emerald-600'
      }`}
    >
      {status.message}
    </div>
  );
}
