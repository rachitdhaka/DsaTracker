import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLinks() {
  console.log('🚀 Starting optimized link update process...');

  const mdPath = path.resolve(process.cwd(), 'utils', 'leetcode  link.md');
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ MD file not found at: ${mdPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading from: ${mdPath}`);
  const fileContent = fs.readFileSync(mdPath, 'utf-8');
  const lines = fileContent.split('\n');
  
  const mappings = lines
    .filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && !trimmed.toLowerCase().startsWith('problem name');
    })
    .map(line => {
      const parts: string[] = [];
      let currentPart = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(currentPart.trim());
          currentPart = '';
        } else {
          currentPart += char;
        }
      }
      parts.push(currentPart.trim());

      const [title, gfgLink, leetcodeLink] = parts;
      return { title: title?.toLowerCase(), leetcodeLink };
    })
    .filter(m => m.title && m.leetcodeLink && m.leetcodeLink !== 'null' && m.leetcodeLink.startsWith('http'));

  console.log(`\n📦 Parsed ${mappings.length} valid LeetCode mappings.`);

  // Fetch all questions from DB
  console.log('📥 Fetching all questions from DB...');
  const { data: dbQuestions, error: fetchError } = await supabase
    .from('questions')
    .select('id, title');

  if (fetchError) {
    console.error('❌ Error fetching questions:', fetchError.message);
    process.exit(1);
  }

  console.log(`✅ Fetched ${dbQuestions.length} questions from DB.`);

  const updates = [];
  for (const mapping of mappings) {
    const matches = dbQuestions.filter(q => q.title.toLowerCase() === mapping.title);
    if (matches.length > 0) {
      for (const match of matches) {
        updates.push({ id: match.id, leetcode_link: mapping.leetcodeLink });
      }
    }
  }

  console.log(`\n📝 Preparing to update ${updates.length} questions.`);

  let updatedCount = 0;
  const CHUNK_SIZE = 50;
  for (let i = 0; i < updates.length; i += CHUNK_SIZE) {
    const chunk = updates.slice(i, i + CHUNK_SIZE);
    
    // We can't do a bulk update with different values easily in supabase-js without upsert
    // But upsert requires all columns if we want to avoid overwriting with nulls.
    // So we'll run individual updates but triggered in parallel chunks.
    const promises = chunk.map(u => 
      supabase
        .from('questions')
        .update({ leetcode_link: u.leetcode_link })
        .eq('id', u.id)
    );

    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error(`❌ Errors in chunk ${Math.floor(i/CHUNK_SIZE) + 1}:`, errors[0].error?.message);
    }
    updatedCount += chunk.length - errors.length;
    console.log(`📤 Progress: ${updatedCount}/${updates.length} updated...`);
  }

  console.log(`\n✅ ALL DONE! Total updated: ${updatedCount}`);
}

updateLinks().catch(console.error);
