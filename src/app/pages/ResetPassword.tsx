import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';
import { supabase } from '../utils/supabaseClient';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'error' | 'success' | '' }>({
    message: '',
    type: '',
  });

  useEffect(() => {
    // Check the URL for error parameters sent by Supabase
    const hash = window.location.hash;
    if (hash.includes('error=access_denied') || hash.includes('error_code=otp_expired')) {
      setStatus({ 
        message: 'This reset link has expired or has already been used. Please request a new one.', 
        type: 'error' 
      });
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus({ message: 'Passwords do not match.', type: 'error' });
      return;
    }

    setLoading(true);
    setStatus({ message: '', type: '' });

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setStatus({ message: error.message, type: 'error' });
    } else {
      setStatus({ message: 'Password updated! Redirecting to login...', type: 'success' });
      // Give the user a moment to see the success message
      setTimeout(() => navigate('/login'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className='h-screen flex flex-col bg-white px-8 pt-20'>
      <h2 className='text-3xl font-bold mb-2' style={{ color: THEME.colors.text }}>
        New Password
      </h2>
      <p className='opacity-50 mb-10'>
        Please enter a secure new password for your account.
      </p>

      <form onSubmit={handleUpdatePassword} className='space-y-4'>
        <input
          type='password'
          placeholder='New Password'
          className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        
        <input
          type='password'
          placeholder='Confirm New Password'
          className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {status.message && (
          <div className={`p-4 rounded-2xl text-sm font-bold ${
            status.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {status.message}
          </div>
        )}

        <div className='pt-6'>
          <CustomButton variant='primary' type='submit' disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}