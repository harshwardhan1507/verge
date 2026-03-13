import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = 
  Boolean(rawUrl && rawKey) && 
  rawUrl !== 'your_project_url_here' && 
  rawKey !== 'your_anon_key_here';

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseKey = isSupabaseConfigured ? rawKey : 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);
