"use client"

import { PollCard } from "./poll-card"

// Mock data - replace with actual data fetching
const mockPolls = [
  {
    id: "1",
    question: "What's your favorite programming language?",
    options: [
      { id: "1-1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "1-2", text: "Python", votes: 38 },
      { id: "1-3", text: "Java", votes: 22 },
      { id: "1-4", text: "C++", votes: 15 }
    ],
    totalVotes: 120,
    isActive: true,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    id: "2",
    question: "Which framework do you prefer for web development?",
    options: [
      { id: "2-1", text: "React", votes: 52 },
      { id: "2-2", text: "Vue", votes: 28 },
      { id: "2-3", text: "Angular", votes: 20 },
      { id: "2-4", text: "Svelte", votes: 12 }
    ],
    totalVotes: 112,
    isActive: true,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    id: "3",
    question: "What's your preferred database?",
    options: [
      { id: "3-1", text: "PostgreSQL", votes: 35 },
      { id: "3-2", text: "MongoDB", votes: 30 },
      { id: "3-3", text: "MySQL", votes: 25 },
      { id: "3-4", text: "Redis", votes: 18 }
    ],
    totalVotes: 108,
    isActive: false,
    endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
]

export function PollList() {
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
        {mockPolls.map((poll) => (
          <PollCard
            key={poll.id}
            id={poll.id}
            question={poll.question}
            options={poll.options}
            totalVotes={poll.totalVotes}
            isActive={poll.isActive}
            endDate={poll.endDate}
          />
        ))}
      </div>

      {mockPolls.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls available</h3>
          <p className="text-gray-500">Check back later for new polls or create one yourself!</p>
        </div>
      )}
    </div>
  )
}
