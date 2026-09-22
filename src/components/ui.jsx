import React, { useEffect, useState } from 'react'
import { ArrowRight, Check, Heart, Home, Search, ShoppingBag, ShoppingCart, User, ReceiptText, Store, Package, BarChart3, ClipboardList, Wifi, WifiOff, RefreshCcw, BatteryFull, Signal, X, Plus, Minus, Star, ShieldCheck, MapPin, Navigation, AlertTriangle, Info, LogIn, UserPlus } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { CURRENCY, PAYMENT_STATUS, fmt, productById, storeById } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  الشعار الرسمي لمنصة «جديد» — public/assets/logo.png (الاسم + العلامة، خلفية شفافة) يُعرض كما هو بلا قصّ أو تمطيط
//  الأبعاد تُحدَّد بالعرض فقط و height:auto حتى تبقى نسبة الأبعاد الأصلية محفوظة دائماً
// ─────────────────────────────────────────────────────────────
export const LOGO_SRC = '/assets/logoo.png' // الشعار الرسمي المعتمد (الاسم العربي + JADEED + العلامة) بخلفية شفافة — نسبة 3.61:1
export const LOGO_ICON_SRC = '/assets/logo-icon.png' // العلامة وحدها (مربعة) — للأيقونات والمساحات الضيقة فقط

/**
 * الشعار الرسمي — مصدر واحد: public/assets/logo.png (الملف المعتمد من العميل بعد إزالة الهوامش الشفافة فقط).
 * - ارتفاع ثابت (size بالبكسل أو صنف Tailwind مثل className="h-12") + عرض تلقائي (w-auto) + object-fit: contain
 *   ⇒ لا تمطيط ولا قصّ مهما كانت الحاوية؛ نسبة العرض إلى الارتفاع هي نسبة الصورة الأصلية دائماً.
 * - light: نسخة للخلفيات الداكنة/البنفسجية (لوحة بيضاء صغيرة خلف الشعار حتى يبقى الاسم الكحلي مقروءاً).
 * - icon: العلامة وحدها (مربعة) للمواضع الضيقة جداً.
 */
export function Logo({ size, light = false, icon = false, className = '' }) {
  const hasHeightClass = /(^|\s)h-/.test(className)
  const px = !hasHeightClass ? (size ?? 40) : undefined
  const img = (
    <img
      src={icon ? LOGO_ICON_SRC : LOGO_SRC}
      alt="جديد — JADEED"
      width={icon ? 512 : 1613}
      height={icon ? 512 : 447}
      style={px ? { height: px, width: 'auto' } : { width: 'auto' }}
      className={`block w-auto max-w-none object-contain shrink-0 select-none ${light && !icon ? '' : className}`}
      draggable={false}
    />
  )
  if (!light || icon) return img
  return (
    <div className={`inline-flex items-center bg-white rounded-xl shadow-sm ${className}`} style={{ padding: `${Math.max(4, Math.round((px || 40) * 0.18))}px ${Math.max(6, Math.round((px || 40) * 0.3))}px` }}>
      {img}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  شريط الحالة (iOS) — يعكس التوقيت الفعلي
// ─────────────────────────────────────────────────────────────
export function StatusBar({ light = false }) {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000)
    return () => clearInterval(t)
  }, [])
  const hh = time.getHours() % 12 || 12
  const mm = String(time.getMinutes()).padStart(2, '0')
  const color = light ? 'text-white' : 'text-ink-900'
  return (
    <div className={`h-11 px-6 flex items-center justify-between text-[13px] font-bold tabular ${color}`} dir="ltr">
      <span>{hh}:{mm}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryFull size={16} strokeWidth={2.2} />
      </div>
    </div>
  )
}

