import React, { useMemo, useState } from 'react'
import { Store, Upload, FileText, Image as ImageIcon, Check, X, Clock, ShieldCheck, Plus, Pencil, Trash2, Package, ClipboardList, BarChart3, ChevronLeft, AlertTriangle, DollarSign, TrendingUp, CheckCircle2, Bell, Lock, Mail, KeyRound, ArrowRight, Boxes, MapPin, Phone, Truck, UserRound, Landmark, Wallet, ShoppingBag, XCircle, Ban, LogOut } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, BottomNav, Price, Chip, ProductThumb, StateScreen, KeyValue, StageChip, Modal, Logo, PaymentChip, StoreMapPreview } from '../components/ui'
import { CATEGORIES, CURRENCY, MERCHANT, MERCHANT_NOTIFICATIONS, ORDER_STAGES, STAGE_INDEX, USER, fmt, productById, storeById, normalizeStage } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  تسجيل التاجر: بيانات مطلوبة (M-042) → إنشاء متجر → هوية (M-044)
//  → صور (M-045) → قيد المراجعة → اعتماد (M-049) / رفض (M-048)
// ─────────────────────────────────────────────────────────────
export function MerchantIntro() {
  const { navigate } = useApp()
  return (
    <StateScreen tone="info" icon={Store} code="M-042" title="يلزم تعبئة بياناتك كتاجر أولاً" description="قبل فتح وإطلاق متجرك في سوق جديد، يتطلب النظام إكمال متطلبات التوثيق الرسمي (KYC) لحماية حقوق العملاء والتجار." primary={{ label: 'البدء بتعبئة نموذج التاجر', onClick: () => navigate('merchantForm', {}, { replace: true }) }}>
      <div className="card p-4 text-right">
        <p className="text-[12px] font-bold text-ink-900 mb-2">المستندات والمعلومات المطلوبة:</p>
        {['اسم المتجر واسم صاحبه ورقم التواصل', 'موقع المتجر على الخريطة ووقت التوصيل المتوقع', 'بيانات استلام المدفوعات (حساب بنكي / محفظة)', 'صورتان لبطاقة الهوية (الوجه والظهر)', 'صور حقيقية لواجهة المتجر (صورتان على الأقل)', 'صورة غلاف المتجر وشعاره'].map((t) => (
          <p key={t} className="text-[11px] font-medium text-ink-600 flex items-center gap-2 py-1"><Check size={13} className="text-success" strokeWidth={3} /> {t}</p>
        ))}
      </div>
    </StateScreen>
  )
}

