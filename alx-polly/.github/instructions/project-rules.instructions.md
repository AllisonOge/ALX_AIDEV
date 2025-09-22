---
applyTo: '**'
---
## Project Overview: Polling App with QR Code Sharing
You are an expert full-stack developer working on the Polling App codebase. Your primary goal is to build a web application that allows users to register, create polls, and share them via unique links and QR codes for others to vote on.

Adhere strictly to the rules, patterns, and conventions outlined in this document to ensure code quality, consistency, and maintainability.

## Technology Stack
The project uses the following technologies. Do not introduce new libraries or frameworks without explicit instruction.

- Language: TypeScript
- Main Framework: Next.js (App Router)
- Database & Auth: Supabase
- Styling: Tailwind CSS with shadcn/ui components
- State Management: Primarily Server Components for server state. Use useState or useReducer for local component state in Client Components.
- API Communication: Use Next.js Server Actions for mutations (creating polls, voting). Fetch data in Server Components using the Supabase client.
- Utility Libraries: A library like qrcode.react for generating QR codes.


## Architecture & Code Style

- Directory Structure: Follow the standard Next.js App Router structure.
    - `/app` for routes and pages.
    - `/components/ui` for `shadcn/ui` components.
    - `/components/` for custom, reusable components.
    - `/lib` for Supabase client setup, utility functions, and Server Actions.

- Component Design: Prefer Server Components for fetching and displaying data. Use Client Components ('use client') only when interactivity (hooks, event listeners) is required.
- Naming Conventions: Component files should be PascalCase (CreatePollForm.tsx). Utility and action functions should be camelCase (submitVote.ts).
- Error Handling: Use try/catch blocks within Server Actions and Route Handlers. Use Next.js error.tsx files for handling errors within route segments.
- API Keys & Secrets: Never hardcode secrets. Use environment variables (.env.local) for Supabase URL and keys, accessed via process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.SUPABASE_SECRET_KEY.

## Code Patterns to Follow
- Use a form that calls a Server Action to handle data submission. This keeps client-side JavaScript minimal.
- Do not create a separate API route handler and use fetch on the client side to submit form data. Use Server Actions instead.
- Do not fetch data on the client side using useEffect and useState in a page component. Fetch data directly in a Server Component.

## Verification Checklist
Before finalizing your response, you MUST verify the following:

- Does the code use the Next.js App Router and Server Components for data fetching?
- Are Server Actions used for data mutations (forms)?
- Is the Supabase client used for all database interactions?
- Are shadcn/ui components used for the UI where appropriate?
- Are Supabase keys and other secrets loaded from environment variables and not hardcoded?

## Security & Auth Rules (Supabase)

These rules are mandatory for all authentication, authorization, and critical flows.

### Tokens, Sessions, and the Free Plan
- Access tokens (JWT) are short-lived and signed by Supabase; their lifetime is configured in the Supabase Dashboard. On the Free plan we cannot customize this value from code.
- Refresh tokens are long-lived and managed by Supabase with rotation and optional replay detection.
    - On the Free plan, refresh tokens do not have a hard expiry (no fixed TTL). Sessions can continue indefinitely via refresh until sign-out or explicit revocation.
    - On the Pro plan, you can time-box sessions and set inactivity limits (which effectively cap refresh token longevity).
- App-enforced session length: we use HTTP-only cookies to define how long a user stays signed in within our app.
    - Free plan: choose a reasonable cookie `maxAge` (e.g., hours/days) to force re-login when it expires.
    - Pro plan: set cookie `maxAge` less than or equal to your configured time-box/inactivity limits.
- Always set auth cookies with: `httpOnly: true`, `secure: true`, `sameSite: 'lax'`, `path: '/'`.

### Roles and RLS
- User role lives in the JWT claims (e.g., `app_metadata.role`). Clients can read payloads but cannot modify them without invalidating the signature.
- Implement RLS policies that allow admin bypass via verified claims only. Pattern:
    - `USING (auth.jwt()->>'role' = 'admin' OR created_by = auth.uid())`
    - `WITH CHECK (auth.jwt()->>'role' = 'admin' OR created_by = auth.uid())`
- Never ship the `service_role` key to the browser. Admin-only operations must execute server-side.
- Keep RLS policy predicates consistent with table schema. If a policy references `is_public`, ensure the column exists, or rename the policy to match the actual column.

### Critical Flows Require Recent Authentication
- For destructive or sensitive actions (delete poll, change email, manage users, admin actions):
    - Require a “recent login” by checking the access token age (`iat` claim). If older than our threshold (e.g., 30 minutes), redirect to the login page and resume the flow after re-auth.
    - Do not rely on client-visible state; the check must happen server-side before executing the action.

### Storage & Transport
- Never store access/refresh tokens in `localStorage` or non-HTTP-only cookies.
- Only transmit tokens over HTTPS.
- Do not put secrets or sensitive PII inside JWT custom claims. Roles/flags are fine; secrets are not.

### Implementation Checklist (add to PRs touching auth/roles)
- Cookies configured with secure defaults and an explicit `maxAge` aligned with refresh token TTL.
- Critical flows enforce a recent-auth check before mutation.
- RLS policies exist for every table and align with actual schema columns; admin bypass checks JWT role claims, not client headers.
- No usage of `service_role` in client-side code; server-only keys read from environment variables.
