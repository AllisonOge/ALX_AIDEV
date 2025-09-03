// jest.setup.js
require('@testing-library/jest-dom');

// Mock Next.js router
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));