import { useState } from 'react';
import { useNavigate } from 'react-router';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { ChevronLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Dummy Logic: Check for user/user
    if (username.toLowerCase() === 'user' && password === 'user') {
      localStorage.setItem('isLoggedIn', 'true');
      // Use window.location to force the Router to re-check the Auth Guard
      window.location.href = '/';
    } else {
      setError('Invalid credentials. Hint: use user / user');
    }
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      {/* Header with Back Button */}
      <div className='px-4 py-4'>
        <button onClick={() => navigate('/landing')} className='p-2 opacity-50'>
          <ChevronLeft size={28} />
        </button>
      </div>

      <div className='flex-1 px-8 pt-10'>
        <h2
          className='text-3xl font-bold mb-2'
          style={{ color: THEME.colors.text }}
        >
          Welcome Back
        </h2>
        <p className='opacity-50 mb-10'>Sign in to continue your journey.</p>

        <form onSubmit={handleLogin} className='space-y-4'>
          <div className='space-y-1'>
            <input
              type='text'
              placeholder='Username'
              className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className='space-y-1'>
            <input
              type='password'
              placeholder='Password'
              className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <p className='text-red-500 text-xs font-bold px-2 animate-pulse'>
              {error}
            </p>
          )}

          <div className='pt-6'>
            <CustomButton variant='primary' type='submit'>
              Login
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
