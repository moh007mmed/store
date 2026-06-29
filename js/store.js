// ============================================================
// STORE APP - Main Logic
// ============================================================

let currentLang = localStorage.getItem('store_lang') || 'ar';
let currentView = 'grid';
let currentPage = 'home';

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
  renderHomeCats();
  renderFeaturedProducts();
  renderNewProducts();
  renderAllProducts();
  renderCategoriesFull();
  updateCartUI();
  animateStats();
  handleHashNav();
  populateFilterCats();
});

window.addEventListener('hashchange', handleHashNav);

function handleHashNav() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash, false);
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page, pushHash = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    currentPage = page;
    window.scrollTo(0, 0);
    if (pushHash) window.location.hash = page;
  }
  if (page === 'cart') renderCartPage();
  if (page === 'checkout') renderCheckoutPage();
  if (page === 'products') { applyFilters(); }
}

// ============================================================
// LANGUAGE
// ============================================================
function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('store_lang', currentLang);
  applyLang();
}

function applyLang() {
  const isAr = currentLang === 'ar';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.getElementById('langBtn').textContent = isAr ? 'EN' : 'AR';

  document.querySelectorAll('[data-ar]').forEach(el => {
    const val = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('[data-ar-placeholder]').forEach(el => {
    el.placeholder = isAr ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
  });
  document.querySelectorAll('[data-ar] option, select option[data-ar]').forEach(opt => {
    const val = isAr ? opt.getAttribute('data-ar') : opt.getAttribute('data-en');
    if (val) opt.textContent = val;
  });

  renderHomeCats();
  renderFeaturedProducts();
  renderNewProducts();
  renderAllProducts();
  renderCategoriesFull();
  updateCartUI();
}

function t(obj) {
  return currentLang === 'ar' ? (obj.name_ar || obj.name_en) : (obj.name_en || obj.name_ar);
}
function td(obj) {
  return currentLang === 'ar' ? (obj.desc_ar || obj.desc_en) : (obj.desc_en || obj.desc_ar);
}

// ============================================================
// PRODUCT CARD
// ============================================================
function productCard(p, size = 'normal') {
  const disc = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;
  const isWished = isInWishlist(p.id);
  return `
  <div class="product-card ${size === 'small' ? 'product-card-sm' : ''}" onclick="showProductDetail(${p.id})">
    <div class="product-img-wrap">
      <div class="product-img">${p.emoji}</div>
      ${p.featured ? `<span class="badge badge-featured" data-ar="مميز" data-en="Featured">${currentLang === 'ar' ? 'مميز' : 'Featured'}</span>` : ''}
      ${p.new ? `<span class="badge badge-new" data-ar="جديد" data-en="New">${currentLang === 'ar' ? 'جديد' : 'New'}</span>` : ''}
      ${disc > 0 ? `<span class="badge badge-sale">-${disc}%</span>` : ''}
      ${p.type === 'digital' ? `<span class="badge badge-digital">${currentLang === 'ar' ? '⬇ رقمي' : '⬇ Digital'}</span>` : ''}
      <button class="wish-btn ${isWished ? 'wished' : ''}" onclick="event.stopPropagation();wishlistToggle(${p.id},this)">♡</button>
    </div>
    <div class="product-info">
      <span class="product-cat">${getCatName(p.category_id)}</span>
      <h3 class="product-name">${t(p)}</h3>
      <div class="product-rating">
        <span class="stars">${starsHTML(p.rating)}</span>
        <span class="review-count">(${p.reviews})</span>
      </div>
      <div class="product-price">
        <span class="price-current">${STORE_CONFIG.currency_symbol}${p.price}</span>
        ${p.original_price ? `<span class="price-original">${STORE_CONFIG.currency_symbol}${p.original_price}</span>` : ''}
      </div>
      <button class="btn-add-cart" onclick="event.stopPropagation();quickAddToCart(${p.id})">
        ${currentLang === 'ar' ? '🛍 أضف للسلة' : '🛍 Add to Cart'}
      </button>
    </div>
  </div>`;
}

function starsHTML(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += i <= Math.floor(rating) ? '★' : (i - 0.5 <= rating ? '⭑' : '☆');
  }
  return s;
}

function getCatName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? t(cat) : '';
}

