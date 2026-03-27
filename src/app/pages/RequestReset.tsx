import { useState } from 'react';
import { useNavigate } from 'react-router';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function RequestReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Check your email for the reset link!', type: 'success' });
    }
    setLoading(false);
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      <div className='px-4 py-4'>
        <button onClick={() => navigate('/login')} className='p-2 opacity-50'><ChevronLeft size={28} /></button>
      </div>

      <div className='flex-1 px-8 pt-10'>
        <h2 className='text-3xl font-bold mb-2' style={{ color: THEME.colors.text }}>Reset Password</h2>
        <p className='opacity-50 mb-10'>Enter your email to receive a password reset link.</p>

        <form onSubmit={handleRequest} className='space-y-6'>
          <input
            type='email'
            placeholder='Email Address'
            className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message.text && (
            <div className={`p-4 rounded-2xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
              {message.text}
            </div>
          )}

          <CustomButton variant='primary' type='submit' disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </CustomButton>
        </form>
      </div>
    </div>
  );
}