import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export interface UserData {
  id: string
  email: string
  name: string
}

/**
 * Creates a new user in the users table.
 */
export async function createUser(user: UserData): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    // Insert user with id (uuid), email, and name
    const { error } = await supabase.from('users').insert([
      {
        id: user.id ,
        email: user.email,
        name: user.name,
      }
    ])
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Updates a user in the users table by id.
 */
export async function updateUser(id: string, updates: Partial<UserData>): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { error } = await supabase.from('users').update(updates).eq('id', id)
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Deletes a user from the users table by id.
 */
export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
