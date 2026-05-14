// Profile Backend Logic
const profile = {
    async getProfile() {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) return null;

            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error.message);
            return null;
        }
    },

    async updateProfile(profileData) {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await window.supabaseClient
                .from('profiles')
                .update({
                    ...profileData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
            
            if (error) throw error;
            window.showToast('Profile updated successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Profile update error:', error.message);
            window.showToast(error.message, 'error');
            return false;
        }
    }
};

window.profileBackend = profile;
