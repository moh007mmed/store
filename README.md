
# 🛍️ متجري | MyStore
## متجر إلكتروني متكامل - Static E-Commerce for GitHub Pages

---

## 📁 هيكل الملفات

```
store/
├── index.html          ← الصفحة الرئيسية للمتجر
├── css/
│   └── store.css       ← تصميم المتجر الكامل
├── js/
│   ├── data.js         ← بيانات المنتجات والتصنيفات
│   └── store.js        ← منطق المتجر
└── admin/
    ├── index.html      ← لوحة التحكم
    └── admin.css       ← تصميم لوحة التحكم
```

---

## 🚀 رفع على GitHub Pages

### الخطوات:
1. أنشئ مستودعاً جديداً على GitHub
2. ارفع جميع الملفات
3. اذهب إلى **Settings → Pages**
4. اختر **Branch: main** ثم **/ (root)**
5. انقر Save — الموقع سيكون جاهزاً خلال دقيقتين!

### الرابط:
```
https://USERNAME.github.io/REPO-NAME/
```

---

## ⚙️ تخصيص المتجر

### 1. تعديل إعدادات المتجر
افتح `js/data.js` وعدّل:
```js
const STORE_CONFIG = {
  name_ar: "اسم متجرك",
  name_en: "Your Store Name",
  paypal_email: "paypal@youremail.com",
  stripe_key: "pk_live_YOUR_KEY",
  binance_address: "YOUR_BINANCE_ID",
  usdt_address: "YOUR_USDT_ADDRESS",
  btc_address: "YOUR_BTC_ADDRESS",
  eth_address: "YOUR_ETH_ADDRESS",
};
```

### 2. إضافة منتجات
من **لوحة التحكم** → المنتجات → إضافة منتج
أو عدّل مباشرة في `PRODUCTS` داخل `data.js`

---

## 💳 ربط طرق الدفع الحقيقية

### Stripe
1. سجّل في [stripe.com](https://stripe.com)
2. احصل على Public Key
3. ضعه في `STORE_CONFIG.stripe_key`
4. لـ Stripe الكامل تحتاج Backend (Netlify Functions مثلاً)

### PayPal
1. سجّل في [paypal.com](https://paypal.com)
2. أضف بريدك في `STORE_CONFIG.paypal_email`
3. يمكن استخدام PayPal Checkout بـ JS فقط

### Binance Pay / Crypto
- أضف عناوين محافظك في الإعدادات
- يُرسل العميل المبلغ ويضع TxID للتأكيد

---

## 🌍 دعم اللغتين
- عربي/إنجليزي مع RTL/LTR تلقائي
- زر التبديل في الهيدر

## 🔒 ملاحظة أمنية
هذا متجر **Static** — البيانات تُحفظ في `localStorage`.
للمتجر الاحترافي مع قاعدة بيانات حقيقية، استخدم:
- **Supabase** (مجاني)
- **Firebase**
- **Airtable**

---

Made with ❤️ | Static E-Commerce for GitHub Pages
