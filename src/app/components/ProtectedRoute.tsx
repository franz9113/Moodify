import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { supabase } from '../utils/supabaseClient';

export default function ProtectedRoute() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If no session, redirect to the login/landing page
  return session ? <Outlet /> : <Navigate to='/login' replace />;
}
