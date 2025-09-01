import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { getCurrentUser } from "@/lib/actions/auth"
import { signOutAction } from "@/lib/actions/auth"
import { formatUserDisplayName } from "@/lib/auth-utils"

export async function NavigationServer() {
  const user = await getCurrentUser()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ALX Polly</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/polls" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Polls
            </Link>
            {user && (
              <Link 
                href="/polls/create" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Create Poll
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {formatUserDisplayName(user)}
                </span>
                
                <form action={signOutAction}>
                  <Button 
                    type="submit"
                    variant="outline" 
                    size="sm"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Sign Out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button 
                    // variant="outline" 
                    size="sm"
                    // className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    size="sm"
                    // className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
