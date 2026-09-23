import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, Navigation, Check, Plus, ChevronLeft, Search, SlidersHorizontal, Bell, ShoppingBag, Sparkles, ArrowRight, Store, X, Heart, Trash2, ShieldCheck, Clock, LocateFixed, MapPinOff, ShoppingCart, Filter, PackageX, Phone, Truck, UserRound, Info } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, BottomNav, Price, Chip, SectionHeader, ProductThumb, StoreAvatar, Rating, VerifiedBadge, StateScreen, ProductCard, FavoriteButton, AddToCartButton, Stepper, KeyValue, Logo, StoreMapPreview, AvailabilityBadge } from '../components/ui'
import { AREAS, CATEGORIES, CITY, PRODUCTS, PROMOS, STORES, TRENDING_SEARCHES, productById, storeById, fmt } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  الموقع: إذن (CUS-013) → نجاح (CUS-015) / رفض (CUS-014) → العناوين
// ─────────────────────────────────────────────────────────────
export function LocationPermission() {
  const { navigate } = useApp()
  return (
    <div className="flex-1 flex flex-col bg-ink-100 relative">
      <StatusBar />
      <MapBackdrop />
      <div className="absolute inset-0 bg-ink-900/70 flex items-center justify-center px-6 animate-fade-in">
        <div className="w-full bg-white rounded-modal shadow-modal p-6 text-center animate-pop">
          <div className="w-16 h-16 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto">
            <Navigation size={28} strokeWidth={2} />
          </div>
          
          <h2 className="text-[18px] font-extrabold text-ink-900 leading-snug mt-1">السماح لتطبيق جديد بالوصول إلى موقعك؟</h2>
          <p className="text-[12px] font-medium text-ink-500 leading-relaxed mt-2">نحتاج إذن تحديد الموقع الجغرافي لعرض المتاجر والمنتجات الأقرب إليك في مدينة {CITY} وحساب رسوم التوصيل بدقة.</p>
          <div className="space-y-2 mt-5">
            <button onClick={() => navigate('locationSuccess', {}, { replace: true })} className="w-full btn-primary btn-md">السماح أثناء استخدام التطبيق</button>
            <button onClick={() => navigate('locationDenied', {}, { replace: true })} className="w-full btn-ghost btn-md">عدم السماح الآن</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MapBackdrop({ pin = false, label }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#EEF1F5', backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '64px 64px' }}>
      <div className="absolute left-[-10%] top-[30%] w-[120%] h-6 bg-white rotate-[-8deg]" />
      <div className="absolute left-[-10%] top-[62%] w-[120%] h-8 bg-white rotate-[6deg]" />
      <div className="absolute left-[38%] top-[-10%] w-7 h-[120%] bg-white rotate-[12deg]" />
      <div className="absolute right-[12%] top-[18%] w-24 h-16 rounded-lg bg-success-100/70" />
      <div className="absolute left-[10%] bottom-[24%] w-28 h-20 rounded-lg bg-success-100/70" />
      {pin && (
        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-full flex flex-col items-center animate-pop">
          {label && <div className="bg-ink-900 text-white text-[11px] font-bold rounded-full px-3 h-7 flex items-center mb-1 shadow-elevated">{label}</div>}
          <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-accent ring-4 ring-white">
            <MapPin size={18} strokeWidth={2.4} fill="currentColor" />
          </div>
          <div className="w-4 h-1.5 rounded-full bg-ink-900/20 mt-1" />
        </div>
      )}
    </div>
  )
}

export function LocationSuccess() {
  const { navigate } = useApp()
  const [sec, setSec] = useState(6)
  const go = () => navigate('addresses', {}, { resetTo: true })
  useEffect(() => {
    const t = setInterval(() => setSec((n) => n - 1), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (sec <= 0) go() }, [sec])
  return (
    <div className="flex-1 flex flex-col bg-ink-100 relative">
      <StatusBar />
      <MapBackdrop pin label="موقعك الحالي" />
      <div className="absolute inset-0 bg-ink-900/65 backdrop-blur-[3px] flex items-center justify-center px-6 animate-fade-in">
        <div className="w-full bg-white rounded-modal shadow-modal p-6 text-center animate-pop">
          <div className="w-16 h-16 rounded-full bg-success-50 text-success flex items-center justify-center mx-auto"><LocateFixed size={28} /></div>
          <h2 className="text-[18px] font-extrabold text-ink-900 mt-3">تم رصد إحداثياتك بنجاح</h2>
          <p className="text-[12px] font-medium text-ink-500 mt-1 leading-relaxed">دقة الإشارة عالية (±5 أمتار) في مدينة {CITY}</p>
          <div className="card p-3 text-right mt-4">
            <p className="text-[12px] font-bold text-ink-900">{CITY}، حي المسبح، بالقرب من مدرسة ناصر</p>
            <p className="font-mono text-[11px] text-ink-400 mt-1" dir="ltr">N 13.5789° , E 44.0124°</p>
          </div>
          <p className="text-[11px] text-ink-400 mt-3">يُغلق تلقائياً خلال {Math.max(0, sec)} ث</p>
          <button onClick={go} className="w-full btn-primary btn-md mt-4">تأكيد الموقع والمتابعة</button>
          <button onClick={go} className="w-full h-10 text-[12px] font-bold text-ink-500 mt-1">خروج</button>
        </div>
      </div>
    </div>
  )
}

export function LocationDenied() {
  const { navigate } = useApp()
  return (
    <StateScreen
      tone="warning"
      icon={MapPinOff}
      code="CUS-014"
      showBack={false}
      title="إذن الموقع غير متاح أو تم رفضه"
      description={`لم نتمكن من جلب موقعك عبر GPS. لا تقلق، يمكنك اختيار منطقتك وحيك في ${CITY} يدوياً للمتابعة.`}
      primary={{ label: 'تحديد الموقع يدوياً', onClick: () => navigate('addresses', {}, { resetTo: true }) }}
    >
      <div className="card p-4 text-right">
        <p className="text-[12px] font-bold text-ink-900">خيارات المتابعة:</p>
        <ul className="text-[11px] font-medium text-ink-500 mt-2 space-y-1.5 list-disc pr-4">
          <li>تحديد المدينة والحي يدوياً من القائمة</li>
          <li>اختيار عنوان سابق تم حفظه في حسابك</li>
        </ul>
      </div>
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  تحديد موقع التوصيل والعناوين المحفوظة (CUS-011 / CUS-040)
// ─────────────────────────────────────────────────────────────
export function Addresses() {
  const { state, dispatch, navigate, canGoBack, switchTab, showToast, back, currentAddress } = useApp()
  // موقع توصيل واحد لكل حساب — يُعرض ويُحدَّث هنا (يدوياً أو عبر الخريطة)، ولا تُنشأ عناوين متعددة
  const [editing, setEditing] = useState(!currentAddress)
  const [form, setForm] = useState({ title: currentAddress?.title || 'موقعي', details: currentAddress?.details?.replace(`، ${CITY}`, '') || '', phone: currentAddress?.phone || '' })
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }
  const confirm = () => {
    showToast('تم اعتماد موقع التوصيل', 'success')
    canGoBack ? back() : switchTab('home')
  }
  const save = () => {
    const er = {}
    if (form.title.trim().length < 2) er.title = 'اسم الموقع مطلوب'
    if (form.details.trim().length < 5) er.details = 'اكتب تفاصيل الموقع (الحي، الشارع، أقرب معلم)'
    if (!/^(\+?967)?7\d{8}$/.test(form.phone.replace(/\s/g, ''))) er.phone = 'رقم جوال صحيح يبدأ بـ 7 (9 أرقام)'
    setErrors(er)
    if (Object.keys(er).length) return showToast('أكمل بيانات الموقع', 'danger')
    dispatch({ type: 'UPDATE_ADDRESS', patch: { title: form.title.trim(), details: `${form.details.trim()}، ${CITY}`, phone: form.phone.replace(/\s/g, '') } })
    setEditing(false)
    showToast('تم تحديث موقعك', 'success')
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={canGoBack ? 'تغيير موقع التوصيل' : 'تحديد موقع التوصيل'} subtitle={`لكل حساب موقع توصيل واحد في ${CITY} يمكنك تحديثه في أي وقت`} />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        <button onClick={() => navigate('mapPin')} className="w-full card p-4 flex items-center gap-3 text-right hover:border-primary transition">
          <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
            <Navigation size={20} strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-primary">تحديث الموقع من الخريطة (GPS)</div>
            <div className="text-[11px] font-medium text-ink-500">تحديد تلقائي لمنطقتك على الخريطة</div>
          </div>
          <ChevronLeft size={18} className="text-ink-400" />
        </button>

        <div>
          <p className="text-[13px] font-bold text-ink-900 mb-2">موقع التوصيل الحالي</p>
          {currentAddress && !editing ? (
            <div className="card p-4 border-2 border-primary bg-primary-50/40 flex items-start gap-3 text-right">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5"><Check size={13} strokeWidth={3.5} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-ink-900">{currentAddress.title}</div>
                <div className="text-[11px] font-medium text-ink-500 mt-0.5">{currentAddress.details}</div>
                <div className="text-[11px] font-bold text-primary mt-1 tabular" dir="ltr">{currentAddress.phone}</div>
              </div>
              <button onClick={() => setEditing(true)} className="text-[11px] font-bold text-secondary shrink-0">تعديل يدوياً</button>
            </div>
          ) : (
            <div className="card p-4 space-y-3 animate-slide-up">
              <div>
                <label className="label">اسم الموقع</label>
                <input className={`field ${errors.title ? 'field-error' : ''}`} placeholder="مثال: المنزل" value={form.title} onChange={set('title')} />
                {errors.title && <p className="text-[11px] font-bold text-danger mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="label">التفاصيل (الحي، الشارع، أقرب معلم)</label>
                <input className={`field ${errors.details ? 'field-error' : ''}`} placeholder="الحوبان، خلف مستشفى الثورة" value={form.details} onChange={set('details')} />
                {errors.details && <p className="text-[11px] font-bold text-danger mt-1">{errors.details}</p>}
              </div>
              <div>
                <label className="label">رقم الجوال للتواصل عند التوصيل</label>
                <input dir="ltr" inputMode="tel" className={`field text-left tabular ${errors.phone ? 'field-error' : ''}`} placeholder="7xxxxxxxx" value={form.phone} onChange={set('phone')} />
                {errors.phone && <p className="text-[11px] font-bold text-danger mt-1">{errors.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={save} className="flex-1 btn-primary btn-md">حفظ الموقع</button>
                {currentAddress && <button onClick={() => setEditing(false)} className="btn-ghost btn-md">إلغاء</button>}
              </div>
            </div>
          )}
        </div>
        <p className="text-[10px] text-ink-400 leading-relaxed px-1">يُستخدم هذا الموقع لعرض المتاجر الأقرب وحساب التوصيل، ويُطلب تأكيد بيانات الاستلام عند كل طلب.</p>
      </div>
      <div className="px-5 pb-4 pt-2 bg-ink-50">
        <button onClick={confirm} disabled={!currentAddress || editing} className="w-full btn-primary btn-lg">{canGoBack ? 'حفظ واعتماد هذا الموقع' : 'تأكيد الموقع ومتابعة التسوق'}</button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function MapPinScreen() {
  const { back, dispatch, showToast, switchTab } = useApp()
  return (
    <div className="flex-1 flex flex-col relative bg-ink-100">
      <MapBackdrop pin label="موقع التوصيل المعتمد" />
      <div className="relative">
        <StatusBar />
        <div className="px-4 pt-1 flex items-center justify-between">
          <button onClick={back} className="icon-btn bg-white shadow-card" aria-label="رجوع">
            <ArrowRight size={18} strokeWidth={2.4} />
          </button>
          <div className="bg-white rounded-full px-4 h-9 flex items-center gap-2 shadow-card text-[13px] font-bold">
            موقعك المحفوظ على الخريطة
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <div className="relative px-4 pb-4">
        <div className="bg-white rounded-modal shadow-modal p-4 animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
              <MapPin size={20} strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-ink-400">الموقع الحالي في {CITY}</p>
              <p className="text-[14px] font-bold text-ink-900">شارع جمال، جوار بريد تعز المركزي</p>
              <p className="text-[11px] font-medium text-ink-500">محافظة تعز • اليمن</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                dispatch({ type: 'UPDATE_ADDRESS', patch: { title: 'موقعي', details: `شارع جمال، جوار بريد تعز المركزي، ${CITY}` } })
                showToast('تم تحديث موقعك من الخريطة', 'success')
                switchTab('home')
              }}
              className="flex-1 btn-primary btn-md"
            >
              تأكيد واستمرار للتسوق
            </button>
            <button onClick={back} className="btn-ghost btn-md">تعديل</button>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  الرئيسية — المتجر المعتمد تعز
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
//  شريط العروض في الرئيسية — تطوير للبانر الأصلي: نفس البطاقة، لكن بأكثر من إعلان
//  تمرير أفقي بالأصبع (snap) + نقاط تنقل قابلة للنقر + تقدّم تلقائي كل 5 ثوانٍ يتوقف عند اللمس
// ─────────────────────────────────────────────────────────────
const PROMO_TONES = {
  secondary: { card: 'bg-gradient-to-l from-secondary to-secondary-400 shadow-accent', btn: 'text-secondary' },
  primary: { card: 'bg-gradient-to-l from-primary to-primary-500 shadow-brand', btn: 'text-primary' },
  brand: { card: 'bg-gradient-to-l from-primary-700 via-primary to-secondary shadow-brand', btn: 'text-primary' },
}
function PromoCarousel({ promos, onAction }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)
  const count = promos.length
  // التمرير البرمجي إلى إعلان معيّن (RTL: scrollLeft سالب في المتصفحات الحديثة — نستخدم scrollIntoView لتجنّب حساب الاتجاه)
  const goTo = (i) => {
    const next = (i + count) % count
    trackRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    setIndex(next)
  }
  // مزامنة النقطة النشطة مع التمرير اليدوي
  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const w = el.clientWidth
    if (!w) return
    const i = Math.round(Math.abs(el.scrollLeft) / w)
    if (i !== index && i >= 0 && i < count) setIndex(i)
  }
  // تقدّم تلقائي (يتوقف أثناء اللمس/التحويم وعند وجود إعلان واحد)
  useEffect(() => {
    if (count < 2 || paused) return undefined
    const t = setTimeout(() => goTo(index + 1), 5000)
    return () => clearTimeout(t)
  }, [index, paused, count])
  if (!count) return null
  return (
    <div className="px-4 pt-4" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
      <div ref={trackRef} onScroll={onScroll} className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 gap-3" aria-roledescription="carousel" aria-label="العروض والإعلانات">
        {promos.map((p, i) => {
          const tone = PROMO_TONES[p.tone] || PROMO_TONES.secondary
          return (
            <div key={p.id} className="snap-center shrink-0 w-full" role="group" aria-roledescription="slide" aria-label={`إعلان ${i + 1} من ${count}: ${p.title}`}>
              <div className={`relative overflow-hidden rounded-modal text-white p-4 min-h-[132px] ${tone.card}`}>
                <Sparkles className="absolute left-4 top-3 text-white/25" size={80} strokeWidth={1.2} />
                <span className="inline-block bg-white/20 rounded-full px-2.5 h-5 text-[10px] font-bold leading-5">{p.badge}</span>
                <h2 className="text-[20px] font-black mt-2 leading-tight">{p.title}</h2>
                <p className="text-[12px] font-medium text-white/90 line-clamp-2">{p.text}</p>
                <button onClick={() => onAction(p)} className={`mt-3 h-8 px-4 rounded-full bg-white text-[12px] font-bold ${tone.btn}`}>{p.cta}</button>
              </div>
            </div>
          )
        })}
      </div>
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2.5" role="tablist" aria-label="التنقل بين الإعلانات">
          {promos.map((p, i) => (
            <button key={p.id} role="tab" aria-selected={i === index} aria-label={`الإعلان ${i + 1}`} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-secondary' : 'w-1.5 bg-ink-300'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Home() {
  const { navigate, switchTab, currentAddress, cartCount, state } = useApp()
  const [cat, setCat] = useState('all')
  const featured = useMemo(() => PRODUCTS.filter((p) => !p.deleted && (cat === 'all' || p.category === cat) && p.stock > 0), [cat, state.catalogVersion])
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <div className="bg-primary text-white rounded-b-[28px] shadow-brand relative overflow-hidden">
        <div className="absolute -top-16 -left-10 w-48 h-48 rounded-full bg-white/10" />
        <StatusBar light />
        <div className="px-4 pb-4 relative">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('addresses')} className="flex items-center gap-2 text-right">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <MapPin size={18} strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-[10px] font-medium text-white/75 leading-none">التوصيل إلى</p>
                <p className="text-[13px] font-bold flex items-center gap-1">
                  {currentAddress?.title?.replace(' (الرئيسي)', '')} · {currentAddress?.details?.split('،')[0]}
                  <ChevronLeft size={14} className="-rotate-90" />
                </p>
              </div>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('notifications')} className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center" aria-label="التنبيهات">
                <Bell size={18} strokeWidth={2.2} />
              </button>
              <button onClick={() => navigate('cart')} className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center" aria-label="السلة">
                <ShoppingCart size={18} strokeWidth={2.2} />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-[9px] font-extrabold flex items-center justify-center tabular animate-pop">{cartCount}</span>}
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => navigate('search')} className="flex-1 h-11 rounded-2xl bg-white text-ink-400 text-[12px] font-medium flex items-center gap-2 px-4 text-right shadow-card">
              <Search size={16} className="text-ink-400" />
              ابحث عن منتج، متجر، أو علامة...
            </button>
            <button onClick={() => navigate('search', { q: '', filters: true })} className="w-11 h-11 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-accent" aria-label="الفلاتر">
              <SlidersHorizontal size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin pb-28">
        {/* شريط العروض والإعلانات (أكثر من إعلان — تمرير + نقاط تنقل) */}
        <PromoCarousel
          promos={PROMOS}
          onAction={(p) => {
            if (p.action.type === 'category') return setCat(p.action.id)
            if (p.action.type === 'store') return navigate('store', { id: p.action.id })
            if (p.action.type === 'tab') return switchTab(p.action.tab)
          }}
        />

        {/* الأقسام */}
        <div className="px-4 pt-5">
          <SectionHeader title="الأقسام والتصنيفات" action="عرض الكل" onAction={() => navigate('search')} />
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)} className={`h-8 px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap transition ${cat === c.id ? 'bg-primary text-white shadow-brand' : 'bg-white text-ink-700 border border-ink-200'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* المتاجر المعتمدة */}
        <div className="px-4 pt-5">
          <SectionHeader title={`المتاجر المعتمدة في ${CITY}`} subtitle="تسوق مباشرة من أشهر متاجر المدينة" action="كل المتاجر" onAction={() => switchTab('nearbyStores')} />
          <div className="grid grid-cols-2 gap-3">
            {STORES.filter((s) => s.verified).slice(0, 2).map((s) => (
              <button key={s.id} onClick={() => navigate('store', { id: s.id })} className="card overflow-hidden text-right active:scale-[0.98] transition">
                <div className="h-20 bg-ink-100 relative overflow-hidden">
                  {s.cover ? <img src={s.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-50 flex items-center justify-center"><Store className="text-primary-300" size={30} /></div>}
                  <div className="absolute top-2 right-2"><VerifiedBadge /></div>
                </div>
                <div className="p-2.5">
                  <p className="text-[12px] font-bold text-ink-900 truncate">{s.name}</p>
                  <p className="text-[10px] font-medium text-ink-500">{s.area}، {s.city}</p>
                  <div className="flex items-center justify-between mt-1">
                    <Rating value={s.rating} />
                    <span className="text-[10px] font-medium text-ink-400">{s.tag}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* أبرز المنتجات */}
        <div className="px-4 pt-5">
          <SectionHeader title="أبرز المنتجات المختارة" action="المزيد" onAction={() => navigate('search', { q: '' })} />
          {featured.length ? (
            <div className="grid grid-cols-2 gap-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={(pr) => navigate('product', { id: pr.id })} />
              ))}
            </div>
          ) : (
            <div className="card p-6 text-center text-[12px] text-ink-500">لا توجد منتجات في هذا القسم حالياً</div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  المتاجر القريبة (CUS-017) / لا توجد (CUS-018)
// ─────────────────────────────────────────────────────────────
export function NearbyStores() {
  const { navigate, current, canGoBack } = useApp()
  const [area, setArea] = useState(current.params?.area || 'الكل')
  const list = STORES.filter((s) => area === 'الكل' || s.area === area)
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <TopBar
        title={canGoBack ? 'المتاجر القريبة منك' : 'المتاجر'}
        subtitle={`${STORES.length} متاجر معتمدة في ${CITY} — اختر الحي أو ابحث`}
        right={<button onClick={() => navigate('search')} className="icon-btn" aria-label="البحث"><Search size={18} strokeWidth={2.4} /></button>}
      />
      <div className="bg-white border-b border-ink-100 px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
        {AREAS.map((a) => (
          <button key={a} onClick={() => setArea(a)} className={`h-8 px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap ${area === a ? 'bg-primary text-white' : 'bg-ink-100 text-ink-700'}`}>
            {a}
          </button>
        ))}
      </div>
      {list.length ? (
        <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-2.5">
          {list.map((s) => (
            <button key={s.id} onClick={() => navigate('store', { id: s.id })} className="w-full card p-3 flex items-center gap-3 text-right active:scale-[0.99] transition">
              <StoreAvatar store={s} size={52} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ink-900 truncate flex items-center gap-1">{s.name} {s.verified && <ShieldCheck size={13} className="text-primary shrink-0" />}</p>
                <p className="text-[11px] font-medium text-ink-500 flex items-center gap-1"><MapPin size={11} /> {s.area} · <Truck size={11} /> {s.deliveryTime}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Chip tone={s.open ? 'success' : 'danger'}>{s.open ? 'مفتوح' : 'مغلق'}</Chip>
                  <Rating value={s.rating} />
                </div>
              </div>
              <ChevronLeft size={18} className="text-ink-400" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pb-24">
          <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><Store size={40} strokeWidth={1.6} /></div>
          <h2 className="text-[20px] font-extrabold">لا توجد متاجر في هذا النطاق حالياً</h2>
          <p className="text-[12px] text-ink-500 mt-2">نعمل على تغطية كافة أحياء {CITY} قريباً. يمكنك تغيير الحي للاطلاع على المتاجر المجاورة.</p>
          <button onClick={() => setArea('الكل')} className="btn-primary btn-md mt-6">عرض كل الأحياء</button>
        </div>
      )}
      <BottomNav />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تفاصيل المتجر وقائمة المنتجات (Figma 11:1464) + المتجر فارغ حالياً (CUS-020 · 11:1426)
//  بطاقة المنتج المدمجة هنا مطابقة للتصميم (صورة كبيرة + الاسم بسطرين + السعر + زر «+» فعلي يضيف للسلة)
// ─────────────────────────────────────────────────────────────
function StoreProductCard({ product, onOpen }) {
  const { state, requestAddToCart } = useApp()
  const inCart = state.cart[product.id] || 0
  const add = (e) => {
    e.stopPropagation()
    requestAddToCart(product)
  }
  return (
    <div onClick={() => onOpen(product)} className="card p-2.5 cursor-pointer active:scale-[0.98] transition">
      <div className="relative">
        <ProductThumb product={product} className="w-full h-[128px]" rounded="rounded-xl" />
        <FavoriteButton productId={product.id} className="absolute top-2 left-2" />
        <AvailabilityBadge stock={product.stock} className="absolute top-2 right-2 shadow-card" />
      </div>
      <h4 className="text-[12px] font-bold text-ink-900 leading-snug line-clamp-2 min-h-[34px] mt-2.5">{product.name}</h4>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Price value={product.price} size="sm" />
        <button
          onClick={add}
          aria-label={`أضف ${product.shortName} للسلة`}
          className={`relative w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-brand hover:shadow-brand-hover active:shadow-none active:scale-95 transition ${product.stock <= 0 ? 'bg-ink-300 shadow-none' : 'bg-primary hover:bg-primary-600'}`}
        >
          <Plus size={18} strokeWidth={2.6} />
          {inCart > 0 && <span className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-secondary text-[10px] font-extrabold flex items-center justify-center border-2 border-white tabular">{inCart}</span>}
        </button>
      </div>
    </div>
  )
}

export function StoreScreen() {
  const { current, navigate, back, switchTab, state } = useApp()
  const store = storeById(current.params.id)
  const products = PRODUCTS.filter((p) => !p.deleted && p.storeId === store.id && (store.id !== 'st-tech' || state.merchantProducts.includes(p.id)))

  // ── CUS-020: المتجر فارغ حالياً — شاشة مستقلة بهيدر وزر «تصفح متاجر أخرى» كما في التصميم ──
  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-ink-50">
        <StatusBar />
        <TopBar title="المتجر فارغ حالياً" subtitle={store.name} />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pb-6 animate-fade-in">
          <div className="w-24 h-24 rounded-3xl bg-warning-50 text-warning flex items-center justify-center mb-6"><PackageX size={42} strokeWidth={1.7} /></div>
          <h2 className="text-[22px] font-extrabold text-ink-900">لا توجد منتجات متوفرة حالياً</h2>
          <p className="text-[13px] font-medium text-ink-500 leading-relaxed mt-3">يقوم هذا المتجر بتحديث وتجديد مخزونه التجاري في الوقت الراهن. يرجى مراجعة المتاجر الأخرى في نفس الحي.</p>
        </div>
        <div className="px-5 pb-4">
          <button onClick={() => navigate('nearbyStores', {}, { replace: true })} className="btn-primary btn-lg w-full">تصفح متاجر أخرى</button>
        </div>
        <HomeIndicator />
      </div>
    )
  }

  // ── 11:1464: تفاصيل المتجر وقائمة المنتجات ──
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <div className="flex-1 overflow-y-auto scroll-thin">
        {/* غلاف المتجر + زر الرجوع */}
        <div className="relative h-[210px] bg-ink-200 overflow-hidden">
          {store.cover ? <img src={store.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary to-primary-400" />}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0">
            <StatusBar light />
            <div className="px-4 flex items-center justify-between">
              <button onClick={back} className="icon-btn bg-white/20 text-white hover:bg-white/30 backdrop-blur" aria-label="رجوع"><ArrowRight size={18} strokeWidth={2.4} /></button>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('notifications')} className="icon-btn bg-white/20 text-white hover:bg-white/30 backdrop-blur" aria-label="التنبيهات"><Bell size={18} strokeWidth={2.2} /></button>
                <button onClick={() => navigate('cart')} className="icon-btn bg-white/20 text-white hover:bg-white/30 backdrop-blur relative" aria-label="السلة"><ShoppingCart size={18} strokeWidth={2.2} />{state.cart && Object.keys(state.cart).length > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 px-1 rounded-full bg-secondary text-[8px] font-extrabold flex items-center justify-center">{Object.values(state.cart).reduce((a,b)=>a+b,0)}</span>}</button>
              </div>
            </div>
          </div>
        </div>

        {/* بطاقة المتجر (متداخلة مع الغلاف) */}
        <div className="px-4 -mt-14 relative">
          <div className="card p-4 flex items-center gap-3 shadow-elevated">
            <div className="w-[60px] h-[60px] rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
              {store.id === 'st-tech' ? <Logo icon size={40} /> : <StoreAvatar store={store} size={52} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[16px] font-extrabold text-ink-900 truncate">{store.name}</h1>
                {store.verified && <ShieldCheck size={16} className="text-primary shrink-0" />}
              </div>
              <p className="text-[12px] font-medium text-ink-500 mt-0.5">{store.area}، {store.city}</p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Chip tone={store.open ? 'success' : 'danger'}>● {store.open ? 'معتمد ومفتوح' : 'مغلق حالياً'}</Chip>
                {store.verified && <Chip tone="secondary">متجر رسمي موثوق</Chip>}
              </div>
            </div>
          </div>
        </div>

        {/* معلومات المتجر: الوصف · التواصل · وقت التوصيل · الموقع على الخريطة */}
        <div className="px-4 pt-3 space-y-3">
          <div className="card p-4">
            <p className="text-[13px] font-extrabold text-ink-900 flex items-center gap-1.5 mb-1.5"><Info size={14} className="text-primary" /> عن المتجر</p>
            <p className="text-[12px] font-medium text-ink-600 leading-relaxed">{store.description}</p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
              <div className="rounded-xl bg-ink-50 p-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success-50 text-success flex items-center justify-center shrink-0"><Truck size={15} /></div>
                <div className="min-w-0"><p className="text-ink-400 font-medium leading-none">وقت التوصيل المتوقع</p><p className="font-bold text-ink-900 mt-1 truncate">{store.deliveryTime}</p></div>
              </div>
              <div className="rounded-xl bg-ink-50 p-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0"><Clock size={15} /></div>
                <div className="min-w-0"><p className="text-ink-400 font-medium leading-none">تجهيز الطلب</p><p className="font-bold text-ink-900 mt-1 truncate">{store.prepTime}</p></div>
              </div>
              <div className="rounded-xl bg-ink-50 p-2.5 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-secondary-50 text-secondary flex items-center justify-center shrink-0"><UserRound size={15} /></div>
                <div className="min-w-0"><p className="text-ink-400 font-medium leading-none">صاحب المتجر</p><p className="font-bold text-ink-900 mt-1 truncate">{store.owner}</p></div>
              </div>
              <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="rounded-xl bg-ink-50 p-2.5 flex items-center gap-2 active:bg-primary-50 transition" aria-label={`اتصال بالمتجر ${store.phone}`}>
                <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0"><Phone size={15} /></div>
                <div className="min-w-0"><p className="text-ink-400 font-medium leading-none">رقم التواصل</p><p className="font-bold text-primary mt-1 tabular" dir="ltr">{store.phone}</p></div>
              </a>
            </div>
          </div>
          <div className="card p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-extrabold text-ink-900 flex items-center gap-1.5"><MapPin size={14} className="text-secondary" /> موقع المتجر على الخريطة</p>
              <span className="text-[11px] font-medium text-ink-500">{store.area}، {store.city}</span>
            </div>
            <StoreMapPreview location={store.location} height={128} />
          </div>
        </div>

        {/* قائمة المنتجات */}
        <div className="px-4 pt-5 pb-28">
          {!store.open && (
            <div className="rounded-card bg-danger-50 border border-danger-100 px-3 py-2.5 mb-3 flex items-center gap-2 text-[11px] font-bold text-danger" role="status">
              <Clock size={14} className="shrink-0" /> المتجر مغلق حالياً ولا يستقبل طلبات جديدة — يمكنك تصفح المنتجات فقط
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-extrabold text-ink-900">قائمة منتجات المتجر</h2>
            <span className="text-[12px] font-medium text-ink-400 tabular">{products.length} منتج</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <StoreProductCard key={p.id} product={p} onOpen={(pr) => navigate('product', { id: pr.id })} />
            ))}
          </div>
          <p className="text-[11px] font-medium text-ink-400 text-center mt-4">الحد الأدنى للطلب من هذا المتجر {fmt(store.minOrder)} ر.ي · التوصيل خلال {store.deliveryTime}</p>
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تفاصيل المنتج (CUS-021) — زر الإضافة يعمل فعلياً مع عدّاد
// ─────────────────────────────────────────────────────────────
export function ProductScreen() {
  const { current, navigate, back, cartCount, state, requestAddToCart } = useApp()
  const product = productById(current.params.id)
  const store = storeById(product.storeId)
  const [qty, setQty] = useState(1)
  const [imgI, setImgI] = useState(0)
  const gallery = (product.images || [product.image]).filter(Boolean).slice(0, 3)
  const inCart = state.cart[product.id] || 0
  const soldOut = product.stock <= 0
  const remaining = Math.max(0, product.stock - inCart) // المتبقي القابل للإضافة بعد ما في السلة
  const closed = store?.open === false // المتجر مغلق: لا يستقبل طلبات جديدة
  const add = () => {
    if (soldOut) return navigate('outOfStock', { id: product.id })
    requestAddToCart(product, qty)
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="relative h-[300px]" style={{ background: product.bg }}>
          {gallery[imgI] ? <img src={gallery[imgI]} alt={product.shortName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={80} className="text-ink-400" strokeWidth={1.2} /></div>}
          {gallery.length > 1 && (
            <>
              <button type="button" onClick={() => setImgI((i) => (i - 1 + gallery.length) % gallery.length)} className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn bg-white/90 shadow-card" aria-label="الصورة السابقة"><ArrowRight size={16} /></button>
              <button type="button" onClick={() => setImgI((i) => (i + 1) % gallery.length)} className="absolute left-3 top-1/2 -translate-y-1/2 icon-btn bg-white/90 shadow-card" aria-label="الصورة التالية"><ChevronLeft size={16} /></button>
            </>
          )}
          <div className="absolute inset-x-0 top-0">
            <StatusBar />
            <div className="px-4 flex items-center justify-between">
              <button onClick={back} className="icon-btn bg-white/90 shadow-card" aria-label="رجوع"><ArrowRight size={18} strokeWidth={2.4} /></button>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('notifications')} className="relative icon-btn bg-white/90 shadow-card" aria-label="التنبيهات"><Bell size={17} strokeWidth={2.2} /></button>
                <button onClick={() => navigate('cart')} className="relative icon-btn bg-white/90 shadow-card" aria-label="السلة">
                  <ShoppingCart size={17} strokeWidth={2.2} />
                  {cartCount > 0 && <span className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-white text-[9px] font-extrabold flex items-center justify-center tabular">{cartCount}</span>}
                </button>
                <FavoriteButton productId={product.id} className="!w-9 !h-9" />
              </div>
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <button key={i} type="button" onClick={() => setImgI(i)} className={`h-1.5 rounded-full transition-all ${i === imgI ? 'w-5 bg-primary' : 'w-1.5 bg-white/70'}`} aria-label={`صورة ${i + 1}`} />
              ))}
            </div>
          )}
        </div>
        <div className="px-5 pt-4 pb-32">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => navigate('store', { id: store.id })} className="text-[13px] font-bold text-secondary flex items-center gap-1 min-w-0">
              <Store size={14} className="shrink-0" /> <span className="truncate">{store.name}</span> <ChevronLeft size={14} className="shrink-0" />
            </button>
            <span className="text-[10px] font-bold text-success-700 flex items-center gap-1 whitespace-nowrap"><Truck size={12} /> التوصيل {store.deliveryTime}</span>
          </div>
          <h1 className="text-[18px] font-extrabold text-ink-900 leading-snug mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {soldOut ? <Chip tone="danger">نفدت الكمية</Chip> : <Chip tone="success">متوفر في المخزون ({product.stock})</Chip>}
            {closed && <Chip tone="danger">المتجر مغلق حالياً</Chip>}
            <Chip tone="primary">ضمان التاجر</Chip>
            {product.badge && !soldOut && <Chip tone="secondary">{product.badge}</Chip>}
          </div>
          <div className="card p-4 mt-4 flex items-center justify-between bg-ink-50">
            <div>
              <p className="text-[11px] font-medium text-ink-500">السعر الإجمالي</p>
              <Price value={product.price} size="lg" />
            </div>
          </div>
          <h3 className="text-[15px] font-extrabold text-ink-900 mt-6">الوصف والمميزات</h3>
          <p className="text-[13px] font-medium text-ink-600 leading-relaxed mt-1.5">{product.description}</p>
          <h3 className="text-[15px] font-extrabold text-ink-900 mt-6">المواصفات الفنية</h3>
          <div className="mt-2 divide-y divide-ink-100 border-y border-ink-100">
            {product.specs.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5 text-[12px]">
                <span className="text-ink-500 font-medium">{k}</span>
                <span className="text-ink-900 font-bold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur border-t border-ink-100 px-5 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <Stepper value={qty} onChange={setQty} min={1} max={Math.max(1, remaining)} maxHint={soldOut ? false : remaining === 0 ? `أقصى كمية متاحة — لديك ${inCart} في السلة` : inCart > 0 ? `أقصى كمية متاحة ${remaining} (لديك ${inCart} في السلة)` : `أقصى كمية متاحة (${product.stock})`} />
          <button onClick={add} className={`flex-1 btn-lg ${soldOut || closed ? 'btn-ghost' : 'btn-primary'}`}>
            <ShoppingCart size={18} strokeWidth={2.4} />
            {closed ? 'المتجر مغلق حالياً' : soldOut ? 'نفدت الكمية' : inCart ? `إضافة المزيد (في السلة ${inCart})` : 'إضافة إلى السلة'}
          </button>
        </div>
        <HomeIndicator />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  البحث الذكي (CUS-022) + نتائج (CUS-023) + لا نتائج (CUS-024)
// ─────────────────────────────────────────────────────────────
export function SearchScreen() {
  const { navigate, current, state } = useApp()
  const [q, setQ] = useState(current.params?.q ?? '')
  // الفلترة مدمجة في نفس شاشة البحث: ترتيب + تصنيف + حد أقصى للسعر + المتوفر فقط
  const [sort, setSort] = useState('all')
  const [cat, setCat] = useState('all')
  const [maxPrice, setMaxPrice] = useState(0) // 0 = بلا حد
  const [inStockOnly, setInStockOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(!!current.params?.filters)
  const activeFilters = (cat !== 'all' ? 1 : 0) + (maxPrice ? 1 : 0) + (inStockOnly ? 1 : 0)
  const resetFilters = () => { setCat('all'); setMaxPrice(0); setInStockOnly(false); setSort('all') }
  const results = useMemo(() => {
    const t = q.trim()
    if (!t && current.params?.q === undefined && !activeFilters) return null
    let list = PRODUCTS.filter((p) => !p.deleted).filter((p) => !t || p.name.includes(t) || p.shortName.includes(t) || CATEGORIES.find((c) => c.id === p.category)?.label.includes(t) || storeById(p.storeId).name.includes(t))
    if (cat !== 'all') list = list.filter((p) => p.category === cat)
    if (maxPrice) list = list.filter((p) => p.price <= maxPrice)
    if (inStockOnly) list = list.filter((p) => p.stock > 0)
    if (sort === 'cheap') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'rated') list = [...list].sort((a, b) => b.sold - a.sold)
    return list
  }, [q, sort, cat, maxPrice, inStockOnly, activeFilters, current.params, state.catalogVersion])
  // المنتجات المقترحة (تظهر في الحالة الفارغة كبديل مباشر)
  const suggested = useMemo(() => PRODUCTS.filter((p) => !p.deleted && p.stock > 0).sort((a, b) => b.sold - a.sold).slice(0, 4), [state.catalogVersion])
  const backToSuggested = () => { setQ(''); resetFilters(); navigate('search', {}, { replace: true }) }
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <h1 className="text-[18px] font-extrabold text-ink-900 mb-2">البحث الذكي</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن منتج، متجر، أو تصنيف..." className="field pr-11 bg-ink-100" autoFocus />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" />
            {q && <button onClick={() => setQ('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-label="مسح"><X size={16} /></button>}
          </div>
          <button onClick={() => setShowFilters((v) => !v)} className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition ${showFilters || activeFilters ? 'bg-secondary text-white shadow-accent' : 'bg-ink-100 text-ink-700'}`} aria-label="الفلاتر">
            <SlidersHorizontal size={18} strokeWidth={2.2} />
            {activeFilters > 0 && <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center">{activeFilters}</span>}
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {[['all', 'الكل'], ['near', 'الأقرب إليك'], ['cheap', 'الأقل سعراً'], ['rated', 'الأعلى تقييماً']].map(([k, l]) => (
            <button key={k} onClick={() => setSort(k)} className={`h-8 px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap ${sort === k ? 'bg-primary text-white' : 'bg-ink-100 text-ink-700'}`}>{l}</button>
          ))}
        </div>
        {showFilters && (
          <div className="mt-3 rounded-card bg-ink-50 border border-ink-100 p-3 space-y-3 animate-slide-up">
            <div>
              <p className="text-[11px] font-bold text-ink-500 mb-1.5">التصنيف</p>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setCat(c.id)} className={`h-7 px-3 rounded-full text-[11px] font-bold ${cat === c.id ? 'bg-secondary text-white' : 'bg-white border border-ink-200 text-ink-700'}`}>{c.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-ink-500 mb-1.5">الحد الأقصى للسعر</p>
              <div className="flex gap-1.5 flex-wrap">
                {[[0, 'بلا حد'], [10000, 'حتى 10,000'], [20000, 'حتى 20,000'], [40000, 'حتى 40,000']].map(([v, l]) => (
                  <button key={v} onClick={() => setMaxPrice(v)} className={`h-7 px-3 rounded-full text-[11px] font-bold tabular ${maxPrice === v ? 'bg-secondary text-white' : 'bg-white border border-ink-200 text-ink-700'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] font-bold text-ink-800 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-primary" /> المتوفر في المخزون فقط
              </label>
              {activeFilters > 0 && <button onClick={resetFilters} className="text-[11px] font-bold text-danger">مسح الفلاتر</button>}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28">
        {!results ? (
          <>
            <p className="text-[13px] font-bold text-ink-900 mb-2">الكلمات الأكثر بحثاً في {CITY}:</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((t) => (
                <button key={t} onClick={() => setQ(t)} className="h-9 px-4 rounded-full bg-white border border-ink-200 text-[12px] font-semibold text-ink-700 hover:border-primary hover:text-primary transition">{t}</button>
              ))}
            </div>
            <p className="text-[13px] font-bold text-ink-900 mt-6 mb-2">تصفح حسب التصنيف</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <button key={c.id} onClick={() => setQ(c.label)} className="card p-3 text-right text-[12px] font-bold text-ink-800 hover:border-primary">{c.label}</button>
              ))}
            </div>
            <p className="text-[13px] font-bold text-ink-900 mt-6 mb-2">منتجات مقترحة لك</p>
            <div className="grid grid-cols-2 gap-3">
              {suggested.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={(pr) => navigate('product', { id: pr.id })} />
              ))}
            </div>
          </>
        ) : results.length ? (
          <>
            <p className="text-[11px] font-medium text-ink-500 mb-3">تم العثور على {results.length} نتيجة{q && <> لـ "<b className="text-ink-900">{q}</b>"</>}{activeFilters > 0 && <> · {activeFilters} فلتر مفعّل</>}</p>
            <div className="grid grid-cols-2 gap-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={(pr) => navigate('product', { id: pr.id })} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center pt-6 px-4">
            {/* إيضاح الحالة الفارغة: عدسة بحث فوق بطاقات فارغة */}
            <svg width="180" height="130" viewBox="0 0 180 130" fill="none" aria-hidden="true" className="mb-4">
              <rect x="12" y="34" width="46" height="60" rx="10" fill="#F3F4F6" />
              <rect x="20" y="42" width="30" height="24" rx="6" fill="#E5E7EB" />
              <rect x="20" y="72" width="30" height="5" rx="2.5" fill="#E5E7EB" />
              <rect x="20" y="81" width="18" height="5" rx="2.5" fill="#E5E7EB" />
              <rect x="122" y="34" width="46" height="60" rx="10" fill="#F3F4F6" />
              <rect x="130" y="42" width="30" height="24" rx="6" fill="#E5E7EB" />
              <rect x="130" y="72" width="30" height="5" rx="2.5" fill="#E5E7EB" />
              <rect x="130" y="81" width="18" height="5" rx="2.5" fill="#E5E7EB" />
              <circle cx="90" cy="58" r="30" fill="#EDE5FA" />
              <circle cx="90" cy="58" r="18" stroke="#5002C9" strokeWidth="5" fill="white" />
              <line x1="103" y1="71" x2="118" y2="86" stroke="#5002C9" strokeWidth="6" strokeLinecap="round" />
              <path d="M82 54l16 8M98 54l-16 8" stroke="#FF5715" strokeWidth="3" strokeLinecap="round" />
              <circle cx="40" cy="20" r="4" fill="#FFE4D6" />
              <circle cx="146" cy="112" r="5" fill="#EDE5FA" />
              <circle cx="24" cy="112" r="3" fill="#EDE5FA" />
            </svg>
            <h2 className="text-[20px] font-extrabold text-ink-900">لم نعثر على منتجات أو متاجر مطابقة</h2>
            <p className="text-[12px] text-ink-500 mt-2 leading-relaxed max-w-[280px]">{q ? <>لا توجد نتائج لـ "<b className="text-ink-800">{q}</b>"{activeFilters > 0 && ' مع الفلاتر المفعّلة'}. </> : 'لا توجد نتائج مع الفلاتر المفعّلة. '}جرّب كلمات أعم، أو تحقق من الإملاء، أو عدّل الفلاتر.</p>
            <div className="flex flex-col gap-2 w-full mt-6">
              <button onClick={backToSuggested} className="w-full btn-primary btn-md"><Sparkles size={16} /> العودة إلى المنتجات المقترحة</button>
              {activeFilters > 0 && <button onClick={resetFilters} className="w-full btn-outline btn-md">مسح الفلاتر وإعادة البحث</button>}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export function FiltersScreen() {
  // الفلترة والترتيب (CUS-025) أصبحا مدمجين داخل شاشة البحث نفسها — هذا المسار يفتح البحث مع لوحة الفلترة مباشرة (بلا شاشة مكررة)
  const { navigate } = useApp()
  useEffect(() => { navigate('search', { q: '', filters: true }, { replace: true }) }, [navigate])
  return null
}

// ─────────────────────────────────────────────────────────────
//  المفضلة
// ─────────────────────────────────────────────────────────────
export function Favorites() {
  const { state, navigate, dispatch, showToast, switchTab } = useApp()
  const list = [...state.favorites].map(productById).filter((p) => p && !p.deleted)
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-extrabold text-ink-900">قائمة المفضلة</h1>
          <p className="text-[11px] text-ink-500 font-medium">{list.length} منتجات محفوظة</p>
        </div>
        <Heart className="text-danger" fill="currentColor" size={22} />
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28">
        {list.length ? (
          <div className="grid grid-cols-2 gap-3">
            {list.map((p) => (
              <div key={p.id} className="card overflow-hidden">
                <div className="relative cursor-pointer" onClick={() => navigate('product', { id: p.id })}>
                  <ProductThumb product={p} className="w-full h-[112px]" rounded="rounded-none" />
                  <AvailabilityBadge stock={p.stock} className="absolute top-2 right-2 shadow-card" />
                  <button onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_FAVORITE', productId: p.id }); showToast('أُزيل من المفضلة') }} className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 shadow-card flex items-center justify-center text-danger"><Trash2 size={14} /></button>
                </div>
                <div className="p-2.5">
                  <h4 className="text-[12px] font-bold text-ink-900 line-clamp-2 min-h-[34px]">{p.shortName}</h4>
                  <div className="flex items-center justify-between mt-1.5">
                    <Price value={p.price} size="sm" tone="primary" />
                  </div>
                  <div className="mt-2"><AddToCartButton product={p} full /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><Heart size={40} strokeWidth={1.6} /></div>
            <h2 className="text-[20px] font-extrabold">قائمة المفضلة فارغة</h2>
            <p className="text-[12px] text-ink-500 mt-2">اضغط على أيقونة القلب في أي منتج لحفظه هنا والعودة إليه لاحقاً.</p>
            <button onClick={() => switchTab('home')} className="btn-primary btn-md mt-6">تصفح المنتجات</button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
