// Upload Backend Logic
const upload = {
    async uploadFile(file) {
        try {
            const user = await window.authBackend.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            // 1. Check for active subscription
            const sub = await window.subscriptionBackend.getUserSubscription(user.id);
            if (!sub) throw new Error('No active subscription found. Please subscribe to upload files.');

            // 2. Upload to storage
            const timestamp = Date.now();
            const filePath = `${user.id}/${timestamp}-${file.name}`;
            
            const { data: storageData, error: storageError } = await window.supabaseClient.storage
                .from('gstin-uploads')
                .upload(filePath, file);

            if (storageError) throw storageError;

            // 3. Create upload record
            const { data: uploadData, error: uploadError } = await window.supabaseClient
                .from('gstin_uploads')
                .insert({
                    user_id: user.id,
                    subscription_id: sub.id,
                    file_name: file.name,
                    file_path: filePath,
                    status: 'uploaded'
                })
                .select()
                .single();

            if (uploadError) throw uploadError;

            return uploadData;
        } catch (error) {
            console.error('Upload error:', error.message);
            window.showToast(error.message, 'error');
            return null;
        }
    },

    async triggerProcessing(uploadId) {
        try {
            const { data, error } = await window.supabaseClient.functions.invoke('process-gstin-upload', {
                body: { upload_id: uploadId }
            });
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Processing trigger error:', error.message);
            return null;
        }
    },

    async getUploadStatus(uploadId) {
        try {
            const { data, error } = await window.supabaseClient
                .from('gstin_uploads')
                .select('*')
                .eq('id', uploadId)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Status fetch error:', error.message);
            return null;
        }
    }
};

window.uploadBackend = upload;
