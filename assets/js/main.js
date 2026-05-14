document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // Toast Functionality
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

// Mock Navigation (optional if using real links)
function navigateTo(url) {
  window.location.href = url;
}
