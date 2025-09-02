import { signInAction, signUpAction, signOutAction, resetPasswordAction, getCurrentUser } from '../auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('Auth Actions', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signInAction', () => {
    it('should redirect to login page with error when email is missing', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('password', 'password123');

      // Act
      await signInAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/login?error=Email%20and%20password%20are%20required'
      );
    });

    it('should redirect to login page with error when password is missing', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      // Act
      await signInAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/login?error=Email%20and%20password%20are%20required'
      );
    });

    it('should redirect to login page with error when email format is invalid', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'invalid-email');
      formData.append('password', 'password123');

      // Act
      await signInAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/login?error=Please%20enter%20a%20valid%20email%20address'
      );
    });

    it('should redirect to polls page on successful login', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');

      const mockSupabase = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');

      // Act
      await signInAction(formData);

      // Assert
      expect(createClient).toHaveBeenCalledWith('mock-cookie-store');
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(redirect).toHaveBeenCalledWith('/polls');
    });

    it('should redirect to login page with error when authentication fails', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'wrong-password');

      const mockSupabase = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            error: { message: 'Invalid login credentials' },
          }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');

      // Act
      await signInAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/login?error=Invalid%20email%20or%20password.%20Please%20try%20again.'
      );
    });
  });

  describe('signUpAction', () => {
    it('should redirect to register page with error when required fields are missing', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      // Missing name, password, and confirmPassword

      // Act
      await signUpAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/register?error=All%20fields%20are%20required'
      );
    });

    it('should redirect to register page with error when email format is invalid', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('name', 'Test User');
      formData.append('email', 'invalid-email');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      // Act
      await signUpAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/register?error=Please%20enter%20a%20valid%20email%20address'
      );
    });

    it('should redirect to register page with error when passwords do not match', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('name', 'Test User');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'different-password');

      // Act
      await signUpAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/register?error=Passwords%20do%20not%20match'
      );
    });

    it('should redirect to register page with error when password is too short', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('name', 'Test User');
      formData.append('email', 'test@example.com');
      formData.append('password', 'short');
      formData.append('confirmPassword', 'short');

      // Act
      await signUpAction(formData);

      // Assert
      expect(redirect).toHaveBeenCalledWith(
        '/auth/register?error=Password%20must%20be%20at%20least%208%20characters%20long'
      );
    });

    it('should redirect to success page on successful registration', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('name', 'Test User');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');

      const mockSupabase = {
        auth: {
          signUp: jest.fn().mockResolvedValue({ error: null }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');
      process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

      // Act
      await signUpAction(formData);

      // Assert
      expect(createClient).toHaveBeenCalledWith('mock-cookie-store');
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
          },
          emailRedirectTo: 'http://localhost:3000/auth/verify-email',
        },
      });
      expect(redirect).toHaveBeenCalledWith('/auth/register/success');
    });
  });

  describe('signOutAction', () => {
    it('should sign out and redirect to login page', async () => {
      // Arrange
      const mockSupabase = {
        auth: {
          signOut: jest.fn().mockResolvedValue({}),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');

      // Act
      await signOutAction();

      // Assert
      expect(createClient).toHaveBeenCalledWith('mock-cookie-store');
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('resetPasswordAction', () => {
    it('should return error when email is missing', async () => {
      // Arrange
      const formData = new FormData();

      // Act
      const result = await resetPasswordAction(formData);

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Email is required',
      });
    });

    it('should return error when email format is invalid', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'invalid-email');

      // Act
      const result = await resetPasswordAction(formData);

      // Assert
      expect(result).toEqual({
        success: false,
        error: 'Please enter a valid email address',
      });
    });

    it('should return success message when password reset email is sent', async () => {
      // Arrange
      const formData = new FormData();
      formData.append('email', 'test@example.com');

      const mockSupabase = {
        auth: {
          resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');
      process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';

      // Act
      const result = await resetPasswordAction(formData);

      // Assert
      expect(createClient).toHaveBeenCalledWith('mock-cookie-store');
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'http://localhost:3000/auth/reset-password',
        }
      );
      expect(result).toEqual({
        success: true,
        message: 'Password reset email sent. Please check your email.',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      // Arrange
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');

      // Act
      const result = await getCurrentUser();

      // Assert
      expect(createClient).toHaveBeenCalledWith('mock-cookie-store');
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      // Arrange
      const mockSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' },
          }),
        },
      };

      (createClient as jest.Mock).mockResolvedValue(mockSupabase);
      (cookies as jest.Mock).mockReturnValue('mock-cookie-store');

      // Act
      const result = await getCurrentUser();

      // Assert
      expect(result).toBeNull();
    });
  });
});