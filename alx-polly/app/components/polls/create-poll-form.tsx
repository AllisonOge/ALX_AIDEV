"use client"

import { useState } from "react"
import { createPoll } from '@/lib/actions/polls'
import { Button } from "@/app/components/ui/button"

interface PollOption {
  id: string
  text: string
}

export function CreatePollForm() {
  const [formData, setFormData] = useState({
    question: "",
    options: [
      { id: "1", text: "" },
      { id: "2", text: "" }
    ],
    endDate: "",
    isPublic: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [
          ...formData.options,
          { id: Date.now().toString(), text: "" }
        ]
      })
    }
  }

  const removeOption = (id: string) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter(option => option.id !== id)
      })
    }
  }

  const updateOption = (id: string, text: string) => {
    setFormData({
      ...formData,
      options: formData.options.map(option =>
        option.id === id ? { ...option, text } : option
      )
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.question.trim()) {
      newErrors.question = "Question is required"
    }

    const validOptions = formData.options.filter(option => option.text.trim())
    if (validOptions.length < 2) {
      newErrors.options = "At least 2 options are required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (validateForm()) {
      setLoading(true)
      const options = formData.options.map(option => option.text)
      const endDateObj = formData.endDate ? new Date(formData.endDate) : undefined
      const result = await createPoll(
        formData.question,
        options,
        formData.isPublic,
        endDateObj
      )
      setLoading(false)
      if (result.error) {
        setSubmitError(result.error)
      } else {
        // Reset form
        setFormData({
          question: "",
          options: [
            { id: "1", text: "" },
            { id: "2", text: "" }
          ],
          endDate: "",
          isPublic: true
        })
        setErrors({})
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {submitError && (
        <div className="mb-4 text-red-600 text-center">{submitError}</div>
      )}
      {loading && (
        <div className="mb-4 text-blue-600 text-center">Creating poll...</div>
      )}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create a New Poll</h1>
        <p className="text-gray-600 mt-2">Share your question with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-900 mb-2">
        Poll Question *
          </label>
          <textarea
        id="question"
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
          errors.question ? 'border-red-500' : 'border-gray-300'
        }`}
        rows={3}
        placeholder="What would you like to ask?"
          />
          {errors.question && (
        <p className="text-red-500 text-sm mt-1">{errors.question}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
        Poll Options *
          </label>
          <div className="space-y-3">
        {formData.options.map((option, index) => (
          <div key={option.id} className="flex items-center space-x-2">
            <input
          type="text"
          value={option.text}
          onChange={(e) => updateOption(option.id, e.target.value)}
          className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
            errors.options ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={`Option ${index + 1}`}
            />
            {formData.options.length > 2 && (
          <button
            type="button"
            onClick={() => removeOption(option.id)}
            className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            Remove
          </button>
            )}
          </div>
        ))}
          </div>
          {errors.options && (
        <p className="text-red-500 text-sm mt-1">{errors.options}</p>
          )}
          
          {formData.options.length < 10 && (
        <button
          type="button"
          onClick={addOption}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-md"
        >
          + Add Option
        </button>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-900 mb-2">
        End Date *
          </label>
          <input
        id="endDate"
        type="datetime-local"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
          errors.endDate ? 'border-red-500' : 'border-gray-300'
        }`}
          />
          {errors.endDate && (
        <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
        id="isPublic"
        type="checkbox"
        checked={formData.isPublic}
        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
        Make this poll public (visible to everyone)
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1 text-gray-900">
          Create Poll
            </Button>
          <Button type="button" variant="outline" className="flex-1">
        Save as Draft
          </Button>
        </div>
      </form>
    </div>
  )
}
