import Link from "next/link"
import { Button } from "@/app/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create and Vote on
            <span className="text-blue-600 block">Amazing Polls</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Engage with your community through interactive polls. Get real-time insights, 
            make decisions together, and discover what others think.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polls">
              <Button size="lg" className="text-lg text-black px-8 py-3">
                Browse Polls
              </Button>
            </Link>
            <Link href="/polls/create">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Create Poll
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose PollApp?
          </h2>
          <p className="text-lg text-gray-600">
            Simple, powerful, and engaging polling for everyone
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Results</h3>
            <p className="text-gray-600">
              See votes and results update instantly as people participate
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Voting</h3>
            <p className="text-gray-600">
              One vote per person with secure authentication and fraud prevention
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Create polls in seconds with our intuitive interface
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users creating and participating in polls every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg text-black px-8 py-3">
                Sign Up Free
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Explore Polls
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