// ============================================================
// HOME RENDERS
// ============================================================
function renderHomeCats() {
  const el = document.getElementById('homeCats');
  if (!el) return;
  el.innerHTML = CATEGORIES.slice(0, 6).map(c => `
    <div class="cat-chip" onclick="filterByCategory(${c.id})" style="--cat-color:${c.color}">
      <span class="cat-icon">${c.icon}</span>
      <span class="cat-name">${t(c)}</span>
    </div>
  `).join('');
}

function renderFeaturedProducts() {
  const el = document.getElementById('featuredProducts');
  if (!el) return;
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  el.innerHTML = featured.map(p => productCard(p)).join('');
}

function renderNewProducts() {
  const el = document.getElementById('newProducts');
  if (!el) return;
  const newP = PRODUCTS.filter(p => p.new).slice(0, 4);
  el.innerHTML = newP.map(p => productCard(p)).join('');
}

// ============================================================
// ALL PRODUCTS + FILTERS
// ============================================================
function populateFilterCats() {
  const sel = document.getElementById('filterCat');
  if (!sel) return;
  CATEGORIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = t(c);
    opt.setAttribute('data-ar', c.name_ar);
    opt.setAttribute('data-en', c.name_en);
    sel.appendChild(opt);
  });
}

function renderAllProducts(list = null) {
  const el = document.getElementById('allProducts');
  const noEl = document.getElementById('noProducts');
  const countEl = document.getElementById('productsCount');
  if (!el) return;
  const products = list !== null ? list : PRODUCTS;
  if (products.length === 0) {
    el.innerHTML = '';
    if (noEl) noEl.classList.remove('hidden');
  } else {
    if (noEl) noEl.classList.add('hidden');
    el.innerHTML = products.map(p => productCard(p)).join('');
  }
  if (countEl) {
    countEl.textContent = currentLang === 'ar'
      ? `${products.length} منتج`
      : `${products.length} products`;
  }
}

function applyFilters() {
  const cat = document.getElementById('filterCat')?.value;
  const type = document.getElementById('filterType')?.value;
  const price = parseFloat(document.getElementById('filterPrice')?.value || 500);
  const sort = document.getElementById('filterSort')?.value;

  let filtered = [...PRODUCTS];
  if (cat) filtered = filtered.filter(p => p.category_id == cat);
  if (type) filtered = filtered.filter(p => p.type === type);
  filtered = filtered.filter(p => p.price <= price);

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);

  renderAllProducts(filtered);
}

function clearFilters() {
  document.getElementById('filterCat').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterPrice').value = 500;
  document.getElementById('priceVal').textContent = '500';
  document.getElementById('filterSort').value = 'default';
  applyFilters();
}

function filterByCategory(catId) {
  navigateTo('products');
  setTimeout(() => {
    document.getElementById('filterCat').value = catId;
    applyFilters();
  }, 100);
}

function searchProducts(query) {
  if (!query.trim()) {
    renderAllProducts();
    return;
  }
  const q = query.toLowerCase();
  const results = PRODUCTS.filter(p =>
    p.name_ar.toLowerCase().includes(q) ||
    p.name_en.toLowerCase().includes(q) ||
    p.desc_ar.toLowerCase().includes(q) ||
    (p.tags_ar && p.tags_ar.some(t => t.includes(q))) ||
    (p.tags_en && p.tags_en.some(t => t.toLowerCase().includes(q)))
  );
  navigateTo('products');
  setTimeout(() => renderAllProducts(results), 100);
}

function setView(v) {
  currentView = v;
  const grid = document.getElementById('allProducts');
  if (v === 'list') grid.classList.add('list-view');
  else grid.classList.remove('list-view');
  document.getElementById('viewGrid').classList.toggle('active', v === 'grid');
  document.getElementById('viewList').classList.toggle('active', v === 'list');
}

