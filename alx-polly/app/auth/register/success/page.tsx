import Link from "next/link"
import { Button } from "@/app/components/ui/button"

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            Account Created Successfully!
          </h1>
          
          <p className="mt-2 text-sm text-gray-600">
            Welcome to ALX Polly! We're excited to have you join our polling community.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-200">
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
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
            
            <h2 className="text-xl font-semibold text-gray-900">
              Check Your Email
            </h2>
            
            <p className="text-gray-600">
              We've sent you a confirmation email. Please check your inbox and click the verification link to activate your account.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> You won't be able to sign in until you verify your email address.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Already verified your email?
          </p>
          
          <Link href="/auth/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Sign In to Your Account
            </Button>
          </Link>
          
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or{" "}
            <button className="text-blue-600 hover:underline">
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
