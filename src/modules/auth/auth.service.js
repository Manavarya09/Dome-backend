const supabase = require('../../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../../config/env');

class AuthService {
    /**
     * Registers a new user.
     * Supabase Auth handles the user pool. We also keep a users record.
     */
    static async signup(email, password) {
        // 1. Hash password for local fallback / or if we were managing it fully entirely ourselves
        // Note: We use Supabase Auth for the primary identity pool. We can configure Supabase to handle the
        // hashing internally if using `supabase.auth.admin.createUser`, but for this assignment, we mimic
        // a standard flow, so we create the user in Supabase Auth.

        // We will use Supabase's admin API to create the user directly without requiring email confirmation for this demo.
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'user' },
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                throw new Error('User already exists');
            }
            throw authError;
        }

        const user = authData.user;

        // 2. Add user to public.users table (if it exists, assuming profile data needs to be kept)
        // Sometimes it's better to manage this via a Supabase trigger on auth.users, but we can do it here explicitly
        // for completeness. We use a try-catch to avoid failing signup if the trigger already did it.
        try {
            await supabase.from('users').upsert([
                { id: user.id, email: user.email, role: 'user' }
            ]);
        } catch (err) {
            // Ignore if it fails due to RLS or trigger duplicate handling
            console.warn("Could not insert into public.users, relying on Supabase trigger or it exists.");
        }

        // 3. Generate JWT Token
        const token = this.generateToken(user);

        return {
            user: { id: user.id, email: user.email, role: 'user' },
            token
        };
    }

    /**
     * Authenticates a user.
     */
    static async login(email, password) {
        // Use Supabase signInWithPassword to verify credentials against their Auth system
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error('Invalid email or password');
        }

        const user = data.user;

        // We generate our own backend JWT for our express API to use symmetrically
        const token = this.generateToken(user);

        return {
            user: { id: user.id, email: user.email, role: user.user_metadata?.role || 'user' },
            token
        };
    }

    /**
     * Generates a JWT token for the user.
     */
    static generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role || 'user',
        };

        return jwt.sign(payload, env.jwtSecret, { expiresIn: '1d' });
    }
}

module.exports = AuthService;
