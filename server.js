const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database', err.message);
  else console.log('Connected to SQLite database.');
});

// Initialize tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT, cat TEXT, category TEXT, desc TEXT, benefits TEXT,
    composition TEXT, shelf_life TEXT, storage TEXT, variants TEXT,
    visual TEXT, badge TEXT, image TEXT, sort INTEGER,
    created_at TEXT, updated_at TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    product TEXT, name TEXT, phone TEXT, comment TEXT,
    status TEXT, created_at TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT, email TEXT, phone TEXT, message TEXT,
    read INTEGER DEFAULT 0, created_at TEXT
  )`);

  // Seed default products if empty
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (row && row.count === 0) {
      const defaultProducts = [
        {
          id: 'kefir', name: 'Кефір', cat: 'Кисломолочні', category: 'fermented',
          desc: 'Класичний кефір з живими лактобактеріями. Корисний для травлення та імунітету.',
          benefits: 'Покращує роботу шлунково-кишкового тракту|Зміцнює імунітет|Джерело кальцію та білка|Містить живі пробіотики|Без консервантів і барвників',
          composition: 'Молоко коров\'яче пастеризоване, закваска кефірна (кефірні грибки). Без ГМО.',
          shelf_life: '14 діб', storage: 'від +2°C до +6°C',
          variants: '2.5%|3.2%', visual: 'photo', badge: '',
          image: 'media/кефір_фото.png', sort: 0
        },
        {
          id: 'symbiomax', name: 'Симбіомакс', cat: 'Пробіотики', category: 'probiotic',
          desc: 'Унікальний симбіотичний продукт нового покоління. Комплекс пробіотиків та пребіотиків.',
          benefits: 'Комплексна підтримка мікрофлори|Пробіотики + пребіотики в одному продукті|Клінічно підтверджена ефективність|Покращує засвоєння поживних речовин|Підходить для щоденного вживання',
          composition: 'Молоко знежирене, інулін (пребіотик), закваски Lactobacillus acidophilus, Bifidobacterium lactis. Без ГМО.',
          shelf_life: '21 доба', storage: 'від +2°C до +6°C',
          variants: 'Пробіотик|Пребіотик', visual: 'symbio', badge: 'Флагман',
          image: '', sort: 1
        },
        {
          id: 'yogurt', name: 'Йогурт', cat: 'Кисломолочні', category: 'fermented',
          desc: 'Натуральний йогурт без консервантів і штучних барвників. Ніжний смак для всієї родини.',
          benefits: 'Натуральний склад без добавок|Ніжна кремова текстура|Підходить для дітей від 3 років|Джерело кальцію та вітаміну D|Без ГМО та пальмової олії',
          composition: 'Молоко незбиране, вершки, закваска йогуртова (Streptococcus thermophilus, Lactobacillus bulgaricus).',
          shelf_life: '21 доба', storage: 'від +2°C до +6°C',
          variants: 'Натуральний|Без ГМО', visual: 'yogurt', badge: '',
          image: '', sort: 2
        },
        {
          id: 'milk', name: 'Молоко', cat: 'Незбиране молоко', category: 'fresh',
          desc: 'Свіже пастеризоване молоко найвищої якості. Джерело кальцію та вітамінів.',
          benefits: 'Пастеризоване при низькій температурі|Зберігає природний смак|Джерело кальцію, фосфору та вітамінів|Від перевірених місцевих ферм|Без антибіотиків та гормонів',
          composition: 'Молоко коров\'яче незбиране пастеризоване. Без добавок та консервантів.',
          shelf_life: '5 діб', storage: 'від +2°C до +6°C',
          variants: '2.5%|3.2%|6%', visual: 'milk', badge: '',
          image: '', sort: 3
        },
        {
          id: 'ryazhanka', name: 'Ряжанка', cat: 'Кисломолочні', category: 'fermented',
          desc: 'Традиційна українська ряжанка з топленого молока. Ніжний карамельний смак.',
          benefits: 'Виготовлена з топленого молока|Традиційний українській рецепт|Ніжний карамельний присмак|Багата на кальцій та фосфор|Без консервантів',
          composition: 'Молоко коров\'яче топлене, закваска (Streptococcus thermophilus, Lactobacillus bulgaricus).',
          shelf_life: '14 діб', storage: 'від +2°C до +6°C',
          variants: '4%', visual: 'ryazh', badge: '',
          image: '', sort: 4
        },
        {
          id: 'butter', name: 'Масло вершкове', cat: 'Масло', category: 'butter',
          desc: 'Натуральне вершкове масло з найвищим вмістом жиру. Справжній вершковий смак.',
          benefits: 'Виготовлено з якісних вершків|Без рослинних жирів та замінників|Насичений вершковий аромат|Ідеальне для випічки та кулінарії|Без барвників і консервантів',
          composition: 'Вершки з коров\'ячого молока. Жирність не менше 82.5%. Без добавок.',
          shelf_life: '30 діб', storage: 'від -6°C до +6°C',
          variants: '72.5%|82.5%', visual: 'butter', badge: '',
          image: '', sort: 5
        },
        {
          id: 'cottage', name: 'Сир кисломолочний', cat: 'Свіжі сири', category: 'fresh',
          desc: 'Ніжний сир із вмістом білка. Ідеальний для сирників, запіканок та дитячого харчування.',
          benefits: 'Високий вміст білка|Ніжна однорідна текстура|Підходить для дитячого харчування|Ідеальний для сирників і запіканок|Без загусників і крохмалю',
          composition: 'Молоко знежирене, вершки. Без стабілізаторів та консервантів.',
          shelf_life: '7 діб', storage: 'від +2°C до +6°C',
          variants: '5%|9%|18%', visual: 'cottage', badge: '',
          image: '', sort: 6
        },
        {
          id: 'smetana', name: 'Сметана', cat: 'Кисломолочні', category: 'fermented',
          desc: 'Густа натуральна сметана. Чудово підходить для заправки страв та соусів.',
          benefits: 'Густа однорідна консистенція|Натуральний кисломолочний смак|Без рослинних жирів|Ідеальна для заправок і соусів|Без крохмалю та загусників',
          composition: 'Вершки з коров\'ячого молока, закваска сметанна.',
          shelf_life: '14 діб', storage: 'від +2°C до +6°C',
          variants: '15%|20%|25%', visual: 'sour', badge: '',
          image: '', sort: 7
        },
        {
          id: 'cultures', name: 'Закваски', cat: 'Заквашувальні культури', category: 'cultures',
          desc: 'Заквашувальні культури для домашнього та промислового виробництва власних лабораторій.',
          benefits: 'Розроблені власною науковою лабораторією|Висока концентрація живих культур|Стабільний результат|Підходить для домашнього та промислового використання|Широкий асортимент штамів',
          composition: 'Живі культури молочнокислих бактерій. Без наповнювачів та добавок.',
          shelf_life: '12 місяців (заморожені)', storage: 'від -18°C до -6°C',
          variants: 'Кефір|Йогурт|Ряжанка', visual: 'cultures', badge: '',
          image: '', sort: 8
        }
      ];
      
      const stmt = db.prepare('INSERT INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
      defaultProducts.forEach(p => {
        stmt.run(p.id, p.name, p.cat, p.category, p.desc, p.benefits, p.composition, p.shelf_life, p.storage, p.variants, p.visual, p.badge, p.image, p.sort, new Date().toISOString(), new Date().toISOString());
      });
      stmt.finalize();
      console.log('Database seeded with default products.');
    }
  });
});

// ===== API ENDPOINTS =====

// Helpers to parse lists stored as strings
const parseProduct = (row) => {
  if (!row) return null;
  return {
    ...row,
    benefits: row.benefits ? row.benefits.split('|') : [],
    variants: row.variants ? row.variants.split('|') : []
  };
};
const serializeList = (arr) => Array.isArray(arr) ? arr.join('|') : '';

// --- PRODUCTS ---
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY sort ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(parseProduct));
  });
});

app.post('/api/products', (req, res) => {
  const p = req.body;
  const id = Math.random().toString(36).slice(2, 10);
  const now = new Date().toISOString();
  db.run(`INSERT INTO products (id, name, cat, category, desc, benefits, composition, shelf_life, storage, variants, visual, badge, image, sort, created_at, updated_at) 
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, p.name, p.cat, p.category, p.desc, serializeList(p.benefits), p.composition, p.shelf_life, p.storage, serializeList(p.variants), p.visual, p.badge, p.image, p.sort || 0, now, now],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...p });
    });
});