// ============================================================
// PRODUCT DETAIL
// ============================================================
function showProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const disc = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : 0;
  const cat = CATEGORIES.find(c => c.id === p.category_id);
  const related = PRODUCTS.filter(x => x.category_id === p.category_id && x.id !== id).slice(0, 4);

  document.getElementById('productDetailContent').innerHTML = `
    <div class="detail-layout">
      <div class="detail-gallery">
        <div class="detail-img-main">${p.emoji}</div>
      </div>
      <div class="detail-info">
        <div class="detail-breadcrumb">
          <span onclick="navigateTo('home')">${currentLang === 'ar' ? 'الرئيسية' : 'Home'}</span> /
          <span onclick="filterByCategory(${p.category_id})">${cat ? t(cat) : ''}</span>
        </div>
        ${disc > 0 ? `<span class="detail-discount">-${disc}% ${currentLang === 'ar' ? 'خصم' : 'OFF'}</span>` : ''}
        <h1 class="detail-title">${t(p)}</h1>
        <div class="detail-rating">
          <span class="stars">${starsHTML(p.rating)}</span>
          <span>${p.rating} (${p.reviews} ${currentLang === 'ar' ? 'تقييم' : 'reviews'})</span>
        </div>
        <div class="detail-price">
          <span class="price-big">${STORE_CONFIG.currency_symbol}${p.price}</span>
          ${p.original_price ? `<span class="price-orig">${STORE_CONFIG.currency_symbol}${p.original_price}</span>` : ''}
        </div>
        <p class="detail-desc">${td(p)}</p>

        ${p.variants ? `
        <div class="detail-variants">
          <label>${currentLang === 'ar' ? 'المقاس' : 'Size'}:</label>
          <div class="variant-btns">
            ${p.variants.map(v => `<button class="variant-btn" onclick="selectVariant(this,'${v}')">${v}</button>`).join('')}
          </div>
        </div>` : ''}

        <div class="detail-qty">
          <label>${currentLang === 'ar' ? 'الكمية' : 'Quantity'}:</label>
          <div class="qty-control">
            <button onclick="changeQty(-1)">−</button>
            <span id="detailQty">1</span>
            <button onclick="changeQty(1)">+</button>
          </div>
        </div>

        <div class="detail-actions">
          <button class="btn-primary big" onclick="addDetailToCart(${p.id})">
            ${currentLang === 'ar' ? '🛍 أضف للسلة' : '🛍 Add to Cart'}
          </button>
          <button class="btn-ghost big" onclick="buyNow(${p.id})">
            ${currentLang === 'ar' ? '⚡ اشتر الآن' : '⚡ Buy Now'}
          </button>
          <button class="wish-btn-large ${isInWishlist(p.id) ? 'wished' : ''}" onclick="wishlistToggle(${p.id},this)">
            ${isInWishlist(p.id) ? '❤️' : '🤍'}
          </button>
        </div>

        <div class="detail-meta">
          <div class="meta-item">
            <span class="meta-icon">${p.type === 'digital' ? '⬇' : '📦'}</span>
            <div>
              <strong>${p.type === 'digital' ? (currentLang === 'ar' ? 'منتج رقمي' : 'Digital Product') : (currentLang === 'ar' ? 'منتج مادي' : 'Physical Product')}</strong>
              <small>${p.type === 'digital' ? (currentLang === 'ar' ? 'تسليم فوري' : 'Instant Delivery') : `${currentLang === 'ar' ? 'يصل خلال' : 'Delivery in'} ${p.shipping_days} ${currentLang === 'ar' ? 'أيام' : 'days'}`}</small>
            </div>
          </div>
          <div class="meta-item">
            <span class="meta-icon">📦</span>
            <div>
              <strong>${currentLang === 'ar' ? 'المخزون' : 'Stock'}</strong>
              <small>${p.stock > 10 ? (currentLang === 'ar' ? 'متوفر' : 'In Stock') : `${p.stock} ${currentLang === 'ar' ? 'قطعة متبقية' : 'left'}`}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${related.length > 0 ? `
    <div class="section">
      <div class="section-head">
        <h2>${currentLang === 'ar' ? 'منتجات مشابهة' : 'Related Products'}</h2>
      </div>
      <div class="products-grid">${related.map(r => productCard(r)).join('')}</div>
    </div>` : ''}
  `;

  navigateTo('product-detail');
}

let selectedVariant = null;
function selectVariant(btn, v) {
  document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedVariant = v;
}

let detailQty = 1;
function changeQty(delta) {
  detailQty = Math.max(1, detailQty + delta);
  document.getElementById('detailQty').textContent = detailQty;
}

function addDetailToCart(id) {
  addToCart(id, detailQty, selectedVariant);
  updateCartUI();
  showToast(currentLang === 'ar' ? '✅ أضيف للسلة!' : '✅ Added to cart!');
  detailQty = 1;
}

function buyNow(id) {
  addToCart(id, 1, selectedVariant);
  updateCartUI();
  navigateTo('checkout');
}

