import React, { useMemo, useState } from 'react'
import { MapPin, Navigation, Check, Plus, ChevronLeft, Search, SlidersHorizontal, Bell, ShoppingBag, Sparkles, ArrowRight, Store, X, Heart, Trash2, ShieldCheck, Clock, LocateFixed, MapPinOff, ShoppingCart, Filter, PackageX } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, BottomNav, Price, Chip, SectionHeader, ProductThumb, StoreAvatar, Rating, VerifiedBadge, StateScreen, ProductCard, FavoriteButton, AddToCartButton, Stepper, KeyValue, Logo } from '../components/ui'
import { AREAS, CATEGORIES, CITY, PRODUCTS, STORES, TRENDING_SEARCHES, productById, storeById, fmt } from '../data/mock'

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
  return (
    <StateScreen
      tone="success"
      icon={LocateFixed}
      code="CUS-015"
      showBack={false}
      title="تم رصد إحداثياتك بنجاح"
      description={`دقة الإشارة عالية (±5 أمتار) في مدينة ${CITY}`}
      primary={{ label: 'تأكيد هذا الموقع ومتابعة التسوق', onClick: () => navigate('addresses', {}, { resetTo: true }) }}
    >
      <div className="card p-4 text-right">
        <div className="flex items-center gap-1.5 text-[12px] font-bold text-success-700">
          <Check size={14} strokeWidth={3} /> العنوان التقريبي الحالي:
        </div>
        <p className="text-[13px] font-bold text-ink-900 mt-1">{CITY}، حي المسبح، بالقرب من مدرسة ناصر</p>
        <p className="font-mono text-[11px] text-ink-400 bg-ink-100 rounded-lg px-3 py-1.5 mt-2 inline-block" dir="ltr">N 13.5789° , E 44.0124°</p>
      </div>
    </StateScreen>
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
  const { state, dispatch, navigate, canGoBack, switchTab, showToast, back } = useApp()
  const [sel, setSel] = useState(state.addressId)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', details: '' })
  const confirm = () => {
    dispatch({ type: 'SET_ADDRESS', addressId: sel })
    showToast('تم اعتماد موقع التوصيل', 'success')
    canGoBack ? back() : switchTab('home')
  }
  const addNew = () => {
    if (form.title.trim().length < 2 || form.details.trim().length < 5) return showToast('أكمل اسم العنوان وتفاصيله', 'danger')
    const id = `a${Date.now()}`
    dispatch({ type: 'ADD_ADDRESS', address: { id, title: form.title.trim(), details: `${form.details.trim()}، ${CITY}`, phone: '773030064' } })
    setSel(id) // اختيار العنوان الجديد تلقائياً
    setAdding(false)
    setForm({ title: '', details: '' })
    showToast('تمت إضافة العنوان الجديد', 'success')
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={canGoBack ? 'تغيير موقع التوصيل' : 'تحديد موقع التوصيل'} subtitle={canGoBack ? `عناوينك المحفوظة في ${CITY}:` : 'اختر عنوانك أو حدد موقعك الحالي لعرض المتاجر الأقرب إليك'} code={canGoBack ? 'CUS-040' : undefined} />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        {!canGoBack && (
          <button onClick={() => navigate('mapPin')} className="w-full card p-4 flex items-center gap-3 text-right hover:border-primary transition">
            <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Navigation size={20} strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-primary">استخدم موقعي الحالي (GPS)</div>
              <div className="text-[11px] font-medium text-ink-500">تحديد تلقائي لمنطقتك على الخريطة</div>
            </div>
            <ChevronLeft size={18} className="text-ink-400" />
          </button>
        )}
        <div>
          <p className="text-[13px] font-bold text-ink-900 mb-2">عناويني المحفوظة</p>
          <div className="space-y-2.5">
            {state.addresses.map((a) => {
              const active = sel === a.id
              return (
                <button key={a.id} onClick={() => setSel(a.id)} className={`w-full card p-4 flex items-start gap-3 text-right transition ${active ? 'border-2 border-primary bg-primary-50/40' : ''}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${active ? 'bg-primary border-primary text-white' : 'border-ink-300'}`}>{active && <Check size={13} strokeWidth={3.5} />}</div>
                  <div className="flex-1">
                    <div className="text-[14px] font-bold text-ink-900">{a.title}</div>
                    <div className="text-[11px] font-medium text-ink-500 mt-0.5">{a.details}</div>
                    <div className="text-[11px] font-bold text-primary mt-1 tabular" dir="ltr">{a.phone}</div>
                  </div>
                  <MapPin size={18} className={active ? 'text-primary' : 'text-ink-300'} />
                </button>
              )
            })}
          </div>
        </div>
        {adding ? (
          <div className="card p-4 space-y-3 animate-slide-up">
            <div>
              <label className="label">اسم العنوان</label>
              <input className="field" placeholder="مثال: بيت العائلة" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">التفاصيل (الحي، الشارع، أقرب معلم)</label>
              <input className="field" placeholder="الحوبان، خلف مستشفى الثورة" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button onClick={addNew} className="flex-1 btn-primary btn-md">حفظ العنوان</button>
              <button onClick={() => setAdding(false)} className="btn-ghost btn-md">إلغاء</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="w-full h-12 rounded-card border-2 border-dashed border-primary-300 text-primary text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-primary-50 transition">
            <Plus size={16} strokeWidth={2.6} /> إضافة عنوان جديد على الخريطة
          </button>
        )}
      </div>
      <div className="px-5 pb-4 pt-2 bg-ink-50">
        <button onClick={confirm} className="w-full btn-primary btn-lg">{canGoBack ? 'حفظ واعتماد هذا الموقع' : 'تأكيد الموقع ومتابعة التسوق'}</button>
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
                dispatch({ type: 'SET_ADDRESS', addressId: 'a2' })
                showToast('تم تأكيد الموقع', 'success')
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
export function Home() {
  const { navigate, currentAddress, cartCount, state } = useApp()
  const [cat, setCat] = useState('all')
  const featured = useMemo(() => PRODUCTS.filter((p) => !p.deleted && (cat === 'all' || p.category === cat) && p.stock > 0), [cat, state.catalogVersion])
  const unread = state.seenNotifications ? 0 : 3
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
                {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-[9px] font-extrabold flex items-center justify-center">{unread}</span>}
              </button>
              <button onClick={() => navigate('cart')} className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center" aria-label="السلة">
                <ShoppingBag size={18} strokeWidth={2.2} />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-[9px] font-extrabold flex items-center justify-center tabular animate-pop">{cartCount}</span>}
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => navigate('search')} className="flex-1 h-11 rounded-2xl bg-white text-ink-400 text-[12px] font-medium flex items-center gap-2 px-4 text-right shadow-card">
              <Search size={16} className="text-ink-400" />
              ابحث عن منتج، متجر، أو علامة...
            </button>
            <button onClick={() => navigate('filters')} className="w-11 h-11 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-accent" aria-label="الفلاتر">
              <SlidersHorizontal size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin pb-28">
        {/* بانر العرض */}
        <div className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-modal bg-gradient-to-l from-secondary to-secondary-400 text-white p-4 shadow-accent">
            <Sparkles className="absolute left-4 top-3 text-white/25" size={80} strokeWidth={1.2} />
            <span className="inline-block bg-white/20 rounded-full px-2.5 h-5 text-[10px] font-bold leading-5">عرض اليوم الخاص</span>
            <h2 className="text-[20px] font-black mt-2 leading-tight">خصومات تصل 50%</h2>
            <p className="text-[12px] font-medium text-white/90">على الأجهزة الإلكترونية والساعات</p>
            <button onClick={() => setCat('electronics')} className="mt-3 h-8 px-4 rounded-full bg-white text-secondary text-[12px] font-bold">تسوق الآن</button>
          </div>
        </div>

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
          <SectionHeader title={`المتاجر المعتمدة في ${CITY}`} subtitle="تسوق مباشرة من أشهر متاجر المدينة" action="استكشاف" onAction={() => navigate('nearbyStores')} />
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
  const { navigate, current } = useApp()
  const [area, setArea] = useState(current.params?.area || 'الكل')
  const list = STORES.filter((s) => area === 'الكل' || s.area === area)
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="المتاجر القريبة منك" code="CUS-017" />
      <div className="bg-white border-b border-ink-100 px-4 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
        {AREAS.map((a) => (
          <button key={a} onClick={() => setArea(a)} className={`h-8 px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap ${area === a ? 'bg-primary text-white' : 'bg-ink-100 text-ink-700'}`}>
            {a}
          </button>
        ))}
      </div>
      {list.length ? (
        <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-2.5">
          {list.map((s) => (
            <button key={s.id} onClick={() => navigate('store', { id: s.id })} className="w-full card p-3 flex items-center gap-3 text-right active:scale-[0.99] transition">
              <StoreAvatar store={s} size={52} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-ink-900 truncate">{s.name}</p>
                <p className="text-[11px] font-medium text-ink-500">{s.area} · {s.prepTime}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Chip tone={s.open ? 'success' : 'danger'}>{s.open ? 'مفتوح' : 'مغلق'}</Chip>
                  <Chip tone="ink">التوصيل</Chip>
                  <Rating value={s.rating} />
                </div>
              </div>
              <ChevronLeft size={18} className="text-ink-400" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><Store size={40} strokeWidth={1.6} /></div>
          <h2 className="text-[20px] font-extrabold">لا توجد متاجر في هذا النطاق حالياً</h2>
          <p className="text-[12px] text-ink-500 mt-2">نعمل على تغطية كافة أحياء {CITY} قريباً. يمكنك تغيير الحي للاطلاع على المتاجر المجاورة.</p>
          <button onClick={() => setArea('الكل')} className="btn-primary btn-md mt-6">عرض كل الأحياء</button>
        </div>
      )}
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تفاصيل المتجر وقائمة المنتجات (Figma 11:1464) + المتجر فارغ حالياً (CUS-020 · 11:1426)
//  بطاقة المنتج المدمجة هنا مطابقة للتصميم (صورة كبيرة + الاسم بسطرين + السعر + زر «+» فعلي يضيف للسلة)
// ─────────────────────────────────────────────────────────────
function StoreProductCard({ product, onOpen }) {
  const { dispatch, showToast, state } = useApp()
  const inCart = state.cart[product.id] || 0
  const add = (e) => {
    e.stopPropagation()
    if (product.stock <= 0) return showToast('عذراً، نفدت الكمية من المخزون', 'danger')
    if (inCart >= product.stock) return showToast(`الحد الأقصى المتاح ${product.stock} قطعة`, 'danger')
    dispatch({ type: 'ADD_TO_CART', productId: product.id })
    showToast('أُضيف إلى السلة', 'success')
  }
  return (
    <div onClick={() => onOpen(product)} className="card p-2.5 cursor-pointer active:scale-[0.98] transition">
      <div className="relative">
        <ProductThumb product={product} className="w-full h-[128px]" rounded="rounded-xl" />
        <FavoriteButton productId={product.id} className="absolute top-2 left-2" />
        {product.stock <= 0 && <Chip tone="danger" className="absolute top-2 right-2">نفدت الكمية</Chip>}
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
            <div className="px-4">
              <button onClick={back} className="icon-btn bg-white/20 text-white hover:bg-white/30 backdrop-blur" aria-label="رجوع"><ArrowRight size={18} strokeWidth={2.4} /></button>
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

        {/* قائمة المنتجات */}
        <div className="px-4 pt-5 pb-28">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-extrabold text-ink-900">قائمة منتجات المتجر</h2>
            <span className="text-[12px] font-medium text-ink-400 tabular">{products.length} منتج</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <StoreProductCard key={p.id} product={p} onOpen={(pr) => navigate('product', { id: pr.id })} />
            ))}
          </div>
          <p className="text-[11px] font-medium text-ink-400 text-center mt-4">الحد الأدنى للطلب من هذا المتجر {fmt(store.minOrder)} ر.ي · التجهيز {store.prepTime}</p>
        </div>
      </div>

      {/* زر ثابت أسفل الشاشة كما في التصميم */}
      <div className="absolute inset-x-0 bottom-0 px-4 pt-6 pb-4 bg-gradient-to-t from-ink-50 via-ink-50/95 to-transparent">
        <button onClick={() => switchTab('home')} className="btn-primary btn-lg w-full">العودة إلى الرئيسية</button>
        <HomeIndicator />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تفاصيل المنتج (CUS-021) — زر الإضافة يعمل فعلياً مع عدّاد
// ─────────────────────────────────────────────────────────────
export function ProductScreen() {
  const { current, navigate, back, dispatch, showToast, cartCount, state } = useApp()
  const product = productById(current.params.id)
  const store = storeById(product.storeId)
  const [qty, setQty] = useState(1)
  const inCart = state.cart[product.id] || 0
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const soldOut = product.stock <= 0
  const add = () => {
    if (soldOut) return navigate('outOfStock', { id: product.id })
    if (inCart + qty > product.stock) return showToast(`المتاح في المخزون ${product.stock} قطعة فقط`, 'danger')
    dispatch({ type: 'ADD_TO_CART', productId: product.id, qty })
    showToast(`أُضيف ${qty} × ${product.shortName} إلى السلة`, 'success')
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="relative h-[300px]" style={{ background: product.bg }}>
          {product.image ? <img src={product.image} alt={product.shortName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={80} className="text-ink-400" strokeWidth={1.2} /></div>}
          <div className="absolute inset-x-0 top-0">
            <StatusBar />
            <div className="px-4 flex items-center justify-between">
              <button onClick={back} className="icon-btn bg-white/90 shadow-card" aria-label="رجوع"><ArrowRight size={18} strokeWidth={2.4} /></button>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('cart')} className="relative icon-btn bg-white/90 shadow-card" aria-label="السلة">
                  <ShoppingCart size={17} strokeWidth={2.2} />
                  {cartCount > 0 && <span className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-white text-[9px] font-extrabold flex items-center justify-center tabular">{cartCount}</span>}
                </button>
                <FavoriteButton productId={product.id} className="!w-9 !h-9" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            <span className="w-5 h-1.5 rounded-full bg-primary" /><span className="w-1.5 h-1.5 rounded-full bg-white/70" /><span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
        </div>
        <div className="px-5 pt-4 pb-32">
          <button onClick={() => navigate('store', { id: store.id })} className="text-[13px] font-bold text-primary flex items-center gap-1">
            <Store size={14} /> {store.name} <ChevronLeft size={14} />
          </button>
          <h1 className="text-[18px] font-extrabold text-ink-900 leading-snug mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {soldOut ? <Chip tone="danger">نفدت الكمية</Chip> : <Chip tone="success">متوفر في المخزون ({product.stock})</Chip>}
            <Chip tone="primary">ضمان الجودة</Chip>
            {product.badge && !soldOut && <Chip tone="secondary">{product.badge}</Chip>}
          </div>
          <div className="card p-4 mt-4 flex items-center justify-between bg-ink-50">
            <div>
              <p className="text-[11px] font-medium text-ink-500">السعر الإجمالي</p>
              <Price value={product.price} size="lg" old={product.oldPrice} />
            </div>
            {discount > 0 && <Chip tone="solidSecondary" className="!h-7 !text-[11px]">وفر {discount}%</Chip>}
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
          <Stepper value={qty} onChange={setQty} min={1} max={Math.max(1, product.stock)} />
          <button onClick={add} className={`flex-1 btn-lg ${soldOut ? 'btn-ghost' : 'btn-primary'}`}>
            <ShoppingBag size={18} strokeWidth={2.4} />
            {soldOut ? 'نفدت الكمية' : inCart ? `إضافة المزيد (في السلة ${inCart})` : 'إضافة إلى السلة'}
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
  const [sort, setSort] = useState('all')
  const results = useMemo(() => {
    const t = q.trim()
    if (!t && current.params?.q === undefined) return null
    let list = PRODUCTS.filter((p) => !p.deleted).filter((p) => !t || p.name.includes(t) || p.shortName.includes(t) || CATEGORIES.find((c) => c.id === p.category)?.label.includes(t) || storeById(p.storeId).name.includes(t))
    if (sort === 'cheap') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'rated') list = [...list].sort((a, b) => b.sold - a.sold)
    return list
  }, [q, sort, current.params, state.catalogVersion])
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <h1 className="text-[18px] font-extrabold text-ink-900 mb-2">البحث الذكي</h1>
        <div className="relative">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن منتج، متجر، أو تصنيف..." className="field pr-11 bg-ink-100" autoFocus />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" />
          {q && <button onClick={() => setQ('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"><X size={16} /></button>}
        </div>
        {results && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {[['all', 'الكل'], ['near', 'الأقرب إليك'], ['cheap', 'الأرخص سعراً'], ['rated', 'الأعلى تقييماً']].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} className={`h-8 px-3.5 rounded-full text-[12px] font-bold whitespace-nowrap ${sort === k ? 'bg-primary text-white' : 'bg-ink-100 text-ink-700'}`}>{l}</button>
            ))}
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
          </>
        ) : results.length ? (
          <>
            <p className="text-[11px] font-medium text-ink-500 mb-3">تم العثور على {results.length} نتيجة{q && <> لـ "<b className="text-ink-900">{q}</b>"</>}</p>
            <div className="grid grid-cols-2 gap-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} onOpen={(pr) => navigate('product', { id: pr.id })} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><Search size={40} strokeWidth={1.6} /></div>
            <h2 className="text-[20px] font-extrabold">لم نعثر على أي نتائج</h2>
            <p className="text-[12px] text-ink-500 mt-2">تأكد من كتابة الكلمات بشكل صحيح، أو جرب البحث بكلمات عامة أخرى.</p>
            <button onClick={() => setQ('')} className="btn-outline btn-md mt-6">مسح البحث</button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

export function FiltersScreen() {
  const { back, navigate, showToast } = useApp()
  const [sel, setSel] = useState('near')
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="الفلترة والترتيب الذكي" code="CUS-025" />
      <div className="flex-1 px-5 py-4">
        <p className="text-[13px] font-bold text-ink-900 mb-3">خيارات الترتيب المعتمدة:</p>
        <div className="space-y-2.5">
          {[['near', MapPin, 'الأقرب مسافة أولاً', `حسب موقعك الحالي في ${CITY}`], ['cheap', Filter, 'الأرخص سعراً أولاً', 'من السعر الأقل إلى الأعلى'], ['rated', Sparkles, 'الأعلى تقييماً', 'حسب تقييمات العملاء']].map(([k, Icon, t, d]) => {
            const active = sel === k
            return (
              <button key={k} onClick={() => setSel(k)} className={`w-full card p-4 flex items-center gap-3 text-right ${active ? 'border-2 border-primary bg-primary-50/40' : ''}`}>
                <Icon size={20} className={active ? 'text-primary' : 'text-ink-400'} />
                <div className="flex-1">
                  <div className={`text-[14px] font-bold ${active ? 'text-primary' : 'text-ink-900'}`}>{t}</div>
                  <div className="text-[11px] text-ink-500">{d}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary text-white' : 'border-ink-300'}`}>{active && <Check size={13} strokeWidth={3.5} />}</div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="px-5 pb-4">
        <button onClick={() => { showToast('تم تطبيق الترتيب', 'success'); navigate('search', { q: '' }, { replace: true }) }} className="w-full btn-primary btn-lg">تطبيق الترتيب</button>
      </div>
      <HomeIndicator />
    </div>
  )
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
