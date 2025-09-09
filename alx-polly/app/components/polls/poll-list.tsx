"use client"

import { PollCard } from "./poll-card"
import { useEffect, useState } from "react"
import { getPolls } from '@/lib/actions/polls'

export function PollList() {
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPolls() {
      setLoading(true)
      setError(null)
      const result = await getPolls(1, 10, true)
      console.log('Fetched polls:', result)
      if (result.error) {
        setError(result.error)
      } else {
        setPolls(result.data || [])
      }
      setLoading(false)
    }
    fetchPolls()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Active Polls</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            All Polls
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Active
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Ended
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="text-center text-blue-600">Loading polls...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && polls.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No polls available</h3>
            <p className="text-gray-500">Check back later for new polls or create one yourself!</p>
          </div>
        )}
        {!loading && !error && polls.map((poll) => (
          <PollCard
            key={poll.id}
            id={poll.id}
            question={poll.question}
            options={poll.options || []}
            totalVotes={poll.total_votes || 0}
            is_active={poll.is_active}
            end_date={poll.end_date}
            is_public={poll.is_public}
            created_by={poll.created_by}
            created_at={poll.created_at}
            updated_at={poll.updated_at}
          />
        ))}
      </div>
    </div>
  )
}
