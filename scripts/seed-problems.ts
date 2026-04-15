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

async function seed() {
  console.log('🚀 Starting seeding process...');

  const csvPath = path.resolve(process.cwd(), 'scripts', 'FINAL450.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading from: ${csvPath}`);
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');
  
  const rawQuestions = lines
    .filter(line => {
      const trimmed = line.trim();
      // Skip empty lines, lines with only commas, and the header row
      return trimmed !== '' && 
             trimmed !== ',,' && 
             trimmed !== ',,,' &&
             !trimmed.toLowerCase().startsWith('topic');
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

      const [topic, title, link, index] = parts;
      return { 
        topic, 
        title, 
        link: link || null, 
        order_index: index ? parseInt(index.trim()) : 0 
      };
    })
    .filter(q => q.topic && q.title);

  // Deduplicate before uploading to avoid "ON CONFLICT" errors
  const uniqueQuestionsMap = new Map<string, any>();
  rawQuestions.forEach(q => {
    const key = `${q.topic}|${q.title}`.toLowerCase();
    uniqueQuestionsMap.set(key, q);
  });

  const questions = Array.from(uniqueQuestionsMap.values());
  console.log(`\n📦 Parsed and deduplicated ${questions.length} questions.`);

  const CHUNK_SIZE = 50;
  for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
    const chunk = questions.slice(i, i + CHUNK_SIZE);
    console.log(`📤 Uploading chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(questions.length / CHUNK_SIZE)}...`);

    const { error } = await supabase
      .from('questions')
      .upsert(chunk, { onConflict: 'topic,title' }); 

    if (error) {
      console.error('❌ Error uploading chunk:', error.message);
      if (error.code === '42P01') {
        process.exit(1);
      }
    }
  }

  console.log('\n✅ Seeding complete!');
}

seed().catch(console.error);
