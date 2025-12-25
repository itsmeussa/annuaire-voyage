import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export server-side client helper
export { createServerSupabaseClient } from './supabase/server';

// Types for our tables
export interface ContactedAgencyRecord {
  id: string;
  agency_id: string;
  contacted: boolean;
  contacted_by: string;
  contacted_at: string;
  created_at?: string;
}

export interface TriedAgencyRecord {
  id: string;
  agency_id: string;
  tried: boolean;
  tried_by: string;
  tried_at: string;
  created_at?: string;
}
