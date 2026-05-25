/* ══════════════════════════════════════
   3 Diva's Lechon House — Main Script
   File: main.js
══════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   ✏️  EASY EDIT ZONE — Change prices & items here ONLY
   ════════════════════════════════════════════════════════
   To update a price: edit the "price" value (number only, no ₱)
   To add a row:      copy an object {}, paste it, fill in values
   To remove a row:   delete the entire { ... }, line
   ════════════════════════════════════════════════════════ */

const REGULAR_LECHON = [
  { price: 7000,  liveWeight: '15–18 kg',  cookedWeight: '7–9 kg',   pax: '15–20 pax'  },
  { price: 8000,  liveWeight: '20–24 kg',  cookedWeight: '10–11 kg', pax: '20–25 pax'  },
  { price: 9000,  liveWeight: '25–27 kg',  cookedWeight: '12–14 kg', pax: '30–35 pax'  },
  { price: 10000, liveWeight: '28–30 kg',  cookedWeight: '15–17 kg', pax: '40–45 pax'  },
  { price: 11000, liveWeight: '31–33 kg',  cookedWeight: '18–20 kg', pax: '50–55 pax'  },
  { price: 12000, liveWeight: '34–36 kg',  cookedWeight: '21–23 kg', pax: '60–65 pax'  },
  { price: 13000, liveWeight: '38–40 kg',  cookedWeight: '24–26 kg', pax: '70–75 pax'  },
  { price: 14000, liveWeight: '41–45 kg',  cookedWeight: '27–29 kg', pax: '80–85 pax'  },
  { price: 15000, liveWeight: '46–50 kg',  cookedWeight: '30–32 kg', pax: '90–95 pax'  },
];

const JUMBO_LECHON = [
  { price: 20000, liveWeight: '56–61 kg',  cookedWeight: '34–36 kg', pax: '105–110 pax' },
  { price: 25000, liveWeight: '62–67 kg',  cookedWeight: '38–40 kg', pax: '150–155 pax' },
];

/* ════════════════════════════════════════
   END OF EASY EDIT ZONE
   ════════════════════════════════════════ */


/* ── RENDER PRICE TABLES ── */
function formatPrice(n) {
  return '₱' + n.toLocaleString();
}

function renderTable(data, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = data.map((row) => `
    <tr>
      <td class="price-cell">${formatPrice(row.price)}</td>
      <td>${row.liveWeight}</td>
      <td>${row.cookedWeight}</td>
      <td>${row.pax}</td>
    </tr>
  `).join('');
}

renderTable(REGULAR_LECHON, 'regularTableBody');
renderTable(JUMBO_LECHON, 'jumboTableBody');


/* ── HEADER SHRINK ON SCROLL ── */
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('shrunk', window.scrollY > 60);
});


/* ── INTERSECTION OBSERVER (scroll reveal) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.tagName === 'TR'
        ? [...el.closest('tbody').querySelectorAll('tr')].indexOf(el) * 60
        : el.classList.contains('perk')
          ? [...document.querySelectorAll('.perk')].indexOf(el) * 120
          : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('tbody tr, .perk').forEach(el => {
  revealObserver.observe(el);
});


/* ── TOAST NOTIFICATION ── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}