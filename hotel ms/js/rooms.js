/* rooms.js — Rooms Page Logic */

let currentFilter = 'all';

/* ── Filter ── */
function setFilter(btn, category) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = category;

  const cards = document.querySelectorAll('.room-card-full');
  let visible = 0;

  cards.forEach(card => {
    const cat = card.dataset.category;
    const show = category === 'all' || cat === category;
    if (show) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  const noResults = document.getElementById('noResults');
  noResults.style.display = visible === 0 ? 'block' : 'none';
}

/* ── Sort ── */
function sortRooms(value) {
  const grid = document.getElementById('roomsGrid');
  const cards = Array.from(grid.querySelectorAll('.room-card-full'));

  cards.sort((a, b) => {
    const pa = parseInt(a.dataset.price);
    const pb = parseInt(b.dataset.price);
    if (value === 'price-asc')  return pa - pb;
    if (value === 'price-desc') return pb - pa;
    return 0; // featured
  });

  cards.forEach(card => grid.appendChild(card));
}

/* ── Search (availability check) ── */
function filterRooms() {
  const checkin  = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;

  if (!checkin || !checkout) {
    alert('Please select check-in and check-out dates.');
    return;
  }

  const inDate  = new Date(checkin);
  const outDate = new Date(checkout);

  if (outDate <= inDate) {
    alert('Check-out date must be after check-in date.');
    return;
  }

  const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));

  // Flash confirmation
  const btn = document.querySelector('.search-btn');
  const orig = btn.textContent;
  btn.textContent = `✓ Showing rooms for ${nights} night${nights > 1 ? 's' : ''}`;
  btn.style.background = '#4caf82';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}

/* ── Set default dates ── */
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 3);

  const fmt = d => d.toISOString().split('T')[0];
  const ci = document.getElementById('checkin');
  const co = document.getElementById('checkout');
  if (ci) { ci.value = fmt(tomorrow); ci.min = fmt(today); }
  if (co) { co.value = fmt(dayAfter); co.min = fmt(tomorrow); }
});
