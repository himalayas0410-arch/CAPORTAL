/**
 * Dashboard Layout Logic
 * Handles sidebar toggling, mobile navigation, and common header elements (user name, plan tag)
 */
document.addEventListener('DOMContentLoaded', async () => {
    const sidebar = document.getElementById('sidebar') || document.querySelector('aside');
    const openBtn = document.querySelector('header button[aria-label="Open menu"]');
    const overlay = document.getElementById('sidebarOverlay');
    const logoutBtns = document.querySelectorAll('.logout-btn');

    // --- Sidebar Toggle Logic ---
    if (openBtn && sidebar && overlay) {
        openBtn.addEventListener('click', () => {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }

    // --- Session & Profile Logic ---
    if (window.authBackend) {
        const user = await window.authBackend.getCurrentUser();
        if (!user) {
            // Only redirect if we are in the dashboard/admin directory
            if (window.location.pathname.includes('/dashboard/')) {
                window.location.href = '../login.html';
                return;
            }
        }

        // Populate common header elements if they exist
        if (user && window.supabaseClient) {
            // Fetch profile for user name
            const { data: profile } = await window.supabaseClient
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (profile) {
                const nameEl = document.getElementById('userName');
                if (nameEl) nameEl.innerText = profile.full_name || 'User';
            }

            // Fetch subscription for header tag
            if (window.subscriptionBackend) {
                const sub = await window.subscriptionBackend.getUserSubscription(user.id);
                if (sub) {
                    const headerTag = document.getElementById('headerPlanTag');
                    if (headerTag) {
                        headerTag.innerText = `${sub.subscription_plans.name} Plan`;
                        headerTag.classList.remove('hidden');
                    }
                }
            }
        }
    }

    // --- Logout Logic ---
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            if (window.authBackend) {
                await window.authBackend.signOut();
            }
        });
    });

    // --- Mobile Link Auto-Close ---
    const navLinks = document.querySelectorAll('aside nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024 && sidebar && overlay) {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        });
    });
});
