import { PollList } from "@/app/components/polls/poll-list"

export default function PollsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PollList />
      </div>
    </div>
  )
}
