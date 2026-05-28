// ===== PRODUCT DATA (from DB) =====
// Reads from KagmaDB (localStorage). Falls back to inline data if DB is empty.

function getProductsMap() {
  const dbProducts = KagmaDB.getProducts();
  const map = {};
  dbProducts.forEach(p => {
    map[p.name] = {
      cat: p.cat,
      desc: p.desc,
      benefits: p.benefits || [],
      composition: p.composition || '',
      shelf_life: p.shelf_life || '',
      storage: p.storage || '',
      variants: p.variants || []
    };
  });
  return map;
}

// PRODUCTS object — used by detail.js and order.js
const PRODUCTS = getProductsMap();

// Dynamic product grid rendering
function renderProductGrid() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  const dbProducts = KagmaDB.getProducts();
  grid.innerHTML = dbProducts.map(p => {
    const isPhoto = p.visual === 'photo' && p.image;
    const visualClass = isPhoto ? 'pc__visual--photo' : ('pc__visual--' + (p.visual || 'milk'));
    const visualContent = isPhoto
      ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
      : '';
    const badge = p.badge ? `<div class="pc__badge">${p.badge}</div>` : '';
    const variants = (p.variants || []).map(v => `<span>${v}</span>`).join('');
    const btnClass = p.visual === 'symbio' ? 'pc__btn pc__btn--dark' : 'pc__btn';

    return `<div class="pc" data-category="${p.category}" data-product="${p.name}" ${p.image ? 'data-image="'+p.image+'"' : ''}>
      ${badge}
      <div class="pc__visual ${visualClass}">${visualContent}</div>
      <div class="pc__body">
        <span class="pc__cat">${p.cat}</span>
        <h3 class="pc__name">${p.name}</h3>
        <p class="pc__desc">${p.desc}</p>
        <div class="pc__variants">${variants}</div>
        <button class="${btnClass}" onclick="event.stopPropagation(); openOrder('${p.name}')">Замовити</button>
      </div>
    </div>`;
  }).join('');

  // Re-bind card click → detail
  document.querySelectorAll('.pc').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.pc__btn')) return;
      const name = card.dataset.product;
      if (name && PRODUCTS[name]) openDetail(name);
    });
  });

  // Re-apply fade animation
  const fadeObserverCards = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserverCards.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.pc').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    fadeObserverCards.observe(el);
  });
}

// Render after all scripts are loaded (openDetail/openOrder defined in later files)
// Uses DOMContentLoaded fallback, but also callable manually
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderProductGrid);
} else {
  // Scripts at bottom of body — DOM ready, but defer to let other scripts parse
  setTimeout(renderProductGrid, 0);
}
