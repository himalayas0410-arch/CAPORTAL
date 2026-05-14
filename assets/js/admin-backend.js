// Admin Backend Logic
const admin = {
    async getDashboardStats() {
        try {
            // This is a mock implementation of stats gathering
            // In a real app, you might use a Postgres function or multiple count queries
            
            const { count: subscribers } = await window.supabaseClient
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'subscriber');

            const { count: activeSubs } = await window.supabaseClient
                .from('subscriptions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            const { data: totalPayments } = await window.supabaseClient
                .rpc('sum_payments'); // We'll need to define this function

            const { count: totalUploads } = await window.supabaseClient
                .from('gstin_uploads')
                .select('*', { count: 'exact', head: true });

            return {
                subscribers: subscribers || 0,
                activeSubscriptions: activeSubs || 0,
                totalPayments: totalPayments || 0,
                uploads: totalUploads || 0
            };
        } catch (error) {
            console.error('Error fetching admin stats:', error.message);
            return null;
        }
    },

    async getAllSubscribers() {
        try {
            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select('*, subscriptions(*)')
                .eq('role', 'subscriber')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching subscribers:', error.message);
            return [];
        }
    },

    async getAllPayments() {
        try {
            const { data, error } = await window.supabaseClient
                .from('payments')
                .select('*, profiles(full_name, email), subscription_plans(name)')
                .order('payment_date', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching payments:', error.message);
            return [];
        }
    }
};

window.adminBackend = admin;
