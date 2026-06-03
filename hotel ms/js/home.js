/* home.js — Animations & Interactions */
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initScrollAnimations();
  animateCounters();
});

/* ── Particles ── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 1.5;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      --dur: ${Math.random() * 8 + 7}s;
      --delay: ${Math.random() * 6}s;
      --travel: -${Math.random() * 300 + 100}px;
      --op: ${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}

/* ── Scroll-triggered reveals ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.room-card, .feature-card, .testimonial-card, .stat-item')
    .forEach((el) => {
      observer.observe(el);
    });
}

/* ── Animated counters ── */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = null;
      const duration = 1800;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}