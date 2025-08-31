'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = createClient();
        
        // Get the current session to check if user is already verified
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.email_confirmed_at) {
          setVerificationStatus('success');
        } else {
          // Try to refresh the session to see if email was just verified
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            setVerificationStatus('error');
            setErrorMessage('Failed to verify email. Please try again or contact support.');
          } else if (data.session?.user?.email_confirmed_at) {
            setVerificationStatus('success');
          } else {
            setVerificationStatus('error');
            setErrorMessage('Email verification failed. Please check your email and try again.');
          }
        }
      } catch (error) {
        setVerificationStatus('error');
        setErrorMessage('An unexpected error occurred during verification.');
      }
    };

    verifyEmail();
  }, []);

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900">Verifying Your Email</h1>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Email Verified Successfully!
            </h1>
            
            <p className="mt-2 text-sm text-gray-600">
              Your email has been verified. You can now sign in to your account and start creating polls!
            </p>
          </div>

          <div className="text-center space-y-4">
            <Link href="/auth/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Sign In to Your Account
              </Button>
            </Link>
            
            <p className="text-sm text-gray-600">
              Or go back to{' '}
              <Link href="/" className="text-blue-600 hover:underline">
                home page
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Verification Failed
          </h1>
          
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-200">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              What to do next?
            </h2>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600">
                  Check your email for the verification link
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600">
                  Make sure to click the link within 24 hours
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600">
                  Check your spam folder if you don't see the email
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
          
          <p className="text-xs text-gray-500">
            Still having trouble?{' '}
            <button className="text-blue-600 hover:underline">
              Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
