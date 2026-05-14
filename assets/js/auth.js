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
            await window.supabaseClient.auth.signOut();
            
            // Determine redirect path (relative to current location)
            const path = window.location.pathname;
            const redirectUrl = (path.includes('/dashboard/') || path.includes('/admin/')) ? '../login.html' : 'login.html';
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Logout error:', error.message);
            // Redirect anyway for better UX
            const path = window.location.pathname;
            const redirectUrl = (path.includes('/dashboard/') || path.includes('/admin/')) ? '../login.html' : 'login.html';
            window.location.href = redirectUrl;
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
            const path = window.location.pathname;
            const redirectUrl = (path.includes('/dashboard/') || path.includes('/admin/')) ? '../login.html' : 'login.html';
            window.location.href = redirectUrl;
        }
        return user;
    },

    async protectAdminPage() {
        console.log('Protecting Admin Page...');
        const user = await this.protectPage();
        if (user) {
            console.log('User authenticated, checking role for user:', user.id);
            const { data: profile, error } = await window.supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (error) {
                console.error('Error fetching admin profile:', error);
            }

            if (profile) {
                console.log('User role:', profile.role);
            }

            if (error || !profile || profile.role !== 'admin') {
                console.warn('Unauthorized admin access. Redirecting...');
                const path = window.location.pathname;
                const redirectUrl = (path.includes('/dashboard/') || path.includes('/admin/')) ? '../index.html' : 'index.html';
                window.location.href = redirectUrl;
                return null;
            }
        } else {
            console.warn('No user session found in protectAdminPage');
        }
        return user;
    }
};

window.authBackend = auth;
