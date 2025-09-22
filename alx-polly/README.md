
# PollApp - Next.js Polling Application

PollApp is a modern polling platform built with Next.js, TypeScript, and Tailwind CSS. It supports regular users and admins, including admin analytics and moderation tools.

## Features

### Core Features
- Authentication: Login, registration, password reset, email verification
- User Roles: Regular users and admins (with admin-only routes/pages)
- Admin Pages: Analytics dashboard and content moderation (delete polls)
- Poll Creation: Create polls with multiple options
- Poll Voting: Voting interface (placeholder)
- Poll Browsing: Browse active and ended polls
- Responsive Design: Mobile-first layout
- Modern UI: Shadcn components, Tailwind CSS

### Planned Features & Enhancements
- Admin user management UI (promote/demote users)
- Poll result charts (charting library)
- Comments/discussion threads on polls
- Improved mobile-responsiveness & accessibility
- Email notifications (e.g., poll closing alerts)
- Unit & integration tests (Jest, React Testing Library)
- AI-powered reviews & CodeRabbit release notes
- QR code generation for polls

## Project Structure

```
alx-polly/
├── app/
│   ├── auth/                    # Authentication pages (login, register, reset-password, verify-email)
│   ├── polls/                   # Poll pages (browse, create)
│   ├── components/              # Reusable components (auth, polls, layout, ui)
│   ├── contexts/                # React context providers (auth)
│   ├── hooks/                   # Custom React hooks (auth state)
│   ├── lib/                     # Utility functions and actions
│   ├── public/                  # Static assets
│   ├── supabase/                # Supabase integration (client, middleware, server)
│   ├── types/                   # TypeScript types
│   ├── README.md, package.json, config files
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm (or yarn)
- Supabase account (for database)

### Installation & Running
1. Clone the repository:
	```bash
	git clone <your-repo-url>
	cd alx-polly
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Set up Supabase:
	- For database setup and migrations, see [`supabase/SETUP.md`](./supabase/SETUP.md).
	- Add your Supabase credentials to `.env.local` as described in those guides.
	- Apply migrations, including roles and admin policies (see below).
4. Start the development server:
	```bash
	npm run dev
	```
5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Database Migrations (roles and admin)

This project includes a migration that adds a `role` column to `public.users` and policies granting admins full access:

- Migration file: `supabase/migrations/002_roles_and_admin.sql`

You can apply migrations using the Supabase CLI:

```bash
npx supabase start
npx supabase migration up # for none destructive or
npx supabase db reset # for destructive when db is already setup otherwise the setup instructions in SETUP.md will work just fine
```

If you’re using the Supabase dashboard, open the SQL editor and run the contents of the migration file.

## Available Routes

- `/` - Home page
- `/auth/login` - Login
- `/auth/register` - Register
- `/auth/reset-password` - Reset password
- `/auth/verify-email` - Email verification
- `/polls` - Browse polls
- `/polls/create` - Create poll
- `/admin` - Admin home (admins only)
- `/admin/dashboard` - Analytics overview (admins only)
- `/admin/moderation` - Content moderation (admins only)

Notes:
- Admin routes are protected in `middleware.ts` and in server components. Non-admins are redirected.

## Component Overview

### Authentication Components
- LoginForm: Email/password login
- RegisterForm: Name, email, password registration
- ProtectedRoute: Restrict access to authenticated users

### Poll Components
- PollCard: Display poll and voting options
- PollList: List/filter polls
- CreatePollForm: Create new poll (validation included)

### Layout/UI Components
- Navigation: Header navigation (auth state aware)
- Button: Reusable button (Shadcn)

## Admin & Roles

- Users have a `role` in `public.users`: either `user` (default) or `admin`.
- Admins can access `/admin/**`, see analytics (counts of users, polls, and votes), and delete any poll from moderation.
- The navbar displays an “Admin” link when the signed-in profile has `role = 'admin'`.

### Promote the First Admin (current approach)

Initially, all registered users are created with `role = 'user'`. To elevate a user to admin today, use one of these methods:

1) Supabase SQL (recommended)

```sql
update public.users
set role = 'admin'
where email = 'your-email@example.com';
```

2) Supabase Dashboard → Table editor: Edit the user’s `role` to `admin`.

There are server actions (`promoteToAdmin`, `demoteToUser`) scaffolded for future UI, but changing roles via UI requires an existing admin and is not exposed in the current interface.


## Current State
This project is scaffolded and under active development. Most features are placeholders and require backend/API/database integration. See the checklist below for planned work:

### Implementation Checklist
- [ ] Backend API integration
- [ ] Database setup and models
- [ ] Authentication state management
- [ ] Real-time voting updates
- [ ] User profile management
- [x] Admin role, gating, and pages (dashboard, moderation)
- [ ] Poll analytics and insights (charts)
- [ ] Admin user management UI (promote/demote)
- [ ] Poll result charts (charting library)
- [ ] Comments/discussion threads on polls
- [ ] Mobile-responsiveness & accessibility improvements
- [ ] Email notification system (poll closing alerts)
- [ ] Unit/integration tests (Jest, React Testing Library)
- [ ] AI-powered reviews & CodeRabbit release notes
- [ ] QR code generation for polls

## Tech Stack

- Frontend: Next.js 14, React 18, TypeScript
- Styling: Tailwind CSS, Shadcn/ui
- State Management: React hooks
- Authentication: Scaffolded (to be implemented)
- Database: Planned (Supabase integration)
- Real-time: Planned (WebSockets)

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/modify tests as needed
5. Open a pull request

## License

MIT License

### Next Steps
1. Complete Supabase authentication and database setup (see SETUP.md and supabase/SETUP.md)
2. Integrate backend API for poll creation, voting, and user management
3. Implement database models and migrations for users, polls, options, and votes
4. Add authentication middleware and JWT handling for secure API access
5. Enable real-time updates for poll voting (WebSockets or Supabase subscriptions)
6. Build user profile management and dashboard features
7. Add poll analytics, insights, and result charts
8. Implement user role management (admin, regular users)
9. Add comments/discussion threads to polls
10. Integrate email notifications (poll closing alerts, password reset, etc.)
11. Add unit and integration tests (Jest, React Testing Library)
12. Apply AI-powered reviews and automate release notes (CodeRabbit)
13. Generate QR codes for polls for easy sharing
14. Improve mobile-responsiveness and accessibility
15. Deploy to production
