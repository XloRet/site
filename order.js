// ===== ORDER & CART (with API) =====
const orderModal = document.getElementById('orderModal');
const modalProduct = document.getElementById('modalProduct');
const modalClose = document.getElementById('modalClose');
const orderForm = document.getElementById('orderForm');
const orderSuccess = document.getElementById('orderSuccess');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const cartPanelClose = document.getElementById('cartPanelClose');
const cartList = document.getElementById('cartList');
const cartEmpty = document.getElementById('cartEmpty');

// Load existing orders count from DB asynchronously
async function updateCartCount() {
  try {
    const orders = await KagmaDB.getOrders();
    if (orders.length > 0) {
      cartCount.textContent = orders.length;
      cartCount.style.display = 'flex';
    } else {
      cartCount.style.display = 'none';
    }
  } catch (err) {
    console.error('Failed to load cart count:', err);
  }
}

// Initial load
updateCartCount();

function openOrder(productName) {
  modalProduct.textContent = productName;
  orderForm.style.display = 'flex';
  orderSuccess.style.display = 'none';
  orderForm.reset();
  const submitBtn = orderForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Надіслати заявку';
  submitBtn.disabled = false;
  orderModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrder() {
  orderModal.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== CART PANEL =====
async function openCart() {
  cartPanel.classList.add('open');
  document.body.style.overflow = 'hidden';
  await renderCartList();
}

function closeCart() {
  cartPanel.classList.remove('open');
  document.body.style.overflow = '';
}

async function renderCartList() {
  try {
    cartList.innerHTML = '<p style="padding:20px;text-align:center;">Завантаження...</p>';
    cartEmpty.style.display = 'none';
    const orders = await KagmaDB.getOrders();
    if (orders.length === 0) {
      cartEmpty.style.display = 'block';
      cartList.innerHTML = '';
    } else {
      cartEmpty.style.display = 'none';
      cartList.innerHTML = orders.map(o =>
        `<div class="cart-item">
          <div class="cart-item__info">
            <strong>${o.product}</strong>
            <span>${o.name} · ${o.phone}</span>
          </div>
          <span class="cart-item__status">Відправлено</span>
        </div>`
      ).join('');
    }
  } catch(err) {
    cartList.innerHTML = '<p style="padding:20px;text-align:center;color:red;">Помилка завантаження</p>';
  }
}

// Event listeners
cartBtn.addEventListener('click', openCart);
cartPanelClose.addEventListener('click', closeCart);
cartPanel.addEventListener('click', (e) => { if (e.target === cartPanel) closeCart(); });

modalClose.addEventListener('click', closeOrder);
orderModal.addEventListener('click', (e) => { if (e.target === orderModal) closeOrder(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeOrder(); closeCart(); }
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = orderForm.querySelector('button[type="submit"]');
  btn.textContent = 'Надсилаємо...';
  btn.disabled = true;
  const product = document.getElementById('modalProduct').textContent;
  const name = document.getElementById('oName').value;
  const phone = document.getElementById('oPhone').value;
  const comment = document.getElementById('oComment') ? document.getElementById('oComment').value : '';

  try {
    await KagmaDB.addOrder({ product, name, phone, comment });
    
    orderForm.style.display = 'none';
    orderSuccess.style.display = 'block';
    
    await updateCartCount();
    
    setTimeout(closeOrder, 2500);
  } catch(err) {
    console.error('Failed to submit order:', err);
    btn.textContent = 'Помилка. Спробуйте ще';
    btn.disabled = false;
  }
});
