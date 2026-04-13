import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkColumns() {
  // Query information_schema.columns via RPC if it exists, or just try to insert a dummy row to see errors
  // But safest is to try to select and see what we get.
  // Since table is empty, we can't get data.
  // Let's try to query the table metadata if possible.
  
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'user_progress' });
  if (error) {
    console.log('RPC failed, trying fallback...');
    // Try to guess by selecting specific common columns
    const columns = ['user_id', 'question_id', 'status', 'solved_at', 'id'];
    const { data: selectData, error: selectError } = await supabase.from('user_progress').select(columns.join(',')).limit(1);
    
    if (selectError) {
      console.log('Select failed:', selectError.message);
    } else {
      console.log('Columns confirmed:', columns);
    }
  } else {
    console.log('Columns:', data);
  }
}

checkColumns().catch(console.error);
