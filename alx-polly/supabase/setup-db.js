#!/usr/bin/env node
/**
 * Guided CLI for Supabase database setup and migrations
 * - Supports Local (Docker) development and Remote (Production) setup
 * - Safe by default: defaults to Local to avoid accidental production pushes
 *
 * Flags:
 *   --env=local|remote     Choose environment non-interactively
 *   --project-ref=XXXX     Provide project ref for remote linking
 *   --yes                  Skip confirmations (use with care, esp. remote)
 */
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function checkSupabaseCLI() {
    try {
        execSync('supabase --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function getArg(name) {
    const prefix = `--${name}=`;
    const arg = process.argv.find(a => a.startsWith(prefix));
    return arg ? arg.slice(prefix.length) : undefined;
}

function hasFlag(name) {
    return process.argv.includes(`--${name}`);
}

function question(prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}

function isProjectLinked() {
    try {
        const out = execSync('supabase status', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
        return !out.toLowerCase().includes('not linked');
    } catch {
        return false;
    }
}

async function ensureLinked(projectRefArg) {
    if (isProjectLinked()) {
        console.log('✅ Project is linked to Supabase');
        return;
    }
    console.log('\n⚠️ Your project is not linked to a Supabase project.');
    const projectRef = projectRefArg || (await question('Enter your project reference (found in dashboard URL): '));
    if (!projectRef) {
        console.log('\n❌ Project reference is required to link. Exiting...');
        process.exit(1);
    }
    try {
        execSync(`supabase link --project-ref ${projectRef}`, { stdio: 'inherit' });
        console.log('\n✅ Project linked successfully');
    } catch {
        console.log('\n❌ Failed to link project');
        process.exit(1);
    }
}

async function runLocalSetup() {
    console.log('\n🛠  Setting up Local (Docker) Supabase...');
    try {
        // Ensure local stack is running; starts if needed
        execSync('supabase start', { stdio: 'inherit' });
    } catch {
        console.log('\n❌ Failed to start local Supabase. Ensure Docker Desktop is running and try again.');
        process.exit(1);
    }

    console.log('\n📦 Applying migrations to local database...');
    try {
        execSync('supabase db reset', { stdio: 'inherit' });
        console.log('\n✅ Local database reset and migrations applied successfully');
    } catch {
        console.log('\n❌ Failed to apply migrations to local database');
        process.exit(1);
    }
}

async function runRemoteSetup() {
    console.log('\n🌐 Preparing to push migrations to Remote (Production)...');
    await ensureLinked(getArg('project-ref'));

    if (!hasFlag('yes')) {
        console.log('\nThis will push migrations to your linked remote database.');
        const confirm = await question("Type 'PROCEED' to continue: ");
        if (confirm !== 'PROCEED') {
            console.log('\n❌ Aborting. No changes were made.');
            process.exit(1);
        }
    }

    console.log('\n📦 Pushing migrations to remote database...');
    try {
        execSync('supabase db push', { stdio: 'inherit' });
        console.log('\n✅ Migrations pushed to remote successfully');
    } catch {
        console.log('\n❌ Failed to push migrations to remote');
        process.exit(1);
    }
}

async function main() {
    console.log('\n🚀 ALX Polly Database Setup');

    if (!checkSupabaseCLI()) {
        console.log('\n❌ Supabase CLI is not installed. Please install it first:');
        console.log('npm install -g supabase');
        process.exit(1);
    }
    console.log('✅ Supabase CLI is installed');

    // Determine environment
    let env = (getArg('env') || '').toLowerCase();
    if (!['local', 'remote'].includes(env)) {
        console.log('\nChoose target environment:');
        console.log('1) Local (Docker) - recommended for development');
        console.log('2) Remote (Production) - push to linked Supabase project');
        const choice = await question('Enter 1 or 2 [default: 1]: ');
        env = choice.trim() === '2' ? 'remote' : 'local';
    }

    if (env === 'local') {
        await runLocalSetup();
    } else {
        await runRemoteSetup();
    }

    console.log('\n🎉 Setup complete!');
    console.log('\nNext steps:');
    if (env === 'local') {
        console.log('1. Make sure your .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from the local stack (printed by supabase start or run the supabase status command).');
    } else {
        console.log('1. Make sure your .env.production has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your remote project.');
    }
    console.log('2. Start your Next.js app: npm run dev');

    rl.close();
}

main().catch(err => {
    console.error('\nAn error occurred:', err);
    process.exit(1);
});
