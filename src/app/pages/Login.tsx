import { useState } from 'react';
import { useNavigate } from 'react-router';
import { THEME } from '@/app/utils/theme';
import { ChevronLeft } from 'lucide-react';
import { handleGoogleLogin, handleForgotPassword, handleAuth } from '@/app/services/authService';
import LoginHeader from '@/app/components/Auth/LoginHeader';
import AuthForm from '@/app/components/Auth/AuthForm';
import StatusAlert from '@/app/components/Auth/StatusAlert';

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

  const onGoogleLogin = async () => {
    setLoading(true);
    const error = await handleGoogleLogin();
    if (error) {
      setStatus({ message: error, type: 'error' });
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    if (!email) {
      setStatus({ message: 'Please enter your email first.', type: 'error' });
      return;
    }

    setLoading(true);
    const error = await handleForgotPassword(email);
    if (error) {
      setStatus({ message: error, type: 'error' });
    } else {
      setStatus({ message: 'Password reset link sent to your email!', type: 'success' });
    }
    setLoading(false);
  };

  const onSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: '', type: '' });

    const error = await handleAuth({
      email,
      password,
      isSignUp,
      navigate,
    });

    if (error) {
      setStatus({ message: error, type: 'error' });
    } else if (isSignUp) {
      setStatus({
        message: 'Account created! You can now sign in.',
        type: 'success',
      });
      setIsSignUp(false);
      setEmail('');
      setPassword('');
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
        <LoginHeader isSignUp={isSignUp} />

        <form onSubmit={onSubmitAuth} className='space-y-4'>
          <AuthForm
            email={email}
            password={password}
            isSignUp={isSignUp}
            loading={loading}
            onEmailChange={(e) => {
              setEmail(e.target.value);
              setStatus({ message: '', type: '' });
            }}
            onPasswordChange={(e) => {
              setPassword(e.target.value);
              setStatus({ message: '', type: '' });
            }}
            onForgotPassword={onForgotPassword}
            onGoogleLogin={onGoogleLogin}
            onToggleMode={() => {
              setIsSignUp(!isSignUp);
              setStatus({ message: '', type: '' });
            }}
          />

          {status.message && <StatusAlert status={status} />}
        </form>
      </div>
    </div>
  );
}