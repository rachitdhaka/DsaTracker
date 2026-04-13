import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkSchema() {
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'user_progress' });
  // If rpc doesn't exist, try a simple select
  const { data: sample, error: err } = await supabase.from('user_progress').select('*').limit(1);
  
  if (err) {
    console.error('Error selecting from user_progress:', err.message);
  } else {
    console.log('User Progress Schema looks reachable with service role.');
  }
}

checkSchema();
