/* ══════════════════════════════════════
   3Diva's Lechon — Main Script
   File: main.js
   Linked in: index.html (bottom of <body>)
══════════════════════════════════════ */

/* ── HEADER SHRINK ON SCROLL ── */
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('shrunk', window.scrollY > 60);
});

/* ── INTERSECTION OBSERVER (scroll reveal) ──
   Adds .visible class to:
     - .product-card   → staggered per-card delay
     - tbody tr        → price table rows slide in
     - .stat           → about-section counters fade up
*/
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;

      const delay = el.classList.contains('product-card')
        ? [...document.querySelectorAll('.product-card')].indexOf(el) * 80
        : el.classList.contains('stat')
          ? [...document.querySelectorAll('.stat')].indexOf(el) * 120
          : 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.product-card, tbody tr, .stat').forEach(el => {
  revealObserver.observe(el);
});

/* ── CART STATE ── */
let cart = [];
let cartOpen = false;

/* Toggle cart panel open/close */
function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cartPanel').classList.toggle('open', cartOpen);
}

/* Add item to cart (or increment qty if already exists) */
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`Added: ${name}`);
}

/* Re-render cart panel contents and badge count */
function updateCartUI() {
  const countEl  = document.getElementById('cartCount');
  const itemsEl  = document.getElementById('cartItems');
  const totalEl  = document.getElementById('cartTotal');
  const totalAmt = document.getElementById('totalAmount');

  const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">No items yet. Tap + to add.</p>';
    totalEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(i =>
      `<div class="cart-item">
        <span>${i.qty}× ${i.name}</span>
        <span>₱${(i.qty * i.price).toLocaleString()}</span>
      </div>`
    ).join('');
    totalEl.style.display = 'flex';
    totalAmt.textContent = `₱${totalPrice.toLocaleString()}`;
  }
}

/* ── TOAST NOTIFICATION ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── CLOSE CART ON OUTSIDE CLICK ── */
document.addEventListener('click', e => {
  const float = document.getElementById('cartFloat');
  if (cartOpen && !float.contains(e.target)) {
    cartOpen = false;
    document.getElementById('cartPanel').classList.remove('open');
  }
});

/* ── TOUCH / POINTER PULSE ON PRODUCT CARDS ──
   Restarts the cardPulse CSS animation on every tap/click
   by toggling the animation property (forces a reflow).
*/
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('pointerdown', function () {
    this.style.animation = 'none';
    void this.offsetWidth; // trigger reflow so animation restarts
    this.style.animation = '';
  });
});