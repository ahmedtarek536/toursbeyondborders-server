const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://gvkgwzyfzewdvzbsfhba.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a2d3enlmemV3ZHZ6YnNmaGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDQxMDMsImV4cCI6MjA2OTE4MDEwM30.dtkAu88fmrQrG7L668hUAhnxYWmXYB3dmJnQPLn4VIc";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
