document.addEventListener('DOMContentLoaded', async () => {
  // --- Dashboard Content Logic ---
  
  // 1. Get User Data
  const user = await window.authBackend.getCurrentUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  // 2. Fetch Profile to get Name
  const { data: profile } = await window.supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.innerText = profile.full_name || 'User';
  }

  // 3. Fetch Subscription
  const sub = await window.subscriptionBackend.getUserSubscription(user.id);
  if (sub) {
    const planName = sub.subscription_plans.name;
    document.getElementById('activeSubscriptionName').innerText = planName;
    document.getElementById('subscriptionStatus').innerText = sub.status.charAt(0).toUpperCase() + sub.status.slice(1);
    
    const endDate = new Date(sub.end_date);
    document.getElementById('planValidityDate').innerText = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const startDate = new Date(sub.start_date);
    document.getElementById('planInfoText').innerText = `From ${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    
    const headerTag = document.getElementById('headerPlanTag');
    if (headerTag) {
      headerTag.innerText = `${planName} Plan`;
      headerTag.classList.remove('hidden');
    }
  } else {
    document.getElementById('activeSubscriptionName').innerText = 'No Plan';
    document.getElementById('subscriptionStatus').innerText = 'Upgrade to start';
    document.getElementById('planValidityDate').innerText = '---';
    document.getElementById('planInfoText').innerText = 'Subscribe to a plan';
  }

  // 4. Fetch Recent Reports & Stats
  const uploads = await window.reportsBackend.getUserUploads();
  
  // Calculate total GSTINs checked
  const totalChecked = uploads
    .filter(u => u.status === 'completed')
    .reduce((sum, u) => sum + (u.total_records || 0), 0);
  
  document.getElementById('gstinCheckedCount').innerText = totalChecked.toLocaleString();

  // Populate Recent Reports Table (last 5)
  const tableBody = document.getElementById('reportsTableBody');
  if (tableBody) {
    tableBody.innerHTML = '';
    const recent = uploads.slice(0, 5);
    
    if (recent.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-muted-foreground">No reports found. <a href="upload.html" class="text-primary hover:underline">Upload your first file</a></td></tr>';
    } else {
      recent.forEach(u => {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-muted/50 transition-colors cursor-pointer';
        row.onclick = () => window.location.href = `report-detail.html?id=${u.id}`;
        
        const date = new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        
        row.innerHTML = `
          <td class="px-5 py-4 font-mono text-xs text-muted-foreground">#${u.id.substring(0, 8)}</td>
          <td class="px-5 py-4 font-medium">${u.file_name}</td>
          <td class="px-5 py-4 text-muted-foreground">${date}</td>
          <td class="px-5 py-4 text-right">${u.total_records || 0}</td>
          <td class="px-5 py-4">
            <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              u.status === 'completed' ? 'bg-success/10 text-success' : 
              u.status === 'processing' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
            }">
              ${u.status.charAt(0).toUpperCase() + u.status.slice(1)}
            </span>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  }
});
