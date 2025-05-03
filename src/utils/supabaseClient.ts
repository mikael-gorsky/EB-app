// src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use the hardcoded values
// from src/services/supabase.ts for development
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jevudnymmadqdjomrirk.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInJlZiI6ImpldnVkbnltbWFkcWRqb21yaXJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNTg4NDQsImV4cCI6MjAzMDczNDg0NH0.MjA2MDY2NTM1Nn0.4VvZ373xec2kACiMPQvGSR-9qYP-n8eQnyOEtvzXHbY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);