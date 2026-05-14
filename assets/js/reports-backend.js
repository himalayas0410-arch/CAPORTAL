// Reports Backend Logic
const reports = {
    async getUserUploads() {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) return [];

            const { data, error } = await window.supabaseClient
                .from('gstin_uploads')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching uploads:', error.message);
            return [];
        }
    },

    async getReportDetails(uploadId) {
        try {
            const { data: upload, error: uploadError } = await window.supabaseClient
                .from('gstin_uploads')
                .select('*')
                .eq('id', uploadId)
                .single();
            
            if (uploadError) throw uploadError;

            const { data: results, error: resultsError } = await window.supabaseClient
                .from('gstin_results')
                .select('*')
                .eq('upload_id', uploadId);
            
            if (resultsError) throw resultsError;

            return { upload, results };
        } catch (error) {
            console.error('Error fetching report details:', error.message);
            return null;
        }
    },

    downloadCSV(results, fileName = 'report.csv') {
        if (!results || results.length === 0) return;

        const headers = ['GSTIN', 'Legal Name', 'Trade Name', 'Status', 'State', 'Registration Date', 'Taxpayer Type', 'Remarks'];
        const rows = results.map(r => [
            r.gstin,
            r.legal_name,
            r.trade_name,
            r.status,
            r.state,
            r.registration_date,
            r.taxpayer_type,
            r.remarks
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

window.reportsBackend = reports;
