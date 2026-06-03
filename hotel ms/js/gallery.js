/* gallery.js — Gallery Filter + Lightbox */

const GALLERY_DATA = [
  { emoji:'🌊', caption:'Ocean Vista Suite',       cat:'rooms',  bg:'linear-gradient(135deg,#1c2640,#0d1f3c)' },
  { emoji:'♾️', caption:'Infinity Pool',            cat:'pool',   bg:'linear-gradient(135deg,#0a1f3a,#051020)' },
  { emoji:'🏖', caption:'Bentota Beach',            cat:'beach',  bg:'linear-gradient(135deg,#1a3a2a,#0a2015)' },
  { emoji:'🍽️', caption:'Gourmet Restaurant',      cat:'dining', bg:'linear-gradient(135deg,#2a1a0a,#150d05)' },
  { emoji:'🌿', caption:'Royal Garden Villa',       cat:'rooms',  bg:'linear-gradient(135deg,#1a2a1a,#0f1f0f)' },
  { emoji:'🌸', caption:'Ayurvedic Spa',            cat:'pool',   bg:'linear-gradient(135deg,#0a2a3a,#041520)' },
  { emoji:'🌅', caption:'Sunset Terrace',           cat:'beach',  bg:'linear-gradient(135deg,#2a2a0a,#151505)' },
  { emoji:'💒', caption:'Beach Wedding',            cat:'events', bg:'linear-gradient(135deg,#2a0a1a,#150510)' },
  { emoji:'👑', caption:'Presidential Penthouse',   cat:'rooms',  bg:'linear-gradient(135deg,#2a1a0a,#1a0f05)' },
  { emoji:'🍷', caption:'Wine Cellar Bar',          cat:'dining', bg:'linear-gradient(135deg,#1a0a2a,#0d0518)' },
  { emoji:'🚣', caption:'Water Activities',         cat:'beach',  bg:'linear-gradient(135deg,#0a1a3a,#040f20)' },
  { emoji:'🎊', caption:'Grand Ballroom',           cat:'events', bg:'linear-gradient(135deg,#1a2a0a,#0f1a05)' },
  { emoji:'🧖', caption:'Wellness Centre',          cat:'pool',   bg:'linear-gradient(135deg,#0a2a2a,#041515)' },
  { emoji:'🛏', caption:'Heritage Suite Bedroom',   cat:'rooms',  bg:'linear-gradient(135deg,#1f1a0a,#120f05)' },
  { emoji:'🍜', caption:'Sri Lankan Cuisine',       cat:'dining', bg:'linear-gradient(135deg,#0a1a1a,#040d0d)' },
];

let lbIndex = 0;
let visibleIndices = GALLERY_DATA.map((_, i) => i); // all visible by default

/* ── Filter ── */
function filterGallery(btn, category) {
  document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const items = document.querySelectorAll('.g-item');
  visibleIndices = [];

  items.forEach((item, i) => {
    const cat = item.dataset.cat;
    const show = category === 'all' || cat === category;
    if (show) {
      item.classList.remove('hidden');
      visibleIndices.push(i);
    } else {
      item.classList.add('hidden');
    }
  });
}

/* ── Lightbox ── */
function openLightbox(index) {
  lbIndex = index;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('lb-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lbMove(dir, e) {
  if (e) e.stopPropagation();

  // Only move through currently visible items
  const pos = visibleIndices.indexOf(lbIndex);
  if (pos === -1) {
    lbIndex = visibleIndices[0] || 0;
  } else {
    const newPos = (pos + dir + visibleIndices.length) % visibleIndices.length;
    lbIndex = visibleIndices[newPos];
  }

  renderLightbox();
}

function renderLightbox() {
  const item = GALLERY_DATA[lbIndex];
  if (!item) return;

  const lbImg = document.getElementById('lbImg');
  const lbEmoji = document.getElementById('lbEmoji');
  const lbCaption = document.getElementById('lbCaption');
  const lbCounter = document.getElementById('lbCounter');

  if (lbImg) lbImg.style.background = item.bg;
  if (lbEmoji) lbEmoji.textContent = item.emoji;
  if (lbCaption) lbCaption.textContent = item.caption;

  const pos = visibleIndices.indexOf(lbIndex);
  if (lbCounter) lbCounter.textContent = `${pos + 1} / ${visibleIndices.length}`;
}

/* Keyboard navigation */
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  lbMove(-1, null);
  if (e.key === 'ArrowRight') lbMove(1, null);
  if (e.key === 'Escape')     { lb.classList.remove('open'); document.body.style.overflow = ''; }
});

/* Touch swipe for lightbox */
let lbTouchX = 0;
document.getElementById('lightbox')?.addEventListener('touchstart', e => {
  lbTouchX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('lightbox')?.addEventListener('touchend', e => {
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) lbMove(diff > 0 ? 1 : -1, null);
});
