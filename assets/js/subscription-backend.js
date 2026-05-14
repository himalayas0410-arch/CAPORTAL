// Subscription Backend Logic
const subscription = {
    async getPlans() {
        try {
            const { data, error } = await window.supabaseClient
                .from('subscription_plans')
                .select('*')
                .eq('is_active', true)
                .order('price', { ascending: true });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching plans:', error.message);
            return [];
        }
    },

    async getUserSubscription(userId) {
        try {
            const { data, error } = await window.supabaseClient
                .from('subscriptions')
                .select('*, subscription_plans(*)')
                .eq('user_id', userId)
                .eq('status', 'active')
                .maybeSingle();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching subscription:', error.message);
            return null;
        }
    },

    async createMockSubscription(planId) {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const { data: plan, error: planError } = await window.supabaseClient
                .from('subscription_plans')
                .select('*')
                .eq('id', planId)
                .single();
            
            if (planError) throw planError;

            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + plan.validity_days);

            // Create subscription
            const { data: sub, error: subError } = await window.supabaseClient
                .from('subscriptions')
                .insert({
                    user_id: user.id,
                    plan_id: planId,
                    status: 'active',
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    max_simultaneous_users: plan.max_simultaneous_users,
                    payment_status: 'paid'
                })
                .select()
                .single();

            if (subError) throw subError;

            // Create payment record
            const receiptNo = 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            const { error: payError } = await window.supabaseClient
                .from('payments')
                .insert({
                    user_id: user.id,
                    subscription_id: sub.id,
                    plan_id: planId,
                    receipt_no: receiptNo,
                    transaction_id: 'TXN-' + Date.now(),
                    amount: plan.price,
                    payment_status: 'success'
                });

            if (payError) throw payError;

            window.showToast('Subscription activated successfully!', 'success');
            return sub;
        } catch (error) {
            console.error('Subscription creation error:', error.message);
            window.showToast(error.message, 'error');
            return null;
        }
    },

    async getPaymentHistory(userId) {
        try {
            const { data, error } = await window.supabaseClient
                .from('payments')
                .select('*, subscription_plans(name)')
                .eq('user_id', userId)
                .order('payment_date', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching payments:', error.message);
            return [];
        }
    }
};

window.subscriptionBackend = subscription;
