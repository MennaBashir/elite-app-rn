import { supabase } from '@/utils/supabase';
import type { EmailOtpType, Session } from '@supabase/supabase-js';
import * as AuthSession from 'expo-auth-session';
import { getQueryParams } from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const emailRedirectTo = AuthSession.makeRedirectUri({ scheme: 'elite', path: 'auth-callback' });

export async function signUpWithEmail(params: {
  email: string;
  password: string;
  fullName: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: params.email.trim().toLowerCase(),
    password: params.password,
    options: {
      emailRedirectTo,
      data: { full_name: params.fullName.trim() },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(params: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email.trim().toLowerCase(),
    password: params.password,
  });
  if (error) throw error;
  return data;
}

export async function resendVerification(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo },
  });
  if (error) throw error;
}

export async function verifyEmailOtp(params: { token_hash: string; type: EmailOtpType }) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: params.token_hash,
    type: params.type,
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle(): Promise<Session | null> {
  const redirectTo = AuthSession.makeRedirectUri({ scheme: 'elite', path: 'auth-callback' });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      queryParams: { prompt: 'consent', access_type: 'offline' },
    },
  });
  if (error) throw error;
  if (!data.url) return null;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, {
    showInRecents: true,
  });

  if (result.type !== 'success') return null;

  const { params, errorCode } = getQueryParams(result.url);
  if (errorCode) throw new Error(errorCode);

  if (params.code) {
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      params.code
    );
    if (exchangeError) throw exchangeError;
    return sessionData.session;
  }

  if (params.access_token && params.refresh_token) {
    const { data: sessionData, error: setError } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (setError) throw setError;
    return sessionData.session;
  }

  return null;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
