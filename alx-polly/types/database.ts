// import { Database as SupabaseDatabase } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          question: string;
          is_active: boolean;
          is_public: boolean;
          created_by: string;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          is_active?: boolean;
          is_public?: boolean;
          created_by: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          is_active?: boolean;
          is_public?: boolean;
          created_by?: string;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_poll_total_votes: {
        Args: { poll_id: string };
        Returns: number;
      };
      get_option_votes: {
        Args: { option_id: string };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper types for better type safety when working with the database
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Specific table types
export type User = Tables<'users'>;
export type Poll = Tables<'polls'>;
export type PollOption = Tables<'poll_options'>;
export type Vote = Tables<'votes'>;

// Insert types
export type InsertUser = InsertTables<'users'>;
export type InsertPoll = InsertTables<'polls'>;
export type InsertPollOption = InsertTables<'poll_options'>;
export type InsertVote = InsertTables<'votes'>;

// Update types
export type UpdateUser = UpdateTables<'users'>;
export type UpdatePoll = UpdateTables<'polls'>;
export type UpdatePollOption = UpdateTables<'poll_options'>;
export type UpdateVote = UpdateTables<'votes'>;
