// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gqfxmpzekrbysfzqjnxn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZnhtcHpla3JieXNmenFqbnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMTg2NTAsImV4cCI6MjA2Mjc5NDY1MH0.7jXBZ_WhRmhvMxlNf-4ZRx58Jl_xnadAkFP0FmZT_Zo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);