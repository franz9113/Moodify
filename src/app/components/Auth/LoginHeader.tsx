import { THEME } from '@/app/utils/theme';

interface LoginHeaderProps {
  isSignUp: boolean;
}

export default function LoginHeader({ isSignUp }: LoginHeaderProps) {
  return (
    <>
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
    </>
  );
}
