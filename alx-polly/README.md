# PollApp - Next.js Polling Application

A modern, interactive polling application built with Next.js 14, TypeScript, and Tailwind CSS. Create polls, vote on them, and see real-time results.

## Features

- **User Authentication**: Secure login and registration system
- **Poll Creation**: Create custom polls with multiple options and end dates
- **Poll Voting**: Interactive voting interface with real-time updates
- **Poll Browsing**: Browse and filter active and ended polls
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Built with Shadcn components and Tailwind CSS

## Project Structure

```
alx-polly/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   └── register/           # Registration page
│   ├── polls/                  # Poll-related pages
│   │   ├── page.tsx           # Browse polls
│   │   └── create/            # Create new poll
│   ├── components/             # Reusable components
│   │   ├── auth/              # Authentication components
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── polls/             # Poll-related components
│   │   │   ├── poll-card.tsx
│   │   │   ├── poll-list.tsx
│   │   │   └── create-poll-form.tsx
│   │   ├── layout/            # Layout components
│   │   │   └── navigation.tsx
│   │   └── ui/                # UI components (Shadcn)
│   │       └── button.tsx
│   ├── lib/                   # Utility functions
│   │   └── utils.ts
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── public/                    # Static assets
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Routes

- `/` - Home page with app overview
- `/auth/login` - User login
- `/auth/register` - User registration
- `/polls` - Browse all polls
- `/polls/create` - Create a new poll

## Component Overview

### Authentication Components
- **LoginForm**: User login with email and password
- **RegisterForm**: User registration with name, email, and password

### Poll Components
- **PollCard**: Individual poll display with voting functionality
- **PollList**: Grid layout of multiple polls with filtering
- **CreatePollForm**: Form for creating new polls with validation

### Layout Components
- **Navigation**: Header navigation with authentication state
- **Button**: Reusable button component with variants

## Development Status

This is a scaffolded application with placeholder functionality. The following areas need implementation:

- [ ] Backend API integration
- [ ] Database setup and models
- [ ] Authentication state management
- [ ] Real-time voting updates
- [ ] User profile management
- [ ] Poll analytics and insights

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **State Management**: React hooks (to be enhanced)
- **Authentication**: Placeholder (to be implemented)
- **Database**: To be implemented
- **Real-time**: To be implemented

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Next Steps

1. Set up a backend API (Node.js/Express, Python/FastAPI, etc.)
2. Implement database models for users and polls
3. Add authentication middleware and JWT handling
4. Implement real-time updates using WebSockets
5. Add poll analytics and user dashboard
6. Deploy to production environment
