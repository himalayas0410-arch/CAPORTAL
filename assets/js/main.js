document.addEventListener('DOMContentLoaded', () => {
  // Note: Components are now directly embedded in the HTML files.

  // --- Mobile Navigation (Event Delegation) ---
  // Using event delegation so dynamic loading timing doesn't matter at all.
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.mobile-nav-toggle') || e.target.closest('#mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav') || document.getElementById('mobile-nav-container');

    // If we click the toggle button
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (mobileNav) {
        mobileNav.classList.toggle('hidden');
        console.log('Toggle clicked, menu hidden state:', mobileNav.classList.contains('hidden'));
      } else {
        console.error('Toggle clicked but mobile-nav element is missing from the DOM!');
      }
      return;
    }

    // If mobile nav is open, handle clicking outside or clicking links
    if (mobileNav && !mobileNav.classList.contains('hidden')) {
      const clickedInsideNav = e.target.closest('.mobile-nav') || e.target.closest('#mobile-nav-container');
      const clickedLink = e.target.closest('.mobile-nav-links a');

      if (clickedLink || !clickedInsideNav) {
        mobileNav.classList.add('hidden');
        console.log('Menu closed via link click or outside click');
      }
    }
  });

  const highlightActiveLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.split('.')[0];

    // Desktop Nav
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage || link.getAttribute('data-nav') === pageName) {
        link.classList.add('text-foreground');
        link.classList.remove('text-muted-foreground');
      } else {
        link.classList.add('text-muted-foreground');
        link.classList.remove('text-foreground');
      }
    });

    // Mobile Nav
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage || link.getAttribute('data-nav') === pageName) {
        link.classList.add('text-primary', 'bg-primary/5', 'font-bold');
        link.classList.remove('text-slate-600');
      } else {
        link.classList.remove('text-primary', 'bg-primary/5', 'font-bold');
        link.classList.add('text-slate-600');
      }
    });
  };

  // Public components are now loaded via iframes in the HTML directly.

  // --- Toast Functionality ---
  window.showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  };
});

function navigateTo(url) {
  window.location.href = url;
}