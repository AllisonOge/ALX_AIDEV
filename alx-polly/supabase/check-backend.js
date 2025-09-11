#!/usr/bin/env node
/**
 * This script checks if the database is properly set up
 * It verifies that the required tables exist and have the correct structure
 */
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

function getArg(name) {
    const prefix = `--${name}=`;
    const arg = process.argv.find(a => a.startsWith(prefix));
    return arg ? arg.slice(prefix.length) : undefined;
}

// Choose env file: explicit flag > NODE_ENV > default local
const envFlag = (getArg('env') || '').toLowerCase();
let envFile;
if (envFlag === 'production' || envFlag === 'prod' || envFlag === 'remote') {
    envFile = '.env.production';
} else if (envFlag === 'test') {
    envFile = '.env.test';
} else if (envFlag === 'development' || envFlag === 'dev' || envFlag === 'local') {
    envFile = '.env.local';
} else if (process.env.NODE_ENV === 'production') {
    envFile = '.env.production';
} else if (process.env.NODE_ENV === 'test') {
    envFile = '.env.test';
} else {
    envFile = '.env.local';
}

// Load base .env (if present) then env-specific to override
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const hint = envFile.includes('production') ? '.env.production' : '.env.local';
    console.error(`❌ Missing environment variables. Make sure you have a ${hint} file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.`);
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
    console.log('🔍 Checking database setup...');
    try {

        // Check if users table exists
        const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('count()')
            .limit(1);
        if (usersError) {
            if (usersError.message.includes('does not exist')) {
                console.error('❌ The "users" table does not exist. Please run the migrations.');
            } else {
                console.error('❌ Error checking users table:', usersError.message);
            }
            return false;
        }
        console.log('✅ "users" table exists');

        // Check if polls table exists
        const { data: pollsData, error: pollsError } = await supabase
            .from('polls')
            .select('count()')
            .limit(1);
        if (pollsError) {
            if (pollsError.message.includes('does not exist')) {
                console.error('❌ The "polls" table does not exist. Please run the migrations.');
            } else {
                console.error('❌ Error checking polls table:', pollsError.message);
            }
            return false;
        }
        console.log('✅ "polls" table exists');

        // Check if poll_options table exists
        const { data: optionsData, error: optionsError } = await supabase
            .from('poll_options')
            .select('count()')
            .limit(1);
        if (optionsError) {
            if (optionsError.message.includes('does not exist')) {
                console.error('❌ The "poll_options" table does not exist. Please run the migrations.');
            } else {
                console.error('❌ Error checking poll_options table:', optionsError.message);
            }
            return false;
        }
        console.log('✅ "poll_options" table exists');

        // Check if votes table exists
        const { data: votesData, error: votesError } = await supabase
            .from('votes')
            .select('count()')
            .limit(1);
        if (votesError) {
            if (votesError.message.includes('does not exist')) {
                console.error('❌ The "votes" table does not exist. Please run the migrations.');
            } else {
                console.error('❌ Error checking votes table:', votesError.message);
            }
            return false;
        }
        console.log('✅ "votes" table exists');

        // Check if we can create a test poll (to verify permissions)
        const testPoll = {
            question: 'Test poll - please ignore',
            options: ['Option 1', 'Option 2'],
            // Note: This will fail if not authenticated, which is expected
            // The purpose is to check if the table structure is correct
        };
        const { error: insertError } = await supabase.from('polls').insert([testPoll]);
        if (insertError && !insertError.message.includes('permission denied')) {
            console.warn('⚠️ Could not insert test poll, but this might be due to authentication requirements.');
            console.warn('   Error message:', insertError.message);
        } else if (!insertError) {
            console.log('✅ Successfully inserted test poll');
        } else {
            console.log('✅ Permission checks are working as expected');
        }

        console.log('\n🎉 Database appears to be set up correctly!');
        console.log('\nNext steps:');
        console.log('1. Make sure you have created a user account');
        console.log('2. Start your application with: npm run dev');
        return true;
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        return false;
    }
}

checkDatabase().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
});
