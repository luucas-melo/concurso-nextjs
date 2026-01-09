#!/usr/bin/env node

/**
 * Database Connection Check Script
 * Verifies Supabase connection and tables exist
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('\n🔍 Checking Supabase Connection...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('   Make sure .env.local contains:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');
  console.error('\n   Run: cp .env.local.example .env.local\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    // Check profiles table
    console.log('📋 Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
      return false;
    }
    console.log('✅ Profiles table: OK');

    // Check exams table
    console.log('📋 Checking exams table...');
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('count')
      .limit(1);

    if (examsError) {
      console.error('❌ Exams table error:', examsError.message);
      return false;
    }
    console.log('✅ Exams table: OK');

    // Check authentication
    console.log('🔐 Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError && authError.message !== 'Auth session missing!') {
      console.error('❌ Auth error:', authError.message);
      return false;
    }

    if (user) {
      console.log('✅ Authenticated as:', user.email);
    } else {
      console.log('ℹ️  No user logged in (this is normal)');
    }

    console.log('\n✅ All checks passed! Database is ready.\n');
    return true;

  } catch (error) {
    console.error('\n❌ Connection error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. You created a Supabase project');
    console.error('   2. You ran supabase-schema.sql in SQL Editor');
    console.error('   3. Your .env.local has correct credentials\n');
    return false;
  }
}

checkDatabase()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
