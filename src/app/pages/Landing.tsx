import backgroundImage from '@/assets/BACKGROUND.png';
import { useNavigate } from 'react-router';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className='relative h-screen w-full bg-white overflow-hidden'>
      {/* Background Image*/}
      <img
        src={backgroundImage}
        className='absolute inset-0 w-full h-full object-cover'
        alt='Background'
      />

      {/* Top Title */}
      <div className='relative w-full flex justify-center pt-24'>
        <h1 className='text-4xl font-bold text-sky-400'>Moodify</h1>
      </div>

      {/* Action Buttons */}
      <div className='absolute bottom-[15%] w-full flex flex-col items-center gap-4'>
        {/* Main Button */}
        <button
          onClick={() => navigate('/login')} // Changed from /home to /login
          className='px-10 py-4 bg-white text-black font-bold rounded-full shadow-lg active:scale-95 transition-all w-[280px]'
        >
          Start Tracking
        </button>

        {/* Secondary Login Link */}
        <button
          onClick={() => navigate('/login')}
          className='text-black text-md font-bold drop-shadow-md opacity-80 hover:opacity-100 transition-opacity'
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