// ============================================================
// CATEGORIES PAGE
// ============================================================
function renderCategoriesFull() {
  const el = document.getElementById('categoriesFull');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => {
    const count = PRODUCTS.filter(p => p.category_id === c.id).length;
    return `
    <div class="cat-card" onclick="filterByCategory(${c.id})" style="--cat-color:${c.color}">
      <div class="cat-card-icon">${c.icon}</div>
      <h3>${t(c)}</h3>
      <p>${count} ${currentLang === 'ar' ? 'منتج' : 'products'}</p>
    </div>`;
  }).join('');
}

// ============================================================
// CART SIDEBAR
// ============================================================
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('show');
  updateCartSidebar();
}

function updateCartSidebar() {
  const cart = getCart();
  const el = document.getElementById('cartSidebarItems');
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty">${currentLang === 'ar' ? '🛒 السلة فارغة' : '🛒 Cart is empty'}</div>`;
    document.getElementById('cartTotalSidebar').textContent = '$0.00';
    return;
  }

  el.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `
    <div class="cart-sidebar-item">
      <div class="csi-img">${p.emoji}</div>
      <div class="csi-info">
        <p>${t(p)}</p>
        ${item.variant ? `<small>${item.variant}</small>` : ''}
        <div class="csi-qty">
          <button onclick="updateCartQty(${p.id},${item.quantity - 1},'${item.variant}');updateCartUI()">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQty(${p.id},${item.quantity + 1},'${item.variant}');updateCartUI()">+</button>
          <button class="csi-remove" onclick="removeFromCart(${p.id},'${item.variant}');updateCartUI()">🗑</button>
        </div>
      </div>
      <div class="csi-price">$${(p.price * item.quantity).toFixed(2)}</div>
    </div>`;
  }).join('');

  const total = getCartTotal();
  document.getElementById('cartTotalSidebar').textContent = `$${total.toFixed(2)}`;
}

function updateCartUI() {
  const count = getCartCount();
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = count;
  updateCartSidebar();
}

function quickAddToCart(id) {
  addToCart(id, 1);
  updateCartUI();
  showToast(currentLang === 'ar' ? '✅ أضيف للسلة!' : '✅ Added to cart!');
}

