// Contact & Support Backend Logic
const contactSupport = {
    async submitEnquiry(enquiryData) {
        try {
            const { error } = await window.supabaseClient
                .from('contact_enquiries')
                .insert({
                    ...enquiryData,
                    status: 'new'
                });
            
            if (error) throw error;
            window.showToast('Enquiry submitted successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Enquiry submission error:', error.message);
            window.showToast(error.message, 'error');
            return false;
        }
    },

    async submitTicket(ticketData) {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const { error } = await window.supabaseClient
                .from('support_tickets')
                .insert({
                    ...ticketData,
                    user_id: user.id,
                    status: 'open'
                });
            
            if (error) throw error;
            window.showToast('Support ticket created successfully!', 'success');
            return true;
        } catch (error) {
            console.error('Ticket creation error:', error.message);
            window.showToast(error.message, 'error');
            return false;
        }
    },

    async getUserTickets() {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) return [];

            const { data, error } = await window.supabaseClient
                .from('support_tickets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching tickets:', error.message);
            return [];
        }
    }
};

window.contactSupportBackend = contactSupport;
