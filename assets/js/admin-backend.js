// Admin Backend Logic
const admin = {
    async getStats() {
        try {
            const { count: totalSubscribers } = await window.supabaseClient
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'subscriber');

            const { count: activeSubscribers } = await window.supabaseClient
                .from('subscriptions')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            const { data: totalRevenue } = await window.supabaseClient
                .rpc('sum_payments');

            const { count: totalGstin } = await window.supabaseClient
                .from('reports')
                .select('*', { count: 'exact', head: true });

            return {
                totalSubscribers: totalSubscribers || 0,
                activeSubscribers: activeSubscribers || 0,
                totalRevenue: totalRevenue || 0,
                totalGstin: totalGstin || 0
            };
        } catch (error) {
            console.error('Error fetching admin stats:', error.message);
            return {
                totalSubscribers: 0,
                activeSubscribers: 0,
                totalRevenue: 0,
                totalGstin: 0
            };
        }
    },

    async getSubscribers(page = 1, limit = 10) {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error } = await window.supabaseClient
                .from('profiles')
                .select(`
                    *,
                    subscriptions (
                        *,
                        subscription_plans (name)
                    )
                `)
                .eq('role', 'subscriber')
                .order('created_at', { ascending: false })
                .range(from, to);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching subscribers:', error.message);
            return [];
        }
    },

    async getPayments(page = 1, limit = 10) {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error } = await window.supabaseClient
                .from('payments')
                .select(`
                    *,
                    profiles (full_name, email),
                    subscription_plans (name)
                `)
                .order('payment_date', { ascending: false })
                .range(from, to);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching payments:', error.message);
            return [];
        }
    },

    async getReports(page = 1, limit = 10) {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error } = await window.supabaseClient
                .from('reports')
                .select(`
                    *,
                    profiles (full_name, email)
                `)
                .order('created_at', { ascending: false })
                .range(from, to);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching reports:', error.message);
            return [];
        }
    },

    async getPlans() {
        try {
            const { data, error } = await window.supabaseClient
                .from('subscription_plans')
                .select('*')
                .order('price', { ascending: true });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching plans:', error.message);
            return [];
        }
    }
};

window.adminBackend = admin;
