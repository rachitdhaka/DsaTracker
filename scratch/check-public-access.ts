import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkPublicAccess() {
  console.log('Testing public access with key:', supabaseKey?.substring(0, 10) + '...');
  const { data, error, count } = await supabase
    .from('questions')
    .select('id', { count: 'exact' });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Count visible to public key:', count);
    if (count === 0) {
      console.log('⚠️ RLS might be blocking access to "questions" table.');
    }
  }
}

checkPublicAccess();
