// ===== PRODUCT DETAIL MODAL =====
const detailModal = document.getElementById('detailModal');
const detailClose = document.getElementById('detailClose');
const detailOrderBtn = document.getElementById('detailOrderBtn');
let currentDetailProduct = '';
let activeTab = 'benefits';

function openDetail(productName) {
  const p = PRODUCTS[productName];
  if (!p) return;
  currentDetailProduct = productName;

  document.getElementById('detailCat').textContent = p.cat;
  document.getElementById('detailName').textContent = productName;
  document.getElementById('detailDesc').textContent = p.desc;

  // Photo from card's data-image attribute
  const card = document.querySelector(`.pc[data-product="${productName}"]`);
  const imgWrap = document.getElementById('detailImgWrap');
  const imgEl = document.getElementById('detailImg');
  const imgSrc = card ? card.dataset.image : '';
  if (imgSrc) {
    imgEl.src = imgSrc;
    imgEl.alt = productName;
    imgWrap.style.display = 'block';
  } else {
    imgWrap.style.display = 'none';
    imgEl.src = '';
  }

  // Variants
  const variantsEl = document.getElementById('detailVariants');
  variantsEl.innerHTML = p.variants.map(v => `<span class="detail-variant-tag">${v}</span>`).join('');

  // Tabs
  activeTab = 'benefits';
  document.querySelectorAll('.detail-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'benefits'));
  renderDetailTab(p, 'benefits');

  detailModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderDetailTab(p, tab) {
  const el = document.getElementById('detailTabContent');
  if (tab === 'benefits') {
    el.innerHTML = `<ul class="detail-benefits">${p.benefits.map(b => `<li class="detail-benefit-item">${b}</li>`).join('')}</ul>`;
  } else if (tab === 'composition') {
    el.innerHTML = `<p class="detail-composition">${p.composition}</p>`;
  } else if (tab === 'storage') {
    el.innerHTML = `<div class="detail-storage">
      <div class="detail-storage-item"><strong>Термін придатності</strong><span>${p.shelf_life}</span></div>
      <div class="detail-storage-item"><strong>Умови зберігання</strong><span>${p.storage}</span></div>
    </div>`;
  }
}

// Tab click handlers
document.querySelectorAll('.detail-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const p = PRODUCTS[currentDetailProduct];
    if (p) renderDetailTab(p, btn.dataset.tab);
  });
});

// Order from detail
detailOrderBtn.addEventListener('click', () => {
  detailModal.classList.remove('open');
  openOrder(currentDetailProduct);
});

// Close detail
detailClose.addEventListener('click', () => { detailModal.classList.remove('open'); document.body.style.overflow = ''; });
detailModal.addEventListener('click', (e) => { if (e.target === detailModal) { detailModal.classList.remove('open'); document.body.style.overflow = ''; } });

// Note: Card click → openDetail binding is in data.js:renderProductGrid()
