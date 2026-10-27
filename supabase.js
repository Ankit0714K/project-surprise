
const SUPABASE_URL = "https://vqyetnqsaivobbvzyhle.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xDuPPYkVlcfFhGWsqkRV5w__5ogNqrH";

if (!window.supabase || !window.supabase.createClient) {
  console.error("Supabase library load nahi hui.");
} else if (
  SUPABASE_URL.includes("PASTE_") ||
  SUPABASE_PUBLISHABLE_KEY.includes("PASTE_")
) {
  console.error("Supabase URL aur publishable key add karo.");
} else {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("Supabase client initialized.");
}
