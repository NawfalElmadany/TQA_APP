import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgprfcjjqmufyssycqdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxncHJmY2pqcW11Znlzc3ljcWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NjY2NDAsImV4cCI6MjA3MjQ0MjY0MH0.rNVh78_Prxg-DhMjzI95zbxv8jAaovB7mcnrhoLmAdw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
