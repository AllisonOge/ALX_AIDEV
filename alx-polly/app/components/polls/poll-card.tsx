"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface PollCardProps {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  endDate?: Date
}

export function PollCard({ id, question, options, totalVotes, isActive, endDate }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      // TODO: Implement vote submission logic
      console.log("Voting for option:", selectedOption, "in poll:", id)
      setHasVoted(true)
    }
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{totalVotes} votes</span>
          {endDate && (
            <span>Ends {endDate.toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {options.map((option) => (
          <div key={option.id} className="relative">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`poll-${id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={!isActive || hasVoted}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedOption === option.id 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                )}
              </div>
              <span className="flex-1 text-gray-700">{option.text}</span>
              <span className="text-sm text-gray-500">{option.votes} votes</span>
            </label>
            
            {hasVoted && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {getPercentage(option.votes)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isActive && !hasVoted && (
        <Button 
          onClick={handleVote}
          disabled={!selectedOption}
          className="w-full"
        >
          Vote
        </Button>
      )}

      {hasVoted && (
        <div className="text-center text-sm text-green-600 font-medium">
          ✓ You've voted on this poll
        </div>
      )}

      {!isActive && (
        <div className="text-center text-sm text-red-600 font-medium">
          This poll has ended
        </div>
      )}
    </div>
  )
}
