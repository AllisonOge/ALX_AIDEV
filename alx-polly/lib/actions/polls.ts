'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { InsertPoll, InsertPollOption, InsertVote } from '@/types/database';

/**
 * Create a new poll with options
 */
export async function createPoll(
  question: string,
  options: string[],
  isPublic: boolean,
  endDate?: Date
) {
  try {
    const supabase = await createClient(cookies());
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to create a poll' };
    }

    // Start a transaction by using RPC
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        question,
        is_public: isPublic,
        created_by: user.id,
        end_date: endDate?.toISOString(),
      })
      .select()
      .single();

    if (pollError) {
      return { error: pollError.message };
    }

    // Insert options
    const pollOptions = options.map(text => ({
      poll_id: poll.id,
      text,
    }));

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions);

    if (optionsError) {
      return { error: optionsError.message };
    }

    revalidatePath('/polls');
    return { data: poll, error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to create poll' };
  }
}

/**
 * Get a poll by ID with its options and vote counts
 */
export async function getPoll(pollId: string) {
  try {
    const supabase = await createClient(cookies());
    
    // Get poll details
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();

    if (pollError) {
      return { error: pollError.message };
    }

    // Get poll options with vote counts
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('*, votes:votes(count)')
      .eq('poll_id', pollId);

    if (optionsError) {
      return { error: optionsError.message };
    }

    // Get total votes
    const { data: totalVotes, error: votesError } = await supabase
      .rpc('get_poll_total_votes', { poll_id: pollId });

    if (votesError) {
      return { error: votesError.message };
    }

    return { 
      data: { 
        ...poll, 
        options, 
        totalVotes 
      }, 
      error: null 
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch poll' };
  }
}

/**
 * Get all polls with pagination
 */
export async function getPolls(page = 1, limit = 10, onlyPublic = true) {
  try {
    const supabase = await createClient(cookies());
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    
    let query = supabase
      .from('polls')
      .select('*, user:users(name)', { count: 'exact' });
    
    if (onlyPublic) {
      query = query.eq('is_public', true);
    }
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      return { error: error.message };
    }

    return { 
      data, 
      count, 
      error: null 
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch polls' };
  }
}

/**
 * Get polls created by the current user
 */
export async function getUserPolls(page = 1, limit = 10) {
  try {
    const supabase = await createClient(cookies());
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to view your polls' };
    }
    
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    
    const { data, count, error } = await supabase
      .from('polls')
      .select('*', { count: 'exact' })
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      return { error: error.message };
    }

    return { 
      data, 
      count, 
      error: null 
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch your polls' };
  }
}

/**
 * Vote on a poll option
 */
export async function votePoll(pollId: string, optionId: string) {
  try {
    const supabase = await createClient(cookies());
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to vote' };
    }

    // Check if user has already voted on this poll
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      return { error: checkError.message };
    }

    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from('votes')
        .update({ option_id: optionId })
        .eq('id', existingVote.id);

      if (updateError) {
        return { error: updateError.message };
      }
    } else {
      // Create new vote
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          poll_id: pollId,
          option_id: optionId,
          user_id: user.id,
        });

      if (voteError) {
        return { error: voteError.message };
      }
    }

    revalidatePath(`/polls/${pollId}`);
    return { success: true, error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to vote' };
  }
}

/**
 * Delete a poll
 */
export async function deletePoll(pollId: string) {
  try {
    const supabase = await createClient(cookies());
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to delete a poll' };
    }

    // Check if user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single();

    if (pollError) {
      return { error: pollError.message };
    }

    if (poll.created_by !== user.id) {
      return { error: 'You can only delete your own polls' };
    }

    // Delete poll (cascade will delete options and votes)
    const { error: deleteError } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);

    if (deleteError) {
      return { error: deleteError.message };
    }

    revalidatePath('/polls');
    return { success: true, error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to delete poll' };
  }
}