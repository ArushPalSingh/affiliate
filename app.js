// ============================================================
//  DELIVERYZONE — app.js
//  Products stored in localStorage for persistence
// ============================================================

const STORAGE_KEY = 'deliveryzone_products';

// ── SAMPLE PRODUCTS (pre-loaded if storage is empty) ────────
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    price: "$279.99",
    originalPrice: "$399.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    link: "#",
    description: "Industry-leading noise cancellation with 30-hour battery life and premium sound.",
    featured: true
  },
  {
    id: 2,
    name: "Ember Temperature Control Mug",
    category: "Home & Living",
    price: "$99.95",
    originalPrice: "$129.99",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    link: "#",
    description: "Keep your coffee at the perfect temperature all morning with smart controls.",
    featured: false
  },
  {
    id: 3,
    name: "Nike Air Zoom Pegasus 41",
    category: "Fashion",
    price: "$130.00",
    originalPrice: "",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    link: "#",
    description: "Responsive cushioning for everyday training runs with a breathable upper.",
    featured: false
  },
  {
    id: 4,
    name: "Anker 65W USB-C Charger",
    category: "Electronics",
    price: "$35.99",
    originalPrice: "$55.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600&q=80",
    link: "#",
    description: "Charge your laptop, phone and tablet simultaneously with one tiny adapter.",
    featured: false
  },
  {
    id: 5,
    name: "Moleskine Classic Notebook",
    category: "Stationery",
    price: "$22.99",
    originalPrice: "",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
    link: "#",
    description: "The iconic hard-cover notebook trusted by creatives and professionals worldwide.",
    featured: false
  },
  {
    id: 6,
    name: "Instant Pot Duo 7-in-1",
    category: "Home & Living",
    price: "$89.95",
    originalPrice: "$119.99",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    link: "#",
    description: "Pressure cook, slow cook, sauté, steam and more — all in one pot.",
    featured: false
  }
];

// ── STATE ────────────────────────────────────────────────────
let products = [];
let activeCategory = 'all';
let searchQuery = '';

// ── INIT ─────────────────────────────────────────────────────
function init() {
  const stored = localStorage.getItem(STORAGE_KEY);
  products = stored ? JSON.parse(stored) : [...SAMPLE_PRODUCTS];
  if (!stored) saveProducts();

  renderCategories();
  renderProducts();
  renderFeatured();
  animateCounter('productCount', products.length);
  bindEvents();
}

// ── SAVE ─────────────────────────────────────────────────────
function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ── STARS ─────────────────────────────────────────────────────
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '★'.repeat(full);
  if (half) stars += '½';
  stars += '☆'.repeat(5 - full - (half ? 1 : 0));
  return stars;
}

// ── DISCOUNT ─────────────────────────────────────────────────
function getDiscount(price, original) {
  if (!original) return null;
  const p = parseFloat(price.replace(/[^0-9.]/g, ''));
  const o = parseFloat(original.replace(/[^0-9.]/g, ''));
  if (!p || !o || o <= p) return null;
  return Math.round((1 - p / o) * 100) + '% OFF';
}

// ── CATEGORIES ───────────────────────────────────────────────
function getCategories() {
  const cats = [...new Set(products.map(p => p.category))].sort();
  return cats;
}

function renderCategories() {
  const container = document.getElementById('categoryFilters');
  const cats = getCategories();
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'cat-btn' + (activeCategory === 'all' ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.dataset.cat = 'all';
  container.appendChild(allBtn);

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn' + (activeCategory === cat ? ' active' : '');
    btn.textContent = cat;
    btn.dataset.cat = cat;
    container.appendChild(btn);
  });

  container.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      container.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });
}

