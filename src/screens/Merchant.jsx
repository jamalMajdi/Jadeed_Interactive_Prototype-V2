import React, { useMemo, useState } from 'react'
import { Store, Upload, FileText, Image as ImageIcon, Check, X, Clock, ShieldCheck, Plus, Pencil, Trash2, Package, ClipboardList, BarChart3, ChevronLeft, AlertTriangle, DollarSign, TrendingUp, CheckCircle2, Bell, Lock, Mail, KeyRound, ArrowRight, Boxes } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, BottomNav, Price, Chip, ProductThumb, StateScreen, KeyValue, StageChip, Modal, Logo } from '../components/ui'
import { CATEGORIES, CURRENCY, MERCHANT, MERCHANT_NOTIFICATIONS, ORDER_STAGES, STAGE_INDEX, fmt, productById, storeById } from '../data/mock'

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
        {['الاسم الكامل ورقم الهاتف المعتمد', 'صورة الهوية الوطنية أو السجل التجاري', 'صورة واجهة المتجر وشعاره'].map((t) => (
          <p key={t} className="text-[11px] font-medium text-ink-600 flex items-center gap-2 py-1"><Check size={13} className="text-success" strokeWidth={3} /> {t}</p>
        ))}
      </div>
    </StateScreen>
  )
}

