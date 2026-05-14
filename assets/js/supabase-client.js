// Supabase Client Initialization
const SUPABASE_URL = 'https://pxmltfjuuyajophzzgsy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pAUa2EHx_mjxqPEAXbjBmA_zABZ4b1d';

if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please ensure the CDN script is included before this file.');
} else {
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized successfully.');
}
