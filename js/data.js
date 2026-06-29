// ============================================================
// STORE DATA - Edit this file to manage your products
// ============================================================

const STORE_CONFIG = {
  name_ar: "متجري",
  name_en: "MyStore",
  currency: "USD",
  currency_symbol: "$",
  whatsapp: "+966500000000",
  email: "store@example.com",
  // Payment Settings
  paypal_email: "paypal@example.com",
  stripe_key: "pk_test_YOUR_STRIPE_KEY",
  binance_address: "YOUR_BINANCE_PAY_ID",
  usdt_address: "YOUR_USDT_TRC20_ADDRESS",
  btc_address: "YOUR_BTC_ADDRESS",
  eth_address: "YOUR_ETH_ADDRESS",
};

// ============================================================
// CATEGORIES
// ============================================================
let CATEGORIES = [
  { id: 1, name_ar: "إلكترونيات", name_en: "Electronics", icon: "💻", color: "#6366f1" },
  { id: 2, name_ar: "برامج وتطبيقات", name_en: "Software & Apps", icon: "📱", color: "#8b5cf6" },
  { id: 3, name_ar: "كورسات تعليمية", name_en: "Courses", icon: "🎓", color: "#ec4899" },
  { id: 4, name_ar: "تصميم جرافيك", name_en: "Graphic Design", icon: "🎨", color: "#f59e0b" },
  { id: 5, name_ar: "ملابس وأكسسوارات", name_en: "Clothing", icon: "👕", color: "#10b981" },
  { id: 6, name_ar: "كتب وملفات", name_en: "Books & Files", icon: "📚", color: "#3b82f6" },
];

