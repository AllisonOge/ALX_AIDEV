# Authentication Tests

This directory contains tests for the authentication actions in the ALX-Polly application.

## Test Files

- `auth.test.ts`: Tests for all authentication actions (signIn, signUp, signOut, resetPassword, getCurrentUser)
- `auth-error-messages.test.ts`: Tests for the error message handling function

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

To run specific tests:

```bash
npm test -- -t "signInAction"
```

## Test Coverage

These tests cover:

1. **Input Validation**:
   - Required fields validation
   - Email format validation
   - Password matching validation
   - Password length validation

2. **Authentication Flows**:
   - Sign in success and failure cases
   - Sign up success and failure cases
   - Sign out functionality
   - Password reset functionality
   - Current user retrieval

3. **Error Handling**:
   - Proper error messages for different authentication scenarios
   - Redirect behavior on errors

## Mocking Strategy

The tests use Jest mocks to isolate the authentication logic from external dependencies:

- `@/lib/supabase/server`: Mocked to avoid actual Supabase API calls
- `next/navigation`: Mocked to capture redirects without actual navigation
- `next/headers`: Mocked to provide cookie functionality without browser context