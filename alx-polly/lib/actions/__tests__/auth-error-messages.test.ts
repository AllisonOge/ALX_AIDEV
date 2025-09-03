import { AuthError } from '@supabase/supabase-js';
import { getAuthErrorMessage } from '../auth';

describe('getAuthErrorMessage', () => {
  it('should return appropriate message for invalid login credentials', () => {
    const error = { message: 'Invalid login credentials' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('Invalid email or password. Please try again.');
  });

  it('should return appropriate message for unconfirmed email', () => {
    const error = { message: 'Email not confirmed' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('Please check your email and click the confirmation link to verify your account.');
  });

  it('should return appropriate message for already registered user', () => {
    const error = { message: 'User already registered' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('An account with this email already exists. Please sign in instead.');
  });

  it('should return appropriate message for password length requirement', () => {
    const error = { message: 'Password should be at least 8 characters' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('Password must be at least 8 characters long.');
  });

  it('should return appropriate message for invalid email format', () => {
    const error = { message: 'Unable to validate email address: invalid format' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('Please enter a valid email address.');
  });

  it('should return the original error message for unknown errors', () => {
    const error = { message: 'Some unknown error' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('Some unknown error');
  });

  it('should return a default message when error message is empty', () => {
    const error = { message: '' } as AuthError;
    expect(getAuthErrorMessage(error)).toBe('An authentication error occurred.');
  });
});