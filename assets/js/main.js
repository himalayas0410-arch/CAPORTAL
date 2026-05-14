document.addEventListener('DOMContentLoaded', () => {
  // --- Component Loader ---
  const loadComponent = async (id, path, type) => {
    const element = document.getElementById(id);
    if (!element) return;

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      const html = await response.text();
      element.innerHTML = html;

      if (type === 'header') {
        highlightActiveLink();
      }
    } catch (error) {
      console.error('Error loading component:', error);
    }
  };

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
  };

  // Load public components
  loadComponent('header-placeholder', 'components/header.html', 'header');
  loadComponent('footer-placeholder', 'components/footer.html', 'footer');

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
