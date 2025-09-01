import { CreatePollForm } from "@/app/components/polls/create-poll-form"
import { ProtectedRouteServer } from "@/app/components/auth/protected-route-server"

export default function CreatePollPage() {
  return (
    <ProtectedRouteServer>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CreatePollForm />
        </div>
      </div>
    </ProtectedRouteServer>
  )
}
