import { Button } from '@/app/components/ui/button';
import { resetPasswordAction } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

interface ResetPasswordPageProps {
  searchParams: {
    error?: string
    success?: string
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  async function handleSubmit(formData: FormData) {
    const result = await resetPasswordAction(formData);
    
    if (result.success) {
      redirect('/auth/reset-password?success=true');
    } else {
      redirect(`/auth/reset-password?error=${encodeURIComponent(result.error || 'Reset failed')}`);
    }
  }

  if (searchParams.success) {
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
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Check Your Email
            </h1>
            
            <p className="mt-2 text-sm text-gray-600">
              We've sent you a password reset link. Please check your email and click the link to reset your password.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-200">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                What happens next?
              </h2>
              
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Check your email for the password reset link
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click the link to set a new password
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Sign in with your new password
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or{' '}
              <a href="/auth/reset-password" className="text-blue-600 hover:underline">
                try again
              </a>
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
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        {searchParams.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}
        
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            Send Reset Link
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}