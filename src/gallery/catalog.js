// ─────────────────────────────────────────────────────────────
//  فهرس معرض الشاشات — كل شاشة مبرمجة مع حالتها الابتدائية
//  المعزولة (state) وأي معاملات (params) لعرض حالة محددة.
//  يُستخدم في ScreensGallery لعرض أي شاشة بشكل مستقل تماماً.
// ─────────────────────────────────────────────────────────────
import { PRODUCTS, SEED_ORDERS, makeSampleOrder } from '../data/mock'

const AUTH_OK = { status: 'authenticated', accountType: 'customer', email: 'customer@jadeed.ye', otpAttempts: 0, lockedUntil: null }
const AUTH_GUEST = { status: 'guest', accountType: 'customer', email: 'customer@jadeed.ye', otpAttempts: 0, lockedUntil: null }
const AUTH_MERCHANT = { ...AUTH_OK, accountType: 'merchant', email: 'merchant@jadeed.ye' }
const MERCHANT_STATE = { auth: AUTH_MERCHANT, merchantStatus: 'approved' }
// سلة من متجرين (سماعات ×1 من التكنولوجيا + بن ×2 من الباريستا) لعرض الفصل حسب المتجر
const MULTI_STORE_CART = { 'p-headphones': 1, 'p-coffee': 2 }
const TRANSFER_ORDER = (stage = 'new') => [makeSampleOrder(stage, { payment: 'تحويل بنكي / محفظة إلى التاجر', paymentStatus: 'pending_confirmation', receipt: { name: 'receipt-st-tech.jpg', size: '1.2 ميجابايت' } }), ...SEED_ORDERS]
const TECH_IDS = PRODUCTS.filter((p) => p.storeId === 'st-tech').map((p) => p.id)

// سلة نموذجية: سماعات ×2 + ساعة ×1 = 87,200 (تُحسب رياضياً في computeCart)
const SAMPLE_CART = { 'p-headphones': 2, 'p-watch': 1 }

const ORDER = (stage, extra) => [makeSampleOrder(stage, extra), ...SEED_ORDERS]