export function MerchantForm() {
  const { navigate, showToast, state } = useApp()
  const linkedAccount = state.auth.email || USER.email
  // اسم صاحب المتجر ورقم التواصل يُملآن تلقائياً من بيانات الحساب (قابلة للتعديل) — الاسم الرباعي مطلوب
  const DELIVERY_OPTIONS = ['25-40 دقيقة', '35-50 دقيقة', '45-60 دقيقة', '60-90 دقيقة', 'خلال 24 ساعة', 'لدي مدة توصيل خاصة']
  const [f, setF] = useState({ name: 'تكنو سيبس للإلكترونيات', owner: 'محمد سعيد أحمد علي', phone: USER.phone, cat: 'electronics', city: 'تعز', area: 'شارع جمال، المسبح', deliveryTime: '45-60 دقيقة', customDelivery: '', bank: 'بنك الكريمي للتمويل الأصغر', account: '', holder: 'محمد سعيد أحمد علي' })
  const [loc, setLoc] = useState(null) // { x, y, label } يُحدَّد بالنقر على الخريطة
  const [logo, setLogo] = useState(false)
  const [cover, setCover] = useState(false)
  const [errors, setErrors] = useState({})
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }
  const pickLocation = () => { setLoc({ lat: 13.5795, lng: 44.021, x: 52, y: 44, label: 'شارع جمال، جوار بريد تعز المركزي' }); setErrors({ ...errors, loc: undefined }); showToast('تم تثبيت موقع المتجر على الخريطة', 'success') }
  const submit = () => {
    const er = {}
    if (f.name.trim().length < 3) er.name = 'اسم المتجر مطلوب'
    if (f.owner.trim().split(/\s+/).filter(Boolean).length < 4) er.owner = 'اسم صاحب المتجر الرباعي مطلوب (أربعة أسماء)'
    if (!/^(\+?967)?7\d{8}$/.test(f.phone.replace(/\s/g, ''))) er.phone = 'رقم التواصل يجب أن يبدأ بـ 7 ويتكون من 9 أرقام'
    if (f.area.trim().length < 3) er.area = 'الحي مطلوب'
    if (!loc) er.loc = 'حدد موقع المتجر على الخريطة'
    if (f.deliveryTime === 'لدي مدة توصيل خاصة') {
      if (!f.customDelivery.trim()) er.deliveryTime = 'أدخل مدة التوصيل الخاصة بك'
    } else if (!f.deliveryTime.trim()) er.deliveryTime = 'وقت التوصيل مطلوب'
    if (f.account.trim().length < 6) er.account = 'رقم الحساب / المحفظة مطلوب لاستلام المدفوعات'
    if (!logo) er.logo = 'شعار المتجر مطلوب — يظهر للعملاء في قوائم المتاجر'
    if (!cover) er.cover = 'غلاف المتجر مطلوب — يظهر كخلفية في صفحة متجرك'
    setErrors(er)
    if (Object.keys(er).length) return showToast('أكمل الحقول المطلوبة', 'danger')
    navigate('merchantIdentity')
  }
  const Err = ({ k }) => (errors[k] ? <p className="text-[11px] font-bold text-danger mt-1">{errors[k]}</p> : null)
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="طلب إنشاء متجر جديد" subtitle="أدخل البيانات الأساسية لمتجرك الرقمي في منصة جديد:" />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        <div className="rounded-card bg-primary-50 border border-primary-100 px-3 py-2.5 flex items-center gap-2 text-[11px] font-medium text-primary">
          <UserRound size={14} className="shrink-0" /> الحساب المرتبط بالمتجر: <b dir="ltr" className="truncate">{linkedAccount}</b>
        </div>
        <div>
          <label className="label">اسم المتجر</label>
          <input className={`field bg-white ${errors.name ? 'field-error' : ''}`} value={f.name} onChange={set('name')} />
          <Err k="name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">اسم صاحب المتجر</label>
            <input className={`field bg-white ${errors.owner ? 'field-error' : ''}`} value={f.owner} onChange={set('owner')} />
            <Err k="owner" />
          </div>
          <div>
            <label className="label">رقم التواصل</label>
            <input dir="ltr" inputMode="tel" className={`field bg-white text-left tabular ${errors.phone ? 'field-error' : ''}`} value={f.phone} onChange={set('phone')} placeholder="7xxxxxxxx" />
            <Err k="phone" />
          </div>
        </div>
        <div>
          <label className="label">نوع النشاط / التصنيف الرئيسي</label>
          <select className="field bg-white" value={f.cat} onChange={set('cat')}>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">المدينة</label>
            <input className="field bg-white" value={f.city} readOnly />
          </div>
          <div>
            <label className="label">الحي</label>
            <input className={`field bg-white ${errors.area ? 'field-error' : ''}`} value={f.area} onChange={set('area')} />
            <Err k="area" />
          </div>
        </div>
        <div>
          <label className="label">موقع المتجر على الخريطة</label>
          <StoreMapPreview location={loc} height={130} onClick={pickLocation} className={loc ? 'border-success' : errors.loc ? 'border-danger' : ''} />
          <p className="text-[10px] text-ink-400 mt-1">{loc ? 'تم تثبيت الدبوس — انقر مرة أخرى لإعادة التحديد' : 'انقر على الخريطة لتثبيت دبوس موقع المتجر (يظهر للعملاء في صفحة المتجر)'}</p>
          <Err k="loc" />
        </div>
        <div>
          <label className="label">وقت التوصيل المتوقع للعملاء</label>
          <select className={`field bg-white ${errors.deliveryTime ? 'field-error' : ''}`} value={f.deliveryTime} onChange={set('deliveryTime')}>
            {DELIVERY_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
          {f.deliveryTime === 'لدي مدة توصيل خاصة' && (
            <input className={`field bg-white mt-2 ${errors.deliveryTime ? 'field-error' : ''}`} value={f.customDelivery} onChange={set('customDelivery')} placeholder="مثال: 2-3 ساعات حسب المنطقة" />
          )}
          <p className="text-[10px] text-ink-400 mt-1">اختر مدة جاهزة أو اختر «لدي مدة توصيل خاصة» واكتبها بنفسك</p>
          <Err k="deliveryTime" />
        </div>
        <div className="card p-3 space-y-3">
          <p className="text-[12px] font-extrabold text-ink-900 flex items-center gap-1.5"><Landmark size={14} className="text-primary" /> بيانات استلام المدفوعات (تظهر للعميل عند اختيار التحويل)</p>
          <div>
            <label className="label">البنك / جهة التحويل</label>
            <select className="field bg-white" value={f.bank} onChange={set('bank')}>
              {['بنك الكريمي للتمويل الأصغر', 'بنك التضامن', 'بنك اليمن والكويت', 'محفظة جوالي', 'محفظة كاش'].map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">رقم الحساب / المحفظة</label>
              <input dir="ltr" className={`field bg-white text-left tabular ${errors.account ? 'field-error' : ''}`} value={f.account} onChange={set('account')} placeholder="KR-3001-000000-00" />
              <Err k="account" />
            </div>
            <div>
              <label className="label">اسم صاحب الحساب</label>
              <input className="field bg-white" value={f.holder} onChange={set('holder')} />
            </div>
          </div>
        </div>
        <div className="card p-3 space-y-3">
          <p className="text-[12px] font-extrabold text-ink-900">شعار المتجر وغلافه (يظهران للعملاء)</p>
          <p className="text-[10px] text-ink-500 leading-relaxed">الشعار والغلاف يظهران مباشرة للعملاء في التطبيق — ليسا للتوثيق الإداري. سترفع صور التوثيق الإدارية (واجهة المتجر الحقيقية) في الخطوة التالية بشكل منفصل.</p>
          <div>
            <label className="label">شعار المتجر (مربع 1:1) — يظهر في قوائم المتاجر والبحث</label>
            <button type="button" onClick={() => setLogo(true)} className={`w-full rounded-xl border-2 flex items-center gap-3 p-3 text-right transition ${logo ? 'border-success bg-success-50/40' : errors.logo ? 'border-danger bg-white' : 'border-dashed border-primary-300 bg-white'}`}>
              <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">{logo ? <Logo icon size={36} /> : <Store size={22} />}</div>
              <div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-ink-900">{logo ? 'تم رفع الشعار' : 'رفع شعار المتجر'}</p><p className="text-[10px] text-ink-400">PNG أو JPG — خلفية شفافة مفضلة</p></div>
              {logo && <Check size={16} className="text-success" />}
            </button>
            <Err k="logo" />
          </div>
          <div>
            <label className="label">غلاف المتجر (Banner 16:9) — يظهر كخلفية في صفحة متجرك للعملاء</label>
            <button type="button" onClick={() => setCover(true)} className={`w-full h-28 rounded-xl border-2 flex flex-col items-center justify-center overflow-hidden transition ${cover ? 'border-success' : errors.cover ? 'border-danger bg-white' : 'border-dashed border-secondary-300 bg-white'}`}>
              {cover ? <img src="/img/store-cover.jpg" alt="" className="w-full h-full object-cover" /> : <><ImageIcon size={24} className="text-secondary" /><p className="text-[12px] font-bold text-ink-900 mt-1">رفع غلاف المتجر</p><p className="text-[10px] text-ink-400">نسبة 16:9 — تُعرض في صفحة المتجر</p></>}
            </button>
            <Err k="cover" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <button onClick={submit} className="w-full btn-primary btn-lg">تقديم طلب إنشاء المتجر</button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function MerchantIdentity() {
  const { navigate } = useApp()
  // التوثيق يتطلب: وجه البطاقة + ظهر البطاقة + صورتين حقيقيتين على الأقل لواجهة المتجر (محاكاة رفع)
  const [idFront, setIdFront] = useState(null)
  const [idBack, setIdBack] = useState(null)
  const [storefront, setStorefront] = useState([])
  const MIN_STOREFRONT = 2
  const complete = !!idFront && !!idBack && storefront.length >= MIN_STOREFRONT
  const missing = [!idFront && 'وجه البطاقة', !idBack && 'ظهر البطاقة', storefront.length < MIN_STOREFRONT && `${MIN_STOREFRONT - storefront.length} صورة لواجهة المتجر`].filter(Boolean)
  const addStorefront = () => setStorefront((l) => (l.length >= 4 ? l : [...l, { name: `storefront_${l.length + 1}.jpg`, size: `${(1.6 + l.length * 0.4).toFixed(1)} ميجابايت` }]))
  const Slot = ({ label, hint, file, onPick, onClear, icon: Icon = ImageIcon }) => (
    <div>
      <p className="text-[11px] font-bold text-ink-700 mb-1">{label}</p>
      {file ? (
        <div className="card p-2.5 flex items-center gap-2.5 animate-slide-up border-success">
          <div className="w-9 h-9 rounded-lg bg-success-50 text-success flex items-center justify-center"><Check size={16} strokeWidth={3} /></div>
          <div className="flex-1 min-w-0"><p className="text-[11px] font-bold font-mono truncate" dir="ltr">{file.name}</p><p className="text-[10px] text-ink-500">{file.size} • واضحة</p></div>
          <button onClick={onClear} className="text-danger" aria-label={`حذف ${label}`}><X size={15} /></button>
        </div>
      ) : (
        <button onClick={onPick} className="w-full rounded-card border-2 border-dashed border-primary-300 bg-white p-3 flex items-center gap-2.5 text-right hover:bg-primary-50 transition" aria-label={`رفع ${label}`}>
          <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0"><Icon size={16} /></div>
          <div className="min-w-0"><p className="text-[11px] font-bold text-ink-900">التقاط أو رفع الصورة</p><p className="text-[10px] text-ink-400 leading-snug">{hint}</p></div>
        </button>
      )}
    </div>
  )
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="توثيق الهوية والمتجر" code="M-044" subtitle="صورتان للبطاقة + صور حقيقية لواجهة المتجر" />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        <div className="card p-3.5 space-y-3">
          <div>
            <h2 className="text-[14px] font-extrabold text-ink-900 flex items-center gap-1.5"><FileText size={15} className="text-primary" /> بطاقة الهوية الوطنية لصاحب المتجر</h2>
            <p className="text-[11px] text-ink-500 mt-0.5 leading-relaxed">صورتان واضحتان للبطاقة (الوجه والظهر) — للتحقق الإداري فقط، لا تظهر للعملاء نهائياً.</p>
          </div>
          <Slot label="1) وجه البطاقة (الأمام)" hint="الاسم والرقم الوطني والصورة ظاهرة بوضوح" file={idFront} onPick={() => setIdFront({ name: 'national_id_front.jpg', size: '2.1 ميجابايت' })} onClear={() => setIdFront(null)} icon={FileText} />
          <Slot label="2) ظهر البطاقة (الخلف)" hint="تاريخ الانتهاء وجهة الإصدار ظاهران" file={idBack} onPick={() => setIdBack({ name: 'national_id_back.jpg', size: '1.9 ميجابايت' })} onClear={() => setIdBack(null)} icon={FileText} />
        </div>
        <div className="card p-3.5 space-y-3 border-2 border-warning-100">
          <div>
            <h2 className="text-[14px] font-extrabold text-ink-900 flex items-center gap-1.5"><Store size={15} className="text-secondary" /> صور واجهة المتجر الخاصة بالإدارة (للتوثيق فقط)</h2>
            <p className="text-[11px] text-warning-700 font-bold mt-0.5 leading-relaxed bg-warning-50 rounded-lg px-2 py-1">⚠️ هذه الصور للإدارة فقط للتحقق من وجود المتجر على أرض الواقع — لا تظهر للعملاء. صور العملاء (الشعار والغلاف) رفعتها في الخطوة السابقة وستظهر في صفحة متجرك.</p>
            <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">صورتان على الأقل (بحد أقصى 4) تُلتقطان في الموقع وتُظهر اللافتة والمدخل — تتحقق منها الإدارة بمطابقتها مع الموقع المحدد على الخريطة.</p>
          </div>
          {storefront.map((f, i) => (
            <div key={f.name} className="card p-2.5 flex items-center gap-2.5 animate-slide-up border-success">
              <div className="w-9 h-9 rounded-lg bg-success-50 text-success flex items-center justify-center"><ImageIcon size={16} /></div>
              <div className="flex-1 min-w-0"><p className="text-[11px] font-bold font-mono truncate" dir="ltr">{f.name}</p><p className="text-[10px] text-ink-500">{f.size} • صورة {i + 1} من واجهة المتجر</p></div>
              <button onClick={() => setStorefront((l) => l.filter((x) => x.name !== f.name))} className="text-danger" aria-label={`حذف صورة الواجهة ${i + 1}`}><X size={15} /></button>
            </div>
          ))}
          {storefront.length < 4 && (
            <button onClick={addStorefront} className="w-full rounded-card border-2 border-dashed border-secondary-300 bg-white p-3 flex items-center gap-2.5 text-right hover:bg-secondary-50 transition" aria-label="التقاط صورة لواجهة المتجر">
              <div className="w-9 h-9 rounded-lg bg-secondary-50 text-secondary flex items-center justify-center shrink-0"><Upload size={16} /></div>
              <div className="min-w-0"><p className="text-[11px] font-bold text-ink-900">التقاط صورة لواجهة المتجر ({storefront.length}/{MIN_STOREFRONT} على الأقل)</p><p className="text-[10px] text-ink-400">JPG أو PNG · بحد أقصى 5 ميجابايت للصورة</p></div>
            </button>
          )}
        </div>
        {!complete && <p className="text-[11px] font-bold text-warning-700 flex items-center gap-1.5"><AlertTriangle size={13} /> متبقٍ لإكمال التوثيق: {missing.join(' · ')}</p>}
        {complete && <p className="text-[11px] font-bold text-success-700 flex items-center gap-1.5"><CheckCircle2 size={13} /> اكتملت صور التوثيق المطلوبة</p>}
      </div>
      <div className="px-5 pb-4">
        <button disabled={!complete} onClick={() => navigate('merchantMedia')} className="w-full btn-primary btn-lg">متابعة لرفع صورة المتجر</button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function MerchantMedia() {
  const { navigate, dispatch } = useApp()
  const [banner, setBanner] = useState(false)
  const [logo, setLogo] = useState(false)
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="صور المتجر الظاهرة للعملاء" code="M-045" subtitle="هذه الصور تظهر للعملاء مباشرة — ليست للتوثيق الإداري" />
      <div className="flex-1 px-5 py-4 space-y-4">
        <div className="rounded-card bg-secondary-50 border border-secondary-100 p-3 text-[11px] font-medium text-secondary">
          <p className="font-bold">للتوضيح:</p>
          <p className="mt-1 leading-relaxed">الشعار والغلاف هنا هما ما يراه العميل في التطبيق (صفحة متجرك وقوائم التسوق). أما صور الواجهة الحقيقية التي رفعتها سابقاً فهي للإدارة فقط للتحقق من موقعك ولا تظهر للعملاء.</p>
        </div>
        <div>
          <label className="label">صورة غلاف المتجر للعملاء (Banner 16:9) — تظهر كخلفية في صفحة متجرك</label>
          <button onClick={() => setBanner(true)} className={`w-full h-36 rounded-modal border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition ${banner ? 'border-success' : 'border-secondary-300 bg-white'}`}>
            {banner ? <img src="/img/store-cover.jpg" alt="" className="w-full h-full object-cover" /> : <><ImageIcon size={28} className="text-secondary" /><p className="text-[12px] font-bold text-ink-900 mt-2">التقاط أو رفع غلاف المتجر للعملاء</p><p className="text-[10px] text-ink-400">نسبة 16:9 — هذه هي الصورة التي يراها العميل</p></>}
          </button>
        </div>
        <div>
          <label className="label">شعار المتجر للعملاء (مربع 1:1) — يظهر في قوائم المتاجر</label>
          <button onClick={() => setLogo(true)} className={`card p-3 w-full flex items-center gap-3 text-right ${logo ? 'border-success' : 'border-dashed border-2 border-primary-300'}`}>
            <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary flex items-center justify-center">{logo ? <Logo icon size={40} /> : <Store size={24} />}</div>
            <div>
              <p className="text-[12px] font-bold text-ink-900">{logo ? 'تم رفع الشعار' : 'شعار المتجر للعملاء (مربع 1:1)'}</p>
              <p className="text-[10px] text-ink-400">يظهر بأعلى قوائم التسوق والبحث — ما يراه العميل</p>
            </div>
          </button>
        </div>
      </div>
      <div className="px-5 pb-4">
        <button disabled={!banner || !logo} onClick={() => { dispatch({ type: 'MERCHANT_STATUS', status: 'pending' }); navigate('merchantPending', {}, { resetTo: true }) }} className="w-full btn-primary btn-lg">متابعة لمراجعة طلب المتجر</button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function MerchantPending() {
  const { switchTab } = useApp()
  return (
    <StateScreen tone="warning" icon={Clock} showBack={false} title="طلب المتجر قيد المراجعة" description={<>طلبك رقم <b className="text-secondary" dir="ltr">{MERCHANT.requestId}</b> قيد الفحص من فريق الإدارة. الاعتماد والرفض من صلاحيات الإدارة فقط، وسيصلك إشعار فور اتخاذ القرار.</>} primary={{ label: 'العودة إلى حسابي', onClick: () => switchTab('account') }}>
      <div className="card p-3 text-right">
        <p className="text-[11px] font-bold text-ink-900">ماذا يحدث الآن؟</p>
        <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">يراجع فريق الإدارة مستنداتك وصور واجهة المتجر ومطابقتها مع الموقع. لا يمكنك اعتماد المتجر بنفسك.</p>
      </div>
    </StateScreen>
  )
}

export function MerchantApproved() {
  const { switchTab } = useApp()
  return (
    <StateScreen tone="success" icon={ShieldCheck} code="M-049" showBack={false} title="تهانينا! تم اعتماد متجرك" description="تم التحقق من هويتك وموافقة إدارة منصة جديد على افتتاح متجرك التجاري في تعز" primary={{ label: 'الدخول إلى لوحة تحكم التاجر', onClick: () => switchTab('m-dashboard') }} secondary={{ label: 'متابعة التسوق كعميل', onClick: () => switchTab('home') }}>
      <KeyValue rows={[['اسم المتجر:', 'تكنو سيبس للإلكترونيات'], ['معرف التاجر:', MERCHANT.merchantId, 'text-primary'], ['حالة الطلب:', 'مقبول — المتجر نشط', 'text-success-700']]} />
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  المتجر محظور — شاشة مستقلة: سبب الحظر + تقديم اعتراض للإدارة + تسجيل الخروج
// ─────────────────────────────────────────────────────────────
export function MerchantBanned() {
  const { dispatch, showToast } = useApp()
  const [appeal, setAppeal] = useState('')
  const [sent, setSent] = useState(false)
  const submitAppeal = () => {
    if (appeal.trim().length < 20) return showToast('اكتب توضيحاً لا يقل عن 20 حرفاً', 'danger')
    setSent(true)
    showToast('تم إرسال اعتراضك إلى الإدارة', 'success')
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="المتجر محظور" subtitle="تم إيقاف متجرك من قِبل إدارة المنصة" onBack={() => dispatch({ type: 'LOGOUT' })} />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-3">
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-20 h-20 rounded-3xl bg-danger-50 text-danger flex items-center justify-center mb-3"><Ban size={38} strokeWidth={1.8} /></div>
          <h2 className="text-[20px] font-extrabold text-ink-900">متجرك محظور حالياً</h2>
          <p className="text-[12px] text-ink-500 mt-1.5 leading-relaxed max-w-[300px]">لا يظهر متجرك للعملاء ولا يستقبل طلبات جديدة حتى تُراجع الإدارة اعتراضك وترفع الحظر.</p>
        </div>
        <div className="bg-danger-50 border border-danger-100 rounded-card p-4">
          <p className="text-[12px] font-extrabold text-danger flex items-center gap-1.5"><AlertTriangle size={14} /> سبب الحظر</p>
          <p className="text-[12px] font-medium text-ink-800 mt-1.5 leading-relaxed">{MERCHANT.banReason}</p>
          <p className="text-[10px] text-ink-500 mt-2">تاريخ الحظر: {MERCHANT.banDate} · معرف التاجر: <span className="tabular" dir="ltr">{MERCHANT.merchantId}</span></p>
        </div>
        {sent ? (
          <div className="card p-4 text-center border-success animate-slide-up">
            <CheckCircle2 size={30} className="text-success mx-auto" />
            <p className="text-[13px] font-extrabold text-ink-900 mt-2">تم استلام اعتراضك</p>
            <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">ستراجع الإدارة الاعتراض خلال 3 أيام عمل ويصلك الرد على بريدك المسجّل.</p>
          </div>
        ) : (
          <div className="card p-4">
            <p className="text-[13px] font-extrabold text-ink-900 flex items-center gap-1.5"><Mail size={14} className="text-primary" /> تقديم اعتراض للإدارة</p>
            <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">اشرح موقفك وأرفق ما يثبت معالجة سبب الحظر، وستُراجع الإدارة الطلب.</p>
            <textarea value={appeal} onChange={(e) => setAppeal(e.target.value)} className="field bg-white h-28 py-3 resize-none mt-3" placeholder="مثال: تمت إزالة المنتجات المخالفة وتحديث الأوصاف لتطابق الصور الفعلية..." aria-label="نص الاعتراض" />
            <button onClick={submitAppeal} className="w-full btn-primary btn-md mt-3">إرسال الاعتراض للإدارة</button>
          </div>
        )}
        <div className="w-full">
          <button onClick={() => { const ok = confirm('هل تريد فعلاً تسجيل الخروج؟'); if (ok) dispatch({ type: 'LOGOUT' }) }} className="w-full card px-4 h-[52px] flex items-center gap-3 text-right text-danger hover:bg-danger-50 transition">
            <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center justify-center"><LogOut size={18} /></div>
            <span className="flex-1 text-[13px] font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </div>
      <HomeIndicator />
    </div>
  )
}

function MerchantLogoutButton() {
  const { dispatch } = useApp()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full card px-4 h-[52px] flex items-center gap-3 text-right text-danger hover:bg-danger-50 transition">
        <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center justify-center"><LogOut size={18} /></div>
        <span className="flex-1 text-[13px] font-bold">تسجيل الخروج</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-[16px] font-extrabold text-center">تأكيد تسجيل الخروج</h2>
        <p className="text-[12px] text-ink-500 text-center mt-1">هل تريد فعلاً تسجيل الخروج؟</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => { setOpen(false); dispatch({ type: 'LOGOUT' }) }} className="flex-1 btn-danger btn-md">تأكيد</button>
          <button onClick={() => setOpen(false)} className="flex-1 btn-ghost btn-md">إلغاء</button>
        </div>
      </Modal>
    </>
  )
}

export function MerchantRejected() {
  const { navigate, dispatch } = useApp()
  return (
    <StateScreen tone="error" icon={X} code="M-048" title="تم رفض طلب توثيق المتجر" description="قام فريق مراجعة الإدارة بمراجعة مستنداتك وتبين عدم اكتمال التوثيق." primary={{ label: 'تعديل البيانات وإعادة رفع المستندات', onClick: () => { dispatch({ type: 'MERCHANT_STATUS', status: 'none' }); navigate('merchantIdentity', {}, { resetTo: true }) } }}>
      <div className="bg-danger-50 border border-danger-100 rounded-card p-4 text-right">
        <p className="text-[12px] font-bold text-danger-700">سبب الرفض الإلزامي من الإدارة:</p>
        <p className="text-[11px] text-danger-700/80 leading-relaxed mt-1">"صورة الهوية الوطنية المرفقة غير واضحة والبيانات غير مقروءة، أو انتهت صلاحيتها. يرجى إعادة التقاط صورة واضحة تحت إضاءة جيدة وإعادة الإرسال"</p>
      </div>
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  لوحة إدارة المتجر والمبيعات (M-050)
// ─────────────────────────────────────────────────────────────
export function MerchantDashboard() {
  const { navigate, state, switchTab, merchantStore: store, dispatch, showToast } = useApp()
  const open = state.storeOpen // حالة المتجر (مفتوح/مغلق) — تنعكس فوراً على واجهة العميل والسلة
  const toggleOpen = () => { dispatch({ type: 'SET_STORE_OPEN', open: !open }); showToast(open ? 'تم إغلاق المتجر — لن تُستقبل طلبات جديدة' : 'تم فتح المتجر — يستقبل الطلبات الآن', open ? 'danger' : 'success') }
  const incoming = state.orders.filter((o) => o.stage === 'new').length
  const recent = state.orders.slice(0, 3)
  const active = state.merchantProducts.map(productById).filter(Boolean)
  const out = active.filter((p) => p.stock <= 0).length
  const delivered = state.orders.filter((o) => o.stage === 'delivered').length
  const completion = state.orders.length ? Math.round((delivered / state.orders.length) * 100) : 100
  const Stat = ({ Icon, label, value, unit, sub, tone }) => (
    <div className="card p-3.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-ink-500">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone === 'secondary' ? 'bg-secondary-50 text-secondary' : tone === 'success' ? 'bg-success-50 text-success' : 'bg-primary-50 text-primary'}`}><Icon size={16} /></div>
      </div>
      <p className={`text-[18px] font-extrabold tabular mt-1 ${tone === 'secondary' ? 'text-secondary' : tone === 'success' ? 'text-success-700' : 'text-primary'}`}>{value} <span className="text-[11px] font-semibold text-ink-500">{unit}</span></p>
      <p className="text-[10px] font-bold text-ink-400 mt-0.5">{sub}</p>
    </div>
  )
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <div className="bg-primary text-white rounded-b-[28px] relative overflow-hidden">
        <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <StatusBar light />
        <div className="px-5 pb-5 flex items-center gap-3 relative">
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-extrabold flex items-center gap-1.5 truncate">{store.name} <ShieldCheck size={16} className="text-warning shrink-0" /></h1>
            <p className="text-[11px] text-white/80">لوحة إدارة المتجر والمبيعات</p>
          </div>
          {/* زر التسوق: التبديل إلى واجهة العميل بنفس الحساب دون تسجيل خروج */}
          <button onClick={() => switchTab('home')} className="h-9 px-3 rounded-full bg-white text-primary text-[11px] font-extrabold flex items-center gap-1.5 shrink-0" aria-label="التسوق"><ShoppingBag size={15} /> التسوق</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-4">
        {/* حالة المتجر: مفتوح / مغلق — Toggle واضح يؤثر على واجهة العميل واستقبال الطلبات */}
        <div className={`card p-3.5 flex items-center gap-3 border ${open ? 'border-success-100' : 'border-danger-100 bg-danger-50/40'}`}>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${open ? 'bg-success-50 text-success' : 'bg-danger-50 text-danger'}`}><Store size={22} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-extrabold text-ink-900 flex items-center gap-1.5">حالة المتجر: <span className={open ? 'text-success-700' : 'text-danger'}>{open ? 'مفتوح' : 'مغلق'}</span></p>
            <p className="text-[10px] text-ink-500 leading-snug">{open ? 'يستقبل طلبات جديدة الآن ويظهر للعملاء «مفتوح»' : 'لا يستقبل طلبات جديدة — يظهر للعملاء «مغلق حالياً» وتُعطَّل الإضافة للسلة'}</p>
          </div>
          <button role="switch" aria-checked={open} aria-label="تبديل حالة المتجر" onClick={toggleOpen} className={`relative w-[52px] h-[30px] rounded-full transition-colors shrink-0 ${open ? 'bg-success' : 'bg-ink-300'}`}>
            <span className={`absolute top-[3px] w-6 h-6 rounded-full bg-white shadow-card transition-all ${open ? 'right-[3px]' : 'right-[25px]'}`} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat Icon={DollarSign} label="مبيعات اليوم" value={fmt(MERCHANT.todaySales)} unit={CURRENCY} sub={MERCHANT.salesDelta} tone="primary" />
          <Stat Icon={ClipboardList} label="طلبات جديدة" value={incoming} unit="طلبات" sub={incoming ? 'تتطلب إجراء سريع' : 'لا توجد طلبات معلقة'} tone="secondary" />
          <Stat Icon={Boxes} label="المنتجات النشطة" value={active.length} unit="منتج" sub={`${out} منتجات نفدت`} tone="primary" />
          <Stat Icon={TrendingUp} label="اكتمال الطلبات" value={`${completion}%`} unit="نجاح" sub="التسليم بالموعد" tone="success" />
        </div>
        <div>
          <p className="section-title mb-2">إجراءات سريعة</p>
          <div className="flex gap-2">
            <button onClick={() => navigate('m-product-form')} className="flex-1 btn-primary btn-md"><Plus size={16} /> إضافة منتج جديد</button>
            <button onClick={() => navigate('m-store-edit')} className="flex-1 btn-outline btn-md"><Pencil size={14} /> تعديل بيانات المتجر</button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="section-title">الطلبات الواردة الحديثة</p>
            <button onClick={() => switchTab('m-orders')} className="link">عرض الكل</button>
          </div>
          <div className="space-y-2">
            {recent.map((o) => (
              <button key={o.id} onClick={() => navigate('m-order', { orderId: o.id })} className="w-full card p-3 flex items-center gap-3 text-right">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-ink-900">{o.customer?.name || 'محمد سعيد'}</p>
                  <p className="text-[10px] text-ink-400 tabular">{o.items.length} منتجات • <span dir="ltr">{o.id}</span></p>
                </div>
                <div className="text-left">
                  <Price value={o.total} size="xs" />
                  <div className="mt-1"><StageChip stage={o.stage} /></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav variant="merchant" />
    </div>
  )
}

export function MerchantStoreEdit() {
  const { back, showToast, merchantStore: store, isMerchant } = useApp()
  const locked = isMerchant // بعد توثيق المتجر (approved) يُقفل اسم المتجر ونشاطه؛ قبل التوثيق يبقيان قابلين للتعديل
  const [f, setF] = useState({ name: store.name, cat: store.category || 'electronics', desc: store.description, prep: store.prepTime, min: store.minOrder, owner: store.owner, phone: store.phone, deliveryTime: store.deliveryTime, bank: store.payment.bank, account: store.payment.account, holder: store.payment.holder, wallet: store.payment.wallet })
  const [loc, setLoc] = useState(store.location)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const save = () => {
    Object.assign(store, { ...(locked ? {} : { name: f.name, category: f.cat }), description: f.desc, prepTime: f.prep, minOrder: Number(f.min), owner: f.owner, phone: f.phone, deliveryTime: f.deliveryTime, location: loc, payment: { bank: f.bank, account: f.account, holder: f.holder, wallet: f.wallet } })
    showToast('تم حفظ التعديلات', 'success')
    back()
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="إدارة وتعديل بيانات المتجر" subtitle="البيانات، التواصل، الموقع، التوصيل، وبيانات الدفع" />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        {locked && (
          <div className="rounded-card bg-primary-50 border border-primary-100 px-3 py-2.5 flex items-center gap-2 text-[11px] font-medium text-primary">
            <Lock size={14} className="shrink-0" /> المتجر موثّق — اسم المتجر ونوع النشاط ثابتان بعد التوثيق ولا يمكن تعديلهما إلا عبر الإدارة
          </div>
        )}
        <div>
          <label className="label flex items-center gap-1">اسم المتجر الظاهر للعملاء {locked && <Lock size={11} className="text-ink-400" />}</label>
          <input className={`field ${locked ? 'bg-ink-100 text-ink-500 cursor-not-allowed' : 'bg-white'}`} value={f.name} onChange={set('name')} disabled={locked} aria-label="اسم المتجر" />
        </div>
        <div>
          <label className="label flex items-center gap-1">نوع النشاط / التصنيف الرئيسي {locked && <Lock size={11} className="text-ink-400" />}</label>
          <select className={`field ${locked ? 'bg-ink-100 text-ink-500 cursor-not-allowed' : 'bg-white'}`} value={f.cat} onChange={set('cat')} disabled={locked} aria-label="نوع النشاط">
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div><label className="label">الوصف التعريفي للمتجر</label><textarea className="field bg-white h-24 py-3 resize-none" value={f.desc} onChange={set('desc')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">اسم صاحب المتجر</label><input className="field bg-white" value={f.owner} onChange={set('owner')} /></div>
          <div><label className="label">رقم التواصل</label><input dir="ltr" className="field bg-white text-left tabular" value={f.phone} onChange={set('phone')} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">وقت التوصيل المتوقع</label><input className="field bg-white" value={f.deliveryTime} onChange={set('deliveryTime')} /></div>
          <div><label className="label">وقت التجهيز</label><input className="field bg-white" value={f.prep} onChange={set('prep')} /></div>
        </div>
        <div><label className="label">الحد الأدنى للطلب</label><input type="number" className="field bg-white tabular" value={f.min} onChange={set('min')} /></div>
        <div>
          <label className="label">موقع المتجر على الخريطة</label>
          <StoreMapPreview location={loc} height={120} onClick={() => { setLoc({ ...loc, x: 40 + Math.round(Math.random() * 25), y: 35 + Math.round(Math.random() * 25) }); showToast('تم تحديث موقع الدبوس', 'success') }} />
          <p className="text-[10px] text-ink-400 mt-1">انقر على الخريطة لتعديل موضع الدبوس</p>
        </div>
        <div className="card p-3 space-y-3">
          <p className="text-[12px] font-extrabold text-ink-900 flex items-center gap-1.5"><Landmark size={14} className="text-primary" /> بيانات استلام المدفوعات</p>
          <div><label className="label">البنك / جهة التحويل</label><input className="field bg-white" value={f.bank} onChange={set('bank')} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">رقم الحساب</label><input dir="ltr" className="field bg-white text-left tabular" value={f.account} onChange={set('account')} /></div>
            <div><label className="label">اسم صاحب الحساب</label><input className="field bg-white" value={f.holder} onChange={set('holder')} /></div>
          </div>
          <div><label className="label">محفظة إلكترونية</label><input dir="ltr" className="field bg-white text-left tabular" value={f.wallet} onChange={set('wallet')} /></div>
        </div>
      </div>
      <div className="px-5 pb-4"><button onClick={save} className="w-full btn-primary btn-lg">حفظ التعديلات</button></div>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  منتجات المتجر (M-051) + إضافة/تعديل + حذف (M-057/058) + أخطاء (M-059)
// ─────────────────────────────────────────────────────────────
export function MerchantProducts() {
  const { state, navigate, dispatch, showToast, current } = useApp()
  const [filter, setFilter] = useState('all')
  const mine = state.merchantProducts.map(productById).filter(Boolean)
  const [confirm, setConfirm] = useState(current.params?.preset === 'confirm' ? mine[0] || null : null)
  const list = mine.filter((p) => filter === 'all' || (filter === 'out' ? p.stock <= 0 : p.stock > 0))
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-extrabold text-ink-900">منتجات المتجر</h1>
            <p className="text-[11px] text-ink-500">إدارة المخزون والأسعار وحالة النشر</p>
          </div>
          <button onClick={() => navigate('m-product-form')} className="btn-primary btn-sm"><Plus size={14} /> منتج جديد</button>
        </div>
        <div className="flex gap-2 mt-3">
          {[['all', 'الكل'], ['active', 'نشط'], ['out', 'نفدت الكمية']].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} className={`h-8 px-3.5 rounded-full text-[12px] font-bold ${filter === k ? 'bg-primary text-white' : 'bg-ink-100 text-ink-700'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-2.5">
        {list.length ? list.map((p) => (
          <div key={p.id} className="card p-3 flex items-center gap-3">
            <ProductThumb product={p} className="w-14 h-14" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-ink-900 truncate">{p.shortName}</p>
              <p className="text-[10px] text-ink-500 tabular">المخزون: <b className={p.stock <= 5 ? 'text-danger' : 'text-ink-700'}>{p.stock}</b> · مبيعات: {p.sold}</p>
              <Price value={p.price} size="xs" />
            </div>
            <button onClick={() => navigate('m-product-form', { id: p.id })} className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center"><Pencil size={15} /></button>
            <button onClick={() => setConfirm(p)} className="w-9 h-9 rounded-xl bg-danger-50 text-danger flex items-center justify-center"><Trash2 size={15} /></button>
          </div>
        )) : <div className="card p-8 text-center text-[12px] text-ink-500">لا توجد منتجات في هذا التصنيف</div>}
      </div>
      <Modal open={!!confirm} onClose={() => setConfirm(null)}>
        
        <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger flex items-center justify-center mx-auto mt-2"><Trash2 size={28} /></div>
        <h2 className="text-[18px] font-extrabold text-center mt-3">هل أنت متأكد من حذف هذا المنتج؟</h2>
        <p className="text-[12px] text-ink-500 text-center mt-1 leading-relaxed">سيتم إزالة المنتج نهائياً من متجرك ولن يتمكن المتسوقون من العثور عليه أو طلبه مجدداً.</p>
        <div className="card p-3 mt-4 text-center"><p className="text-[10px] text-ink-400">المنتج المراد حذفه:</p><p className="text-[13px] font-bold text-primary">{confirm?.shortName}</p></div>
        <button onClick={() => { const name = confirm.shortName; dispatch({ type: 'MERCHANT_DELETE_PRODUCT', productId: confirm.id }); setConfirm(null); navigate('m-product-deleted', { name, tab: 'm-products' }) }} className="w-full btn-danger btn-md mt-4">نعم، احذف المنتج نهائياً</button>
        <button onClick={() => setConfirm(null)} className="w-full btn-outline btn-md mt-2">إلغاء والاحتفاظ بالمنتج</button>
      </Modal>
      <BottomNav variant="merchant" />
    </div>
  )
}

export function MerchantProductForm() {
  const { current, back, dispatch, showToast, navigate } = useApp()
  const editing = current.params?.id ? productById(current.params.id) : null
  const [f, setF] = useState({ name: editing?.name || '', price: editing?.price ?? '', stock: editing?.stock ?? '', cat: editing?.category || 'electronics', desc: editing?.description || '' })
  const [errors, setErrors] = useState(current.params?.preset === 'errors' ? ['اسم المنتج مطلوب ولا يمكن تركه فارغاً.', 'السعر يجب أن يكون أكبر من 0 ر.ي.', 'الكمية المتوفرة مطلوبة (0 أو أكثر).'] : [])
  const save = () => {
    const er = []
    if (!f.name.trim()) er.push('اسم المنتج مطلوب ولا يمكن تركه فارغاً.')
    if (!(Number(f.price) > 0)) er.push('السعر يجب أن يكون أكبر من 0 ر.ي.')
    if (f.stock === '' || Number(f.stock) < 0) er.push('الكمية المتوفرة مطلوبة (0 أو أكثر).')
    if (!f.cat) er.push('يجب تحديد تصنيف واحد على الأقل للمنتج.')
    setErrors(er)
    if (er.length) return
    if (editing) {
      dispatch({ type: 'MERCHANT_UPDATE_PRODUCT', productId: editing.id, patch: { name: f.name, shortName: f.name.slice(0, 32), price: Number(f.price), stock: Number(f.stock), category: f.cat, description: f.desc, badge: Number(f.stock) <= 0 ? 'نفدت الكمية' : editing.badge === 'نفدت الكمية' ? null : editing.badge } })
      navigate('m-product-saved', { id: editing.id, tab: 'm-products' }, { replace: true })
      return
    } else {
      const id = `p-new-${Date.now()}`
      dispatch({ type: 'MERCHANT_ADD_PRODUCT', product: { id, storeId: MERCHANT.storeId, name: f.name, shortName: f.name.slice(0, 32), category: f.cat, price: Number(f.price), oldPrice: null, stock: Number(f.stock), badge: 'جديد', image: null, bg: '#EDE5FD', description: f.desc || 'منتج جديد في متجر التكنولوجيا الحديثة.', specs: [['القسم', CATEGORIES.find((c) => c.id === f.cat)?.label]], sold: 0 } })
      showToast('تم نشر المنتج في المتجر', 'success')
    }
    back()
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={editing ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'} subtitle={editing ? 'تحديث السعر والكمية المخزنية والحالة' : 'أدخل تفاصيل ومواصفات المنتج وسعره'} />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        {errors.length > 0 && (
          <div className="bg-danger-50 border border-danger-100 rounded-card p-3.5 animate-slide-up">
            <p className="text-[12px] font-bold text-danger-700 flex items-center gap-1.5 mb-1"><AlertTriangle size={14} /> بيانات المنتج غير صالحة</p>
            {errors.map((e) => <p key={e} className="text-[11px] text-danger-700/90 flex items-start gap-1.5"><X size={12} className="mt-0.5 shrink-0" /> {e}</p>)}
          </div>
        )}
        <div><label className="label">اسم المنتج</label><input className="field bg-white" placeholder="مثال: سماعة رأس لاسلكية احترافية" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">السعر ({CURRENCY})</label><input type="number" className="field bg-white tabular" placeholder="45000" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
          <div><label className="label">الكمية المتوفرة</label><input type="number" className="field bg-white tabular" placeholder="25" value={f.stock} onChange={(e) => setF({ ...f, stock: e.target.value })} /></div>
        </div>
        <div><label className="label">القسم / التصنيف</label><select className="field bg-white" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{CATEGORIES.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
        <div><label className="label">الوصف</label><textarea className="field bg-white h-24 py-3 resize-none" value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} /></div>
        <div><label className="label">صور المنتج</label><button onClick={() => showToast('محاكاة: تم اختيار صورة')} className="w-full h-24 rounded-modal border-2 border-dashed border-primary-300 bg-white text-primary flex flex-col items-center justify-center"><Upload size={20} /><p className="text-[12px] font-bold mt-1">اسحب وأفلت أو اضغط لرفع الصور</p><p className="text-[10px] text-ink-400">PNG, JPG حتى 5 ميجابايت</p></button></div>
      </div>
      <div className="px-5 pb-4"><button onClick={save} className="w-full btn-primary btn-lg">{editing ? 'حفظ التغييرات' : 'نشر المنتج في المتجر'}</button></div>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  الطلبات الواردة (M-060/061) + قرار (M-063) + معالجة المراحل (M-062→069)
// ─────────────────────────────────────────────────────────────
export function MerchantOrders() {
  const { state, navigate } = useApp()
  const orders = state.orders
  // مرحلتان فقط: جديد → قيد التوصيل (بعد قبول التاجر) → تم التوصيل تلقائياً بعد 24 ساعة
  const sections = [
    { key: 'new', title: 'طلبات جديدة — بانتظار قرارك', hint: 'اقبل أو ارفض خلال وقت قصير', tone: 'text-primary', list: orders.filter((o) => normalizeStage(o.stage) === 'new') },
    { key: 'active', title: 'طلبات قيد التوصيل', hint: 'قبلتها — تُسلَّم تلقائياً بعد 24 ساعة', tone: 'text-secondary', list: orders.filter((o) => normalizeStage(o.stage) === 'out') },
    { key: 'done', title: 'طلبات منتهية', hint: 'تم توصيلها أو أُلغيت', tone: 'text-ink-500', list: orders.filter((o) => ['delivered', 'cancelled', 'rejected'].includes(normalizeStage(o.stage))) },
  ]
  const OrderCard = ({ o }) => (
    <button onClick={() => navigate('m-order', { orderId: o.id })} className={`w-full card p-3.5 text-right ${o.stage === 'new' ? 'border-2 border-primary' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-extrabold text-primary tabular" dir="ltr">{o.id}</span>
        <div className="flex items-center gap-1.5">{o.paymentStatus === 'pending_confirmation' && <PaymentChip status={o.paymentStatus} />}<StageChip stage={o.stage} by={o.cancelledBy} /></div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div><p className="text-[13px] font-bold text-ink-900">{o.customer?.name || 'محمد سعيد'}</p><p className="text-[10px] text-ink-400">تعز · {o.createdAt} · {o.items.length} أصناف</p></div>
        <Price value={o.total} size="sm" />
      </div>
      <div className="border-t border-ink-100 mt-2.5 pt-2 flex items-center justify-between text-[11px] font-bold text-primary"><span>{normalizeStage(o.stage) === 'new' ? (o.paymentStatus === 'pending_confirmation' ? 'تأكيد استلام التحويل وبدء التوصيل' : 'قبول وبدء التوصيل أو رفض') : normalizeStage(o.stage) === 'out' ? 'قيد التوصيل — يُسلَّم تلقائياً بعد 24 ساعة' : o.stage === 'cancelled' && o.cancelledBy === 'merchant' ? 'ألغيته أنت' : 'عرض التفاصيل'}</span><ChevronLeft size={14} /></div>
    </button>
  )
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <h1 className="text-[18px] font-extrabold text-ink-900">الطلبات الواردة للمتجر</h1>
        <p className="text-[11px] text-ink-500">متابعة طلبات العملاء وتحديث حالات التجهيز</p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-5">
        {orders.length ? sections.filter((sec) => sec.list.length || sec.key === 'new').map((sec) => (
          <section key={sec.key}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[13px] font-extrabold ${sec.tone}`}>{sec.title} <span className="text-[11px] font-bold text-ink-400">({sec.list.length})</span></p>
              <span className="text-[10px] font-medium text-ink-400">{sec.hint}</span>
            </div>
            {sec.list.length ? <div className="space-y-2.5">{sec.list.map((o) => <OrderCard key={o.id} o={o} />)}</div> : <div className="card p-4 text-center text-[11px] text-ink-400">لا توجد طلبات جديدة الآن</div>}
          </section>
        )) : (
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><ClipboardList size={40} strokeWidth={1.6} /></div>
            <h2 className="text-[20px] font-extrabold">لا توجد طلبات واردة حالياً</h2>
            <p className="text-[12px] text-ink-500 mt-2">متجرك جاهز لاستقبال الطلبات. ستظهر هنا فور قيام العملاء بالطلب.</p>
          </div>
        )}
      </div>
      <BottomNav variant="merchant" />
    </div>
  )
}

export function MerchantOrder() {
  const { current, state, dispatch, navigate, back, showToast, addressById } = useApp()
  const order = state.orders.find((o) => o.id === current.params.orderId)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('نفدت الكمية من المخزون')
  if (!order) return null
  const address = addressById(order.addressId)
  const idx = STAGE_INDEX[normalizeStage(order.stage)]
  const transferPending = order.paymentStatus === 'pending_confirmation'
  // إلغاء التاجر بعد القبول (قيد التوصيل): نافذة تأكيد بسبب واضح يصل للعميل
  const CANCEL_REASONS = ['نفدت الكمية من المخزون', 'تعذر التوصيل إلى العنوان', 'خطأ في السعر أو بيانات المنتج', 'المتجر مغلق حالياً']
  const canMerchantCancel = normalizeStage(order.stage) === 'out'
  const cancelByMerchant = () => {
    dispatch({ type: 'CANCEL_ORDER', orderId: order.id, by: 'merchant', reason: cancelReason })
    setCancelOpen(false)
    showToast('تم إلغاء الطلب وإبلاغ العميل بالسبب', 'danger')
  }
  // مرحلتان فقط: جديد → قيد التوصيل (بعد قبول التاجر). التسليم يتم تلقائياً بعد 24 ساعة دون تدخل
  const nextAction = null
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={normalizeStage(order.stage) === 'new' ? (transferPending ? 'تأكيد التحويل وبدء التوصيل' : 'قرار قبول أو رفض الطلب') : 'تفاصيل طلب قيد التوصيل'} right={<StageChip stage={order.stage} by={order.cancelledBy} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-3">
        <div className="card p-4">
          <div className="flex items-center justify-between"><span className="text-[13px] font-extrabold text-primary tabular" dir="ltr">{order.id}</span><span className="text-[10px] text-ink-400">{order.createdAt}</span></div>
          <p className="text-[14px] font-bold text-ink-900 mt-1">العميل: {order.customer?.name || address?.name || 'محمد سعيد'} <span className="text-[11px] text-ink-400 font-medium tabular" dir="ltr">({order.customer?.phone || address?.phone || '773030064'})</span></p>
          <p className="text-[11px] text-ink-500">{order.customer?.details || address?.details}</p>
          {order.customer?.notes && <p className="text-[10px] text-ink-400 mt-0.5">ملاحظات العميل: {order.customer.notes}</p>}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap"><PaymentChip status={order.paymentStatus || 'cod'} /><Chip tone="ink">{order.payment}</Chip></div>
        </div>

        {/* إيصال التحويل المرفق من العميل */}
        {order.receipt && (
          <div className={`card p-4 ${transferPending ? 'border-2 border-warning' : ''}`}>
            <p className="text-[12px] font-extrabold text-ink-900 flex items-center gap-1.5 mb-2"><Landmark size={14} className="text-primary" /> إيصال التحويل المرفق مع الطلب</p>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0"><ImageIcon size={26} /></div>
              <div className="flex-1 min-w-0 text-[11px]">
                <p className="font-bold text-ink-900 truncate" dir="ltr">{order.receipt.name}</p>
                <p className="text-ink-500">المبلغ المتوقع: <b className="text-secondary tabular">{fmt(order.total)} {CURRENCY}</b></p>
                <p className="text-ink-500">إلى حساب: <span className="tabular" dir="ltr">{storeById(order.storeId)?.payment?.account}</span></p>
              </div>
            </div>
            {transferPending ? (
              <p className="text-[10px] font-medium text-warning-700 mt-2">راجع الإيصال مقابل كشف حسابك ثم أكّد الاستلام — سينتقل الطلب تلقائياً إلى «قيد التوصيل» ويُسلَّم تلقائياً بعد 24 ساعة.</p>
            ) : (
              <p className="text-[10px] font-bold text-success-700 mt-2 flex items-center gap-1"><CheckCircle2 size={12} /> تم تأكيد استلام المبلغ — الطلب الآن قيد التوصيل</p>
            )}
          </div>
        )}

        <div className="card p-4">
          <p className="text-[12px] font-bold text-ink-900 mb-2">العناصر المطلوبة:</p>
          {order.items.map((it) => { const p = productById(it.productId); return (
            <label key={it.productId} className="flex items-center justify-between py-1.5 text-[12px]">
              <span className="flex items-center gap-2 text-ink-700 font-medium">{p.shortName} <span className="text-ink-400">× {it.qty}</span></span>
              <span className="font-bold tabular">{fmt(it.price * it.qty)}</span>
            </label>
          ) })}
          <div className="border-t border-dashed border-ink-200 mt-2 pt-2 flex items-center justify-between"><span className="text-[13px] font-extrabold text-primary">إجمالي الفاتورة:</span><Price value={order.total} size="sm" tone="primary" /></div>
        </div>

        {/* مسار مبسّط من 4 مراحل — للعرض فقط، الانتقال عبر الزر الرئيسي بالأسفل */}
        {idx !== undefined && (
          <div className="card p-4">
            <p className="text-[12px] font-bold text-ink-900 mb-3">مسار الطلب</p>
            <ol className="flex items-center gap-1">
              {ORDER_STAGES.map((s, i) => { const done = i < idx; const cur = i === idx; return (
                <li key={s.key} className="flex-1 flex flex-col items-center gap-1 text-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${done ? 'bg-primary text-white' : cur ? 'bg-secondary text-white ring-4 ring-secondary-100' : 'bg-ink-100 text-ink-400'}`}>{done ? <Check size={13} strokeWidth={3} /> : i + 1}</div>
                  <span className={`text-[9px] font-bold leading-tight ${cur ? 'text-secondary' : done ? 'text-ink-800' : 'text-ink-400'}`}>{s.label}</span>
                </li>
              ) })}
            </ol>
          </div>
        )}
        {order.stage === 'cancelled' && (
          <div className="card p-4 border-2 border-danger-100 bg-danger-50/40">
            <p className="text-[13px] font-extrabold text-danger-700 flex items-center gap-1.5"><XCircle size={16} /> {order.cancelledBy === 'merchant' ? 'ألغيت هذا الطلب' : 'ألغى العميل هذا الطلب'}</p>
            {order.cancelReason && <p className="text-[11px] text-ink-600 mt-1">السبب المرسل للعميل: <b>{order.cancelReason}</b></p>}
            {order.cancelledFrom && order.cancelledFrom !== 'new' && <p className="text-[10px] text-ink-400 mt-0.5">أُلغي بعد القبول (كان {order.cancelledFrom === 'out' ? 'قيد التوصيل' : 'قيد التوصيل'})</p>}
          </div>
        )}
        {order.stage === 'delivered' && <div className="card p-6 text-center"><CheckCircle2 size={36} className="text-success mx-auto" /><p className="text-[14px] font-extrabold mt-2">تم تسليم الطلب بنجاح!</p><p className="text-[11px] text-ink-500 mt-1">أُضيف المبلغ إلى مستحقاتك.</p></div>}
      </div>
      <div className="px-4 pb-4 pt-2 space-y-2">
        {normalizeStage(order.stage) === 'new' && (<>
          {transferPending ? (
            <button onClick={() => { dispatch({ type: 'CONFIRM_PAYMENT', orderId: order.id }); navigate('m-order-accepted', { orderId: order.id, tab: 'm-orders', paid: true }, { replace: true }) }} className="w-full btn-primary btn-lg"><CheckCircle2 size={18} /> تأكيد استلام المبلغ وبدء التوصيل</button>
          ) : (
            <button onClick={() => { dispatch({ type: 'SET_ORDER_STAGE', orderId: order.id, stage: 'out' }); navigate('m-order-accepted', { orderId: order.id, tab: 'm-orders' }, { replace: true }) }} className="w-full btn-primary btn-lg"><Check size={18} /> قبول الطلب وبدء التوصيل</button>
          )}
          <button onClick={() => { dispatch({ type: 'REJECT_ORDER', orderId: order.id }); navigate('m-order-rejected', { orderId: order.id, tab: 'm-orders' }, { replace: true }) }} className="w-full btn-outline btn-lg !text-danger !border-danger-100"><X size={18} /> رفض الطلب{transferPending ? ' (لم يصل المبلغ)' : ''}</button>
        </>)}
        {canMerchantCancel && <button onClick={() => setCancelOpen(true)} className="w-full btn-outline btn-md !text-danger !border-danger-100 hover:!bg-danger-50"><XCircle size={16} /> إلغاء الطلب (بعد القبول — قيد التوصيل)</button>}
        {(order.stage === 'delivered' || order.stage === 'rejected' || order.stage === 'cancelled') && <button onClick={back} className="w-full btn-outline btn-lg">العودة للطلبات الواردة</button>}
      </div>
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger flex items-center justify-center mx-auto mt-2"><XCircle size={28} /></div>
        <h2 className="text-[18px] font-extrabold text-center mt-3">إلغاء الطلب بعد قبوله؟</h2>
        <p className="text-[12px] text-ink-500 text-center mt-1 leading-relaxed">سيُبلَّغ العميل فوراً بالإلغاء والسبب، وتُعاد أي مبالغ محوّلة. اختر السبب:</p>
        <div className="space-y-1.5 mt-4">
          {CANCEL_REASONS.map((r) => (
            <button key={r} onClick={() => setCancelReason(r)} className={`w-full flex items-center gap-2 rounded-xl border p-2.5 text-right text-[12px] font-bold ${cancelReason === r ? 'border-danger bg-danger-50 text-danger-700' : 'border-ink-100 text-ink-700'}`}>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${cancelReason === r ? 'bg-danger border-danger text-white' : 'border-ink-300'}`}>{cancelReason === r && <Check size={10} strokeWidth={4} />}</span>{r}
            </button>
          ))}
        </div>
        <button onClick={cancelByMerchant} className="w-full btn-danger btn-md mt-4">تأكيد إلغاء الطلب وإبلاغ العميل</button>
        <button onClick={() => setCancelOpen(false)} className="w-full btn-outline btn-md mt-2">تراجع — متابعة الطلب</button>
      </Modal>
      <HomeIndicator />
    </div>
  )
}


// ─────────────────────────────────────────────────────────────
//  شاشات حالة التاجر مع شريط التنقل (M-056 · M-058 · M-064 · M-065)
// ─────────────────────────────────────────────────────────────
function MerchantState({ code, title, heading, description, tone = 'success', icon: Icon = CheckCircle2, children, primary, onBack }) {
  const tones = { success: 'bg-success-50 text-success', danger: 'bg-danger-50 text-danger', info: 'bg-primary-50 text-primary' }
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <TopBar title={title} code={code} onBack={onBack} />
      <div className="flex-1 overflow-y-auto scroll-thin px-6 pb-28 flex flex-col items-center justify-center text-center">
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-5 animate-pop ${tones[tone]}`}><Icon size={40} strokeWidth={2} /></div>
        <h2 className="text-[20px] font-extrabold text-ink-900">{heading}</h2>
        <p className="text-[12px] text-ink-500 mt-2 leading-relaxed max-w-[300px]">{description}</p>
        {children && <div className="w-full mt-5 text-right">{children}</div>}
        {primary && <button onClick={primary.onClick} className={`w-full btn-lg mt-6 ${primary.className || 'btn-primary'}`}>{primary.label}</button>}
      </div>
      <BottomNav variant="merchant" />
    </div>
  )
}

export function MerchantProductSaved() {
  const { current, switchTab } = useApp()
  const p = productById(current.params?.id)
  return (
    <MerchantState code="M-056" title="تم تعديل بيانات المنتج" heading="تم تحديث بيانات المنتج والمخزون" description="التعديلات أصبحت مرئية الآن لجميع المتسوقين في متجرك." onBack={() => switchTab('m-products')} primary={{ label: 'العودة لقائمة المنتجات', onClick: () => switchTab('m-products') }}>
      {p && <KeyValue rows={[['اسم المنتج:', p.shortName], ['السعر المحدث:', `${fmt(p.price)} ${CURRENCY}`, 'text-primary'], ['الكمية / المخزون:', `${p.stock} قطعة`]]} />}
    </MerchantState>
  )
}

export function MerchantProductDeleted() {
  const { current, switchTab } = useApp()
  return (
    <MerchantState code="M-058" title="تم حذف المنتج" heading="تم حذف المنتج بنجاح" description="تم تحديث قائمة منتجات متجرك ولن يظهر المنتج للمتسوقين بعد الآن." tone="info" icon={Trash2} onBack={() => switchTab('m-products')} primary={{ label: 'العودة لقائمة المنتجات', onClick: () => switchTab('m-products') }}>
      {current.params?.name && <div className="card p-3 text-center"><p className="text-[10px] text-ink-400">المنتج المحذوف:</p><p className="text-[13px] font-bold text-ink-900">{current.params.name}</p></div>}
    </MerchantState>
  )
}

export function MerchantOrderAccepted() {
  const { current, state, navigate, switchTab } = useApp()
  const order = state.orders.find((o) => o.id === current.params?.orderId)
  const paid = !!current.params?.paid
  return (
    <MerchantState title={paid ? 'تم تأكيد الدفع' : 'تم قبول الطلب'} heading={paid ? 'تم تأكيد استلام المبلغ وبدء التوصيل' : 'تم قبول الطلب وبدء التوصيل!'} description={paid ? 'تم إشعار العميل بتأكيد الدفع، وانتقل الطلب تلقائياً إلى «قيد التوصيل» وسيُسلَّم تلقائياً بعد 24 ساعة.' : 'تم إشعار العميل بقبول طلبه، وانتقل الطلب مباشرة إلى «قيد التوصيل» وسيُسلَّم تلقائياً بعد 24 ساعة دون تدخل منك.'} primary={{ label: 'فتح الطلب لمتابعة التوصيل', onClick: () => (order ? navigate('m-order', { orderId: order.id }, { replace: true }) : switchTab('m-orders')) }} onBack={() => switchTab('m-orders')}>
      {order && <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['إجمالي الفاتورة:', `${fmt(order.total)} ${CURRENCY}`], ['الدفع:', paid ? 'تم تأكيد استلام المبلغ' : order.payment, paid ? 'text-success-700' : 'text-ink-900'], ['الحالة الحالية:', 'قيد التوصيل', 'text-secondary'], ['التسليم:', 'تلقائي بعد 24 ساعة', 'text-ink-500']]} />}
    </MerchantState>
  )
}

export function MerchantOrderRejected() {
  const { current, switchTab } = useApp()
  return (
    <MerchantState code="M-065" title="تم رفض الطلب" heading="تم تسجيل رفض الطلب" description="تم إرسال إشعار للعميل بعدم تمكن المتجر من تلبية الطلب، ولم يتم خصم أي مبالغ." tone="danger" icon={X} onBack={() => switchTab('m-orders')} primary={{ label: 'العودة للطلبات الواردة', onClick: () => switchTab('m-orders') }}>
      <KeyValue rows={[['رقم الطلب:', current.params?.orderId || '—', 'text-primary'], ['الحالة:', 'مرفوض من المتجر', 'text-danger-700']]} />
    </MerchantState>
  )
}

// ─────────────────────────────────────────────────────────────
//  الإحصائيات (M-070) — مخطط أعمدة حقيقي بدل الفارغ في Figma
// ─────────────────────────────────────────────────────────────
export function MerchantStats() {
  const { state, switchTab } = useApp()
  const max = Math.max(...MERCHANT.weekly.map((d) => d.value))
  const top = useMemo(() => [...state.merchantProducts.map(productById).filter(Boolean)].sort((a, b) => b.sold - a.sold).slice(0, 3), [state.merchantProducts])
  const total = MERCHANT.weekly.reduce((s, d) => s + d.value, 0)
  const noData = state.orders.length === 0 && top.length === 0
  if (noData) {
    return (
      <div className="flex-1 flex flex-col bg-ink-50 relative">
        <StatusBar />
        <TopBar title="الإحصائيات غير متوفرة" code="M-071" onBack={() => switchTab('m-dashboard')} />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pb-10">
          <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><BarChart3 size={40} strokeWidth={1.6} /></div>
          <h2 className="text-[20px] font-extrabold">بيانات الإحصائيات غير متوفرة حالياً</h2>
          <p className="text-[12px] text-ink-500 mt-2 leading-relaxed">لا توجد مبيعات أو طلبات مكتملة كافية بعد لتوليد مؤشرات الأداء ومخططات المبيعات لمتجرك.</p>
        </div>
        <div className="px-6 pb-28"><button onClick={() => switchTab('m-dashboard')} className="w-full btn-primary btn-lg">العودة للوحة التحكم</button></div>
        <BottomNav variant="merchant" />
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <h1 className="text-[18px] font-extrabold text-ink-900">إحصائيات وأداء المبيعات</h1>
        <p className="text-[11px] text-ink-500">تحليل المبيعات الأسبوعية والشهرية</p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4"><p className="text-[14px] font-extrabold text-ink-900">مبيعات الأيام الـ 7 الأخيرة</p><Chip tone="success">{fmt(total)} ألف ر.ي</Chip></div>
          <div className="flex items-end justify-between gap-2 h-36" dir="rtl">
            {MERCHANT.weekly.map((d, i) => { const h = Math.round((d.value / max) * 100); const best = d.value === max; return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className={`text-[9px] font-bold tabular ${best ? 'text-secondary' : 'text-ink-400'}`}>{d.value}</span>
                <div className={`w-full rounded-t-lg transition-all ${best ? 'bg-secondary shadow-accent' : 'bg-primary/80'}`} style={{ height: `${h}%`, animation: `slide-up .5s ${i * 60}ms both` }} />
                <span className="text-[9px] font-semibold text-ink-500">{d.day}</span>
              </div>
            ) })}
          </div>
        </div>
        <div className="card p-4">
          <p className="text-[14px] font-extrabold text-ink-900 mb-2">المنتجات الأكثر طلباً</p>
          <div className="divide-y divide-ink-100">
            {top.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 py-2.5">
                <span className="w-6 h-6 rounded-full bg-primary-50 text-primary text-[11px] font-extrabold flex items-center justify-center">{i + 1}</span>
                <ProductThumb product={p} className="w-10 h-10" />
                <p className="flex-1 text-[12px] font-semibold text-ink-800 truncate">{p.shortName}</p>
                <span className="text-[12px] font-bold text-secondary tabular">{p.sold} مبيعة</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-3.5"><p className="text-[11px] text-ink-500">متوسط قيمة الطلب</p><p className="text-[18px] font-extrabold text-primary tabular">{fmt(state.orders.length ? state.orders.reduce((s, o) => s + o.total, 0) / state.orders.length : 0)} <span className="text-[10px] text-ink-500">{CURRENCY}</span></p></div>
          <div className="card p-3.5"><p className="text-[11px] text-ink-500">إجمالي الطلبات</p><p className="text-[18px] font-extrabold text-ink-900 tabular">{state.orders.length} <span className="text-[10px] text-ink-500">طلب</span></p></div>
        </div>
      </div>
      <BottomNav variant="merchant" />
    </div>
  )
}

export function MerchantNotifications() {
  const { state } = useApp()
  const latestNew = state.orders.find((o) => o.stage === 'new')
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="إشعارات التاجر" code="M-072" subtitle="تنبيهات الطلبات الجديدة والمخزون" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {MERCHANT_NOTIFICATIONS.map((n, i) => (
          <div key={n.id} className={`card p-3.5 ${i === 0 ? 'border-r-4 border-r-primary' : i === 1 ? 'border-r-4 border-r-warning' : 'border-r-4 border-r-success'}`}>
            <div className="flex items-center justify-between"><p className="text-[13px] font-bold text-ink-900">{n.title}</p><span className="text-[10px] text-ink-400">{n.time}</span></div>
            <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">{i === 0 && latestNew ? n.body.replace('JD-984210', latestNew.id) : n.body}</p>
          </div>
        ))}
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  بوابة الإدارة المركزية — تسجيل الدخول
// ─────────────────────────────────────────────────────────────
export function AdminLogin() {
  const { back, showToast } = useApp()
  const [f, setF] = useState({ email: 'admin@jadeedmarket.ye', pw: '', code: '' })
  const submit = () => {
    if (!f.pw || f.code.length !== 6) return showToast('أدخل كلمة المرور ورمز التحقق المكوّن من 6 أرقام', 'danger')
    showToast('بوابة الإدارة متاحة على الويب فقط (عرض توضيحي)', 'primary')
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-100">
      <StatusBar />
      <div className="px-4 pt-1"><button onClick={back} className="icon-btn bg-white" aria-label="رجوع"><ArrowRight size={18} strokeWidth={2.4} /></button></div>
      <div className="flex-1 flex items-center px-5">
        <div className="w-full bg-white rounded-modal shadow-modal p-6">
          <div className="flex flex-col items-center"><Logo size={56} /></div>
          <p className="text-[12px] font-medium text-ink-500 text-center mt-4">تسجيل دخول المشرفين والمدراء المعتمدين</p>
          <div className="space-y-3 mt-5">
            <div><label className="label text-ink-500">البريد الإلكتروني الإداري</label><div className="relative"><input dir="ltr" className="field !bg-ink-800 !text-white text-left font-mono pl-10" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /></div></div>
            <div><label className="label text-ink-500">كلمة المرور السرية</label><div className="relative"><input dir="ltr" type="password" className="field !bg-ink-800 !text-white text-left pl-10" placeholder="••••••••••••" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} /><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /></div></div>
            <div><label className="label text-ink-500">رمز التحقق الثنائي (2FA)</label><div className="relative"><input dir="ltr" inputMode="numeric" maxLength={6} className="field !bg-ink-800 !text-secondary text-center font-mono tracking-[0.5em] font-bold" placeholder="000000" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.replace(/\D/g, '') })} /><KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /></div></div>
          </div>
          <button onClick={submit} className="w-full btn-primary btn-lg mt-5">الدخول إلى لوحة التحكم</button>
          <p className="text-[10px] text-ink-400 text-center mt-3">نظام آمن ومحمي بأحدث معايير التشفير</p>
        </div>
      </div>
      <HomeIndicator />
    </div>
  )
}
