const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

// Using the service role key for database interactions from the server
// Note: RLS policies should still be enforced within the logic via user_id
const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});

module.exports = supabase;
