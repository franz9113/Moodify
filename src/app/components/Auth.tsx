import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert('Check your email for the confirmation link!');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <form onSubmit={handleAuth} className='space-y-4'>
          <input
            type='email'
            placeholder='Email'
            className='w-full p-2 border rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='w-full p-2 border rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50'
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className='w-full mt-4 text-sm text-blue-500 hover:underline'
        >
          {isSignUp
            ? 'Already have an account? Login'
            : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
}