export function MerchantForm() {
  const { navigate, showToast } = useApp()
  const [f, setF] = useState({ name: 'تكنو سيبس للإلكترونيات', cat: 'electronics', city: 'تعز', area: 'شارع جمال، المسبح' })
  const [errors, setErrors] = useState({})
  const submit = () => {
    const er = {}
    if (f.name.trim().length < 3) er.name = 'اسم المتجر مطلوب'
    if (f.area.trim().length < 3) er.area = 'الحي مطلوب'
    setErrors(er)
    if (Object.keys(er).length) return
    navigate('merchantIdentity')
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="طلب إنشاء متجر جديد" subtitle="أدخل البيانات الأساسية لمتجرك الرقمي في منصة جديد:" />
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4 space-y-4">
        <div>
          <label className="label">اسم المتجر</label>
          <input className={`field bg-white ${errors.name ? 'field-error' : ''}`} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          {errors.name && <p className="text-[11px] font-bold text-danger mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="label">نوع النشاط / التصنيف الرئيسي</label>
          <select className="field bg-white" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
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
            <input className={`field bg-white ${errors.area ? 'field-error' : ''}`} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label">شعار وغلاف المتجر</label>
          <button onClick={() => showToast('سيتم رفع الصور في الخطوة التالية')} className="w-full h-12 rounded-card border-2 border-dashed border-primary-300 text-primary text-[12px] font-bold flex items-center justify-center gap-2 bg-white"><Upload size={16} /> رفع الشعار والصورة التعريفية</button>
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
  const [file, setFile] = useState(null)
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="رفع وثيقة إثبات الهوية" code="M-044" />
      <div className="flex-1 px-5 py-4 space-y-4">
        <div>
          <h2 className="text-[16px] font-extrabold text-ink-900">صورة الهوية الوطنية أو السجل التجاري</h2>
          <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">يرجى التقاط صورة واضحة لوثيقة الهوية الوطنية للمالك أو السجل التجاري الساري.</p>
        </div>
        <button onClick={() => setFile({ name: 'national_id_front.jpg', size: '2.1 ميجابايت' })} className="w-full rounded-modal border-2 border-dashed border-primary-300 bg-white p-8 flex flex-col items-center text-center hover:bg-primary-50/40 transition">
          <div className="w-14 h-14 rounded-full bg-primary-50 text-primary flex items-center justify-center"><Upload size={24} /></div>
          <p className="text-[13px] font-bold text-ink-900 mt-3">اسحب الوثيقة هنا أو انقر للرفع</p>
          <p className="text-[10px] text-ink-400 mt-1">JPG, PNG أو PDF · بحد أقصى 5 ميجابايت</p>
        </button>
        {file && (
          <div className="card p-3 flex items-center gap-3 animate-slide-up">
            <div className="w-10 h-10 rounded-xl bg-success-50 text-success flex items-center justify-center"><FileText size={18} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold font-mono" dir="ltr">{file.name}</p>
              <p className="text-[10px] text-ink-500">{file.size} • تم التحقق من الوضوح</p>
            </div>
            <button onClick={() => setFile(null)} className="text-danger"><X size={16} /></button>
          </div>
        )}
      </div>
      <div className="px-5 pb-4">
        <button disabled={!file} onClick={() => navigate('merchantMedia')} className="w-full btn-primary btn-lg">متابعة لرفع صورة المتجر</button>
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
      <TopBar title="صور المتجر الظاهرة للعملاء" code="M-045" subtitle="أضف صورة واجهة متجرك وشعاره لتظهر للمتسوقين" />
      <div className="flex-1 px-5 py-4 space-y-4">
        <div>
          <label className="label">صورة واجهة المتجر (Banner):</label>
          <button onClick={() => setBanner(true)} className={`w-full h-36 rounded-modal border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition ${banner ? 'border-success' : 'border-secondary-300 bg-white'}`}>
            {banner ? <img src="/img/store-cover.jpg" alt="" className="w-full h-full object-cover" /> : <><ImageIcon size={28} className="text-secondary" /><p className="text-[12px] font-bold text-ink-900 mt-2">التقاط أو رفع صورة الواجهة</p><p className="text-[10px] text-ink-400">نسبة العرض المفضلة 16:9</p></>}
          </button>
        </div>
        <div>
          <label className="label">شعار المتجر (مربع 1:1):</label>
          <button onClick={() => setLogo(true)} className={`card p-3 w-full flex items-center gap-3 text-right ${logo ? 'border-success' : 'border-dashed border-2 border-primary-300'}`}>
            <div className="w-14 h-14 rounded-xl bg-primary-50 text-primary flex items-center justify-center">{logo ? <Logo icon size={40} /> : <Store size={24} />}</div>
            <div>
              <p className="text-[12px] font-bold text-ink-900">{logo ? 'تم رفع الشعار' : 'شعار المتجر (مربع 1:1)'}</p>
              <p className="text-[10px] text-ink-400">يظهر بأعلى قوائم التسوق والبحث</p>
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
  const { navigate, dispatch, switchTab } = useApp()
  return (
    <StateScreen tone="warning" icon={Clock} showBack={false} title="طلب المتجر قيد المراجعة" description={<>طلبك رقم <b className="text-secondary" dir="ltr">{MERCHANT.requestId}</b> قيد الفحص من المشرفين. سيتم إشعارك فور اعتماد المتجر.</>} primary={{ label: 'العودة إلى حسابي', onClick: () => switchTab('account') }}>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => { dispatch({ type: 'MERCHANT_STATUS', status: 'approved' }); navigate('merchantApproved', {}, { resetTo: true }) }} className="btn-success btn-sm">محاكاة: اعتماد</button>
        <button onClick={() => { dispatch({ type: 'MERCHANT_STATUS', status: 'rejected' }); navigate('merchantRejected', {}, { resetTo: true }) }} className="btn-danger btn-sm">محاكاة: رفض</button>
      </div>
    </StateScreen>
  )
}

export function MerchantApproved() {
  const { switchTab } = useApp()
  return (
    <StateScreen tone="success" icon={ShieldCheck} code="M-049" showBack={false} title="تهانينا! تم اعتماد متجرك" description="تم التحقق من هويتك وموافقة إدارة منصة جديد على افتتاح متجرك التجاري في تعز" primary={{ label: 'الدخول للوحة تحكم التاجر', onClick: () => switchTab('m-dashboard') }}>
      <KeyValue rows={[['اسم المتجر:', 'تكنو سيبس للإلكترونيات'], ['معرف التاجر:', MERCHANT.merchantId, 'text-primary'], ['الحالة التشغيلية:', 'نشط ومعتمد', 'text-success-700']]} />
    </StateScreen>
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
  const { navigate, state, switchTab } = useApp()
  const store = storeById(MERCHANT.storeId)
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
          <div className="flex-1">
            <h1 className="text-[18px] font-extrabold flex items-center gap-1.5">{store.name} <ShieldCheck size={16} className="text-warning" /></h1>
            <p className="text-[11px] text-white/80">لوحة إدارة المتجر والمبيعات</p>
          </div>
          <button onClick={() => navigate('m-notifications')} className="relative w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"><Bell size={18} /><span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-secondary text-[9px] font-extrabold flex items-center justify-center">3</span></button>
          <button onClick={() => switchTab('account')} className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"><Store size={18} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-4">
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
                  <p className="text-[12px] font-bold text-ink-900">محمد سعيد</p>
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
  const { back, showToast } = useApp()
  const store = storeById(MERCHANT.storeId)
  const [f, setF] = useState({ name: store.name, desc: store.description, prep: store.prepTime, min: store.minOrder })
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="إدارة وتعديل بيانات المتجر" subtitle="ساعات العمل، الشعار، وسياسة التوصيل" />
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div><label className="label">اسم المتجر الظاهر للعملاء</label><input className="field bg-white" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div><label className="label">الوصف التعريفي للمتجر</label><textarea className="field bg-white h-24 py-3 resize-none" value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">وقت التجهيز المتوقع</label><input className="field bg-white" value={f.prep} onChange={(e) => setF({ ...f, prep: e.target.value })} /></div>
          <div><label className="label">الحد الأدنى للطلب</label><input type="number" className="field bg-white tabular" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} /></div>
        </div>
      </div>
      <div className="px-5 pb-4"><button onClick={() => { Object.assign(store, { name: f.name, description: f.desc, prepTime: f.prep, minOrder: Number(f.min) }); showToast('تم حفظ التعديلات', 'success'); back() }} className="w-full btn-primary btn-lg">حفظ التعديلات</button></div>
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
  const [confirm, setConfirm] = useState(current.params?.preset === 'confirm' ? productById(state.merchantProducts[0]) || null : null)
  const list = state.merchantProducts.map(productById).filter(Boolean).filter((p) => filter === 'all' || (filter === 'out' ? p.stock <= 0 : p.stock > 0))
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
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <h1 className="text-[18px] font-extrabold text-ink-900">الطلبات الواردة للمتجر</h1>
        <p className="text-[11px] text-ink-500">متابعة طلبات العملاء وتحديث حالات التجهيز</p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-2.5">
        {orders.length ? orders.map((o) => (
          <button key={o.id} onClick={() => navigate('m-order', { orderId: o.id })} className={`w-full card p-3.5 text-right ${o.stage === 'new' ? 'border-2 border-primary' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-primary tabular" dir="ltr">{o.id}</span>
              <StageChip stage={o.stage} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div><p className="text-[13px] font-bold text-ink-900">محمد سعيد</p><p className="text-[10px] text-ink-400">تعز · {o.createdAt} · {o.items.length} أصناف</p></div>
              <Price value={o.total} size="sm" />
            </div>
            <div className="border-t border-ink-100 mt-2.5 pt-2 flex items-center justify-between text-[11px] font-bold text-primary"><span>{o.stage === 'new' ? 'قرار القبول أو الرفض' : 'فتح تفاصيل الطلب وتحديث المرحلة'}</span><ChevronLeft size={14} /></div>
          </button>
        )) : (
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><ClipboardList size={40} strokeWidth={1.6} /></div>
            <h2 className="text-[20px] font-extrabold">لا توجد طلبات واردة حالياً</h2>
            <p className="text-[12px] text-ink-500 mt-2">متجرك جاهز لاستقبال الطلبات. ستصلك إشعارات فورية حال قيام العملاء بالطلب.</p>
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
  if (!order) return null
  const address = addressById(order.addressId)
  const idx = STAGE_INDEX[order.stage]
  const setStage = (stage, msg) => { dispatch({ type: 'SET_ORDER_STAGE', orderId: order.id, stage }); showToast(msg, 'success') }
  const stageBtn = { accepted: ['قيد التحضير', 'preparing', 'M-066'], preparing: ['تحديد الطلب كـ "جاهز"', 'ready', 'M-067'], ready: ['تحديد كـ "خرج للتوصيل"', 'out', 'M-068'], out: ['تأكيد إتمام التوصيل والتسليم', 'delivered', 'M-069'] }[order.stage]
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={order.stage === 'new' ? 'قرار قبول أو رفض الطلب' : 'معالجة وتحديث حالة الطلب'} code={order.stage === 'new' ? 'M-063' : 'M-062'} right={<StageChip stage={order.stage} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-3">
        <div className="card p-4">
          <div className="flex items-center justify-between"><span className="text-[13px] font-extrabold text-primary tabular" dir="ltr">{order.id}</span><span className="text-[10px] text-ink-400">{order.createdAt}</span></div>
          <p className="text-[14px] font-bold text-ink-900 mt-1">العميل: محمد سعيد <span className="text-[11px] text-ink-400 font-medium tabular" dir="ltr">(773030064)</span></p>
          <p className="text-[11px] text-ink-500">{address?.details}</p>
        </div>
        <div className="card p-4">
          <p className="text-[12px] font-bold text-ink-900 mb-2">{idx >= STAGE_INDEX.preparing && idx < STAGE_INDEX.out ? 'قائمة فحص الأصناف:' : 'العناصر المطلوبة:'}</p>
          {order.items.map((it) => { const p = productById(it.productId); return (
            <label key={it.productId} className="flex items-center justify-between py-1.5 text-[12px]">
              <span className="flex items-center gap-2 text-ink-700 font-medium">{idx >= STAGE_INDEX.preparing && idx < STAGE_INDEX.out && <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />}{p.shortName} <span className="text-ink-400">(×{it.qty})</span></span>
              <span className="font-bold tabular">{fmt(it.price * it.qty)}</span>
            </label>
          ) })}
          <div className="border-t border-dashed border-ink-200 mt-2 pt-2 flex items-center justify-between"><span className="text-[13px] font-extrabold text-primary">إجمالي الفاتورة:</span><Price value={order.total} size="sm" tone="primary" /></div>
        </div>
        {idx >= STAGE_INDEX.accepted && idx <= STAGE_INDEX.out && (
          <div className="card p-4">
            <p className="text-[12px] font-bold text-ink-900 mb-2">تغيير مرحلة الطلب الحالية</p>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_STAGES.slice(2).map((s) => { const i = STAGE_INDEX[s.key]; const cur = i === idx; const done = i < idx; return (
                <button key={s.key} disabled={i <= idx || i > idx + 1} onClick={() => setStage(s.key, `تم تحديث المرحلة: ${s.label}`)} className={`h-10 rounded-xl text-[12px] font-bold border transition disabled:cursor-not-allowed ${cur ? 'bg-secondary text-white border-secondary' : done ? 'bg-success-50 text-success-700 border-success-100' : i === idx + 1 ? 'bg-white text-primary border-primary' : 'bg-ink-100 text-ink-400 border-transparent'}`}>{done && '✓ '}{s.label}</button>
              ) })}
            </div>
          </div>
        )}
        {order.stage === 'delivered' && <div className="card p-6 text-center"><CheckCircle2 size={36} className="text-success mx-auto" /><p className="text-[14px] font-extrabold mt-2">تم تسليم الطلب بنجاح!</p><p className="text-[11px] text-ink-500">اكتملت دورة حياة الطلب وتم تحصيل المبلغ نقداً</p></div>}
      </div>
      <div className="px-4 pb-4 pt-2 space-y-2">
        {order.stage === 'new' && (<>
          <button onClick={() => { dispatch({ type: 'SET_ORDER_STAGE', orderId: order.id, stage: 'accepted' }); navigate('m-order-accepted', { orderId: order.id, tab: 'm-orders' }, { replace: true }) }} className="w-full btn-primary btn-lg"><Check size={18} strokeWidth={3} /> قبول الطلب والبدء بالتجهيز</button>
          <button onClick={() => { dispatch({ type: 'REJECT_ORDER', orderId: order.id }); navigate('m-order-rejected', { orderId: order.id, tab: 'm-orders' }, { replace: true }) }} className="w-full btn-outline btn-lg !text-danger !border-danger-100">رفض الطلب</button>
        </>)}
        {stageBtn && <button onClick={() => setStage(stageBtn[1], stageBtn[1] === 'delivered' ? 'تم تسليم الطلب بنجاح!' : `تم تحديث المرحلة إلى: ${stageBtn[0]}`)} className={`w-full btn-lg ${stageBtn[1] === 'delivered' ? 'btn-success' : stageBtn[1] === 'preparing' ? 'btn-primary' : 'btn-secondary'}`}>{stageBtn[0]}</button>}
        {(order.stage === 'delivered' || order.stage === 'rejected') && <button onClick={back} className="w-full btn-outline btn-lg">العودة للطلبات الواردة</button>}
      </div>
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
  const { current, state, dispatch, navigate, switchTab } = useApp()
  const order = state.orders.find((o) => o.id === current.params?.orderId)
  const goPreparing = () => {
    if (!order) return switchTab('m-orders')
    if (order.stage === 'accepted') dispatch({ type: 'SET_ORDER_STAGE', orderId: order.id, stage: 'preparing' })
    navigate('m-order', { orderId: order.id }, { replace: true })
  }
  return (
    <MerchantState code="M-064" title="تم قبول الطلب" heading="تم قبول الطلب بنجاح!" description="تم إشعار العميل بقبول طلبه، وتحويل حالة الطلب إلى مرحلة التجهيز والتحضير." onBack={() => switchTab('m-orders')} primary={{ label: 'الانتقال لمرحلة التحضير', onClick: goPreparing }}>
      {order && <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['إجمالي الفاتورة:', `${fmt(order.total)} ${CURRENCY}`], ['الحالة الحالية:', 'مقبول — بانتظار التحضير', 'text-info']]} />}
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
  const noData = state.orders.length === 0 && state.merchantProducts.length === 0
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
                <div className={`w-full rounded-t-lg transition-all ${best ? 'bg-secondary shadow-secondary' : 'bg-primary/80'}`} style={{ height: `${h}%`, animation: `slide-up .5s ${i * 60}ms both` }} />
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
