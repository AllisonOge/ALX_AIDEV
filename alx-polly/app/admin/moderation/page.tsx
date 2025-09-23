import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/actions/auth'
import { adminDeletePollAction, adminListRecentPolls } from '@/lib/actions/admin'

export default async function ModerationPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const admin = await isAdmin()
  if (!admin) redirect('/polls')

  const polls = await adminListRecentPolls(25)

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Content Moderation</h1>
        <div className="space-y-3">
          {(polls ?? []).map((p) => (
            <form key={p.id} action={adminDeletePollAction} className="flex items-center justify-between bg-white p-4 rounded shadow border">
              <div>
                <div className="font-medium">{p.question}</div>
                <div className="text-sm text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
              </div>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="px-3 py-1 text-sm bg-red-600 text-white rounded">Delete</button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
