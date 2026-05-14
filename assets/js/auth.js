// Auth Backend Logic
const auth = {
    async signUp(email, password, fullName, companyName, mobile, gstin) {
        try {
            const { data, error } = await window.supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        company_name: companyName,
                        mobile,
                        gstin
                    }
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Signup error:', error.message);
            window.showToast(error.message, 'error');
            return null;
        }
    },

    async signIn(email, password) {
        try {
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            
            // Create user session record
            await this.createUserSession(data.user.id, data.session.access_token);
            
            return data;
        } catch (error) {
            console.error('Login error:', error.message);
            window.showToast(error.message, 'error');
            return null;
        }
    },

    async signOut() {
        try {
            const { error } = await window.supabaseClient.auth.signOut();
            if (error) throw error;
            
            // Redirect to home
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout error:', error.message);
            window.showToast(error.message, 'error');
        }
    },

    async getCurrentUser() {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        return user;
    },

    async createUserSession(userId, token) {
        try {
            const { error } = await window.supabaseClient
                .from('user_sessions')
                .insert({
                    user_id: userId,
                    session_token: token,
                    is_active: true
                });
            if (error) console.warn('Failed to record session:', error.message);
        } catch (err) {
            console.error('Session error:', err);
        }
    },

    async protectPage() {
        const user = await this.getCurrentUser();
        if (!user) {
            window.location.href = '/login.html';
        }
        return user;
    },

    async protectAdminPage() {
        const user = await this.protectPage();
        if (user) {
            const { data: profile, error } = await window.supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (error || profile.role !== 'admin') {
                window.location.href = '/dashboard/index.html';
            }
        }
    }
};

window.authBackend = auth;
