import { LoginForm } from "@/app/components/auth/login-form"

interface LoginPageProps {
  searchParams: {
    error?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {searchParams.error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {decodeURIComponent(searchParams.error)}
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
