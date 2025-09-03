// Mock for the Supabase server client

export const createClient = jest.fn().mockImplementation(() => ({
  auth: {
    signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    signUp: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({}),
    resetPasswordForEmail: jest.fn().mockResolvedValue({ error: null }),
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'mock-user-id', email: 'test@example.com' } },
      error: null,
    }),
  },
}));
