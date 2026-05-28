// ===== ADMIN PANEL LOGIC =====

// ===== TAB NAVIGATION =====
document.querySelectorAll('.sidebar__link[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sidebar__link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    refreshCurrentTab(btn.dataset.tab);
  });
});

function refreshCurrentTab(tab) {
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'products')  renderProducts();
  if (tab === 'orders')    renderOrders();
  if (tab === 'contacts')  renderContacts();
}

// ===== DASHBOARD =====
function renderDashboard() {
  const s = KagmaDB.getStats();
  document.getElementById('statProducts').textContent = s.totalProducts;
  document.getElementById('statOrders').textContent = s.totalOrders;
  document.getElementById('statNewOrders').textContent = s.newOrders;
  document.getElementById('statUnread').textContent = s.unreadContacts;
  updateBadges(s);

  const orders = KagmaDB.getOrders().slice(0, 5);
  const tbody = document.getElementById('dashRecentOrders');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--admin-muted);padding:40px">Замовлень поки немає</td></tr>';
  } else {
    tbody.innerHTML = orders.map(o => `<tr>
      <td>${esc(o.name)}</td>
      <td>${esc(o.product)}</td>
      <td>${esc(o.phone)}</td>
      <td><span class="status status--${o.status}">${statusLabel(o.status)}</span></td>
      <td>${fmtDate(o.created_at)}</td>
    </tr>`).join('');
  }
}

// ===== PRODUCTS =====
function renderProducts() {
  const products = KagmaDB.getProducts();
  const tbody = document.getElementById('productsTableBody');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--admin-muted);padding:40px">Немає продуктів</td></tr>';
    return;
  }
  tbody.innerHTML = products.map(p => `<tr>
    <td><strong>${esc(p.name)}</strong><br><small style="color:var(--admin-muted)">${esc(p.desc).slice(0, 60)}...</small></td>
    <td>${esc(p.cat)}</td>
    <td>${(p.variants || []).join(', ')}</td>
    <td>${p.badge ? `<span class="status status--new">${esc(p.badge)}</span>` : '—'}</td>
    <td>
      <button class="admin-btn admin-btn--ghost admin-btn--sm" onclick="editProduct('${p.id}')">Редагувати</button>
      <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="deleteProduct('${p.id}')">Видалити</button>
    </td>
  </tr>`).join('');
}

// ===== ORDERS =====
function renderOrders() {
  const orders = KagmaDB.getOrders();
  const tbody = document.getElementById('ordersTableBody');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--admin-muted);padding:40px">Замовлень поки немає</td></tr>';
    return;
  }
  tbody.innerHTML = orders.map(o => `<tr>
    <td><strong>${esc(o.name)}</strong></td>
    <td>${esc(o.product)}</td>
    <td>${esc(o.phone)}</td>
    <td>${esc(o.comment || '—')}</td>
    <td>
      <select onchange="changeOrderStatus('${o.id}', this.value)" style="background:var(--admin-bg);color:var(--admin-text);border:1px solid var(--admin-border);border-radius:6px;padding:4px 8px;font-size:12px">
        <option value="new" ${o.status==='new'?'selected':''}>Новий</option>
        <option value="processing" ${o.status==='processing'?'selected':''}>В обробці</option>
        <option value="done" ${o.status==='done'?'selected':''}>Виконано</option>
      </select>
    </td>
    <td>${fmtDate(o.created_at)}</td>
    <td><button class="admin-btn admin-btn--danger admin-btn--sm" onclick="deleteOrderAdmin('${o.id}')">Видалити</button></td>
  </tr>`).join('');
}

// ===== CONTACTS =====
function renderContacts() {
  const contacts = KagmaDB.getContacts();
  const tbody = document.getElementById('contactsTableBody');
  if (contacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--admin-muted);padding:40px">Звернень поки немає</td></tr>';
    return;
  }
  tbody.innerHTML = contacts.map(c => `<tr style="${!c.read ? 'background:rgba(231,76,60,0.03)' : ''}">
    <td><strong>${esc(c.name)}</strong></td>
    <td>${esc(c.email)}</td>
    <td>${esc(c.phone || '—')}</td>
    <td style="max-width:300px">${esc(c.message)}</td>
    <td><span class="status status--${c.read ? 'read' : 'unread'}">${c.read ? 'Прочитано' : 'Нове'}</span></td>
    <td>${fmtDate(c.created_at)}</td>
    <td>
      ${!c.read ? `<button class="admin-btn admin-btn--ghost admin-btn--sm" onclick="markRead('${c.id}')">Прочитано</button>` : ''}
      <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="deleteContactAdmin('${c.id}')">Видалити</button>
    </td>
  </tr>`).join('');
}

