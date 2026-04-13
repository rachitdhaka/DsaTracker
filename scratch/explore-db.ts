import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function explore() {
  console.log('🔍 Exploring Supabase schema...');

  // Try to list tables by querying information_schema
  const { data, error } = await supabase.rpc('get_tables'); // If a custom RPC exists
  
  if (error) {
    // Fallback: Try a raw query if possible, or just check known tables
    console.log('Trying to check known tables...');
    
    const tables = ['questions', 'user_progress', 'solved_questions', 'profiles'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table '${table}' does not exist or error:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists.`);
      }
    }
  } else {
    console.log('Tables:', data);
  }
}

explore().catch(console.error);
