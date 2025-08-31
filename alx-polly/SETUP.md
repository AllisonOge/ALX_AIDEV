# Supabase Authentication Setup

This project uses Supabase for authentication with context providers for state management on the client side.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from the project settings
3. Add the environment variables to your `.env.local` file

## Features Implemented

### Authentication Context
- **File**: `app/contexts/auth-context.tsx`
- Provides authentication state throughout the app
- Handles sign in, sign up, sign out, and password reset
- Automatically manages user sessions

### Protected Routes
- **File**: `app/components/auth/protected-route.tsx`
- Wraps pages that require authentication
- Redirects unauthenticated users to login

### Authentication Forms
- **Login Form**: `app/components/auth/login-form.tsx`
- **Register Form**: `app/components/auth/register-form.tsx`
- Both forms use the authentication context
- Include proper error handling and loading states

### Authentication Flow Pages
- **Registration Success**: `app/auth/register/success/page.tsx`
  - Shows after successful registration
  - Prompts user to check email for verification
  - Provides link to sign in page
- **Email Verification**: `app/auth/verify-email/page.tsx`
  - Handles email verification process
  - Shows success/error states
  - Redirects to sign in after verification
- **Password Reset**: `app/auth/reset-password/page.tsx`
  - Allows users to request password reset
  - Sends reset link via email

### Navigation
- **File**: `app/components/layout/navigation.tsx`
- Shows authentication status
- Provides sign out functionality
- Conditionally shows navigation items based on auth state

### Utilities
- **Auth Utils**: `lib/auth-utils.ts`
- Helper functions for error handling
- User data formatting utilities

## Usage

### Using the Auth Context

```tsx
import { useAuth } from '@/app/contexts/auth-context';

function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
}
```

### Protecting Routes

```tsx
import { ProtectedRoute } from '@/app/components/auth/protected-route';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

## Authentication Flow

1. **Sign Up**: User creates account → Redirected to success page
2. **Email Verification**: User clicks email link → Verification page → Success confirmation
3. **Sign In**: User logs in with verified email/password
4. **Session Management**: Automatic session persistence and refresh
5. **Sign Out**: User logs out and session is cleared
6. **Password Reset**: User requests reset → Receives email → Sets new password

## User Experience Flow

### Registration Process
1. User fills out registration form
2. Form submits to Supabase
3. User is redirected to `/auth/register/success`
4. Success page shows email verification prompt
5. User receives verification email
6. User clicks verification link
7. User lands on `/auth/verify-email`
8. Verification page confirms success
9. User can now sign in

### Password Reset Process
1. User clicks "Forgot password?" on login form
2. User is taken to `/auth/reset-password`
3. User enters email and submits
4. Success page shows email sent confirmation
5. User receives reset email
6. User clicks reset link
7. User sets new password
8. User can sign in with new password

## Security Features

- Email verification required for new accounts
- Secure session management with cookies
- Protected routes for authenticated-only content
- Proper error handling without exposing sensitive information
- Password reset via secure email links
- Automatic session refresh and management
