
# PollApp - Next.js Polling Application

PollApp is a modern polling platform scaffolded with Next.js 14, TypeScript, and Tailwind CSS. It provides a foundation for building interactive polls, user authentication, and real-time features. The current state is a scaffold with placeholder functionality and planned enhancements.

## Features

### Core Features (Scaffolded)
- User Authentication: Login and registration pages
- Poll Creation: Create polls with multiple options
- Poll Voting: Voting interface (placeholder)
- Poll Browsing: Browse active and ended polls
- Responsive Design: Mobile-first layout
- Modern UI: Shadcn components, Tailwind CSS

### Planned Features & Enhancements
- User role management (admin, regular users)
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
	- Follow the instructions in [`SETUP.md`](./SETUP.md) for authentication setup.
	- For database setup and migrations, see [`supabase/SETUP.md`](./supabase/SETUP.md).
	- Add your Supabase credentials to `.env.local` as described in those guides.
4. Start the development server:
	```bash
	npm run dev
	```
5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Available Routes

- `/` - Home page
- `/auth/login` - Login
- `/auth/register` - Register
- `/auth/reset-password` - Reset password
- `/auth/verify-email` - Email verification
- `/polls` - Browse polls
- `/polls/create` - Create poll

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


## Current State
This project is scaffolded and under active development. Most features are placeholders and require backend/API/database integration. See the checklist below for planned work:

### Implementation Checklist
- [ ] Backend API integration
- [ ] Database setup and models
- [ ] Authentication state management
- [ ] Real-time voting updates
- [ ] User profile management
- [ ] Poll analytics and insights
- [ ] User role management (admin vs. regular users)
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
