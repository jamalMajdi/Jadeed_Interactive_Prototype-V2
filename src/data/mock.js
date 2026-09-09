// ─────────────────────────────────────────────────────────────
//  بيانات تجريبية موحّدة (Mock Data)
//  • أرقام الطلبات بصيغة واحدة: JD-XXXXXX
//  • كل الأسعار بالريال اليمني (ر.ي) وتُحسب رياضيًا في المتجر (store)
// ─────────────────────────────────────────────────────────────

export const CURRENCY = 'ر.ي'
export const CITY = 'تعز'
export const DELIVERY_FEE_INSIDE_CITY = 0 // مجاني داخل تعز
export const FREE_DELIVERY_NOTE = `مجاني (داخل ${CITY})`

export const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'electronics', label: 'إلكترونيات' },
  { id: 'fashion', label: 'أزياء وموضة' },
  { id: 'beauty', label: 'عطور وجمال' },
  { id: 'food', label: 'مواد غذائية' },
  { id: 'home', label: 'أدوات منزلية' },
]

export const STORES = [
  {
    id: 'st-tech',
    name: 'متجر التكنولوجيا الحديثة',
    area: 'شارع جمال',
    city: CITY,
    rating: 4.9,
    reviews: 312,
    tag: 'توصيل سريع',
    verified: true,
    open: true,
    prepTime: '30-45 دقيقة',
    minOrder: 15000,
    description: 'المتجر الرسمي الرائد في بيع أحدث الإلكترونيات والسماعات والساعات الذكية الأصلية مع ضمان سنتين.',
    cover: '/img/store-cover.jpg',
    initials: 'متجر التكنولوجيا',
  },
  {
    id: 'st-perfume',
    name: 'عطور الجزيرة الملكية',
    area: 'حوض الأشراف',
    city: CITY,
    rating: 4.8,
    reviews: 187,
    tag: 'خصم 15%',
    verified: true,
    open: true,
    prepTime: '20-30 دقيقة',
    minOrder: 5000,
    description: 'أجود العطور الشرقية والعود والمسك الأصلي من مصادر موثوقة.',
    cover: null,
    initials: 'عطور الجزيرة',
  },
  {
    id: 'st-barista',
    name: 'عالم الباريستا المنزلي',
    area: 'المسبح',
    city: CITY,
    rating: 4.7,
    reviews: 96,
    tag: 'بن يمني أصلي',
    verified: true,
    open: true,
    prepTime: '15-25 دقيقة',
    minOrder: 3000,
    description: 'بن يمني معطر وأدوات تحضير القهوة للمنزل والمكتب.',
    cover: null,
    initials: 'عالم الباريستا',
  },
  {
    id: 'st-gaming',
    name: 'جيمرز هاب للترفيه',
    area: 'التحرير',
    city: CITY,
    rating: 4.6,
    reviews: 74,
    tag: 'عروض أسبوعية',
    verified: false,
    open: false,
    prepTime: '40-60 دقيقة',
    minOrder: 10000,
    description: 'ألعاب وإكسسوارات للاعبين.',
    cover: null,
    initials: 'جيمرز هاب',
  },
  {
    id: 'st-decor',
    name: 'روائع الديكور والمنزل',
    area: 'بير باشا',
    city: CITY,
    rating: 4.5,
    reviews: 58,
    tag: 'تشكيلة جديدة',
    verified: true,
    open: true,
    prepTime: '45-60 دقيقة',
    minOrder: 8000,
    description: 'قطع ديكور ومستلزمات منزلية عصرية.',
    cover: null,
    initials: 'روائع الديكور',
  },
]