export function HomeIndicator({ light = false }) {
  return (
    <div className="h-5 flex items-end justify-center pb-1.5 shrink-0">
      <div className={`w-[134px] h-[5px] rounded-full ${light ? 'bg-white/80' : 'bg-ink-900/80'}`} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  رأس الشاشة الموحّد: عنوان + زر رجوع (سهم لليمين في RTL)
// ─────────────────────────────────────────────────────────────
export function TopBar({ title, subtitle, code, onBack, right, light = false, transparent = false }) {
  const { back, canGoBack } = useApp()
  const handleBack = onBack || back
  return (
    <div className={`px-4 pt-1 pb-3 flex items-center gap-3 relative z-10 ${transparent ? '' : light ? 'bg-primary' : 'bg-white border-b border-ink-100'}`}>
      {(onBack || canGoBack) && (
        <button onClick={handleBack} className={`icon-btn shrink-0 ${light ? 'bg-white/15 text-white hover:bg-white/25' : ''}`} aria-label="رجوع">
          <ArrowRight size={18} strokeWidth={2.4} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className={`text-[17px] font-extrabold leading-tight truncate ${light ? 'text-white' : 'text-ink-900'}`}>{title}</div>
        {subtitle && <div className={`text-[11px] font-medium truncate ${light ? 'text-white/80' : 'text-ink-500'}`}>{subtitle}</div>}
      </div>
      {right ? <div className="shrink-0 flex items-center gap-2">{right}</div> : <Logo size={26} light={light} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  شريط التنقل السفلي الموحّد — ترتيب ثابت في RTL:
//  الرئيسية · المتاجر · المفضلة · طلباتي · حسابي
//  (البحث متاح من رأس الرئيسية وشاشة المتاجر — تبويب «المتاجر» وصول مباشر لكل المتاجر)
//  المفضلة/طلباتي تتطلبان تسجيل الدخول؛ الرئيسية والمتاجر وحسابي متاحة للزائر
// ─────────────────────────────────────────────────────────────
const CUSTOMER_TABS = [
  { key: 'home', label: 'الرئيسية', Icon: Home },
  { key: 'nearbyStores', label: 'المتاجر', Icon: Store },
  { key: 'favorites', label: 'المفضلة', Icon: Heart, badge: 'favorites', auth: 'المفضلة تحتاج تسجيل الدخول' },
  { key: 'orders', label: 'طلباتي', Icon: ReceiptText, badge: 'orders', auth: 'سجّل الدخول لمتابعة طلباتك' },
  { key: 'account', label: 'حسابي', Icon: User },
]
const MERCHANT_TABS = [
  { key: 'm-dashboard', label: 'الرئيسية', Icon: Store },
  { key: 'm-products', label: 'المنتجات', Icon: Package },
  { key: 'm-orders', label: 'الطلبات', Icon: ClipboardList, badge: 'm-orders' },
  { key: 'm-stats', label: 'الإحصائيات', Icon: BarChart3 },
  { key: 'account', label: 'حسابي', Icon: User },
]

export function BottomNav({ variant = 'customer' }) {
  const { current, switchTab, state, navigate, requireAuth, isAuthenticated } = useApp()
  const tabs = variant === 'merchant' ? MERCHANT_TABS : CUSTOMER_TABS
  const go = (tab) => {
    if (variant === 'merchant' && tab.key === 'account') return navigate('account', { merchant: true }, { resetTo: true })
    if (tab.auth && !requireAuth({ name: tab.key, params: {} }, tab.auth)) return
    switchTab(tab.key)
  }
  const activeOrders = state.orders.filter((o) => !['delivered', 'cancelled', 'rejected'].includes(o.stage)).length
  const badges = { favorites: isAuthenticated ? state.favorites.size : 0, orders: isAuthenticated ? activeOrders : 0, 'm-orders': state.orders.filter((o) => o.stage === 'new').length }
  const activeKey = current.params?.tab || current.name
  return (
    <nav className="absolute inset-x-0 bottom-0 px-3 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-[20px] shadow-elevated border border-ink-100 h-[62px] grid grid-cols-5">
        {tabs.map((tab) => {
          const { key, label, Icon, badge } = tab
          const active = activeKey === key
          const count = badge ? badges[badge] : 0
          return (
            <button key={key} onClick={() => go(tab)} className="relative flex flex-col items-center justify-center gap-1 transition active:scale-95" aria-current={active ? 'page' : undefined}>
              <div className={`relative w-9 h-6 flex items-center justify-center rounded-lg ${active ? 'bg-primary-50' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.4 : 1.9} className={active ? 'text-primary' : 'text-ink-400'} fill={active && key === 'favorites' ? 'currentColor' : 'none'} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-white text-[9px] font-extrabold flex items-center justify-center tabular">{count}</span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${active ? 'text-primary' : 'text-ink-400'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────
//  عناصر عامة
// ─────────────────────────────────────────────────────────────
export function Price({ value, size = 'md', tone = 'secondary', old }) {
  const sizes = { xs: 'text-[12px]', sm: 'text-[14px]', md: 'text-[16px]', lg: 'text-[24px]' }
  const tones = { secondary: 'text-secondary', primary: 'text-primary', ink: 'text-ink-900' }
  return (
    <span className="inline-flex items-baseline gap-1 tabular">
      <span className={`${sizes[size]} font-extrabold ${tones[tone]}`}>{fmt(value)}</span>
      <span className="text-[10px] font-bold text-ink-500">{CURRENCY}</span>
      {old && <span className="text-[10px] font-medium text-ink-300 line-through ms-1">{fmt(old)}</span>}
    </span>
  )
}

export function Chip({ children, tone = 'ink', className = '' }) {
  const tones = {
    ink: 'bg-ink-100 text-ink-700',
    primary: 'bg-primary-50 text-primary',
    secondary: 'bg-secondary-50 text-secondary-600',
    success: 'bg-success-50 text-success-700',
    danger: 'bg-danger-50 text-danger-700',
    warning: 'bg-warning-50 text-warning-700',
    info: 'bg-info-50 text-info',
    solidPrimary: 'bg-primary text-white',
    solidSecondary: 'bg-secondary text-white',
  }
  return <span className={`chip ${tones[tone]} ${className}`}>{children}</span>
}

export function StageChip({ stage, by }) {
  // دورة حياة مبسّطة: جديد → قيد التجهيز → في الطريق → تم التوصيل (+ ملغي / مرفوض) — by='merchant' يميّز إلغاء المتجر
  if (stage === 'cancelled' && by === 'merchant') return <Chip tone="danger">ألغاه المتجر</Chip>
  const map = {
    new: ['جديد', 'ink'],
    preparing: ['قيد التجهيز', 'warning'],
    out: ['في الطريق', 'secondary'],
    delivered: ['تم التوصيل', 'success'],
    cancelled: ['ملغي', 'danger'],
    rejected: ['مرفوض', 'danger'],
  }
  const [label, tone] = map[stage] || [stage, 'ink']
  return <Chip tone={tone}>{label}</Chip>
}

export function PaymentChip({ status }) {
  const p = PAYMENT_STATUS[status]
  if (!p) return null
  return <Chip tone={p.tone}>{p.label}</Chip>
}

// ─────────────────────────────────────────────────────────────
//  معاينة موقع المتجر على خريطة (مصغّرة، بلا شبكة) — تُستخدم في صفحة المتجر ونموذج التاجر
//  location: { lat, lng, x, y, label } حيث x/y نسب مئوية لموضع الدبوس داخل المعاينة
// ─────────────────────────────────────────────────────────────
export function StoreMapPreview({ location, height = 120, className = '', onClick }) {
  const x = location?.x ?? 50
  const y = location?.y ?? 50
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className={`relative w-full overflow-hidden rounded-card border border-ink-100 text-right ${className}`} style={{ height, backgroundColor: '#EEF1F5', backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '26px 26px' }} aria-label={location?.label ? `موقع المتجر: ${location.label}` : 'موقع المتجر'}>
      <div className="absolute left-[-10%] top-[35%] w-[120%] h-3 bg-white rotate-[-7deg]" />
      <div className="absolute left-[-10%] top-[68%] w-[120%] h-4 bg-white rotate-[5deg]" />
      <div className="absolute left-[30%] top-[-10%] w-4 h-[120%] bg-white rotate-[10deg]" />
      <div className="absolute right-[10%] top-[14%] w-16 h-10 rounded-md bg-success-100/70" />
      <div className="absolute left-[8%] bottom-[16%] w-20 h-12 rounded-md bg-success-100/70" />
      {location ? (
        <div className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center animate-pop" style={{ left: `${x}%`, top: `${y}%` }}>
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shadow-accent ring-4 ring-white"><MapPin size={15} strokeWidth={2.4} fill="currentColor" /></div>
          <div className="w-3 h-1 rounded-full bg-ink-900/20 mt-0.5" />
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-card border-2 border-dashed border-primary-300"><MapPin size={18} strokeWidth={2.2} /></div>
          <p className="text-[11px] font-bold text-primary mt-2 bg-white/90 rounded-full px-3 py-1 shadow-card">انقر لتثبيت موقع المتجر على الخريطة</p>
        </div>
      )}
      {location?.label && (
        <div className="absolute bottom-2 right-2 left-2 bg-white/95 backdrop-blur rounded-xl px-2.5 h-8 flex items-center gap-1.5 text-[10px] font-bold text-ink-800 shadow-card">
          <Navigation size={12} className="text-primary shrink-0" />
          <span className="truncate">{location.label}</span>
          {location.lat && <span className="mr-auto text-[9px] font-medium text-ink-400 tabular" dir="ltr">{location.lat}, {location.lng}</span>}
        </div>
      )}
    </Tag>
  )
}

export function SectionHeader({ title, action, onAction, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="section-title">{title}</h3>
        {subtitle && <p className="text-[10px] text-ink-500 font-medium">{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction} className="link">
          {action}
        </button>
      )}
    </div>
  )
}

export function Stepper({ value, onChange, min = 0, max = 99, size = 'md', maxHint = false }) {
  const s = size === 'sm' ? 'h-7 w-7 text-[12px]' : 'h-9 w-9 text-[14px]'
  const atMax = value >= max
  return (
    <div className="inline-flex flex-col items-start gap-1">
    <div className="inline-flex items-center gap-1.5 bg-ink-100 rounded-xl p-1" dir="ltr">
      <button onClick={() => onChange(Math.max(min, value - 1))} className={`${s} rounded-lg bg-white shadow-card flex items-center justify-center text-ink-700 active:scale-95 disabled:opacity-40`} aria-label="إنقاص" disabled={value <= min}>
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className={`min-w-[24px] text-center font-extrabold tabular ${size === 'sm' ? 'text-[12px]' : 'text-[14px]'}`}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className={`${s} rounded-lg bg-primary text-white flex items-center justify-center active:scale-95 disabled:opacity-40`} aria-label="زيادة" disabled={value >= max}>
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
    {maxHint && atMax && <span className="text-[10px] font-bold text-warning-700 flex items-center gap-1"><AlertTriangle size={11} /> {typeof maxHint === 'string' ? maxHint : `أقصى كمية متاحة (${max})`}</span>}
    </div>
  )
}

export function ProductThumb({ product, className = '', rounded = 'rounded-xl' }) {
  return (
    <div className={`${rounded} overflow-hidden flex items-center justify-center shrink-0 ${className}`} style={{ background: product.bg || '#F3F4F6' }}>
      {product.image ? (
        <img src={product.image} alt={product.shortName} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <ShoppingBag className="text-ink-400" size={28} strokeWidth={1.6} />
      )}
    </div>
  )
}

export function StoreAvatar({ store, size = 44 }) {
  return (
    <div className="rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary text-[9px] font-extrabold text-center leading-tight p-1 shrink-0" style={{ width: size, height: size }}>
      {store.initials}
    </div>
  )
}

export function Rating({ value, count }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-warning tabular">
      <Star size={11} fill="currentColor" strokeWidth={0} />
      {value}
      {count != null && <span className="text-ink-400 font-medium">({count})</span>}
    </span>
  )
}

export function VerifiedBadge({ label = 'معتمد' }) {
  return (
    <span className="inline-flex items-center gap-0.5 bg-primary text-white text-[9px] font-bold rounded-full px-1.5 h-4">
      <ShieldCheck size={10} strokeWidth={2.5} /> {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────
//  حالات: نجاح / خطأ / فارغ — بنفس بنية شاشات Figma
// ─────────────────────────────────────────────────────────────
export function StateScreen({ tone = 'success', icon: Icon = Check, title, description, children, primary, secondary, code, showBack = true }) {
  const { back } = useApp()
  const tones = {
    success: { ring: 'bg-success-50 text-success', big: 'bg-primary text-white' },
    error: { ring: 'bg-danger-50 text-danger', big: 'bg-danger text-white' },
    warning: { ring: 'bg-warning-50 text-warning', big: 'bg-warning text-white' },
    info: { ring: 'bg-primary-50 text-primary', big: 'bg-primary text-white' },
    empty: { ring: 'bg-ink-100 text-ink-400', big: 'bg-ink-100 text-ink-400' },
  }
  const t = tones[tone]
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <div className="px-4 pt-1 flex items-center justify-between">
        {showBack ? (
          <button onClick={back} className="icon-btn" aria-label="رجوع">
            <ArrowRight size={18} strokeWidth={2.4} />
          </button>
        ) : (
          <span />
        )}
        <Logo size={26} />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-7 pb-6 animate-fade-in">
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 animate-pop ${t.ring}`}>
          <Icon size={40} strokeWidth={2.2} />
        </div>
        <h1 className="text-[22px] font-extrabold text-ink-900 leading-snug">{title}</h1>
        {description && <p className="text-[13px] font-medium text-ink-500 leading-relaxed mt-2 max-w-[300px]">{description}</p>}
        {children && <div className="w-full mt-6">{children}</div>}
      </div>
      <div className="px-6 pb-4 space-y-2.5">
        {primary && (
          <button onClick={primary.onClick} className={`w-full btn-lg ${primary.className || 'btn-primary'}`}>
            {primary.label}
          </button>
        )}
        {secondary && (
          <button onClick={secondary.onClick} className="w-full btn-outline btn-lg">
            {secondary.label}
          </button>
        )}
      </div>
      <HomeIndicator />
    </div>
  )
}

export function KeyValue({ rows, className = '' }) {
  return (
    <div className={`card divide-y divide-ink-100 ${className}`}>
      {rows.map(([k, v, tone]) => (
        <div key={k} className="flex items-center justify-between px-4 py-3 text-[12px]">
          <span className="text-ink-500 font-medium">{k}</span>
          <span className={`font-bold tabular ${tone || 'text-ink-900'}`}>{v}</span>
        </div>
      ))}
    </div>
  )
}

export function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-[2px]" />
      <div className="relative w-full bg-white rounded-modal shadow-modal p-6 animate-pop" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  مطالبة الزائر بالدخول عند محاولة الإضافة للسلة — التصفح متاح للجميع، والشراء لحساب عميل مسجّل
// ─────────────────────────────────────────────────────────────
export function AuthPrompt() {
  const { state, dispatch, navigate } = useApp()
  const prompt = state.authPrompt
  if (!prompt) return null
  const close = () => dispatch({ type: 'AUTH_PROMPT_CLOSE' })
  const go = (screen) => {
    close()
    dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: 'customer' })
    dispatch({ type: 'AUTH_GATE', returnTo: prompt.returnTo || null }) // العودة إلى المنتج/المتجر نفسه بعد الدخول
    navigate(screen, screen === 'login' ? { gated: true } : {})
  }
  return (
    <Modal open onClose={close}>
      <button onClick={close} className="icon-btn absolute top-3 left-3" aria-label="إغلاق"><X size={16} /></button>
      <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto mt-2"><ShoppingCart size={28} strokeWidth={2} /></div>
      <h2 className="text-[18px] font-extrabold text-center mt-3 text-ink-900">سجّل الدخول لإضافة المنتج إلى السلة</h2>
      <p className="text-[12px] text-ink-500 text-center mt-1 leading-relaxed">يمكنك تصفح المنتجات والمتاجر والعروض كزائر، لكن إضافة المنتجات للسلة وإتمام الشراء يتطلبان حساب عميل.</p>
      {prompt.productName && (
        <div className="card p-3 mt-4 text-center"><p className="text-[10px] text-ink-400">المنتج الذي حاولت إضافته:</p><p className="text-[13px] font-bold text-primary line-clamp-1">{prompt.productName}</p></div>
      )}
      <button onClick={() => go('login')} className="w-full btn-primary btn-lg mt-4"><LogIn size={18} /> تسجيل الدخول</button>
      <button onClick={() => go('register')} className="w-full btn-outline btn-md mt-2"><UserPlus size={17} /> إنشاء حساب كعميل</button>
      <button onClick={close} className="w-full h-10 text-[12px] font-bold text-ink-500 mt-1">متابعة التصفح كزائر</button>
    </Modal>
  )
}

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const tones = { dark: 'bg-ink-900 text-white', success: 'bg-success text-white', danger: 'bg-danger text-white', primary: 'bg-primary text-white' }
  return (
    <div key={toast.id} className={`absolute bottom-[92px] left-1/2 z-50 px-4 py-2.5 min-h-[40px] rounded-2xl shadow-modal text-[12px] font-bold flex items-center gap-2 w-[calc(100%-32px)] max-w-[358px] -translate-x-1/2 animate-toast-in ${tones[toast.tone]}`} role="status">
      {toast.tone === 'success' && <Check size={15} strokeWidth={3} className="shrink-0" />}
      {toast.tone === 'danger' && <AlertTriangle size={15} strokeWidth={2.6} className="shrink-0" />}
      {toast.tone === 'primary' && <Info size={15} strokeWidth={2.6} className="shrink-0" />}
      <span className="leading-snug">{toast.message}</span>
    </div>
  )
}

// حالة انقطاع الإنترنت أثناء التصفح: شريط واضح أعلى الشاشة + زر إعادة المحاولة (يُقرأ من navigator.onLine أو يُحاكى)
export function OfflineBanner() {
  const { state, dispatch, showToast } = useApp()
  const [checking, setChecking] = useState(false)
  if (!state.offline) return null
  const retry = () => {
    setChecking(true)
    setTimeout(() => {
      setChecking(false)
      const online = typeof navigator === 'undefined' ? true : navigator.onLine
      if (online) { dispatch({ type: 'SET_OFFLINE', offline: false }); showToast('عاد الاتصال بالإنترنت', 'success') }
      else showToast('لا يزال الاتصال مقطوعاً — تحقق من الشبكة', 'danger')
    }, 900)
  }
  return (
    <div className="absolute inset-x-0 top-11 z-[55] px-3 animate-slide-up" role="alert">
      <div className="bg-ink-900 text-white rounded-2xl shadow-modal px-3.5 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><WifiOff size={18} /></div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-extrabold">لا يوجد اتصال بالإنترنت</p>
          <p className="text-[10px] text-white/70">تصفّح ما تم تحميله مسبقاً — سيُستأنف التحديث تلقائياً عند عودة الاتصال</p>
        </div>
        <button onClick={retry} disabled={checking} className="h-8 px-3 rounded-full bg-white text-ink-900 text-[11px] font-extrabold flex items-center gap-1 shrink-0 disabled:opacity-60">
          <RefreshCcw size={12} className={checking ? 'animate-spin' : ''} /> {checking ? 'جارٍ الفحص' : 'إعادة المحاولة'}
        </button>
      </div>
    </div>
  )
}

export function FavoriteButton({ productId, className = '' }) {
  const { isFavorite, dispatch, showToast, requireAuth, isAuthenticated } = useApp()
  const fav = isAuthenticated && isFavorite(productId)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (!requireAuth(undefined, 'سجّل الدخول لحفظ المنتجات في المفضلة')) return
        dispatch({ type: 'TOGGLE_FAVORITE', productId })
        showToast(fav ? 'أُزيل من المفضلة' : 'أُضيف إلى المفضلة', fav ? 'dark' : 'primary')
      }}
      className={`w-8 h-8 rounded-full bg-white/90 shadow-card flex items-center justify-center transition active:scale-90 ${className}`}
      aria-label="المفضلة"
    >
      <Heart size={15} strokeWidth={2.2} className={fav ? 'text-danger' : 'text-ink-500'} fill={fav ? 'currentColor' : 'none'} />
    </button>
  )
}

export function AddToCartButton({ product, size = 'xs', full = false }) {
  const { dispatch, showToast, state, requireCustomer } = useApp()
  const closed = storeById(product.storeId)?.open === false // المتجر مغلق: لا يستقبل طلبات جديدة
  const inCart = state.cart[product.id] || 0
  const soldOut = product.stock <= 0
  const maxed = inCart >= product.stock
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (closed) return showToast('المتجر مغلق حالياً ولا يستقبل طلبات جديدة', 'danger')
        if (soldOut) return showToast('عذراً، نفدت الكمية من المخزون', 'danger')
        if (!requireCustomer(product.shortName)) return // الزائر: نافذة مطالبة بتسجيل الدخول أو إنشاء حساب عميل
        if (maxed) return showToast(`الحد الأقصى المتاح ${product.stock} قطعة`, 'danger')
        dispatch({ type: 'ADD_TO_CART', productId: product.id })
        showToast('أُضيف إلى السلة', 'success')
      }}
      className={`btn-primary btn-${size} ${full ? 'w-full' : ''} ${soldOut || closed ? 'opacity-50' : ''}`}
    >
      <ShoppingCart size={size === 'xs' ? 12 : 16} strokeWidth={2.4} />
      {closed ? 'المتجر مغلق' : soldOut ? 'نفدت الكمية' : inCart ? `في السلة (${inCart})` : 'أضف للسلة'}
    </button>
  )
}

// سطر «المتجر / الشركة» فوق اسم المنتج — يفتح صفحة المتجر عند النقر
export function StoreLine({ storeId, onOpenStore, className = '' }) {
  const { navigate } = useApp()
  const store = storeById(storeId)
  if (!store) return null
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onOpenStore ? onOpenStore(store) : navigate('store', { id: store.id })
      }}
      className={`flex items-center gap-1 text-[10px] font-bold text-primary max-w-full ${className}`}
      aria-label={`متجر ${store.name}`}
    >
      <Store size={11} strokeWidth={2.4} className="shrink-0" />
      <span className="truncate">{store.name}</span>
      {store.verified && <ShieldCheck size={10} className="shrink-0 text-primary" />}
    </button>
  )
}

