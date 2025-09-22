import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/actions/auth'
import Link from 'next/link'

export default async function AdminHome() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')
  const admin = await isAdmin()
  if (!admin) redirect('/polls')

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/dashboard" className="p-6 bg-white rounded-lg shadow border hover:shadow-md">
            <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
            <p className="text-gray-600">Overview of polls, users, and votes</p>
          </Link>
          <Link href="/admin/moderation" className="p-6 bg-white rounded-lg shadow border hover:shadow-md">
            <h2 className="text-xl font-semibold">Content Moderation</h2>
            <p className="text-gray-600">Review and manage polls</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
