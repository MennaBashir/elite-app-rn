import { AuthError } from '@supabase/supabase-js';

export function mapAuthError(error: unknown): string {
  if (error instanceof AuthError) {
    const message = error.message.toLowerCase();

    if (error.status === 429 || message.includes('rate limit')) {
      return 'Too many attempts. Please try again in a bit.';
    }
    if (message.includes('already registered') || message.includes('already exists')) {
      return 'An account with this email already exists.';
    }
    if (message.includes('invalid login credentials')) {
      return 'Incorrect email or password.';
    }
    if (message.includes('email not confirmed')) {
      return 'Please verify your email first.';
    }
    if (message.includes('password')) {
      return "Password doesn't meet the minimum requirements.";
    }
    if (message.includes('expired')) {
      return 'This link has expired. Please request a new one.';
    }
    if (message.includes('invalid') && message.includes('token')) {
      return 'This link is invalid or has already been used.';
    }
    return error.message;
  }

  if (error instanceof Error && error.message.toLowerCase().includes('network')) {
    return 'You appear to be offline. Check your connection.';
  }

  return 'Something went wrong. Please try again.';
}
