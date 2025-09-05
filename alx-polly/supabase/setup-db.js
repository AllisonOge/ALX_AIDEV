#!/usr/bin/env node
/**
 * Guided CLI for Supabase database setup and migrations
 */
const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkSupabaseCLI() {
    try {
        execSync('supabase --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

function isProjectLinked() {
    try {
        const projectInfo = execSync('supabase status').toString();
        return !projectInfo.includes('not linked');
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('\n🚀 ALX Polly Database Setup\n');

    if (!checkSupabaseCLI()) {
        console.log('❌ Supabase CLI is not installed. Please install it first:');
        console.log('npm install -g supabase');
        process.exit(1);
    }
    console.log('✅ Supabase CLI is installed');

    if (!isProjectLinked()) {
        console.log('\n⚠️ Your project is not linked to a Supabase project.');
        const answer = await question('Would you like to link it now? (y/n): ');
        if (answer.toLowerCase() === 'y') {
            console.log('\nPlease get your project reference from the Supabase dashboard URL:');
            console.log('https://app.supabase.com/project/YOUR_PROJECT_REF');
            const projectRef = await question('Enter your project reference: ');
            try {
                execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
                console.log('\n✅ Project linked successfully');
            } catch (error) {
                console.log('\n❌ Failed to link project');
                process.exit(1);
            }
        } else {
            console.log('\n❌ Project must be linked to continue. Exiting...');
            process.exit(1);
        }
    } else {
        console.log('✅ Project is linked to Supabase');
    }


    // Run all migrations
    console.log('\n📦 Running database migrations...');
    try {
        execSync('supabase db push', { stdio: 'inherit' });
        console.log('\n✅ Migrations applied successfully');
    } catch (error) {
        console.log('\n❌ Failed to apply migrations');
        process.exit(1);
    }

    console.log('\n🎉 Setup complete! Your database is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env.local file contains the correct Supabase credentials');
    console.log('2. Start your Next.js application with: npm run dev');

    rl.close();
}

function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

main().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
});