// شارة حالة التوفر الموحّدة على بطاقات المنتجات: متوفر / كمية محدودة (≤5) / نفدت الكمية
export function AvailabilityBadge({ stock, className = '' }) {
  const [label, tone] = stock <= 0 ? ['نفدت الكمية', 'danger'] : stock <= 5 ? [`متبقٍ ${stock} فقط`, 'warning'] : ['متوفر', 'success']
  return <Chip tone={tone} className={`!h-5 !text-[10px] !px-2 ${className}`}>{label}</Chip>
}

export function ProductCard({ product, onOpen, onOpenStore }) {
  return (
    <div onClick={() => onOpen(product)} className="card overflow-hidden cursor-pointer active:scale-[0.98] transition">
      <div className="relative">
        <ProductThumb product={product} className="w-full h-[112px]" rounded="rounded-none" />
        <FavoriteButton productId={product.id} className="absolute top-2 left-2" />
        <AvailabilityBadge stock={product.stock} className="absolute top-2 right-2 shadow-card" />
      </div>
      <div className="p-2.5">
        <StoreLine storeId={product.storeId} onOpenStore={onOpenStore} />
        <h4 className="text-[12px] font-bold text-ink-900 leading-snug line-clamp-2 min-h-[34px]">{product.shortName}</h4>
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <Price value={product.price} size="sm" tone="primary" />
        </div>
        <div className="mt-2">
          <AddToCartButton product={product} full />
        </div>
      </div>
    </div>
  )
}