// ============================================================
// CART PAGE
// ============================================================
function renderCartPage() {
  const cart = getCart();
  const itemsEl = document.getElementById('cartItems');
  const summaryEl = document.getElementById('cartSummary');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart-page">
        <div class="empty-icon">🛒</div>
        <h2>${currentLang === 'ar' ? 'السلة فارغة' : 'Your cart is empty'}</h2>
        <button class="btn-primary" onclick="navigateTo('products')">${currentLang === 'ar' ? 'ابدأ التسوق' : 'Start Shopping'}</button>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = `
    <div class="cart-table">
      <div class="cart-table-head">
        <span>${currentLang === 'ar' ? 'المنتج' : 'Product'}</span>
        <span>${currentLang === 'ar' ? 'السعر' : 'Price'}</span>
        <span>${currentLang === 'ar' ? 'الكمية' : 'Qty'}</span>
        <span>${currentLang === 'ar' ? 'الإجمالي' : 'Total'}</span>
        <span></span>
      </div>
      ${cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-table-row">
        <div class="cart-prod-cell">
          <div class="cart-prod-img">${p.emoji}</div>
          <div>
            <strong>${t(p)}</strong>
            ${item.variant ? `<small>${item.variant}</small>` : ''}
          </div>
        </div>
        <span>$${p.price}</span>
        <div class="qty-control sm">
          <button onclick="updateCartQty(${p.id},${item.quantity - 1},'${item.variant}');renderCartPage();updateCartUI()">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartQty(${p.id},${item.quantity + 1},'${item.variant}');renderCartPage();updateCartUI()">+</button>
        </div>
        <strong>$${(p.price * item.quantity).toFixed(2)}</strong>
        <button class="remove-btn" onclick="removeFromCart(${p.id},'${item.variant}');renderCartPage();updateCartUI()">✕</button>
      </div>`;
  }).join('')}
    </div>`;

  const subtotal = getCartTotal();
  const shipping = cart.some(i => { const p = PRODUCTS.find(x => x.id === i.id); return p && p.type === 'physical'; }) ? 10 : 0;
  const total = subtotal + shipping;

  summaryEl.innerHTML = `
    <div class="summary-box">
      <h3>${currentLang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
      <div class="summary-row"><span>${currentLang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>${currentLang === 'ar' ? 'الشحن' : 'Shipping'}</span><span>${shipping === 0 ? (currentLang === 'ar' ? 'مجاني' : 'Free') : '$' + shipping}</span></div>
      <div class="summary-row total"><span>${currentLang === 'ar' ? 'الإجمالي' : 'Total'}</span><strong>$${total.toFixed(2)}</strong></div>
      <button class="btn-primary full" onclick="navigateTo('checkout')">${currentLang === 'ar' ? '⚡ إتمام الطلب' : '⚡ Proceed to Checkout'}</button>
      <button class="btn-ghost full" onclick="navigateTo('products')">${currentLang === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}</button>
    </div>`;
}

// ============================================================
// CHECKOUT PAGE
// ============================================================
function renderCheckoutPage() {
  const cart = getCart();
  const subtotal = getCartTotal();
  const shipping = cart.some(i => { const p = PRODUCTS.find(x => x.id === i.id); return p && p.type === 'physical'; }) ? 10 : 0;
  const total = subtotal + shipping;

  document.getElementById('checkoutForm').innerHTML = `
    <div class="checkout-section">
      <h3>👤 ${currentLang === 'ar' ? 'البيانات الشخصية' : 'Personal Info'}</h3>
      <div class="form-row">
        <div class="form-group"><label>${currentLang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label><input type="text" id="co-name" placeholder="${currentLang === 'ar' ? 'اسمك الكريم' : 'Your full name'}"></div>
        <div class="form-group"><label>${currentLang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label><input type="email" id="co-email" placeholder="email@example.com"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>${currentLang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label><input type="tel" id="co-phone" placeholder="+966 5xx xxx xxxx"></div>
        <div class="form-group"><label>${currentLang === 'ar' ? 'الدولة' : 'Country'}</label>
          <select id="co-country">
            <option value="SA">السعودية / Saudi Arabia</option>
            <option value="AE">الإمارات / UAE</option>
            <option value="KW">الكويت / Kuwait</option>
            <option value="EG">مصر / Egypt</option>
            <option value="OTHER">${currentLang === 'ar' ? 'دولة أخرى' : 'Other'}</option>
          </select>
        </div>
      </div>
      <div class="form-group" id="addressRow">
        <label>${currentLang === 'ar' ? 'العنوان' : 'Address'}</label>
        <input type="text" id="co-address" placeholder="${currentLang === 'ar' ? 'عنوان الشحن' : 'Shipping address'}">
      </div>
    </div>

    <div class="checkout-section">
      <h3>💳 ${currentLang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h3>
      <div class="payment-methods">
        <label class="pay-method active" onclick="selectPayment(this,'stripe')">
          <input type="radio" name="payment" value="stripe" checked>
          <div class="pay-method-inner">
            <span class="pay-icon">💳</span>
            <div><strong>Stripe</strong><small>${currentLang === 'ar' ? 'بطاقة ائتمانية/مدى' : 'Credit/Debit Card'}</small></div>
          </div>
        </label>
        <label class="pay-method" onclick="selectPayment(this,'paypal')">
          <input type="radio" name="payment" value="paypal">
          <div class="pay-method-inner">
            <span class="pay-icon">🅿️</span>
            <div><strong>PayPal</strong><small>${currentLang === 'ar' ? 'دفع عبر باي بال' : 'Pay via PayPal'}</small></div>
          </div>
        </label>
        <label class="pay-method" onclick="selectPayment(this,'binance')">
          <input type="radio" name="payment" value="binance">
          <div class="pay-method-inner">
            <span class="pay-icon">🟡</span>
            <div><strong>Binance Pay</strong><small>${currentLang === 'ar' ? 'دفع عبر بايننس' : 'Pay via Binance'}</small></div>
          </div>
        </label>
        <label class="pay-method" onclick="selectPayment(this,'crypto')">
          <input type="radio" name="payment" value="crypto">
          <div class="pay-method-inner">
            <span class="pay-icon">💎</span>
            <div><strong>${currentLang === 'ar' ? 'عملات رقمية' : 'Crypto'}</strong><small>USDT / BTC / ETH</small></div>
          </div>
        </label>
      </div>

      <div id="payment-details">
        <div id="pay-stripe" class="pay-detail-box">
          <div class="form-group"><label>${currentLang === 'ar' ? 'رقم البطاقة' : 'Card Number'}</label><input type="text" placeholder="4242 4242 4242 4242" maxlength="19" oninput="formatCard(this)"></div>
          <div class="form-row">
            <div class="form-group"><label>${currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry'}</label><input type="text" placeholder="MM/YY" maxlength="5"></div>
            <div class="form-group"><label>CVV</label><input type="text" placeholder="123" maxlength="3"></div>
          </div>
        </div>
        <div id="pay-paypal" class="pay-detail-box hidden">
          <div class="paypal-redirect">
            <p>${currentLang === 'ar' ? 'سيتم توجيهك لصفحة PayPal لإتمام الدفع' : 'You will be redirected to PayPal to complete payment'}</p>
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" style="height:50px;margin-top:10px">
          </div>
        </div>
        <div id="pay-binance" class="pay-detail-box hidden">
          <div class="crypto-box">
            <p>${currentLang === 'ar' ? 'معرف Binance Pay' : 'Binance Pay ID'}: <strong>${STORE_CONFIG.binance_address}</strong></p>
            <p>${currentLang === 'ar' ? 'المبلغ المطلوب' : 'Amount'}: <strong>$${total.toFixed(2)}</strong></p>
            <div class="form-group"><label>${currentLang === 'ar' ? 'رقم التحويل / لقطة الشاشة' : 'Transfer ID / Screenshot'}</label><input type="text" id="co-binance-ref" placeholder="TxID or Order Reference"></div>
          </div>
        </div>
        <div id="pay-crypto" class="pay-detail-box hidden">
          <div class="crypto-tabs">
            <button class="crypto-tab active" onclick="showCryptoTab(this,'usdt')">USDT TRC20</button>
            <button class="crypto-tab" onclick="showCryptoTab(this,'btc')">Bitcoin</button>
            <button class="crypto-tab" onclick="showCryptoTab(this,'eth')">Ethereum</button>
          </div>
          <div id="crypto-usdt" class="crypto-addr">
            <p>${currentLang === 'ar' ? 'عنوان USDT (TRC20)' : 'USDT TRC20 Address'}:</p>
            <div class="addr-box" onclick="copyAddr('${STORE_CONFIG.usdt_address}')">${STORE_CONFIG.usdt_address} 📋</div>
          </div>
          <div id="crypto-btc" class="crypto-addr hidden">
            <p>${currentLang === 'ar' ? 'عنوان Bitcoin' : 'Bitcoin Address'}:</p>
            <div class="addr-box" onclick="copyAddr('${STORE_CONFIG.btc_address}')">${STORE_CONFIG.btc_address} 📋</div>
          </div>
          <div id="crypto-eth" class="crypto-addr hidden">
            <p>${currentLang === 'ar' ? 'عنوان Ethereum' : 'Ethereum Address'}:</p>
            <div class="addr-box" onclick="copyAddr('${STORE_CONFIG.eth_address}')">${STORE_CONFIG.eth_address} 📋</div>
          </div>
          <div class="form-group" style="margin-top:15px"><label>${currentLang === 'ar' ? 'رقم المعاملة (TxID)' : 'Transaction ID (TxID)'}</label><input type="text" id="co-txid" placeholder="0x..."></div>
        </div>
      </div>
    </div>

    <button class="btn-primary full big" onclick="placeOrder()">
      ✅ ${currentLang === 'ar' ? 'تأكيد الطلب' : 'Place Order'} — $${total.toFixed(2)}
    </button>
  `;

  document.getElementById('checkoutSummary').innerHTML = `
    <div class="summary-box">
      <h3>${currentLang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}</h3>
      ${cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `<div class="summary-item">
          <span>${p.emoji} ${t(p)} × ${item.quantity}</span>
          <span>$${(p.price * item.quantity).toFixed(2)}</span>
        </div>`;
  }).join('')}
      <div class="summary-row"><span>${currentLang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>${currentLang === 'ar' ? 'الشحن' : 'Shipping'}</span><span>${shipping === 0 ? (currentLang === 'ar' ? 'مجاني' : 'Free') : '$' + shipping}</span></div>
      <div class="summary-row total"><span>${currentLang === 'ar' ? 'الإجمالي' : 'Total'}</span><strong>$${total.toFixed(2)}</strong></div>
    </div>`;
}

function selectPayment(el, method) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
  el.classList.add('active');
  ['stripe', 'paypal', 'binance', 'crypto'].forEach(m => {
    const box = document.getElementById('pay-' + m);
    if (box) box.classList.toggle('hidden', m !== method);
  });
}

function showCryptoTab(btn, tab) {
  document.querySelectorAll('.crypto-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['usdt', 'btc', 'eth'].forEach(t => {
    document.getElementById('crypto-' + t)?.classList.toggle('hidden', t !== tab);
  });
}

function copyAddr(addr) {
  navigator.clipboard.writeText(addr).then(() => {
    showToast(currentLang === 'ar' ? '✅ تم نسخ العنوان!' : '✅ Address copied!');
  });
}

function formatCard(el) {
  el.value = el.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
}

function placeOrder() {
  const name = document.getElementById('co-name')?.value.trim();
  const email = document.getElementById('co-email')?.value.trim();
  const phone = document.getElementById('co-phone')?.value.trim();
  if (!name || !email || !phone) {
    showToast(currentLang === 'ar' ? '⚠️ يرجى ملء جميع الحقول المطلوبة' : '⚠️ Please fill all required fields', 'error');
    return;
  }

  const cart = getCart();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'stripe';
  const subtotal = getCartTotal();
  const shipping = cart.some(i => { const p = PRODUCTS.find(x => x.id === i.id); return p && p.type === 'physical'; }) ? 10 : 0;

  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    customer: { name, email, phone, country: document.getElementById('co-country')?.value, address: document.getElementById('co-address')?.value },
    items: cart.map(i => {
      const p = PRODUCTS.find(x => x.id === i.id);
      return { id: i.id, name_ar: p?.name_ar, name_en: p?.name_en, price: p?.price, quantity: i.quantity, variant: i.variant };
    }),
    payment_method: payment,
    subtotal, shipping, total: subtotal + shipping,
    status: 'pending',
  };

  saveOrder(order);
  clearCart();
  updateCartUI();

  document.getElementById('successOrderId').innerHTML =
    `${currentLang === 'ar' ? 'رقم الطلب' : 'Order ID'}: <strong>${order.id}</strong><br>
     ${currentLang === 'ar' ? 'سيتم التواصل معك على' : 'We will contact you at'}: <strong>${email}</strong>`;

  navigateTo('success');
}

// ============================================================
// WISHLIST
// ============================================================
function wishlistToggle(id, btn) {
  const wl = toggleWishlist(id);
  const inWL = wl.includes(id);
  if (btn) {
    btn.classList.toggle('wished', inWL);
    btn.textContent = btn.tagName === 'BUTTON' && btn.classList.contains('wish-btn-large')
      ? (inWL ? '❤️' : '🤍') : '♡';
  }
  showToast(inWL
    ? (currentLang === 'ar' ? '❤️ أضيف للمفضلة' : '❤️ Added to wishlist')
    : (currentLang === 'ar' ? '🤍 حذف من المفضلة' : '🤍 Removed from wishlist'));
}

// ============================================================
// CONTACT
// ============================================================
function sendContact() {
  const name = document.getElementById('cName')?.value.trim();
  const email = document.getElementById('cEmail')?.value.trim();
  const msg = document.getElementById('cMsg')?.value.trim();
  if (!name || !email || !msg) {
    showToast(currentLang === 'ar' ? '⚠️ يرجى ملء جميع الحقول' : '⚠️ Please fill all fields', 'error');
    return;
  }
  showToast(currentLang === 'ar' ? '✅ تم إرسال رسالتك بنجاح!' : '✅ Message sent successfully!');
  document.getElementById('cName').value = '';
  document.getElementById('cEmail').value = '';
  document.getElementById('cMsg').value = '';
}

// ============================================================
// UI HELPERS
// ============================================================
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  bar.classList.toggle('visible');
  if (bar.classList.contains('visible')) document.getElementById('searchInput').focus();
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function animateStats() {
  const countUp = (el, target) => {
    let n = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      n = Math.min(n + step, target);
      el.textContent = n.toLocaleString();
      if (n >= target) clearInterval(timer);
    }, 30);
  };
  countUp(document.getElementById('stat-products'), PRODUCTS.length);
  countUp(document.getElementById('stat-orders'), getOrders().length + 1240);
}
