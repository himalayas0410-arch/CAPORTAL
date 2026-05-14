// Supabase Client Initialization
const SUPABASE_URL = 'https://pxmltfjuuyajophzzgsy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bWx0Zmp1dXlham9waHp6Z3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MzYxOTAsImV4cCI6MjA5MTMxMjE5MH0.EC3ew68z41-0ygGXpHaHncJJ3Dbhs1Gw59_biPeuS1w';

if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please ensure the CDN script is included before this file.');
} else {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully.');
}