export const PRODUCTS = [
  {
    id: 'p-headphones',
    storeId: 'st-tech',
    name: 'سماعات الرأس اللاسلكية الاحترافية مع خاصية إلغاء الضوضاء',
    shortName: 'سماعات رأس لاسلكية احترافية',
    category: 'electronics',
    price: 34500,
    oldPrice: 42000,
    stock: 24,
    badge: 'الأكثر مبيعاً',
    image: '/img/headphones.jpg',
    bg: '#FBBF24',
    description:
      'استمتع بنقاء صوتي فائق وتجربة صوت ثلاثي الأبعاد مع عزل تام للضوضاء المحيطة. وسائد أذن ميموري فوم مريحة للاستخدام الطويل مع ميكروفونات ذكية للمكالمات الواضحة.',
    specs: [
      ['عمر البطارية', 'حتى 40 ساعة متواصلة'],
      ['البلوتوث', 'إصدار 5.3 فائق الاستقرار'],
      ['مقاومة الماء', 'معيار IPX4'],
      ['الشحن السريع', '5 دقائق تمنحك 4 ساعات تشغيل'],
    ],
    sold: 140,
  },
  {
    id: 'p-watch',
    storeId: 'st-tech',
    name: 'ساعة ذكية رياضية من التيتانيوم مع شاشة AMOLED',
    shortName: 'ساعة ذكية رياضية من التيتانيوم',
    category: 'electronics',
    price: 18200,
    oldPrice: 26000,
    stock: 18,
    badge: 'خصم هائل',
    image: '/img/watch.jpg',
    bg: '#E5E7EB',
    description: 'ساعة ذكية بهيكل تيتانيوم خفيف، تتبع للنبض والأكسجين والنوم، ومقاومة للماء حتى 50 مترًا.',
    specs: [
      ['الشاشة', 'AMOLED 1.43 بوصة'],
      ['البطارية', 'حتى 14 يومًا'],
      ['مقاومة الماء', '5ATM'],
      ['التوافق', 'iOS و Android'],
    ],
    sold: 110,
  },
  {
    id: 'p-perfume',
    storeId: 'st-perfume',
    name: 'عطر العود والمسك الملكي النادر - تركيز عالٍ',
    shortName: 'عطر العود والمسك الملكي',
    category: 'beauty',
    price: 9500,
    oldPrice: null,
    stock: 42,
    badge: null,
    image: '/img/perfume.jpg',
    bg: '#FCE7F3',
    description: 'مزيج فاخر من العود الكمبودي والمسك الأبيض بثبات يدوم أكثر من 12 ساعة.',
    specs: [
      ['الحجم', '100 مل'],
      ['التركيز', 'Extrait de Parfum'],
      ['الثبات', '12+ ساعة'],
    ],
    sold: 80,
  },
  {
    id: 'p-shoes',
    storeId: 'st-decor',
    name: 'حذاء الجري الرياضي خفيف الوزن بنعل مرن',
    shortName: 'حذاء الجري الرياضي خفيف الوزن',
    category: 'fashion',
    price: 12900,
    oldPrice: 15500,
    stock: 15,
    badge: null,
    image: '/img/shoes.jpg',
    bg: '#FEE2E2',
    description: 'حذاء جري بوزن 210 جرام فقط، نعل رغوي عالي الارتداد وقماش شبكي يسمح بتهوية ممتازة.',
    specs: [
      ['الوزن', '210 جم'],
      ['المقاسات', '39 – 45'],
      ['النعل', 'رغوة EVA مرنة'],
    ],
    sold: 64,
  },
  {
    id: 'p-coffee',
    storeId: 'st-barista',
    name: 'بن يمني خولاني فاخر محمص - 500 جرام',
    shortName: 'بن يمني خولاني فاخر',
    category: 'food',
    price: 6000,
    oldPrice: null,
    stock: 45,
    badge: 'منتج محلي',
    image: '/img/coffee.jpg',
    bg: '#FEF3C7',
    description: 'بن خولاني من مرتفعات اليمن، تحميص متوسط بنكهات الشوكولاتة والفواكه المجففة.',
    specs: [
      ['الوزن', '500 جم'],
      ['التحميص', 'متوسط'],
      ['المنشأ', 'خولان - اليمن'],
    ],
    sold: 52,
  },
  {
    id: 'p-espresso',
    storeId: 'st-barista',
    name: 'ماكينة تحضير قهوة الإسبريسو المنزلية 15 بار',
    shortName: 'ماكينة تحضير الإسبريسو',
    category: 'home',
    price: 52000,
    oldPrice: 58000,
    stock: 12,
    badge: null,
    image: '/img/espresso.jpg',
    bg: '#E0E7FF',
    description: 'ماكينة إسبريسو بضغط 15 بار مع مبخّر حليب، خزان مياه 1.5 لتر وتسخين سريع خلال 30 ثانية.',
    specs: [
      ['الضغط', '15 بار'],
      ['الخزان', '1.5 لتر'],
      ['القدرة', '1350 واط'],
    ],
    sold: 21,
  },
  {
    id: 'p-honey',
    storeId: 'st-barista',
    name: 'عسل سدر جبلي يمني دوعني - 1 كجم',
    shortName: 'عسل سدر جبلي دوعني',
    category: 'food',
    price: 28000,
    oldPrice: null,
    stock: 0, // نفدت الكمية (لتجربة حالة CUS-029)
    badge: 'نفدت الكمية',
    image: null,
    bg: '#FEF3C7',
    description: 'عسل سدر دوعني أصلي 100% من وادي دوعن بحضرموت.',
    specs: [
      ['الوزن', '1 كجم'],
      ['المصدر', 'وادي دوعن'],
    ],
    sold: 33,
  },
  {
    id: 'p-saffron',
    storeId: 'st-perfume',
    name: 'زعفران إيراني أصلي - 5 جرام',
    shortName: 'زعفران إيراني أصلي 5 جرام',
    category: 'food',
    price: 4500,
    oldPrice: null,
    stock: 30,
    badge: null,
    image: null,
    bg: '#FFEDD5',
    description: 'زعفران سرقل فاخر بخيوط حمراء كاملة.',
    specs: [['الوزن', '5 جم']],
    sold: 17,
  },
]

