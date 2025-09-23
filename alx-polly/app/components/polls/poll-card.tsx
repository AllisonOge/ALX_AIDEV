"use client"

import { useState } from "react"
import { votePoll } from '@/lib/actions/polls'
import { Button } from "@/app/components/ui/button"
import { useFlashToast } from "@/app/hooks/use-flash-toast"

interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  created_at: string;
  updated_at: string;
  votes: Array<{ count: number }>;
}

interface PollCardProps {
  id: string;
  question: string;
  is_active: boolean;
  is_public: boolean;
  created_by: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  options: PollOption[];
  totalVotes: number;
}

export function PollCard({ id, question, options, totalVotes, is_active, end_date }: PollCardProps) {
  const { showError, showSuccess } = useFlashToast()
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const [loading, setLoading] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)

  const handleVote = async () => {
    if (selectedOption && !hasVoted) {
      setLoading(true)
      setVoteError(null)
      const result = await votePoll(id, selectedOption)
      setLoading(false)
      if (result.error) {
        setVoteError(result.error)
        showError(result.error)
      } else {
        setHasVoted(true)
        showSuccess('Vote submitted')
      }
    }
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-md p-6 border border-gray-200">
      {/* <pre>{JSON.stringify({ id, question, options, totalVotes, is_active, end_date }, null, 2)}</pre> */}
      {voteError && (
        <div className="mb-2 text-red-600 text-center">{voteError}</div>
      )}
      {loading && (
        <div className="mb-2 text-blue-600 text-center">Submitting vote...</div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{totalVotes} votes</span>
          {end_date && (
            <span>Ends {new Date(end_date).toLocaleDateString()}</span>
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
                disabled={!is_active || hasVoted}
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
              <span className="text-sm text-gray-500">{option.votes?.[0]?.count ?? 0} votes</span>
            </label>
            
            {hasVoted && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(option.votes?.[0]?.count ?? 0)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {getPercentage(option.votes?.[0]?.count ?? 0)}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

  {is_active && !hasVoted && (
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

  {!is_active && (
        <div className="text-center text-sm text-red-600 font-medium">
          This poll has ended
        </div>
      )}
    </div>
  )
}
