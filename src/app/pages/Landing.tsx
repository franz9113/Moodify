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

      {/* Start Tracking Button */}
      <div className='absolute bottom-[20%] w-full flex justify-center'>
        <button
          onClick={() => navigate('/home')}
          className='px-10 py-3 bg-white text-black font-bold rounded-full shadow-lg active:scale-95 transition-all'
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
}
