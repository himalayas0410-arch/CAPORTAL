document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('aside');
  const openBtn = document.querySelector('header button[aria-label="Open menu"]');
  const overlay = document.getElementById('sidebarOverlay');
  const logoutBtns = document.querySelectorAll('.logout-btn');

  // Session Check
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'subscriber') {
    // window.location.href = '../login.html'; // Disabled for demo stability, but good for real app
  }

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

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('session');
      window.location.href = '../index.html';
    });
  });

  // Mobile menu links click
  const navLinks = document.querySelectorAll('aside nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      }
    });
  });
});