app.put('/api/products/:id', (req, res) => {
  const p = req.body;
  const now = new Date().toISOString();
  db.run(`UPDATE products SET name=?, cat=?, category=?, desc=?, benefits=?, composition=?, shelf_life=?, storage=?, variants=?, visual=?, badge=?, image=?, updated_at=? WHERE id=?`,
    [p.name, p.cat, p.category, p.desc, serializeList(p.benefits), p.composition, p.shelf_life, p.storage, serializeList(p.variants), p.visual, p.badge, p.image, now, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: true });
    });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id=?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
});

// --- ORDERS ---
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/orders', (req, res) => {
  const o = req.body;
  const id = Math.random().toString(36).slice(2, 10);
  const now = new Date().toISOString();
  db.run('INSERT INTO orders (id, product, name, phone, comment, status, created_at) VALUES (?,?,?,?,?,?,?)',
    [id, o.product, o.name, o.phone, o.comment || '', 'new', now],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...o, status: 'new' });
    });
});

app.put('/api/orders/:id/status', (req, res) => {
  db.run('UPDATE orders SET status=? WHERE id=?', [req.body.status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
});

app.delete('/api/orders/:id', (req, res) => {
  db.run('DELETE FROM orders WHERE id=?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
});

// --- CONTACTS ---
app.get('/api/contacts', (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Convert read from INTEGER 0/1 to boolean false/true
    res.json(rows.map(r => ({ ...r, read: !!r.read })));
  });
});

app.post('/api/contacts', (req, res) => {
  const c = req.body;
  const id = Math.random().toString(36).slice(2, 10);
  const now = new Date().toISOString();
  db.run('INSERT INTO contacts (id, name, email, phone, message, read, created_at) VALUES (?,?,?,?,?,?,?)',
    [id, c.name, c.email, c.phone || '', c.message, 0, now],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...c, read: false });
    });
});

app.put('/api/contacts/:id/read', (req, res) => {
  db.run('UPDATE contacts SET read=1 WHERE id=?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: true });
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  db.run('DELETE FROM contacts WHERE id=?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: true });
  });
});

// --- STATS ---
app.get('/api/stats', (req, res) => {
  db.get('SELECT (SELECT COUNT(*) FROM products) as totalProducts, (SELECT COUNT(*) FROM orders) as totalOrders, (SELECT COUNT(*) FROM orders WHERE status="new") as newOrders, (SELECT COUNT(*) FROM contacts) as totalContacts, (SELECT COUNT(*) FROM contacts WHERE read=0) as unreadContacts', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// START SERVER
app.listen(port, () => {
  console.log(`Kagma API Server running at http://localhost:${port}`);
});
