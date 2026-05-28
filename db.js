// ===== KAGMA DATABASE (API Client) =====
const API_BASE = '/api'; // Relative path, works because static files are served by the same Node server

const KagmaDB = {
  // ===== PRODUCTS CRUD =====
  async getProducts() {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },

  async addProduct(product) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async updateProduct(id, updates) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // ===== ORDERS =====
  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async addOrder(order) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // ===== CONTACTS =====
  async getContacts() {
    const res = await fetch(`${API_BASE}/contacts`);
    return res.json();
  },

  async addContact(contact) {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    });
    return res.json();
  },

  async markContactRead(id) {
    const res = await fetch(`${API_BASE}/contacts/${id}/read`, { method: 'PUT' });
    return res.json();
  },

  async deleteContact(id) {
    const res = await fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // ===== STATS =====
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  }
};
