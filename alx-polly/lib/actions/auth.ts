'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthError } from '@supabase/supabase-js'

export interface AuthActionResult {
  success: boolean
  error?: string
  message?: string
}

export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      }
    }

    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error)
      }
    }

    return {
      success: true,
      message: 'Successfully signed in'
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!name || !email || !password || !confirmPassword) {
      return {
        success: false,
        error: 'All fields are required'
      }
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: 'Passwords do not match'
      }
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      }
    }

    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email`,
      },
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error)
      }
    }

    return {
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.'
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

export async function signOutAction(): Promise<void> {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
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

    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
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

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
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

function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.'
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link to verify your account.'
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.'
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.'
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.'
    default:
      return error.message || 'An authentication error occurred.'
  }
}