// screen: اسم الشاشة في SCREENS · params: معاملات · state: تجاوزات الحالة · stack: مكدس (لتفعيل زر الرجوع)
export const GALLERY = [
  {
    id: 'onboarding',
    title: 'التهيئة والبداية',
    desc: 'شاشة البداية وثلاث شرائح تعريفية واختيار نوع الحساب',
    items: [
      { key: 'splash', title: 'شاشة البداية (Splash)', screen: 'splash', state: { auth: AUTH_GUEST }, note: 'تنتقل تلقائياً للتهيئة بعد 1.4 ثانية', figma: '—' },
      { key: 'onb-1', title: 'التهيئة 1 — اشتري أغراضك بكل سهولة', screen: 'onboarding', params: { slide: 0 }, figma: '11:54' },
      { key: 'onb-2', title: 'التهيئة 2 — اكتشف أفضل الأسعار والعروض', screen: 'onboarding', params: { slide: 1 }, figma: '11:98' },
      { key: 'onb-3', title: 'التهيئة 3 — سوقك الذكي والشامل', screen: 'onboarding', params: { slide: 2 }, figma: '11:200' },
      { key: 'account-type', title: 'تحديد نوع الحساب', screen: 'accountType', figma: '11:137' },
    ],
  },
  {
    id: 'auth',
    title: 'التسجيل والمصادقة',
    desc: 'الدخول، رمز التحقق OTP (4 أرقام)، إنشاء الحساب وحالاته',
    items: [
      { key: 'login', title: 'تسجيل الدخول بالبريد الإلكتروني', code: 'CUS-001', screen: 'login', state: { auth: AUTH_GUEST }, figma: '11:245' },
      { key: 'login-invalid', title: 'تنبيه: البريد غير صالح', code: 'CUS-002', screen: 'login', params: { preset: 'invalid' }, state: { auth: AUTH_GUEST }, figma: '11:380' },
      { key: 'otp-sent', title: 'تم إرسال رمز التحقق', code: 'CUS-004', screen: 'otpSent', state: { auth: AUTH_GUEST }, figma: '11:336' },
      { key: 'otp', title: 'التحقق من رمز OTP (4 خانات)', screen: 'otp', state: { auth: AUTH_GUEST }, stack: ['login'], note: 'الرمز الصحيح 1234', figma: '11:295' },
      { key: 'otp-wrong', title: 'رمز التحقق غير صحيح', code: 'CUS-005', screen: 'otp', params: { preset: 'wrong' }, state: { auth: { ...AUTH_GUEST, otpAttempts: 1 } }, stack: ['login'], figma: '11:430' },
      { key: 'otp-locked', title: 'تجاوز محاولات التحقق', code: 'CUS-006', screen: 'otpLocked', state: { auth: { ...AUTH_GUEST, otpAttempts: 3, lockedUntil: Date.now() + 9e5 } }, figma: '11:485' },
      { key: 'login-success', title: 'نجاح تسجيل الدخول', code: 'CUS-007', screen: 'loginSuccess', figma: '11:528' },
      { key: 'register', title: 'إنشاء حساب جديد', code: 'CUS-008', screen: 'register', state: { auth: AUTH_GUEST }, stack: ['login'], figma: '11:577' },
      { key: 'register-errors', title: 'إنشاء حساب — أخطاء التحقق من الحقول', code: 'CUS-008', screen: 'register', params: { preset: 'errors' }, state: { auth: AUTH_GUEST }, stack: ['login'], figma: '11:577' },
      { key: 'register-success', title: 'تم إنشاء الحساب بنجاح', code: 'CUS-009', screen: 'registerSuccess', params: { name: 'محمد سعيد' }, figma: '11:655' },
      { key: 'register-failed', title: 'فشل حفظ الحساب', code: 'CUS-010', screen: 'registerFailed', stack: ['register'], figma: '11:701' },
      { key: 'forgot-password', title: 'استعادة الحساب — نسيت بيانات الدخول', screen: 'forgotPassword', stack: ['login'], note: 'جديد (غير موجود في Figma) — الدخول بـ OTP لذا الاستعادة عبر قناة بديلة', figma: '—' },
      { key: 'login-gated', title: 'تسجيل الدخول — مطلوب لإكمال إجراء (زائر)', screen: 'login', params: { gated: true }, state: { auth: AUTH_GUEST }, stack: ['home'], note: 'يظهر عند محاولة الزائر استخدام المفضلة/الطلبات/الدفع', figma: '—' },
    ],
  },
  {
    id: 'location',
    title: 'الموقع والعناوين',
    desc: 'إذن الموقع وحالاته، الخريطة، العناوين المحفوظة',
    items: [
      { key: 'loc-permission', title: 'طلب إذن الموقع', code: 'CUS-013', screen: 'locationPermission', figma: '11:1131' },
      { key: 'loc-success', title: 'تم تحديد موقع GPS بنجاح', code: 'CUS-015', screen: 'locationSuccess', figma: '11:1157' },
      { key: 'loc-denied', title: 'تعذر تحديد الموقع تلقائياً', code: 'CUS-014', screen: 'locationDenied', figma: '11:1202' },
      { key: 'map-pin', title: 'موقعك المحفوظ على الخريطة', code: 'CUS-012', screen: 'mapPin', stack: ['addresses'], figma: '11:1075' },
      { key: 'addresses', title: 'تحديد موقع التوصيل والعناوين المحفوظة', code: 'CUS-011', screen: 'addresses', figma: '11:743' },
      { key: 'addresses-change', title: 'تغيير موقع التوصيل', code: 'CUS-040', screen: 'addresses', stack: ['home'], figma: '13:3623' },
    ],
  },
  {
    id: 'customer',
    title: 'رحلة العميل — التسوق',
    desc: 'الرئيسية، المتاجر، المنتجات، البحث والفلترة، المفضلة',
    items: [
      { key: 'home', title: 'الرئيسية — المتاجر المعتمدة في تعز', screen: 'home', state: { cart: SAMPLE_CART }, figma: '11:816' },
      { key: 'nearby', title: 'المتاجر القريبة منك', code: 'CUS-017', screen: 'nearbyStores', stack: ['home'], figma: '11:1247' },
      { key: 'nearby-empty', title: 'لا توجد متاجر قريبة', code: 'CUS-018', screen: 'nearbyStores', params: { area: 'الحوبان' }, stack: ['home'], figma: '11:1392' },
      { key: 'store', title: 'تفاصيل المتجر وقائمة المنتجات', screen: 'store', params: { id: 'st-tech' }, stack: ['home'], figma: '11:1464' },
      { key: 'store-empty', title: 'المتجر فارغ حالياً', code: 'CUS-020', screen: 'store', params: { id: 'st-gaming' }, stack: ['home'], figma: '11:1426' },
      { key: 'product', title: 'تفاصيل المنتج', code: 'CUS-021', screen: 'product', params: { id: 'p-headphones' }, stack: ['home'], figma: '11:1516' },
      { key: 'product-soldout', title: 'تفاصيل منتج نفدت كميته', code: 'CUS-021', screen: 'product', params: { id: 'p-honey' }, stack: ['home'], figma: '11:1516' },
      { key: 'search', title: 'البحث الذكي', code: 'CUS-022', screen: 'search', figma: '11:1604' },
      { key: 'search-results', title: 'نتائج البحث', code: 'CUS-023', screen: 'search', params: { q: 'سماعات' }, figma: '11:1683' },
      { key: 'search-empty', title: 'لا توجد نتائج بحث', code: 'CUS-024', screen: 'search', params: { q: 'ثلاجة' }, figma: '11:1817' },
      { key: 'filters', title: 'الفلترة والترتيب الذكي', code: 'CUS-025', screen: 'filters', stack: ['home'], figma: '11:1894' },
      { key: 'favorites', title: 'قائمة المفضلة', screen: 'favorites', state: { favorites: new Set(['p-headphones', 'p-perfume']) }, figma: '13:4202' },
      { key: 'favorites-empty', title: 'قائمة المفضلة — فارغة', screen: 'favorites', state: { favorites: new Set() }, figma: '13:4202' },
    ],
  },
  {
    id: 'cart',
    title: 'السلة والطلبات',
    desc: 'السلة (حساب رياضي)، الدفع، حالات الطلب والتتبع والفاتورة',
    items: [
      { key: 'cart', title: 'سلة المشتريات', code: 'CUS-026', screen: 'cart', state: { cart: SAMPLE_CART }, stack: ['home'], note: '34,500×2 + 18,200 = 87,200 ر.ي', figma: '11:1973' },
      { key: 'cart-multi-store', title: 'سلة المشتريات — مفصولة حسب المتجر (متجران)', screen: 'cart', state: { cart: MULTI_STORE_CART }, stack: ['home'], note: 'طلب مستقل لكل متجر مع مجموعه الفرعي', figma: '—' },
      { key: 'cart-coupon', title: 'سلة المشتريات — مع كوبون JADEED20', code: 'CUS-028', screen: 'cart', state: { cart: SAMPLE_CART, coupon: 'JADEED20' }, stack: ['home'], note: '87,200 − 17,440 = 69,760 ر.ي', figma: '11:2221' },
      { key: 'cart-empty', title: 'سلة المشتريات فارغة', code: 'CUS-027', screen: 'cart', state: { cart: {} }, stack: ['home'], figma: '11:2094' },
      { key: 'checkout', title: 'إتمام الطلب والدفع', screen: 'checkout', state: { cart: SAMPLE_CART, coupon: 'JADEED20' }, stack: ['home', 'cart'], figma: '11:2175' },
      { key: 'out-of-stock', title: 'المنتج غير متوفر', code: 'CUS-029', screen: 'outOfStock', params: { id: 'p-honey' }, state: { cart: { 'p-honey': 1 } }, stack: ['home'], figma: '11:2128' },
      { key: 'checkout-transfer', title: 'إتمام الطلب — تحويل بنكي مع إيصال', screen: 'checkout', state: { cart: MULTI_STORE_CART }, stack: ['home', 'cart'], note: 'اختر «تحويل بنكي» لعرض بيانات حساب كل تاجر ورفع الإيصال', figma: '—' },
      { key: 'order-success', title: 'تم إنشاء الطلب بنجاح', code: 'CUS-031', screen: 'orderSuccess', params: { orderId: 'JD-984210' }, state: { orders: ORDER('new') }, figma: '11:2270' },
      { key: 'order-failed', title: 'فشل إتمام الطلب', code: 'CUS-032', screen: 'orderFailed', stack: ['home', 'checkout'], figma: '69:509', figmaAlt: '69:740' },
      { key: 'tracking', title: 'تتبع الشحنة المباشر (خرج للتوصيل)', code: 'CUS-033', screen: 'tracking', params: { orderId: 'JD-984210' }, state: { orders: ORDER('out') }, stack: ['orders'], figma: '11:2392' },
      { key: 'tracking-preparing', title: 'حالة الطلب الحالية (قيد التحضير)', code: 'CUS-039', screen: 'tracking', params: { orderId: 'JD-984210' }, state: { orders: ORDER('preparing') }, stack: ['orders'], figma: '13:3991' },
      { key: 'delivered', title: 'تم تسليم الطلب بنجاح', code: 'CUS-035', screen: 'tracking', params: { orderId: 'JD-984210' }, state: { orders: ORDER('delivered') }, stack: ['orders'], figma: '11:2652' },
      { key: 'orders', title: 'سجل طلباتي', code: 'CUS-036', screen: 'orders', state: { orders: ORDER('preparing') }, figma: '11:2543' },
      { key: 'orders-empty', title: 'لا توجد طلبات سابقة', code: 'CUS-037', screen: 'orders', state: { orders: [] }, figma: '11:2711' },
      { key: 'order-details', title: 'تفاصيل الفاتورة والطلب الكاملة', code: 'CUS-038', screen: 'orderDetails', params: { orderId: 'JD-984210' }, state: { orders: ORDER('preparing') }, stack: ['orders'], figma: '13:4061' },
      { key: 'order-cancelled', title: 'تم إلغاء الطلب', code: 'CUS-034', screen: 'orderCancelled', params: { orderId: 'JD-984210' }, state: { orders: ORDER('cancelled') }, figma: '11:2504' },
    ],
  },
  {
    id: 'account',
    title: 'الحساب والتنبيهات',
    desc: 'الملف الشخصي، مركز التنبيهات، الدعم، بوابة الإدارة',
    items: [
      { key: 'account', title: 'الملف الشخصي وإدارة الحساب', screen: 'account', figma: '13:3816' },
      { key: 'account-guest', title: 'الملف الشخصي — زائر غير مسجّل', screen: 'account', state: { auth: AUTH_GUEST, merchantStatus: 'none', favorites: new Set() }, figma: '13:3816' },
      { key: 'account-merchant', title: 'الملف الشخصي — تاجر معتمد (بيانات المتجر)', screen: 'account', state: MERCHANT_STATE, figma: '13:4429' },
      { key: 'account-merchant-pending', title: 'الملف الشخصي — طلب المتجر قيد المراجعة', screen: 'account', state: { merchantStatus: 'pending' }, figma: '13:3816' },
      { key: 'notifications', title: 'مركز التنبيهات', screen: 'notifications', state: { orders: ORDER('out') }, stack: ['home'], figma: '13:3747' },
      { key: 'legal-terms', title: 'شروط الاستخدام', screen: 'legal', params: { doc: 'terms' }, stack: ['account'], figma: '—' },
      { key: 'legal-privacy', title: 'سياسة الخصوصية', screen: 'legal', params: { doc: 'privacy' }, stack: ['account'], figma: '—' },
      { key: 'support', title: 'المساعدة والدعم الفني', screen: 'support', stack: ['account'], figma: '—' },
      { key: 'admin-login', title: 'بوابة الإدارة المركزية — تسجيل الدخول', screen: 'adminLogin', stack: ['account'], note: 'شاشة دخول فقط (لوحة الإدارة خارج النطاق)', figma: '13:6062' },
    ],
  },
  {
    id: 'merchant-onboarding',
    title: 'رحلة التاجر — التوثيق',
    desc: 'من "بيانات التاجر مطلوبة" حتى الاعتماد أو الرفض',
    items: [
      { key: 'm-intro', title: 'بيانات التاجر مطلوبة', code: 'M-042', screen: 'merchantIntro', state: { merchantStatus: 'none' }, stack: ['account'], figma: '13:3692' },
      { key: 'm-form', title: 'طلب إنشاء متجر جديد', screen: 'merchantForm', state: { merchantStatus: 'none' }, stack: ['merchantIntro'], figma: '13:3500' },
      { key: 'm-form-dashboard', title: 'طلب إنشاء متجر جديد — من لوحة التاجر', screen: 'merchantForm', state: { merchantStatus: 'none' }, stack: ['m-dashboard'], note: 'نفس النموذج عند فتحه من لوحة التاجر', figma: '13:4329' },
      { key: 'm-identity', title: 'رفع وثيقة إثبات الهوية', code: 'M-044', screen: 'merchantIdentity', state: { merchantStatus: 'none' }, stack: ['merchantForm'], figma: '13:3567' },
      { key: 'm-media', title: 'رفع صورة وشعار المتجر', code: 'M-045', screen: 'merchantMedia', state: { merchantStatus: 'none' }, stack: ['merchantIdentity'], figma: '13:3440' },
      { key: 'm-pending', title: 'طلب المتجر قيد المراجعة', screen: 'merchantPending', state: { merchantStatus: 'pending' }, figma: '13:4302' },
      { key: 'm-approved', title: 'تم اعتماد التاجر رسمياً', code: 'M-049', screen: 'merchantApproved', figma: '13:4529' },
      { key: 'm-rejected', title: 'تم رفض طلب التوثيق', code: 'M-048', screen: 'merchantRejected', state: { merchantStatus: 'rejected' }, stack: ['account'], figma: '13:4709' },
    ],
  },
  {
    id: 'merchant',
    title: 'رحلة التاجر — لوحة التحكم',
    desc: 'لوحة المتجر، المنتجات، الطلبات الواردة وكل مراحلها، الإحصائيات',
    items: [
      { key: 'm-dashboard', title: 'لوحة إدارة المتجر والمبيعات', code: 'M-050', screen: 'm-dashboard', state: { ...MERCHANT_STATE, orders: ORDER('new') }, figma: '13:4890' },
      { key: 'm-store-edit', title: 'إدارة وتعديل بيانات المتجر', state: MERCHANT_STATE, screen: 'm-store-edit', stack: ['m-dashboard'], figma: '13:4576' },
      { key: 'm-products', title: 'قائمة منتجات المتجر', code: 'M-051', state: MERCHANT_STATE, screen: 'm-products', figma: '13:4748' },
      { key: 'm-product-add', title: 'إضافة منتج جديد للمتجر', state: MERCHANT_STATE, screen: 'm-product-form', stack: ['m-products'], figma: '13:4621' },
      { key: 'm-product-edit', title: 'تعديل بيانات المنتج', code: 'M-056', state: MERCHANT_STATE, screen: 'm-product-form', params: { id: 'p-headphones' }, stack: ['m-products'], figma: '13:4390' },
      { key: 'm-product-errors', title: 'خطأ في بيانات المنتج', code: 'M-059', state: MERCHANT_STATE, screen: 'm-product-form', params: { preset: 'errors' }, stack: ['m-products'], figma: '63:11' },
      { key: 'm-product-saved', title: 'تم تعديل المنتج بنجاح', code: 'M-056', state: MERCHANT_STATE, screen: 'm-product-saved', params: { id: 'p-headphones', tab: 'm-products' }, stack: ['m-products'], figma: '63:101' },
      { key: 'm-product-delete', title: 'تأكيد حذف المنتج', code: 'M-057', state: MERCHANT_STATE, screen: 'm-products', params: { preset: 'confirm' }, figma: '13:5263' },
      { key: 'm-product-deleted', title: 'تم حذف المنتج', code: 'M-058', state: MERCHANT_STATE, screen: 'm-product-deleted', params: { name: 'كاميرا مراقبة ذكية', tab: 'm-products' }, stack: ['m-products'], figma: '13:5460' },
      { key: 'm-orders', title: 'الطلبات الواردة للمتجر', code: 'M-060', screen: 'm-orders', state: { ...MERCHANT_STATE, orders: ORDER('new') }, figma: '13:5345' },
      { key: 'm-orders-empty', title: 'لا توجد طلبات واردة', code: 'M-061', screen: 'm-orders', state: { ...MERCHANT_STATE, orders: [] }, figma: '13:5525' },
      { key: 'm-order-decision', title: 'قرار قبول أو رفض الطلب', code: 'M-063', screen: 'm-order', params: { orderId: 'JD-984210' }, state: { ...MERCHANT_STATE, orders: ORDER('new') }, stack: ['m-orders'], figma: '13:5685' },
      { key: 'm-order-transfer', title: 'تأكيد استلام التحويل وبدء التجهيز (إيصال مرفق)', state: { ...MERCHANT_STATE, orders: TRANSFER_ORDER('new') }, screen: 'm-order', params: { orderId: 'JD-984210' }, stack: ['m-orders'], note: 'زر واحد يثبت الدفع وينقل الطلب إلى التجهيز', figma: '—' },
      { key: 'm-order-accepted', title: 'تم قبول الطلب وبدء التجهيز', code: 'M-064', screen: 'm-order-accepted', params: { orderId: 'JD-984210', tab: 'm-orders' }, state: { ...MERCHANT_STATE, orders: ORDER('preparing') }, stack: ['m-orders'], figma: '13:5607' },
      { key: 'm-order-processing', title: 'معالجة وتحديث حالة الطلب', code: 'M-062', screen: 'm-order', params: { orderId: 'JD-984210' }, state: { ...MERCHANT_STATE, orders: ORDER('preparing') }, stack: ['m-orders'], figma: '13:5815' },
      { key: 'm-order-preparing', title: 'مرحلة: قيد التجهيز', code: 'M-066', screen: 'm-order', params: { orderId: 'JD-984210' }, state: { ...MERCHANT_STATE, orders: ORDER('preparing') }, stack: ['m-orders'], figma: '13:5869' },
      { key: 'm-order-ready', title: 'مرحلة: جاهز للتسليم للمندوب (مدمجة ضمن قيد التجهيز)', code: 'M-067', screen: 'm-order', params: { orderId: 'JD-984210' }, state: { ...MERCHANT_STATE, orders: ORDER('preparing') }, stack: ['m-orders'], figma: '13:5914' },
      { key: 'm-order-out', title: 'مرحلة: في الطريق', code: 'M-068', screen: 'm-order', params: { orderId: 'JD-984210' }, state: { ...MERCHANT_STATE, orders: ORDER('out') }, stack: ['m-orders'], figma: '13:5951' },
      { key: 'm-order-delivered', title: 'تم التوصيل بنجاح', code: 'M-069', screen: 'm-order', params: { orderId: 'JD-984210' }, state: { ...MERCHANT_STATE, orders: ORDER('delivered') }, stack: ['m-orders'], figma: '13:6001' },
      { key: 'm-order-rejected', title: 'تم رفض الطلب', code: 'M-065', screen: 'm-order-rejected', params: { orderId: 'JD-984210', tab: 'm-orders' }, state: { ...MERCHANT_STATE, orders: ORDER('rejected') }, stack: ['m-orders'], figma: '13:5742' },
      { key: 'm-stats', title: 'إحصائيات وأداء المبيعات', code: 'M-070', state: MERCHANT_STATE, screen: 'm-stats', figma: '13:6170' },
      { key: 'm-stats-empty', title: 'الإحصائيات غير متوفرة', code: 'M-071', screen: 'm-stats', state: { ...MERCHANT_STATE, orders: [], merchantProducts: [] }, figma: '13:6276' },
      { key: 'm-notifications', title: 'إشعارات التاجر', code: 'M-072', state: MERCHANT_STATE, screen: 'm-notifications', stack: ['m-dashboard'], figma: '13:6113' },
    ],
  },
  {
    id: 'components',
    title: 'المكونات المستقلة',
    desc: 'العناصر المشتركة كما في Figma: الرأس، شريط التنقل، الأزرار، الحقول، الحالات',
    items: [
      { key: 'c-nav', title: 'شريط التنقل السفلي (RTL · 5 تبويبات) — عميل/تاجر', screen: '__components', params: { section: 'nav' }, figma: '48:41' },
      { key: 'c-header', title: 'رأس الشاشة الموحّد (HeaderSection)', screen: '__components', params: { section: 'header' }, figma: '44:22' },
      { key: 'c-buttons', title: 'الأزرار والشرائح (Buttons & Chips)', screen: '__components', params: { section: 'buttons' }, figma: '—' },
      { key: 'c-fields', title: 'حقول الإدخال وخانات OTP', screen: '__components', params: { section: 'fields' }, figma: '—' },
      { key: 'c-cards', title: 'بطاقات المنتج والمتجر والحالات', screen: '__components', params: { section: 'cards' }, figma: '—' },
      { key: 'c-tokens', title: 'نظام الألوان الموحّد (Design Tokens)', screen: '__components', params: { section: 'tokens' }, figma: '—' },
    ],
  },
]

export const GALLERY_ITEMS = GALLERY.flatMap((g) => g.items.map((it) => ({ ...it, group: g.id, groupTitle: g.title })))
export const GALLERY_COUNT = GALLERY_ITEMS.length

// الحالة الابتدائية لعنصر في المعرض
export function stateForItem(item) {
  const stack = [...(item.stack || []).map((name) => ({ name, params: {} })), { name: item.screen, params: item.params || {} }]
  // المعرض يعرض افتراضياً عميلاً مسجّلاً؛ شاشات التاجر تمرّر merchantStatus: 'approved' عبر MERCHANT_STATE
  return { auth: AUTH_OK, merchantProducts: TECH_IDS, ...(item.state || {}), stack }
}