// ── PRODUCTS ─────────────────────────────────────────────────
function getFilteredProducts() {
  return products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyState');
  const filtered = getFilteredProducts();

  grid.innerHTML = '';

  if (!filtered.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach((p, i) => {
    const discount = getDiscount(p.price, p.originalPrice);
    const card = document.createElement('div');
    card.className = 'card-wrap';
    card.style.animationDelay = `${i * 0.05}s`;

    card.innerHTML = `
      ${discount ? `<span class="card-badge">${discount}</span>` : ''}
      <div class="product-card">
        ${p.image
          ? `<img class="card-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          : ''}
        <div class="card-img-placeholder" style="${p.image ? 'display:none' : ''}">📦</div>
        <div class="card-body">
          <div class="card-category">${p.category}</div>
          <div class="card-name">${p.name}</div>
          ${p.description ? `<div class="card-desc">${p.description}</div>` : ''}
          <div class="card-rating">
            <span class="stars">${renderStars(p.rating)}</span>
            <span class="rating-num">${p.rating.toFixed(1)}</span>
          </div>
          <div class="card-footer">
            <div class="card-price">
              <span class="price-now">${p.price}</span>
              ${p.originalPrice ? `<span class="price-old">${p.originalPrice}</span>` : ''}
            </div>
            <a href="${p.link}" target="_blank" rel="noopener noreferrer sponsored" class="card-btn">Get Deal</a>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── FEATURED ─────────────────────────────────────────────────
function renderFeatured() {
  const featured = products.find(p => p.featured) || products[0];
  if (!featured) return;

  document.getElementById('featuredDesc').textContent = featured.description || '';
  const link = document.getElementById('featuredLink');
  link.href = featured.link;

  const card = document.getElementById('featuredCard');
  const discount = getDiscount(featured.price, featured.originalPrice);
  card.innerHTML = `
    <div style="position:relative">
      ${discount ? `<span class="card-badge">${discount}</span>` : ''}
      ${featured.image ? `<img class="card-img" src="${featured.image}" alt="${featured.name}" style="height:240px">` : '<div class="card-img-placeholder" style="height:240px">📦</div>'}
    </div>
    <div class="card-body">
      <div class="card-category">${featured.category}</div>
      <div class="card-name" style="font-size:1.2rem">${featured.name}</div>
      <div class="card-rating">
        <span class="stars">${renderStars(featured.rating)}</span>
        <span class="rating-num">${featured.rating.toFixed(1)}</span>
      </div>
      <div class="card-footer">
        <div class="card-price">
          <span class="price-now">${featured.price}</span>
          ${featured.originalPrice ? `<span class="price-old">${featured.originalPrice}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ── COUNTER ANIMATION ─────────────────────────────────────────
function animateCounter(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

// ── EVENTS ───────────────────────────────────────────────────
function bindEvents() {
  // Search
  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Modal
  document.getElementById('openModal').addEventListener('click', () => {
    document.getElementById('modalOverlay').classList.add('open');
  });
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });

  // Submit
  document.getElementById('submitProduct').addEventListener('click', () => {
    const name     = document.getElementById('pName').value.trim();
    const category = document.getElementById('pCategory').value.trim();
    const price    = document.getElementById('pPrice').value.trim();
    const original = document.getElementById('pOriginal').value.trim();
    const rating   = parseFloat(document.getElementById('pRating').value) || 4.0;
    const image    = document.getElementById('pImage').value.trim();
    const link     = document.getElementById('pLink').value.trim();
    const desc     = document.getElementById('pDesc').value.trim();
    const featured = document.getElementById('pFeatured').checked;

    if (!name || !category || !price || !link) {
      alert('Please fill in all required fields (Name, Category, Price, Affiliate Link).');
      return;
    }

    if (featured) products.forEach(p => p.featured = false);

    const newProduct = {
      id: Date.now(),
      name, category, price,
      originalPrice: original,
      rating: Math.min(5, Math.max(1, rating)),
      image, link,
      description: desc,
      featured
    };

    products.unshift(newProduct);
    saveProducts();
    renderCategories();
    renderProducts();
    renderFeatured();
    animateCounter('productCount', products.length);
    closeModal();
    clearForm();
  });
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}
function clearForm() {
  ['pName','pCategory','pPrice','pOriginal','pRating','pImage','pLink','pDesc'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('pFeatured').checked = false;
}

// ── START ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
