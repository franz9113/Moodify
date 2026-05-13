import { useState } from 'react';
import { supabase } from '@/app/utils/supabaseClient';

/**
 * Signs up a user with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
): Promise<void> => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
};

/**
 * Signs in a user with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error('Invalid email or password.');
  }
};

/**
 * Initiates OAuth login with Google
 */
export const signInWithGoogle = async (): Promise<void> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/app',
    },
  });

  if (error) {
    throw error;
  }
};

/**
 * Sends a password reset email
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });

  if (error) {
    throw error;
  }
};
