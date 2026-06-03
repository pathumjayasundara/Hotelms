/* room-details.js — Room Details Page: Slider + Booking */

/* ── Room Data ── */
const ROOMS = {
  1: { name:'Sunrise Deluxe Room',     type:'Deluxe Room',    price:240, size:'42 m²', guests:'2 Adults',   bed:'King Bed',       view:'Garden' },
  2: { name:'Ocean Vista Suite',        type:'Ocean Suite',    price:340, size:'65 m²', guests:'2 Adults',   bed:'King Bed',       view:'Ocean'  },
  3: { name:'Royal Garden Villa',       type:'Garden Villa',   price:520, size:'90 m²', guests:'4 Adults',   bed:'King + Twin',    view:'Garden' },
  4: { name:'Heritage Colonial Suite',  type:'Heritage Suite', price:460, size:'70 m²', guests:'2 Adults',   bed:'Four-Poster',    view:'Garden' },
  5: { name:'Beachfront Paradise Villa',type:'Beach Villa',    price:680, size:'120 m²',guests:'4 Adults',   bed:'King + Twin',    view:'Beach'  },
  6: { name:'Presidential Penthouse',   type:'Penthouse',      price:980, size:'180 m²',guests:'6 Adults',   bed:'King Panoramic', view:'360°'   },
};

/* ── Load room from URL param ── */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('room')) || 2;
  const room = ROOMS[id] || ROOMS[2];

  // Populate
  document.getElementById('rdTitle')?.setAttribute('textContent', room.name) ||
    (document.getElementById('rdTitle').textContent = room.name);
  document.getElementById('rdType').textContent   = room.type;
  document.getElementById('rdSize').textContent   = room.size;
  document.getElementById('rdGuests').textContent = room.guests;
  document.getElementById('rdBed').textContent    = room.bed;
  document.getElementById('rdView').textContent   = room.view;
  document.getElementById('bpPrice').textContent  = '$' + room.price;
  document.getElementById('breadcrumbName').textContent = room.name;
  document.title = room.name + ' — Serendib Grand Hotel';

  // Dates
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const d1 = new Date(today); d1.setDate(d1.getDate() + 1);
  const d2 = new Date(today); d2.setDate(d2.getDate() + 4);
  const ci = document.getElementById('bpCheckin');
  const co = document.getElementById('bpCheckout');
  if (ci) { ci.value = fmt(d1); ci.min = fmt(today); ci.addEventListener('change', updateSummary); }
  if (co) { co.value = fmt(d2); co.addEventListener('change', updateSummary); }

  updateSummary();
  initSlider();
  buildDots();
});

/* ── Slider ── */
let currentSlide = 0;
const TOTAL_SLIDES = 5;

function initSlider() {
  buildDots();
  updateSlider();
}

function buildDots() {
  const dotsEl = document.getElementById('sliderDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsEl.appendChild(dot);
  }
}

function updateSlider() {
  const track = document.getElementById('sliderTrack');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Counter
  const counter = document.getElementById('sliderCounter');
  if (counter) counter.textContent = `${currentSlide + 1} / ${TOTAL_SLIDES}`;

  // Dots
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });

  // Thumbs
  document.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentSlide);
  });
}

function slideMove(dir) {
  currentSlide = (currentSlide + dir + TOTAL_SLIDES) % TOTAL_SLIDES;
  updateSlider();
}

function goToSlide(i) {
  currentSlide = i;
  updateSlider();
}

/* Auto-play */
let autoplay = setInterval(() => slideMove(1), 5000);
document.getElementById('rdSlider')?.addEventListener('mouseenter', () => clearInterval(autoplay));
document.getElementById('rdSlider')?.addEventListener('mouseleave', () => {
  autoplay = setInterval(() => slideMove(1), 5000);
});

/* Touch/swipe */
let touchStartX = 0;
document.getElementById('rdSlider')?.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('rdSlider')?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) slideMove(diff > 0 ? 1 : -1);
});

/* Keyboard */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  slideMove(-1);
  if (e.key === 'ArrowRight') slideMove(1);
});

/* ── Booking Calculator ── */
function calculateStay() {
  const checkin  = document.getElementById('bpCheckin')?.value;
  const checkout = document.getElementById('bpCheckout')?.value;

  if (!checkin || !checkout) {
    alert('Please select check-in and check-out dates.');
    return;
  }

  updateSummary();

  const summary = document.getElementById('bpSummary');
  if (summary) {
    summary.style.display = 'flex';
    summary.style.flexDirection = 'column';
    summary.style.animation = 'fadeIn 0.4s ease';
  }

  const btn = document.querySelector('.bp-reserve-btn');
  if (btn) {
    btn.textContent = 'Confirm Reservation';
    btn.style.background = '#4caf82';
    btn.onclick = confirmReservation;
  }
}

function updateSummary() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('room')) || 2;
  const room = ROOMS[id] || ROOMS[2];

  const checkin  = document.getElementById('bpCheckin')?.value;
  const checkout = document.getElementById('bpCheckout')?.value;
  if (!checkin || !checkout) return;

  const inDate  = new Date(checkin);
  const outDate = new Date(checkout);
  if (outDate <= inDate) return;

  const nights   = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
  const subtotal = nights * room.price;
  const tax      = Math.round(subtotal * 0.12);
  const total    = subtotal + tax;

  const el = id => document.getElementById(id);
  if (el('bpNightsLabel')) el('bpNightsLabel').textContent = `${nights} night${nights > 1 ? 's' : ''} × $${room.price}`;
  if (el('bpSubtotal'))    el('bpSubtotal').textContent    = `$${subtotal.toLocaleString()}`;
  if (el('bpTax'))         el('bpTax').textContent         = `$${tax.toLocaleString()}`;
  if (el('bpTotal'))       el('bpTotal').textContent       = `$${total.toLocaleString()}`;

  const summary = document.getElementById('bpSummary');
  if (summary) summary.style.display = 'flex';
}

function confirmReservation() {
  alert('Thank you! Your reservation request has been received.\nOur team will contact you within 2 hours to confirm.');
}

/* @keyframes fadeIn needed globally */
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
