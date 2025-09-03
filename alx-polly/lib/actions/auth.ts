'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthError } from '@supabase/supabase-js'
import { User } from '@supabase/supabase-js'

export interface AuthActionResult {
  success: boolean
  error?: string
  message?: string
}

// Utility function to validate email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility function to create Supabase client
async function getSupabaseClient() {
  const cookieStore = cookies()
  return await createClient(cookieStore)
}

// Utility function to handle auth errors
function handleAuthError(error: unknown, redirectPath: string): never {
  console.error(`Auth error (${redirectPath}):`, error)
  
  // Check if this is a redirect error (which is expected)
  if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    throw error // Re-throw redirect errors
  }
  
  redirect(`${redirectPath}?error=${encodeURIComponent('An unexpected error occurred')}`)
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectPath = '/auth/login'

  // Validation - do this before try-catch to avoid catching redirect errors
  if (!email || !password) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Email and password are required')}`)
  }

  if (!validateEmail(email)) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Please enter a valid email address')}`)
  }

  try {
    const supabase = await getSupabaseClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      redirect(`${redirectPath}?error=${encodeURIComponent(getAuthErrorMessage(error))}`)
    }

    // Success - redirect to polls page
    redirect("/polls")
  } catch (error) {
    handleAuthError(error, redirectPath)
  }
}

export async function signUpAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const redirectPath = '/auth/register'

  // Validation - do this before try-catch to avoid catching redirect errors
  if (!name || !email || !password || !confirmPassword) {
    redirect(`${redirectPath}?error=${encodeURIComponent('All fields are required')}`)
  }

  if (!validateEmail(email)) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Please enter a valid email address')}`)
  }

  if (password !== confirmPassword) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Passwords do not match')}`)
  }

  if (password && password.length < 8) {
    redirect(`${redirectPath}?error=${encodeURIComponent('Password must be at least 8 characters long')}`)
  }

  try {
    const supabase = await getSupabaseClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${siteUrl}/auth/verify-email`,
      },
    })

    if (error) {
      redirect(`${redirectPath}?error=${encodeURIComponent(getAuthErrorMessage(error))}`)
    }

    redirect(`${redirectPath}/success`)
  } catch (error) {
    handleAuthError(error, redirectPath)
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const supabase = await getSupabaseClient()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Sign out error:', error)
  }
  
  redirect('/auth/login')
}

export async function resetPasswordAction(formData: FormData): Promise<AuthActionResult> {
  try {
    const email = formData.get('email') as string

    if (!email) {
      return {
        success: false,
        error: 'Email is required'
      }
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      }
    }

    const supabase = await getSupabaseClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error)
      }
    }

    return {
      success: true,
      message: 'Password reset email sent. Please check your email.'
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.'
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link to verify your account.'
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.'
    case 'Password should be at least 8 characters':
      return 'Password must be at least 8 characters long.'
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.'
    default:
      return error.message || 'An authentication error occurred.'
  }
}
