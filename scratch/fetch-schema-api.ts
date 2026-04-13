import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function fetchSchema() {
  const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  const schema = await response.json();
  const userProgress = schema.definitions.user_progress;
  console.log('User Progress Properties:', Object.keys(userProgress.properties));
}

fetchSchema().catch(console.error);
