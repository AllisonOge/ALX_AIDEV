import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type ModerationPoll = {
  id: string
  question: string
  is_public: boolean
  is_active: boolean
  created_at: string
}

async function ensureAdmin(): Promise<boolean> {
  const supabase = await createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: me } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  return me?.role === 'admin'
}

export async function adminListRecentPolls(limit = 25): Promise<ModerationPoll[]> {
  const isAdmin = await ensureAdmin()
  if (!isAdmin) return []

  const supabase = await createClient(cookies())
  const { data } = await supabase
    .from('polls')
    .select('id, question, is_public, is_active, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as ModerationPoll[]
}

export async function adminDeletePollAction(formData: FormData): Promise<void> {
  'use server'
  const isAdmin = await ensureAdmin()
  if (!isAdmin) {
    redirect('/admin/moderation?error=' + encodeURIComponent('You are not authorized to perform this action'))
  }

  const id = formData.get('id') as string
  if (!id) return

  const supabase = await createClient(cookies())
  const { error } = await supabase.from('polls').delete().eq('id', id)
  if (error) {
    redirect('/admin/moderation?error=' + encodeURIComponent(error.message))
  }
  revalidatePath('/admin/moderation')
  redirect('/admin/moderation?success=' + encodeURIComponent('Poll deleted'))
}
