import { createClient } from "@supabase/supabase-js";

// User's existing Supabase project — these are publishable keys
const supabaseUrl = "https://frnwevdgvycgvlagnovf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybndldmRndnljZ3ZsYWdub3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTcwODAsImV4cCI6MjA5MTU5MzA4MH0.Uscxb0O9RuDGPzFVXRoDvYBHSlNQq7sEFNdbSd9WRo8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseConfigured = true;
