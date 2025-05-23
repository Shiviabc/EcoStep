import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Default fallback values for local development
// These will be replaced with actual environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qkugpuhddgpvvrcifaxn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdWdwdWhkZGdwdnZyY2lmYXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMDE4NjIsImV4cCI6MjA2Mjc3Nzg2Mn0.2l2vjx6Cp6V9t6oFSU2iXJAYaruGzVr89IZpaqGCsuA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;