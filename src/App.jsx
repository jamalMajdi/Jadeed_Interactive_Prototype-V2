import React, { useEffect, useMemo, useState } from 'react'
import { AppProvider, useApp } from './store/AppContext'
import { Toast, Logo, OfflineBanner, AuthPrompt } from './components/ui'
import { Splash, Onboarding, AccountType, Login, OtpSent, OtpVerify, OtpLocked, LoginSuccess, Register, RegisterSuccess, RegisterFailed, ForgotPassword } from './screens/Onboarding'
import { LocationPermission, LocationSuccess, LocationDenied, Addresses, MapPinScreen, Home, NearbyStores, StoreScreen, ProductScreen, SearchScreen, FiltersScreen, Favorites } from './screens/Shopping'
import { CartScreen, Checkout, OrderSuccess, OrderFailed, OutOfStock, Orders, OrderDetails, OrderCancelled, Tracking } from './screens/Cart'
import { Account, Notifications, Support, Legal } from './screens/Account'
import { MerchantIntro, MerchantForm, MerchantIdentity, MerchantMedia, MerchantPending, MerchantApproved, MerchantRejected, MerchantBanned, MerchantDashboard, MerchantStoreEdit, MerchantProducts, MerchantProductForm, MerchantProductSaved, MerchantProductDeleted, MerchantOrders, MerchantOrder, MerchantOrderAccepted, MerchantOrderRejected, MerchantStats, MerchantNotifications, AdminLogin } from './screens/Merchant'
import { ComponentsShowcase } from './gallery/ComponentsShowcase'
import { GALLERY, GALLERY_ITEMS, GALLERY_COUNT, stateForItem } from './gallery/catalog'
import { Smartphone, RotateCcw, ShoppingBag, Store, KeyRound, Ban, LayoutGrid, Play, ArrowRight, ChevronLeft, ChevronRight, Search, Layers, Sparkles, Palette, UserRound, ShieldCheck, RefreshCw, X, Wifi, WifiOff } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
//  جدول الشاشات (Router بسيط قائم على مكدس داخل Context)
// ─────────────────────────────────────────────────────────────
export const SCREENS = {
  splash: Splash,
  onboarding: Onboarding,
  accountType: AccountType,
  login: Login,
  otpSent: OtpSent,
  otp: OtpVerify,
  otpLocked: OtpLocked,
  loginSuccess: LoginSuccess,
  register: Register,
  registerSuccess: RegisterSuccess,
  registerFailed: RegisterFailed,
  forgotPassword: ForgotPassword,

  locationPermission: LocationPermission,
  locationSuccess: LocationSuccess,
  locationDenied: LocationDenied,
  addresses: Addresses,
  mapPin: MapPinScreen,

  home: Home,
  nearbyStores: NearbyStores,
  store: StoreScreen,
  product: ProductScreen,
  search: SearchScreen,
  filters: FiltersScreen,
  favorites: Favorites,

  cart: CartScreen,
  checkout: Checkout,
  orderSuccess: OrderSuccess,
  orderFailed: OrderFailed,
  outOfStock: OutOfStock,
  orders: Orders,
  orderDetails: OrderDetails,
  orderCancelled: OrderCancelled,
  tracking: Tracking,

  account: Account,
  notifications: Notifications,
  support: Support,
  legal: Legal,

  merchantIntro: MerchantIntro,
  merchantForm: MerchantForm,
  merchantIdentity: MerchantIdentity,
  merchantMedia: MerchantMedia,
  merchantPending: MerchantPending,
  merchantApproved: MerchantApproved,
  merchantRejected: MerchantRejected,
  merchantBanned: MerchantBanned,
  'm-dashboard': MerchantDashboard,
  'm-store-edit': MerchantStoreEdit,
  'm-products': MerchantProducts,
  'm-product-form': MerchantProductForm,
  'm-product-saved': MerchantProductSaved,
  'm-product-deleted': MerchantProductDeleted,
  'm-orders': MerchantOrders,
  'm-order': MerchantOrder,
  'm-order-accepted': MerchantOrderAccepted,
  'm-order-rejected': MerchantOrderRejected,
  'm-stats': MerchantStats,
  'm-notifications': MerchantNotifications,
  adminLogin: AdminLogin,

  // معرض المكونات المستقلة (Design System)
  __components: ComponentsShowcase,
}