export const TRENDING_SEARCHES = ['بن يمني معطر', 'غسل دوعني', 'سماعات بلوتوث', 'عطور شرقية', 'أدوات منزلية']

export const AREAS = ['الكل', 'شارع جمال', 'المسبح', 'التحرير', 'بير باشا', 'حوض الأشراف', 'الحوبان'] // الحوبان بلا متاجر بعد → حالة CUS-018

export const COUPONS = {
  JADEED20: { type: 'percent', value: 20, label: 'خصم 20% لعملاء جديد' },
  WELCOME10: { type: 'percent', value: 10, label: 'خصم ترحيبي 10%' },
  FLAT2000: { type: 'flat', value: 2000, label: 'خصم 2,000 ر.ي' },
}

export const ADDRESSES = [
  { id: 'a1', title: 'المنزل (الرئيسي)', details: 'المسبح، قرب جولة المسبح، تعز', phone: '773030064' },
  { id: 'a2', title: 'مقر العمل', details: 'شارع جمال، أمام بنك التضامن، تعز', phone: '773030064' },
  { id: 'a3', title: 'الفرع الثاني', details: 'الحوبان، مجمع النور، تعز', phone: '773030064' },
]

export const USER = {
  name: 'محمد سعيد',
  phone: '773030064',
  email: 'mohammed.saeed@gmail.com',
  area: 'المسبح',
  city: CITY,
  avatar: '/img/avatar.jpg',
  verified: true,
}

export const COURIER = {
  name: 'كابتن فهد السامعي',
  vehicle: 'دراجة توصيل سريعة',
  verified: true,
  avatar: '/img/courier.jpg',
}

// مراحل دورة حياة الطلب (موحّدة بين واجهة العميل ولوحة التاجر)
export const ORDER_STAGES = [
  { key: 'new', label: 'جديد', desc: 'تم تسجيل الطلب في نظام جديد بنجاح' },
  { key: 'accepted', label: 'مقبول', desc: `تم قبول الطلب من قبل المتجر في ${CITY}` },
  { key: 'preparing', label: 'قيد التحضير', desc: 'جاري تجهيز وتغليف المنتجات بعناية' },
  { key: 'ready', label: 'جاهز', desc: 'الطلب جاهز لاستلام مندوب التوصيل' },
  { key: 'out', label: 'خرج للتوصيل', desc: 'مندوب التوصيل في طريقه إلى عنوانك' },
  { key: 'delivered', label: 'تم التوصيل', desc: 'استلام الشحنة وتأكيد التسليم بنجاح' },
]

export const STAGE_INDEX = Object.fromEntries(ORDER_STAGES.map((s, i) => [s.key, i]))