// ============================================================
// PRODUCTS
// ============================================================
let PRODUCTS = [
  {
    id: 1, category_id: 1,
    name_ar: "لابتوب Dell XPS 15", name_en: "Dell XPS 15 Laptop",
    desc_ar: "لابتوب احترافي بشاشة 15.6 بوصة OLED مع معالج Intel Core i9 وذاكرة 32GB RAM",
    desc_en: "Professional laptop with 15.6\" OLED screen, Intel Core i9, 32GB RAM",
    price: 1299, original_price: 1599,
    type: "physical", stock: 5, featured: true, new: false,
    emoji: "💻", rating: 4.8, reviews: 124,
    images: [],
    tags_ar: ["لابتوب", "ديل", "إلكترونيات"],
    tags_en: ["laptop", "dell", "electronics"],
    shipping_days: 5,
  },
  {
    id: 2, category_id: 3,
    name_ar: "كورس تصميم UI/UX الشامل", name_en: "Complete UI/UX Design Course",
    desc_ar: "كورس شامل لتعلم تصميم واجهات المستخدم من الصفر حتى الاحتراف مع 50+ ساعة فيديو",
    desc_en: "Complete course to learn UI/UX design from scratch with 50+ hours of video",
    price: 49, original_price: 99,
    type: "digital", stock: 999, featured: true, new: true,
    emoji: "🎨", rating: 4.9, reviews: 892,
    images: [],
    tags_ar: ["كورس", "تصميم", "UI"],
    tags_en: ["course", "design", "UI"],
    download_link: "#",
  },
  {
    id: 3, category_id: 2,
    name_ar: "ترخيص Adobe Creative Suite", name_en: "Adobe Creative Suite License",
    desc_ar: "ترخيص رسمي لمجموعة Adobe الإبداعية الكاملة لمدة سنة كاملة",
    desc_en: "Official license for the complete Adobe Creative Suite for one year",
    price: 199, original_price: 349,
    type: "digital", stock: 50, featured: true, new: false,
    emoji: "🖌️", rating: 4.7, reviews: 341,
    images: [],
    tags_ar: ["أدوبي", "برامج", "تصميم"],
    tags_en: ["adobe", "software", "design"],
    download_link: "#",
  },
  {
    id: 4, category_id: 5,
    name_ar: "قميص كلاسيك بيور كوتون", name_en: "Classic Pure Cotton Shirt",
    desc_ar: "قميص قطن 100% بقصة كلاسيكية أنيقة متوفر بعدة ألوان ومقاسات",
    desc_en: "100% cotton shirt with elegant classic cut, available in multiple colors and sizes",
    price: 29, original_price: 45,
    type: "physical", stock: 30, featured: false, new: true,
    emoji: "👕", rating: 4.5, reviews: 67,
    images: [],
    tags_ar: ["قميص", "ملابس", "قطن"],
    tags_en: ["shirt", "clothing", "cotton"],
    shipping_days: 3,
    variants: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 5, category_id: 6,
    name_ar: "حزمة القوالب الاحترافية", name_en: "Professional Templates Bundle",
    desc_ar: "حزمة تحتوي على 500+ قالب احترافي لـ PowerPoint وWord وExcel",
    desc_en: "Bundle containing 500+ professional templates for PowerPoint, Word, and Excel",
    price: 15, original_price: 35,
    type: "digital", stock: 999, featured: false, new: true,
    emoji: "📁", rating: 4.6, reviews: 203,
    images: [],
    tags_ar: ["قوالب", "ملفات", "مكتبية"],
    tags_en: ["templates", "files", "office"],
    download_link: "#",
  },
  {
    id: 6, category_id: 4,
    name_ar: "حزمة الأيقونات المتميزة", name_en: "Premium Icons Bundle",
    desc_ar: "10,000+ أيقونة احترافية بصيغ SVG وPNG لجميع استخداماتك التصميمية",
    desc_en: "10,000+ professional icons in SVG and PNG formats for all your design needs",
    price: 25, original_price: 60,
    type: "digital", stock: 999, featured: true, new: false,
    emoji: "✨", rating: 4.9, reviews: 556,
    images: [],
    tags_ar: ["أيقونات", "تصميم", "SVG"],
    tags_en: ["icons", "design", "SVG"],
    download_link: "#",
  },
  {
    id: 7, category_id: 1,
    name_ar: "سماعات Sony WH-1000XM5", name_en: "Sony WH-1000XM5 Headphones",
    desc_ar: "أفضل سماعات لاسلكية بخاصية إلغاء الضوضاء الاحترافية وعمر بطارية 30 ساعة",
    desc_en: "Best wireless headphones with professional noise cancellation and 30-hour battery",
    price: 299, original_price: 399,
    type: "physical", stock: 12, featured: false, new: false,
    emoji: "🎧", rating: 4.8, reviews: 445,
    images: [],
    tags_ar: ["سماعات", "سوني", "لاسلكي"],
    tags_en: ["headphones", "sony", "wireless"],
    shipping_days: 4,
  },
  {
    id: 8, category_id: 3,
    name_ar: "كورس البرمجة بـ Python", name_en: "Python Programming Course",
    desc_ar: "تعلم البرمجة بلغة Python من الصفر مع مشاريع عملية وشهادة إتمام معتمدة",
    desc_en: "Learn Python programming from scratch with practical projects and completion certificate",
    price: 39, original_price: 79,
    type: "digital", stock: 999, featured: false, new: true,
    emoji: "🐍", rating: 4.7, reviews: 1204,
    images: [],
    tags_ar: ["كورس", "بايثون", "برمجة"],
    tags_en: ["course", "python", "programming"],
    download_link: "#",
  },
];

// ============================================================
// ORDERS (stored in localStorage)
// ============================================================
function getOrders() {
  return JSON.parse(localStorage.getItem('store_orders') || '[]');
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('store_orders', JSON.stringify(orders));
  return order;
}

function generateOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

// ============================================================
// CART (stored in localStorage)
// ============================================================
function getCart() {
  return JSON.parse(localStorage.getItem('store_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('store_cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1, variant = null) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId && i.variant === variant);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      cart.push({ id: productId, quantity, variant });
    }
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(productId, variant = null) {
  let cart = getCart();
  cart = cart.filter(i => !(i.id === productId && i.variant === variant));
  saveCart(cart);
  return cart;
}

function updateCartQty(productId, quantity, variant = null) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId && i.variant === variant);
  if (item) item.quantity = Math.max(1, quantity);
  saveCart(cart);
  return cart;
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

// ============================================================
// WISHLIST
// ============================================================
function getWishlist() {
  return JSON.parse(localStorage.getItem('store_wishlist') || '[]');
}

function toggleWishlist(productId) {
  const wl = getWishlist();
  const idx = wl.indexOf(productId);
  if (idx === -1) wl.push(productId);
  else wl.splice(idx, 1);
  localStorage.setItem('store_wishlist', JSON.stringify(wl));
  return wl;
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}