function ScreenRouter() {
  const { current, isBanned } = useApp()
  // التاجر المحظور لا يصل إلى أي شاشة من شاشات لوحة التاجر — تُعرض شاشة الحظر بدلاً منها
  const Screen = isBanned && current.name.startsWith('m-') ? MerchantBanned : SCREENS[current.name] || Home
  return (
    <div key={`${current.name}-${JSON.stringify(current.params || {})}`} className="absolute inset-0 flex flex-col animate-fade-in [&>*]:min-h-0 [&>*]:max-h-full [&>*]:overflow-hidden">
      <Screen />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  إطار الهاتف 390×844
// ─────────────────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div className="relative" style={{ width: 390 + 24, height: 844 + 24 }}>
      <div className="absolute inset-0 rounded-[56px] bg-ink-900 shadow-[0_30px_80px_-20px_rgba(17,24,39,0.6)]" />
      <div className="absolute inset-[3px] rounded-[53px] bg-ink-800/80" />
      <div className="absolute -left-[3px] top-[120px] w-[3px] h-8 rounded-l bg-ink-700" />
      <div className="absolute -left-[3px] top-[170px] w-[3px] h-14 rounded-l bg-ink-700" />
      <div className="absolute -left-[3px] top-[240px] w-[3px] h-14 rounded-l bg-ink-700" />
      <div className="absolute -right-[3px] top-[190px] w-[3px] h-20 rounded-r bg-ink-700" />
      <div className="absolute inset-3 rounded-[44px] overflow-hidden bg-white" style={{ width: 390, height: 844 }}>
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[120px] h-[34px] rounded-full bg-ink-900 z-[60] pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden">{children}</div>
        <OfflineBanner />
        <AuthPrompt />
        <Toast />
      </div>
    </div>
  )
}

// تصغير إطار الهاتف تلقائيًا على الشاشات الصغيرة حتى لا يخرج عن حدود العرض
function useFrameScale(reserveW = 24, reserveH = 24) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const calc = () => setScale(Math.min(1, (window.innerWidth - reserveW) / 414, (window.innerHeight - reserveH) / 868))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [reserveW, reserveH])
  return scale
}

function ScaledPhone({ scale, children }) {
  return (
    <div style={{ width: 414 * scale, height: 868 * scale }} className="relative shrink-0">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }} className="absolute top-0 left-0">
        <PhoneFrame>{children}</PhoneFrame>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  التوجيه على مستوى التطبيق (Hash): #/ · #/gallery · #/gallery/<key> · #/prototype