// طلبات سابقة (البيانات محسوبة رياضيًا من المنتجات)
export const SEED_ORDERS = [
  {
    id: 'JD-984188',
    storeId: 'st-tech',
    createdAt: 'أمس، 04:15 م',
    items: [{ productId: 'p-watch', qty: 1, price: 18200 }],
    subtotal: 18200,
    discount: 0,
    deliveryFee: 0,
    total: 18200,
    stage: 'delivered',
    payment: 'الدفع نقداً عند الاستلام',
    addressId: 'a1',
    coupon: null,
  },
  {
    id: 'JD-984050',
    storeId: 'st-barista',
    createdAt: 'قبل 3 أيام، 11:00 ص',
    items: [
      { productId: 'p-coffee', qty: 2, price: 6000 },
      { productId: 'p-saffron', qty: 1, price: 4500 },
    ],
    subtotal: 16500,
    discount: 0,
    deliveryFee: 0,
    total: 16500,
    stage: 'delivered',
    payment: 'الدفع نقداً عند الاستلام',
    addressId: 'a2',
    coupon: null,
  },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'طلبك في الطريق إليك!', body: 'الكابتن فهد استلم طلبك رقم JD-984210 وهو في طريقه إلى موقعك.', time: 'منذ 25 دقيقة', icon: 'truck', tone: 'primary' },
  { id: 'n2', title: 'قسيمة خصم 20% بانتظارك', body: 'استخدم الكود JADEED20 واحصل على خصم فوري على طلبك القادم.', time: 'منذ 3 ساعات', icon: 'tag', tone: 'secondary' },
  { id: 'n3', title: 'تم شحن محفظتك الرقمية', body: 'تمت إضافة 50 ريال مكافأة ترحيبية إلى رصيد حسابك.', time: 'أمس', icon: 'wallet', tone: 'warning' },
]

export const MERCHANT = {
  storeId: 'st-tech',
  merchantId: 'MER-7729',
  requestId: 'STR-REQ-101',
  todaySales: 345000,
  salesDelta: '+18% مقارنة بالأمس',
  activeProducts: 42,
  outOfStock: 3,
  completion: 100,
  weekly: [
    { day: 'السبت', value: 120 },
    { day: 'الأحد', value: 210 },
    { day: 'الاثنين', value: 160 },
    { day: 'الثلاثاء', value: 280 },
    { day: 'الأربعاء', value: 240 },
    { day: 'الخميس', value: 345 },
    { day: 'الجمعة', value: 190 },
  ],
}

export const MERCHANT_NOTIFICATIONS = [
  { id: 'm1', title: 'طلب جديد بانتظار القبول', body: 'طلب رقم JD-984210 بحاجة للموافقة وبدء التجهيز.', time: 'منذ 10 دقائق' },
  { id: 'm2', title: 'تنبيه مخزون منخفض', body: 'الكمية المتبقية لمنتج "ساعة ذكية رياضية" أقل من 5 قطع.', time: 'منذ ساعتين' },
  { id: 'm3', title: 'تم تحويل مستحقاتك البنكية', body: 'تم إيداع مبلغ 845,000 ر.ي في حسابك المصرفي المسجل.', time: 'أمس' },
]

export const productById = (id) => PRODUCTS.find((p) => p.id === id)
export const storeById = (id) => STORES.find((s) => s.id === id)

export const fmt = (n) => new Intl.NumberFormat('en-US').format(Math.round(n))

// طلب نموذجي (يُستخدم في معرض الشاشات لعرض كل مرحلة بشكل مستقل) — الأرقام محسوبة رياضياً:
// 34,500 + 18,200 = 52,700 − خصم JADEED20 (20% = 10,540) + توصيل مجاني = 42,160
export const makeSampleOrder = (stage = 'new', overrides = {}) => ({
  id: 'JD-984210',
  storeId: 'st-tech',
  createdAt: 'اليوم، 10:30 ص',
  items: [
    { productId: 'p-headphones', qty: 1, price: 34500 },
    { productId: 'p-watch', qty: 1, price: 18200 },
  ],
  subtotal: 52700,
  discount: 10540,
  deliveryFee: 0,
  total: 42160,
  stage,
  payment: 'الدفع نقداً عند الاستلام',
  addressId: 'a1',
  coupon: 'JADEED20',
  ...overrides,
})