// ===== PRODUCT MODAL =====
function openProductModal(product) {
  const modal = document.getElementById('productModal');
  document.getElementById('productModalTitle').textContent = product ? 'Редагувати продукт' : 'Додати продукт';
  document.getElementById('pf_id').value = product ? product.id : '';
  document.getElementById('pf_name').value = product ? product.name : '';
  document.getElementById('pf_cat').value = product ? product.cat : '';
  document.getElementById('pf_category').value = product ? product.category : 'fermented';
  document.getElementById('pf_visual').value = product ? product.visual : 'photo';
  document.getElementById('pf_desc').value = product ? product.desc : '';
  document.getElementById('pf_variants').value = product ? (product.variants || []).join(', ') : '';
  document.getElementById('pf_badge').value = product ? (product.badge || '') : '';
  document.getElementById('pf_benefits').value = product ? (product.benefits || []).join('\n') : '';
  document.getElementById('pf_composition').value = product ? (product.composition || '') : '';
  document.getElementById('pf_shelf').value = product ? (product.shelf_life || '') : '';
  document.getElementById('pf_storage').value = product ? (product.storage || '') : '';
  document.getElementById('pf_image').value = product ? (product.image || '') : '';
  modal.classList.add('open');
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
}

function editProduct(id) {
  const p = KagmaDB.getProduct(id);
  if (p) openProductModal(p);
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('pf_id').value;
  const data = {
    name: document.getElementById('pf_name').value.trim(),
    cat: document.getElementById('pf_cat').value.trim(),
    category: document.getElementById('pf_category').value,
    visual: document.getElementById('pf_visual').value,
    desc: document.getElementById('pf_desc').value.trim(),
    variants: document.getElementById('pf_variants').value.split(',').map(v => v.trim()).filter(Boolean),
    badge: document.getElementById('pf_badge').value.trim(),
    benefits: document.getElementById('pf_benefits').value.split('\n').map(b => b.trim()).filter(Boolean),
    composition: document.getElementById('pf_composition').value.trim(),
    shelf_life: document.getElementById('pf_shelf').value.trim(),
    storage: document.getElementById('pf_storage').value.trim(),
    image: document.getElementById('pf_image').value.trim()
  };

  if (id) {
    KagmaDB.updateProduct(id, data);
  } else {
    data.sort = KagmaDB.getProducts().length;
    KagmaDB.addProduct(data);
  }

  closeProductModal();
  renderProducts();
  renderDashboard();
}

function deleteProduct(id) {
  if (confirm('Видалити цей продукт?')) {
    KagmaDB.deleteProduct(id);
    renderProducts();
    renderDashboard();
  }
}

// ===== ORDER ACTIONS =====
function changeOrderStatus(id, status) {
  KagmaDB.updateOrderStatus(id, status);
  renderDashboard();
}

function deleteOrderAdmin(id) {
  if (confirm('Видалити це замовлення?')) {
    KagmaDB.deleteOrder(id);
    renderOrders();
    renderDashboard();
  }
}

// ===== CONTACT ACTIONS =====
function markRead(id) {
  KagmaDB.markContactRead(id);
  renderContacts();
  renderDashboard();
}

function deleteContactAdmin(id) {
  if (confirm('Видалити це звернення?')) {
    KagmaDB.deleteContact(id);
    renderContacts();
    renderDashboard();
  }
}

// ===== HELPERS =====
function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function statusLabel(s) {
  const map = { new: 'Новий', processing: 'В обробці', done: 'Виконано' };
  return map[s] || s;
}

function updateBadges(stats) {
  const ob = document.getElementById('ordersBadge');
  const cb = document.getElementById('contactsBadge');
  if (stats.newOrders > 0) { ob.textContent = stats.newOrders; ob.style.display = 'inline'; }
  else { ob.style.display = 'none'; }
  if (stats.unreadContacts > 0) { cb.textContent = stats.unreadContacts; cb.style.display = 'inline'; }
  else { cb.style.display = 'none'; }
}

// Close modal on overlay click
document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeProductModal();
});

// ===== INIT =====
renderDashboard();
