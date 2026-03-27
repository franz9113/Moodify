import { useState } from 'react';
import { useNavigate } from 'react-router';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [status, setStatus] = useState<{
    message: string;
    type: 'error' | 'success' | '';
  }>({
    message: '',
    type: '',
  });

  // 1. Google Login Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Ensure this matches your Supabase redirect settings
        redirectTo: window.location.origin + '/app',
      },
    });

    if (error) {
      setStatus({ message: error.message, type: 'error' });
      setLoading(false);
    }
  };

  // 2. Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!email) {
      setStatus({ message: 'Please enter your email first.', type: 'error' });
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      setStatus({ message: error.message, type: 'error' });
    } else {
      setStatus({ message: 'Password reset link sent to your email!', type: 'success' });
    }
    setLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setStatus({ message: error.message, type: 'error' });
      } else {
        setStatus({
          message: 'Account created! You can now sign in.',
          type: 'success',
        });
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setStatus({ message: 'Invalid email or password.', type: 'error' });
      } else {
        navigate('/app');
      }
    }
    setLoading(false);
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      <div className='px-4 py-4'>
        <button
          onClick={() => navigate('/')}
          className='p-2 opacity-50 outline-none active:scale-95 transition-transform'
        >
          <ChevronLeft size={28} />
        </button>
      </div>

      <div className='flex-1 px-8 pt-10'>
        <h2
          className='text-3xl font-bold mb-2'
          style={{ color: THEME.colors.text }}
        >
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className='opacity-50 mb-10'>
          {isSignUp
            ? 'Start your journey with us.'
            : 'Sign in to continue your journey.'}
        </p>

        <form onSubmit={handleAuth} className='space-y-4'>
          <div className='space-y-1'>
            <input
              type='email'
              placeholder='Email Address'
              className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus({ message: '', type: '' });
              }}
              required
            />
          </div>

          {!isSignUp && (
            <div className='space-y-1'>
              <input
                type='password'
                placeholder='Password'
                className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setStatus({ message: '', type: '' });
                }}
                required
              />
              <div className='flex justify-end pr-2'>
                <button 
                  type="button"
                  onClick={() => navigate('/request-reset')}
                  className="text-xs font-medium opacity-50 hover:opacity-100"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          )}

          {isSignUp && (
            <div className='space-y-1'>
              <input
                type='password'
                placeholder='Password'
                className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          {status.message && (
            <div
              className={`p-4 rounded-2xl text-sm font-bold transition-all animate-in fade-in slide-in-from-top-2 ${
                status.type === 'error'
                  ? 'bg-red-50 text-red-500'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {status.message}
            </div>
          )}

          <div className='pt-6 space-y-4'>
            <CustomButton variant='primary' type='submit' disabled={loading}>
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
            </CustomButton>

            {/* Google Login Divider */}
            <div className="flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="px-3 text-xs opacity-30 font-bold">OR</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <button
              type='button'
              onClick={handleGoogleLogin}
              disabled={loading}
              className='w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border-2 border-gray-50 font-bold active:scale-95 transition-all'
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span style={{ color: THEME.colors.text }}>Continue with Google</span>
            </button>

            <button
              type='button'
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStatus({ message: '', type: '' });
              }}
              className='w-full text-center text-sm font-medium opacity-60 hover:opacity-100 transition-opacity py-2'
            >
              {isSignUp
                ? 'Already have an account? Login'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}