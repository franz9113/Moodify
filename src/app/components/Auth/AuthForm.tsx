import { THEME } from '@/app/utils/theme';
import { CustomButton } from '@/app/components/custom/CustomComponents';

interface AuthFormProps {
  isSignUp: boolean;
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGoogleLogin: () => void;
  onToggleMode: () => void;
  onForgotPassword?: () => void;
}

export default function AuthForm({
  isSignUp,
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onGoogleLogin,
  onToggleMode,
  onForgotPassword,
}: AuthFormProps) {
  return (
    <>
      <div className='space-y-1'>
        <input
          type='email'
          placeholder='Email Address'
          className='w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-cyan-100 outline-none transition-all'
          value={email}
          onChange={onEmailChange}
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
            onChange={onPasswordChange}
            required
          />
          <div className='flex justify-end pr-2'>
            <button
              type='button'
              onClick={onForgotPassword}
              className='text-xs font-medium opacity-50 hover:opacity-100'
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
            onChange={onPasswordChange}
            required
          />
        </div>
      )}

      <div className='pt-6 space-y-4'>
        <CustomButton variant='primary' type='submit' disabled={loading}>
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
        </CustomButton>

        <div className='flex items-center py-2'>
          <div className='flex-grow border-t border-gray-100'></div>
          <span className='px-3 text-xs opacity-30 font-bold'>OR</span>
          <div className='flex-grow border-t border-gray-100'></div>
        </div>

        <button
          type='button'
          onClick={onGoogleLogin}
          disabled={loading}
          className='w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border-2 border-gray-50 font-bold active:scale-95 transition-all'
        >
          <img
            src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
            className='w-5 h-5'
            alt='Google'
          />
          <span style={{ color: THEME.colors.text }}>Continue with Google</span>
        </button>

        <button
          type='button'
          onClick={onToggleMode}
          className='w-full text-center text-sm font-medium opacity-60 hover:opacity-100 transition-opacity py-2'
        >
          {isSignUp
            ? 'Already have an account? Login'
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </>
  );
}
