// ===== KAGMA DATABASE (localStorage) =====
const KagmaDB = {
  // ===== INIT =====
  init() {
    if (!localStorage.getItem('kagma_products')) {
      localStorage.setItem('kagma_products', JSON.stringify(KagmaDB.defaultProducts()));
    }
    if (!localStorage.getItem('kagma_orders')) {
      localStorage.setItem('kagma_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('kagma_contacts')) {
      localStorage.setItem('kagma_contacts', JSON.stringify([]));
    }
  },

  // ===== PRODUCTS CRUD =====
  getProducts() {
    return JSON.parse(localStorage.getItem('kagma_products') || '[]');
  },

  getProduct(id) {
    return this.getProducts().find(p => p.id === id) || null;
  },

  saveProducts(products) {
    localStorage.setItem('kagma_products', JSON.stringify(products));
  },

  addProduct(product) {
    const products = this.getProducts();
    product.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    product.created_at = new Date().toISOString();
    product.updated_at = product.created_at;
    products.push(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(id, updates) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates, updated_at: new Date().toISOString() };
    this.saveProducts(products);
    return products[idx];
  },

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  },

  // ===== ORDERS =====
  getOrders() {
    return JSON.parse(localStorage.getItem('kagma_orders') || '[]');
  },

  addOrder(order) {
    const orders = this.getOrders();
    order.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    order.status = 'new';
    order.created_at = new Date().toISOString();
    orders.unshift(order);
    localStorage.setItem('kagma_orders', JSON.stringify(orders));
    return order;
  },

  updateOrderStatus(id, status) {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem('kagma_orders', JSON.stringify(orders));
    }
  },

  deleteOrder(id) {
    const orders = this.getOrders().filter(o => o.id !== id);
    localStorage.setItem('kagma_orders', JSON.stringify(orders));
  },

  // ===== CONTACTS =====
  getContacts() {
    return JSON.parse(localStorage.getItem('kagma_contacts') || '[]');
  },

  addContact(contact) {
    const contacts = this.getContacts();
    contact.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    contact.created_at = new Date().toISOString();
    contact.read = false;
    contacts.unshift(contact);
    localStorage.setItem('kagma_contacts', JSON.stringify(contacts));
    return contact;
  },

  markContactRead(id) {
    const contacts = this.getContacts();
    const idx = contacts.findIndex(c => c.id === id);
    if (idx !== -1) {
      contacts[idx].read = true;
      localStorage.setItem('kagma_contacts', JSON.stringify(contacts));
    }
  },

  deleteContact(id) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    localStorage.setItem('kagma_contacts', JSON.stringify(contacts));
  },

  // ===== STATS =====
  getStats() {
    return {
      totalProducts: this.getProducts().length,
      totalOrders: this.getOrders().length,
      newOrders: this.getOrders().filter(o => o.status === 'new').length,
      totalContacts: this.getContacts().length,
      unreadContacts: this.getContacts().filter(c => !c.read).length
    };
  },

  // ===== DEFAULT DATA =====
  defaultProducts() {
    return [
      {
        id: 'kefir', name: 'Кефір', cat: 'Кисломолочні', category: 'fermented',
        desc: 'Класичний кефір з живими лактобактеріями. Корисний для травлення та імунітету.',
        benefits: ['Покращує роботу шлунково-кишкового тракту', 'Зміцнює імунітет', 'Джерело кальцію та білка', 'Містить живі пробіотики', 'Без консервантів і барвників'],
        composition: 'Молоко коров\'яче пастеризоване, закваска кефірна (кефірні грибки). Без ГМО.',
        shelf_life: '14 діб', storage: 'від +2°C до +6°C',
        variants: ['2.5%', '3.2%'], visual: 'photo', badge: '',
        image: 'media/кефір_фото.png', sort: 0
      },
      {
        id: 'symbiomax', name: 'Симбіомакс', cat: 'Пробіотики', category: 'probiotic',
        desc: 'Унікальний симбіотичний продукт нового покоління. Комплекс пробіотиків та пребіотиків.',
        benefits: ['Комплексна підтримка мікрофлори', 'Пробіотики + пребіотики в одному продукті', 'Клінічно підтверджена ефективність', 'Покращує засвоєння поживних речовин', 'Підходить для щоденного вживання'],
        composition: 'Молоко знежирене, інулін (пребіотик), закваски Lactobacillus acidophilus, Bifidobacterium lactis. Без ГМО.',
        shelf_life: '21 доба', storage: 'від +2°C до +6°C',
        variants: ['Пробіотик', 'Пребіотик'], visual: 'symbio', badge: 'Флагман',
        image: '', sort: 1
      },
      {
        id: 'yogurt', name: 'Йогурт', cat: 'Кисломолочні', category: 'fermented',
        desc: 'Натуральний йогурт без консервантів і штучних барвників. Ніжний смак для всієї родини.',
        benefits: ['Натуральний склад без добавок', 'Ніжна кремова текстура', 'Підходить для дітей від 3 років', 'Джерело кальцію та вітаміну D', 'Без ГМО та пальмової олії'],
        composition: 'Молоко незбиране, вершки, закваска йогуртова (Streptococcus thermophilus, Lactobacillus bulgaricus).',
        shelf_life: '21 доба', storage: 'від +2°C до +6°C',
        variants: ['Натуральний', 'Без ГМО'], visual: 'yogurt', badge: '',
        image: '', sort: 2
      },
      {
        id: 'milk', name: 'Молоко', cat: 'Незбиране молоко', category: 'fresh',
        desc: 'Свіже пастеризоване молоко найвищої якості. Джерело кальцію та вітамінів.',
        benefits: ['Пастеризоване при низькій температурі', 'Зберігає природний смак', 'Джерело кальцію, фосфору та вітамінів', 'Від перевірених місцевих ферм', 'Без антибіотиків та гормонів'],
        composition: 'Молоко коров\'яче незбиране пастеризоване. Без добавок та консервантів.',
        shelf_life: '5 діб', storage: 'від +2°C до +6°C',
        variants: ['2.5%', '3.2%', '6%'], visual: 'milk', badge: '',
        image: '', sort: 3
      },
      {
        id: 'ryazhanka', name: 'Ряжанка', cat: 'Кисломолочні', category: 'fermented',
        desc: 'Традиційна українська ряжанка з топленого молока. Ніжний карамельний смак.',
        benefits: ['Виготовлена з топленого молока', 'Традиційний українській рецепт', 'Ніжний карамельний присмак', 'Багата на кальцій та фосфор', 'Без консервантів'],
        composition: 'Молоко коров\'яче топлене, закваска (Streptococcus thermophilus, Lactobacillus bulgaricus).',
        shelf_life: '14 діб', storage: 'від +2°C до +6°C',
        variants: ['4%'], visual: 'ryazh', badge: '',
        image: '', sort: 4
      },
      {
        id: 'butter', name: 'Масло вершкове', cat: 'Масло', category: 'butter',
        desc: 'Натуральне вершкове масло з найвищим вмістом жиру. Справжній вершковий смак.',
        benefits: ['Виготовлено з якісних вершків', 'Без рослинних жирів та замінників', 'Насичений вершковий аромат', 'Ідеальне для випічки та кулінарії', 'Без барвників і консервантів'],
        composition: 'Вершки з коров\'ячого молока. Жирність не менше 82.5%. Без добавок.',
        shelf_life: '30 діб', storage: 'від -6°C до +6°C',
        variants: ['72.5%', '82.5%'], visual: 'butter', badge: '',
        image: '', sort: 5
      },
      {
        id: 'cottage', name: 'Сир кисломолочний', cat: 'Свіжі сири', category: 'fresh',
        desc: 'Ніжний сир із вмістом білка. Ідеальний для сирників, запіканок та дитячого харчування.',
        benefits: ['Високий вміст білка', 'Ніжна однорідна текстура', 'Підходить для дитячого харчування', 'Ідеальний для сирників і запіканок', 'Без загусників і крохмалю'],
        composition: 'Молоко знежирене, вершки. Без стабілізаторів та консервантів.',
        shelf_life: '7 діб', storage: 'від +2°C до +6°C',
        variants: ['5%', '9%', '18%'], visual: 'cottage', badge: '',
        image: '', sort: 6
      },
      {
        id: 'smetana', name: 'Сметана', cat: 'Кисломолочні', category: 'fermented',
        desc: 'Густа натуральна сметана. Чудово підходить для заправки страв та соусів.',
        benefits: ['Густа однорідна консистенція', 'Натуральний кисломолочний смак', 'Без рослинних жирів', 'Ідеальна для заправок і соусів', 'Без крохмалю та загусників'],
        composition: 'Вершки з коров\'ячого молока, закваска сметанна.',
        shelf_life: '14 діб', storage: 'від +2°C до +6°C',
        variants: ['15%', '20%', '25%'], visual: 'sour', badge: '',
        image: '', sort: 7
      },
      {
        id: 'cultures', name: 'Закваски', cat: 'Заквашувальні культури', category: 'cultures',
        desc: 'Заквашувальні культури для домашнього та промислового виробництва власних лабораторій.',
        benefits: ['Розроблені власною науковою лабораторією', 'Висока концентрація живих культур', 'Стабільний результат', 'Підходить для домашнього та промислового використання', 'Широкий асортимент штамів'],
        composition: 'Живі культури молочнокислих бактерій. Без наповнювачів та добавок.',
        shelf_life: '12 місяців (заморожені)', storage: 'від -18°C до -6°C',
        variants: ['Кефір', 'Йогурт', 'Ряжанка'], visual: 'cultures', badge: '',
        image: '', sort: 8
      }
    ];
  },

  // ===== RESET =====
  resetToDefaults() {
    localStorage.setItem('kagma_products', JSON.stringify(this.defaultProducts()));
    localStorage.removeItem('kagma_orders');
    localStorage.removeItem('kagma_contacts');
    this.init();
  }
};

// Auto-init
KagmaDB.init();
