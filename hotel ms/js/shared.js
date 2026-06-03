/* =============================================
   shared.js — loads navbar & footer into pages
   ============================================= */

(function () {
  /* ── helpers ── */
  function resolveBase() {
    // Works for both root index.html and pages/*.html
    const depth = location.pathname.split('/').filter(Boolean).length;
    // If we're inside /pages/ sub-dir, go up one level
    return document.querySelector('[data-base]')?.dataset.base || (depth > 1 ? '../' : './');
  }

  async function loadHTML(url, targetId) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch failed');
      const html = await res.text();
      document.getElementById(targetId).innerHTML = html;
    } catch (e) {
      console.warn('Could not load component:', url, e);
    }
  }

  async function init() {
    const base = resolveBase();
    await Promise.all([
      loadHTML(base + 'components/navbar.html', 'navbar-placeholder'),
      loadHTML(base + 'components/footer.html', 'footer-placeholder'),
    ]);

    /* Fix hrefs for pages in sub-directories */
    if (base !== './') {
      document.querySelectorAll('a[href^="../"], a[href^="./"]').forEach(() => {});
    }

    setupNavbar();
    setActiveLink();
  }

  function setupNavbar() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    /* Scroll behaviour */
    const onScroll = () => {
      if (window.scrollY > 40) navbar?.classList.add('scrolled');
      else navbar?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu toggle */
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks?.classList.toggle('open');
    });

    /* Close menu when link clicked */
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  function setActiveLink() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop();
      if (href === current) link.classList.add('active');
    });
  }

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
