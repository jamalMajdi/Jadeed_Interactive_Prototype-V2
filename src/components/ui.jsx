import React, { useEffect, useState } from 'react'
import { ArrowRight, Check, Heart, Home, Search, ShoppingBag, User, ReceiptText, Store, Package, BarChart3, ClipboardList, Wifi, BatteryFull, Signal, X, Plus, Minus, Star, ShieldCheck } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { CURRENCY, fmt, productById } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  الشعار الرسمي لمنصة «جديد» — public/assets/logo.png (الاسم + العلامة، خلفية شفافة) يُعرض كما هو بلا قصّ أو تمطيط
//  الأبعاد تُحدَّد بالعرض فقط و height:auto حتى تبقى نسبة الأبعاد الأصلية محفوظة دائماً
// ─────────────────────────────────────────────────────────────
export const LOGO_SRC = '/assets/logo.png' // الشعار الرسمي المعتمد (الاسم العربي + JADEED + العلامة) بخلفية شفافة — نسبة 3.61:1
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
//  الرئيسية · البحث · المفضلة · طلباتي · حسابي
// ─────────────────────────────────────────────────────────────
const CUSTOMER_TABS = [
  { key: 'home', label: 'الرئيسية', Icon: Home },
  { key: 'search', label: 'البحث', Icon: Search },
  { key: 'favorites', label: 'المفضلة', Icon: Heart, badge: 'favorites' },
  { key: 'orders', label: 'طلباتي', Icon: ReceiptText, badge: 'orders' },
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
  const { current, switchTab, state, navigate } = useApp()
  const go = (key) => (variant === 'merchant' && key === 'account' ? navigate('account', { merchant: true }, { resetTo: true }) : switchTab(key))
  const tabs = variant === 'merchant' ? MERCHANT_TABS : CUSTOMER_TABS
  const activeOrders = state.orders.filter((o) => !['delivered', 'cancelled', 'rejected'].includes(o.stage)).length
  const badges = { favorites: state.favorites.size, orders: activeOrders, 'm-orders': state.orders.filter((o) => o.stage === 'new').length }
  const activeKey = current.params?.tab || current.name
  return (
    <nav className="absolute inset-x-0 bottom-0 px-3 pb-6 pt-2 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-[20px] shadow-elevated border border-ink-100 h-[62px] grid grid-cols-5">
        {tabs.map(({ key, label, Icon, badge }) => {
          const active = activeKey === key
          const count = badge ? badges[badge] : 0
          return (
            <button key={key} onClick={() => go(key)} className="relative flex flex-col items-center justify-center gap-1 transition active:scale-95" aria-current={active ? 'page' : undefined}>
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

export function StageChip({ stage }) {
  const map = {
    new: ['جديد', 'ink'],
    accepted: ['مقبول', 'info'],
    preparing: ['قيد التحضير', 'warning'],
    ready: ['جاهز للاستلام', 'primary'],
    out: ['جاري التوصيل', 'secondary'],
    delivered: ['تم التوصيل', 'success'],
    cancelled: ['ملغي', 'danger'],
    rejected: ['مرفوض', 'danger'],
  }
  const [label, tone] = map[stage] || [stage, 'ink']
  return <Chip tone={tone}>{label}</Chip>
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

export function Stepper({ value, onChange, min = 0, max = 99, size = 'md' }) {
  const s = size === 'sm' ? 'h-7 w-7 text-[12px]' : 'h-9 w-9 text-[14px]'
  return (
    <div className="inline-flex items-center gap-1.5 bg-ink-100 rounded-xl p-1" dir="ltr">
      <button onClick={() => onChange(Math.max(min, value - 1))} className={`${s} rounded-lg bg-white shadow-card flex items-center justify-center text-ink-700 active:scale-95 disabled:opacity-40`} aria-label="إنقاص" disabled={value <= min}>
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className={`min-w-[24px] text-center font-extrabold tabular ${size === 'sm' ? 'text-[12px]' : 'text-[14px]'}`}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className={`${s} rounded-lg bg-primary text-white flex items-center justify-center active:scale-95 disabled:opacity-40`} aria-label="زيادة" disabled={value >= max}>
        <Plus size={14} strokeWidth={2.5} />
      </button>
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

export function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const tones = { dark: 'bg-ink-900 text-white', success: 'bg-success text-white', danger: 'bg-danger text-white', primary: 'bg-primary text-white' }
  return (
    <div key={toast.id} className={`absolute bottom-28 left-1/2 z-50 px-4 h-10 rounded-full shadow-modal text-[12px] font-bold flex items-center gap-2 whitespace-nowrap max-w-[340px] -translate-x-1/2 animate-toast-in ${tones[toast.tone]}`}>
      {toast.tone === 'success' && <Check size={14} strokeWidth={3} />}
      {toast.tone === 'danger' && <X size={14} strokeWidth={3} />}
      {toast.message}
    </div>
  )
}

export function FavoriteButton({ productId, className = '' }) {
  const { isFavorite, dispatch, showToast } = useApp()
  const fav = isFavorite(productId)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
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
  const { dispatch, showToast, state } = useApp()
  const inCart = state.cart[product.id] || 0
  const soldOut = product.stock <= 0
  const maxed = inCart >= product.stock
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (soldOut) return showToast('عذراً، نفدت الكمية من المخزون', 'danger')
        if (maxed) return showToast(`الحد الأقصى المتاح ${product.stock} قطعة`, 'danger')
        dispatch({ type: 'ADD_TO_CART', productId: product.id })
        showToast('أُضيف إلى السلة', 'success')
      }}
      className={`btn-primary btn-${size} ${full ? 'w-full' : ''} ${soldOut ? 'opacity-50' : ''}`}
    >
      <ShoppingBag size={size === 'xs' ? 12 : 16} strokeWidth={2.4} />
      {soldOut ? 'نفدت الكمية' : inCart ? `في السلة (${inCart})` : 'أضف للسلة'}
    </button>
  )
}

export function ProductCard({ product, onOpen }) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  return (
    <div onClick={() => onOpen(product)} className="card overflow-hidden cursor-pointer active:scale-[0.98] transition">
      <div className="relative">
        <ProductThumb product={product} className="w-full h-[112px]" rounded="rounded-none" />
        <FavoriteButton productId={product.id} className="absolute top-2 left-2" />
        {product.badge && <Chip tone={product.stock <= 0 ? 'danger' : 'solidSecondary'} className="absolute top-2 right-2">{product.badge}</Chip>}
        {discount > 0 && !product.badge && <Chip tone="solidSecondary" className="absolute top-2 right-2">خصم {discount}%</Chip>}
      </div>
      <div className="p-2.5">
        <p className="text-[10px] text-ink-400 font-medium truncate">{productById(product.id) && (product.category === 'electronics' ? 'إلكترونيات' : product.category === 'beauty' ? 'عطور وجمال' : product.category === 'food' ? 'مواد غذائية' : product.category === 'fashion' ? 'أزياء' : 'أدوات منزلية')}</p>
        <h4 className="text-[12px] font-bold text-ink-900 leading-snug line-clamp-2 min-h-[34px]">{product.shortName}</h4>
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <Price value={product.price} size="sm" tone="primary" old={product.oldPrice} />
        </div>
        <div className="mt-2">
          <AddToCartButton product={product} full />
        </div>
      </div>
    </div>
  )
}
