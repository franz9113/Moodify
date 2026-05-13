import { X } from 'lucide-react';

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LogoutConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: LogoutConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className='absolute inset-0 z-[100] flex items-end justify-center px-6 pb-20 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='w-full bg-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold text-gray-800'>Exit Moodify?</h3>
          <button onClick={onCancel} className='p-1 opacity-40'>
            <X size={24} />
          </button>
        </div>
        <p className='text-gray-500 mb-8'>
          Are you sure you want to log out of your journey?
        </p>
        <div className='flex flex-col gap-3'>
          <button
            onClick={onConfirm}
            className='w-full py-4 bg-red-500 text-white font-bold rounded-2xl active:scale-95 transition-transform'
          >
            Log Out
          </button>
          <button
            onClick={onCancel}
            className='w-full py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl active:scale-95 transition-transform'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