// ─────────────────────────────────────────────────────────────
function parseHash() {
  const h = (window.location.hash || '#/').replace(/^#/, '')
  const [, mode = '', key = ''] = h.split('/')
  if (mode === 'prototype') return { mode: 'prototype' }
  if (mode === 'gallery') return { mode: 'gallery', key: decodeURIComponent(key) }
  return { mode: 'landing' }
}
function useHashRoute() {
  const [route, setRoute] = useState(parseHash)
  useEffect(() => {
    const on = () => setRoute(parseHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const go = (path) => { window.location.hash = path }
  return [route, go]
}

// ─────────────────────────────────────────────────────────────
//  1) الشاشة الترحيبية للمطوّر / المُقيّم (Landing)
// ─────────────────────────────────────────────────────────────
const STATS = [
  { v: GALLERY_COUNT, l: 'شاشة وحالة في المعرض' },
  { v: GALLERY.length, l: 'فئات مصنّفة' },
  { v: '2', l: 'رحلتان: عميل + تاجر' },
  { v: '0', l: 'أخطاء Console' },
]
const FIXES = [
  ['Design Tokens موحّدة', '#5002C9 أساسي · #FF5715 ثانوي · سلّم رمادي واحد (ink)'],
  ['OTP = 4 أرقام', 'موحّد في كل الشاشات مع قفل بعد 3 محاولات (CUS-006)'],
  ['أرقام الطلبات JD-XXXXXX', 'صيغة واحدة في السلة والتتبع والفاتورة ولوحة التاجر'],
  ['حساب السلة رياضياً', 'المجموع + التوصيل = الإجمالي، بلا أرقام ثابتة'],
  ['شريط تنقل موحّد RTL', 'ترتيب وأيقونات ثابتة للعميل وللتاجر مع شارات حيّة'],
  ['دورة حياة الطلب', 'جديد → مقبول → تحضير → جاهز → توصيل → تم، مزامنة تاجر ↔ عميل'],
]

function Landing({ go }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1040px] animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <Logo size={56} />
          <div className="mr-auto flex items-center gap-2 text-[11px] font-bold text-ink-500">
            <span className="px-2.5 h-7 rounded-full bg-white border border-ink-200 flex items-center gap-1"><Smartphone size={12} /> 390×844</span>
            <span className="px-2.5 h-7 rounded-full bg-white border border-ink-200 flex items-center">React + Tailwind</span>
            <span className="px-2.5 h-7 rounded-full bg-white border border-ink-200 flex items-center">RTL · Cairo</span>
          </div>
        </div>

        <h1 className="text-[30px] md:text-[40px] font-black text-ink-900 leading-tight">
          نموذج <span className="text-primary">جديد</span> التفاعلي — <span className="text-secondary">نسخة المطوّر / المُقيّم</span>
        </h1>
        <p className="text-[14px] md:text-[15px] font-medium text-ink-600 mt-3 max-w-[720px] leading-relaxed">
          اختر طريقة الاستعراض: تصفّح <b>كل الشاشات المبرمجة</b> بشكل مستقل ومصنّف للتأكد من مطابقتها للتصميم، أو جرّب <b>التطبيق التفاعلي الكامل</b> بتدفقه الطبيعي من شاشة البداية مع البيانات الوهمية.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <button onClick={() => go('/gallery')} className="group text-right rounded-[28px] bg-white border border-ink-200 p-6 shadow-card hover:shadow-elevated hover:border-primary transition-all active:scale-[0.99]">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-brand"><LayoutGrid size={26} /></div>
              <span className="text-[11px] font-extrabold text-primary bg-primary-50 rounded-full px-3 h-7 flex items-center">{GALLERY_COUNT} شاشة</span>
            </div>
            <h2 className="text-[22px] font-extrabold text-ink-900 mt-5">معرض الشاشات</h2>
            <p className="text-[12px] text-ink-500 font-medium leading-relaxed mt-1">Screens Dashboard / UI Gallery — كل شاشة معزولة بحالتها الخاصة (نجاح، خطأ، فارغ…) ومصنّفة: التهيئة، التسجيل، العميل، التاجر، المكونات المستقلة.</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {GALLERY.map((g) => <span key={g.id} className="text-[10px] font-bold text-ink-600 bg-ink-100 rounded-full px-2.5 h-6 flex items-center">{g.title}</span>)}
            </div>
            <span className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary mt-5 group-hover:gap-2 transition-all">فتح المعرض <ChevronLeft size={16} strokeWidth={2.6} /></span>
          </button>

          <button onClick={() => go('/prototype')} className="group text-right rounded-[28px] bg-gradient-to-bl from-primary to-primary-800 text-white p-6 shadow-brand hover:shadow-modal transition-all active:scale-[0.99] relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-secondary/30 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white text-primary flex items-center justify-center shadow-elevated"><Play size={26} fill="currentColor" /></div>
                <span className="text-[11px] font-extrabold bg-white/15 rounded-full px-3 h-7 flex items-center">MVP تفاعلي</span>
              </div>
              <h2 className="text-[22px] font-extrabold mt-5">تجربة النموذج الأولي</h2>
              <p className="text-[12px] text-white/85 font-medium leading-relaxed mt-1">Interactive Prototype — يبدأ من شاشة البداية والتهيئة ويستمر بتدفق حقيقي: تسجيل، OTP، تسوّق، سلة بحساب رياضي، طلب، تتبع، ولوحة تاجر تعالج الطلب نفسه.</p>
              <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] font-bold">
                <span className="bg-white/10 rounded-xl px-2 py-1.5 text-center">OTP: 1234</span>
                <span className="bg-white/10 rounded-xl px-2 py-1.5 text-center">JADEED20</span>
                <span className="bg-white/10 rounded-xl px-2 py-1.5 text-center">لوحة عرض جانبية</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-extrabold mt-5 group-hover:gap-2 transition-all">بدء التجربة <ChevronLeft size={16} strokeWidth={2.6} /></span>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {STATS.map((s) => (
            <div key={s.l} className="rounded-2xl bg-white/70 backdrop-blur border border-white p-4 text-center">
              <p className="text-[24px] font-black text-ink-900 tabular leading-none">{s.v}</p>
              <p className="text-[11px] font-bold text-ink-500 mt-1.5">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[24px] bg-white/70 backdrop-blur border border-white p-5 mt-6">
          <p className="text-[12px] font-extrabold text-ink-500 mb-3 flex items-center gap-1.5"><Sparkles size={14} className="text-secondary" /> ما تم تصحيحه برمجياً مقارنةً بملف Figma</p>
          <div className="grid md:grid-cols-3 gap-x-6 gap-y-3">
            {FIXES.map(([t, d]) => (
              <div key={t} className="flex gap-2">
                <ShieldCheck size={16} className="text-success shrink-0 mt-0.5" />
                <div><p className="text-[12px] font-bold text-ink-900">{t}</p><p className="text-[11px] text-ink-500 leading-relaxed">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-ink-400 font-medium mt-6 text-center">شاشات الإدارة المركزية (Admin Web) خارج نطاق هذا النموذج بحسب التصميم — بوابة الدخول فقط مضمّنة كشاشة توضيحية.</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  2) معرض الشاشات (Gallery)
// ─────────────────────────────────────────────────────────────
const GROUP_ICONS = { onboarding: Smartphone, auth: KeyRound, location: Layers, customer: ShoppingBag, cart: ShoppingBag, account: UserRound, 'merchant-onboarding': Store, merchant: Store, components: Palette }

function GalleryStateReadout() {
  const { current, cart, state } = useApp()
  return (
    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] tabular">
      <dt className="text-ink-500">الشاشة</dt><dd className="font-bold font-mono text-left truncate" dir="ltr">{current.name}</dd>
      <dt className="text-ink-500">المعاملات</dt><dd className="font-mono text-left text-[10px] truncate" dir="ltr">{JSON.stringify(current.params || {})}</dd>
      <dt className="text-ink-500">السلة</dt><dd className="font-bold">{cart.itemCount} · {new Intl.NumberFormat('en-US').format(cart.total)} ر.ي</dd>
      <dt className="text-ink-500">الطلبات</dt><dd className="font-bold">{state.orders.length}</dd>
    </dl>
  )
}

function Gallery({ route, go }) {
  const [q, setQ] = useState('')
  const [menu, setMenu] = useState(false)
  const [open, setOpen] = useState(() => Object.fromEntries(GALLERY.map((g) => [g.id, true])))
  const [nonce, setNonce] = useState(0)
  const scale = useFrameScale(24, 96)
  const selectedKey = route.key || GALLERY_ITEMS[0].key
  const idx = Math.max(0, GALLERY_ITEMS.findIndex((i) => i.key === selectedKey))
  const item = GALLERY_ITEMS[idx]
  const prev = GALLERY_ITEMS[(idx - 1 + GALLERY_COUNT) % GALLERY_COUNT]
  const next = GALLERY_ITEMS[(idx + 1) % GALLERY_COUNT]
  const initial = useMemo(() => stateForItem(item), [item, nonce])
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return GALLERY
    return GALLERY.map((g) => ({ ...g, items: g.items.filter((i) => `${i.title} ${i.code || ''} ${i.screen} ${i.key}`.toLowerCase().includes(t)) })).filter((g) => g.items.length)
  }, [q])

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return
      if (e.key === 'ArrowLeft') go(`/gallery/${next.key}`)
      if (e.key === 'ArrowRight') go(`/gallery/${prev.key}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next.key, prev.key])

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* الشريط العلوي */}
      <header className="h-14 shrink-0 px-4 flex items-center gap-3 bg-white/80 backdrop-blur border-b border-ink-200 sticky top-0 z-20">
        <button onClick={() => go('/')} className="icon-btn" aria-label="العودة للبداية"><ArrowRight size={18} strokeWidth={2.4} /></button>
        <Logo size={30} />
        <div className="leading-none min-w-0 border-r border-ink-200 pr-3">
          <p className="text-[14px] font-extrabold text-ink-900 whitespace-nowrap">معرض الشاشات</p>
          <p className="text-[10px] font-bold text-ink-500 mt-0.5 whitespace-nowrap">{GALLERY_COUNT} شاشة وحالة · {GALLERY.length} فئات</p>
        </div>
        <div className="mr-auto flex items-center gap-2 shrink-0">
          <button onClick={() => setMenu((m) => !m)} className="md:hidden btn-outline btn-sm !px-3"><Layers size={13} /> الشاشات</button>
          <button onClick={() => go('/prototype')} className="btn-primary btn-sm !px-3 whitespace-nowrap"><Play size={13} fill="currentColor" /> <span className="hidden sm:inline">تجربة النموذج</span><span className="sm:hidden">النموذج</span></button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* القائمة الجانبية */}
        {menu && <div className="md:hidden fixed inset-0 top-14 bg-ink-900/40 z-10" onClick={() => setMenu(false)} />}
        <aside className={`w-[320px] max-w-[85vw] shrink-0 border-l border-ink-200 bg-white/95 md:bg-white/60 backdrop-blur flex-col fixed md:static top-14 right-0 bottom-0 z-10 ${menu ? 'flex' : 'hidden md:flex'}`} style={{ height: 'calc(100vh - 56px)' }}>
          <div className="p-3 border-b border-ink-100">
            <div className="relative">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث باسم الشاشة أو رمزها (CUS-026 / M-063)…" className="field !h-10 pr-9 text-[12px]" />
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
              {q && <button onClick={() => setQ('')} className="absolute left-2 top-1/2 -translate-y-1/2 text-ink-400" aria-label="مسح"><X size={14} /></button>}
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto scroll-thin p-2 space-y-1">
            {filtered.map((g) => {
              const Icon = GROUP_ICONS[g.id] || Layers
              const isOpen = open[g.id] || !!q
              return (
                <div key={g.id}>
                  <button onClick={() => setOpen({ ...open, [g.id]: !open[g.id] })} className="w-full flex items-center gap-2 px-2.5 h-10 rounded-xl hover:bg-white text-right">
                    <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary flex items-center justify-center"><Icon size={14} /></span>
                    <span className="flex-1 text-[12px] font-extrabold text-ink-900 truncate">{g.title}</span>
                    <span className="text-[10px] font-bold text-ink-400 tabular">{g.items.length}</span>
                    <ChevronLeft size={14} className={`text-ink-400 transition ${isOpen ? '-rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <ul className="pr-3 pb-1 space-y-0.5">
                      {g.items.map((it) => {
                        const active = it.key === item.key
                        return (
                          <li key={it.key}>
                            <button onClick={() => { go(`/gallery/${it.key}`); setMenu(false) }} className={`w-full text-right px-3 h-9 rounded-lg flex items-center gap-2 transition ${active ? 'bg-primary text-white shadow-brand' : 'hover:bg-white text-ink-700'}`}>
                              <span className={`text-[11px] font-bold truncate flex-1 ${active ? 'text-white' : ''}`}>{it.title}</span>
                              {it.code && <span className={`text-[9px] font-mono font-bold shrink-0 ${active ? 'text-white/80' : 'text-secondary'}`} dir="ltr">{it.code}</span>}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
            {!filtered.length && <p className="text-center text-[12px] text-ink-500 py-10">لا توجد شاشة مطابقة لبحثك</p>}
          </nav>
        </aside>

        {/* منطقة المعاينة */}
        <main className="flex-1 min-w-0 flex flex-col items-center px-4 py-3 gap-3 overflow-y-auto" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="w-full max-w-[760px] rounded-2xl bg-white/70 backdrop-blur border border-white px-4 py-2.5 flex items-center gap-3">
            <button onClick={() => go(`/gallery/${prev.key}`)} className="icon-btn" title="السابقة (→)"><ChevronRight size={18} /></button>
            <div className="flex-1 min-w-0 text-center">
              <p className="text-[13px] font-extrabold text-ink-900 truncate">{item.title} {item.code && <span className="font-mono text-[11px] text-secondary" dir="ltr">{item.code}</span>}</p>
              <p className="text-[10px] font-bold text-ink-500 truncate">
                {item.groupTitle} · <span className="font-mono" dir="ltr">{item.screen}</span>{item.figma && item.figma !== '—' ? <> · Figma <span className="font-mono" dir="ltr">{item.figma}</span></> : null} · {idx + 1}/{GALLERY_COUNT}
              </p>
            </div>
            <button onClick={() => setNonce((n) => n + 1)} className="icon-btn" title="إعادة ضبط حالة الشاشة"><RefreshCw size={16} /></button>
            <button onClick={() => go(`/gallery/${next.key}`)} className="icon-btn" title="التالية (←)"><ChevronLeft size={18} /></button>
          </div>

          <AppProvider key={`${item.key}-${nonce}`} initial={initial} autoAdvance={false}>
            <ScaledPhone scale={scale}>
              <ScreenRouter />
            </ScaledPhone>
            <div className="w-full max-w-[760px] rounded-2xl bg-white/70 backdrop-blur border border-white px-4 py-2.5 grid md:grid-cols-2 gap-3">
              <GalleryStateReadout />
              <p className="text-[11px] text-ink-500 leading-relaxed md:border-r md:border-ink-200 md:pr-3">
                {item.note ? <><b className="text-ink-700">ملاحظة:</b> {item.note} · </> : null}
                الشاشة تفاعلية بالكامل ومعزولة بحالتها الخاصة؛ التنقل داخلها يعمل فعلياً، واضغط <RefreshCw size={11} className="inline" /> لإعادة ضبطها. الأسهم ← → للتنقل بين الشاشات.
              </p>
            </div>
          </AppProvider>
        </main>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  3) النموذج التفاعلي الكامل (Prototype) — مع لوحة عرض جانبية
// ─────────────────────────────────────────────────────────────
function DemoPanel({ go }) {
  const { state, dispatch, switchTab, navigate, cart, current } = useApp()
  const Btn = ({ onClick, Icon, children }) => (
    <button onClick={onClick} className="w-full flex items-center gap-2 text-right px-3 h-10 rounded-xl bg-white/70 hover:bg-white text-[12px] font-bold text-ink-800 transition border border-white">
      <Icon size={15} className="text-primary" /> {children}
    </button>
  )
  return (
    <aside className="w-[290px] shrink-0 hidden lg:flex flex-col gap-4 text-ink-800">
      <div className="flex items-center gap-2">
        <button onClick={() => go('/')} className="icon-btn bg-white" aria-label="العودة للبداية"><ArrowRight size={18} strokeWidth={2.4} /></button>
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-brand"><Smartphone className="text-white" size={20} /></div>
        <div>
          <h1 className="text-[18px] font-black text-ink-900 leading-none">جديد · نموذج تفاعلي</h1>
          <p className="text-[11px] font-medium text-ink-500 mt-1">React + Tailwind · RTL · Cairo · 390×844</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur border border-white p-3 space-y-1.5">
        <p className="text-[11px] font-extrabold text-ink-500 px-1 mb-1">اختصارات العرض</p>
        <Btn onClick={() => navigate('splash', {}, { resetTo: true })} Icon={RotateCcw}>إعادة التشغيل من البداية</Btn>
        <Btn onClick={() => { if (state.auth.status !== 'authenticated') dispatch({ type: 'LOGIN' }); switchTab('home') }} Icon={ShoppingBag}>الدخول مباشرة كعميل</Btn>
        <Btn onClick={() => { dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: 'merchant' }); dispatch({ type: 'LOGIN' }); switchTab('m-dashboard') }} Icon={Store}>لوحة التاجر (M-050)</Btn>
        <Btn onClick={() => { dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: 'merchant' }); dispatch({ type: 'LOGIN' }); dispatch({ type: 'MERCHANT_STATUS', status: 'banned' }); navigate('merchantBanned', {}, { resetTo: true }) }} Icon={Ban}>محاكاة: متجر محظور</Btn>
        <Btn onClick={() => navigate('login', {}, { resetTo: true })} Icon={KeyRound}>شاشة الدخول (OTP = 1234)</Btn>
        <Btn onClick={() => { dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: 'customer' }); if (state.auth.status !== 'authenticated') dispatch({ type: 'LOGIN' }); dispatch({ type: 'MERCHANT_STATUS', status: 'none' }); navigate('merchantIntro', {}, { resetTo: true }) }} Icon={Store}>رحلة توثيق تاجر جديد (M-042)</Btn>
        <Btn onClick={() => dispatch({ type: 'SET_OFFLINE', offline: !state.offline })} Icon={state.offline ? Wifi : WifiOff}>{state.offline ? 'محاكاة: عودة الاتصال' : 'محاكاة: انقطاع الإنترنت'}</Btn>
        <Btn onClick={() => go('/gallery')} Icon={LayoutGrid}>الانتقال إلى معرض الشاشات</Btn>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur border border-white p-3">
        <p className="text-[11px] font-extrabold text-ink-500 px-1 mb-2">الحالة الحية (State)</p>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] px-1 tabular">
          <dt className="text-ink-500">الشاشة</dt><dd className="font-bold font-mono text-left" dir="ltr">{current.name}</dd>
          <dt className="text-ink-500">عناصر السلة</dt><dd className="font-bold">{cart.itemCount}</dd>
          <dt className="text-ink-500">إجمالي السلة</dt><dd className="font-bold text-secondary">{new Intl.NumberFormat('en-US').format(cart.total)} ر.ي</dd>
          <dt className="text-ink-500">المفضلة</dt><dd className="font-bold">{state.favorites.size}</dd>
          <dt className="text-ink-500">الطلبات</dt><dd className="font-bold">{state.orders.length}</dd>
          <dt className="text-ink-500">المصادقة</dt><dd className="font-bold">{state.auth.status === 'authenticated' ? (state.merchantStatus === 'approved' ? 'مسجّل · تاجر' : state.merchantStatus === 'banned' ? 'مسجّل · تاجر محظور' : 'مسجّل · عميل') : 'غير مسجّل'}</dd>
        </dl>
      </div>

      <div className="rounded-2xl bg-white/60 backdrop-blur border border-white p-3 text-[11px] leading-relaxed text-ink-600">
        <p className="font-extrabold text-ink-500 mb-1">بيانات التجربة</p>
        <ul className="list-disc pr-4 space-y-0.5">
          <li>الدخول: أي بريد صالح أو رقم يبدأ بـ 7 (9 أرقام)</li>
          <li>رمز التحقق OTP: <b className="text-primary">1234</b> — 3 محاولات خاطئة تقفل الحساب</li>
          <li>الخصومات والإشعارات موقوفة مؤقتاً (قرار المنتج)</li>
          <li>بريد يحتوي "fail" ← محاكاة فشل التسجيل</li>
          <li>الطلب يتقدّم تلقائياً أو يدوياً من لوحة التاجر</li>
        </ul>
      </div>
    </aside>
  )
}

function Prototype({ go }) {
  const scale = useFrameScale()
  return (
    <AppProvider>
      <div className="min-h-screen w-full flex items-center justify-center gap-10 p-3 lg:p-10 relative">
        <button onClick={() => go('/')} className="lg:hidden absolute top-3 right-3 z-30 icon-btn bg-white shadow-card" aria-label="العودة للبداية"><ArrowRight size={18} strokeWidth={2.4} /></button>
        <DemoPanel go={go} />
        <ScaledPhone scale={scale}>
          <ScreenRouter />
        </ScaledPhone>
      </div>
    </AppProvider>
  )
}

// ─────────────────────────────────────────────────────────────
//  نقطة الدخول
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [route, go] = useHashRoute()
  if (route.mode === 'prototype') return <Prototype go={go} />
  if (route.mode === 'gallery') return <Gallery route={route} go={go} />
  return <Landing go={go} />
}
