import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/actions/auth'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const admin = await isAdmin()
  if (!admin) redirect('/polls')

  const supabase = await createClient(cookies())

  const [{ count: usersCount }, { count: pollsCount }, { count: votesCount }] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('polls').select('*', { count: 'exact', head: true }),
    supabase.from('votes').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow border">
            <div className="text-sm text-gray-500">Users</div>
            <div className="text-3xl font-bold">{usersCount ?? 0}</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <div className="text-sm text-gray-500">Polls</div>
            <div className="text-3xl font-bold">{pollsCount ?? 0}</div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow border">
            <div className="text-sm text-gray-500">Votes</div>
            <div className="text-3xl font-bold">{votesCount ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
