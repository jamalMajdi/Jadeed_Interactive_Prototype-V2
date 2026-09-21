import React, { useState } from 'react'
import { ShoppingBag, ShoppingCart, Trash2, Tag, X, Check, ChevronLeft, MapPin, Banknote, Wallet, CreditCard, AlertTriangle, PackageX, RefreshCcw, Truck, Bike, MessageCircle, Phone, ReceiptText, Download, Package, Clock, XCircle, ArrowRight, Store, Landmark, Upload, ImageIcon, Copy, ShieldCheck } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, BottomNav, Price, Chip, ProductThumb, Stepper, StateScreen, KeyValue, StageChip, Logo, PaymentChip, StoreAvatar } from '../components/ui'
import { COURIER, CURRENCY, ORDER_STAGES, STAGE_INDEX, fmt, productById, storeById, CITY } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  سلة المشتريات (CUS-026) — كل الأرقام محسوبة من computeCart
// ─────────────────────────────────────────────────────────────
export function CartScreen() {
  const { cart, state, dispatch, navigate, showToast, switchTab, canGoBack, requireAuth, current } = useApp()
  // نظام الكوبونات/الخصومات موقوف مؤقتاً (قرار المنتج) — لا يُعرض قسم الكوبون في السلة
  const demoToast = current?.params?.demoToast // معرض الشاشات: إظهار تنبيه «تم تحديث السلة» عند الفتح
  React.useEffect(() => { if (demoToast) showToast(demoToast, 'success') }, [demoToast, showToast])

  if (!cart.lines.length) {
    return (
      <div className="flex-1 flex flex-col bg-ink-50 relative">
        <StatusBar />
        <TopBar title="سلة المشتريات" right={<ShoppingCart className="text-primary" size={22} />} />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pb-10">
          <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><ShoppingCart size={40} strokeWidth={1.6} /></div>
          <h2 className="text-[20px] font-extrabold">سلتك فارغة حالياً</h2>
          <p className="text-[12px] text-ink-500 mt-2 leading-relaxed">لم تقم بإضافة أي منتجات للسلة بعد. تصفح المتاجر والمنتجات المميزة في {CITY} وأضف ما يناسبك.</p>
        </div>
        <div className="px-6 pb-4">
          <button onClick={() => switchTab('home')} className="w-full btn-primary btn-lg">تصفح المنتجات الآن</button>
        </div>
        <HomeIndicator />
      </div>
    )
  }

  const blockedStores = cart.groups.filter((g) => !g.minOrderMet)
  const closedStores = cart.groups.filter((g) => g.storeClosed) // متجر مغلق: لا تُستقبل طلبات جديدة له
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="سلة المشتريات" subtitle={`${cart.itemCount} عناصر من ${cart.storeCount} ${cart.storeCount === 1 ? 'متجر' : 'متاجر'}`} right={<ShoppingCart className="text-primary" size={22} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        {cart.storeCount > 1 && (
          <div className="rounded-card bg-primary-50 border border-primary-100 px-3 py-2.5 text-[11px] font-medium text-primary flex items-start gap-2">
            <Store size={14} className="shrink-0 mt-0.5" />
            <span>سلتك تحتوي منتجات من {cart.storeCount} متاجر مختلفة — سيتم إنشاء <b>طلب مستقل لكل متجر</b> بمجموعه الخاص، ويجهّز كل متجر طلبه ويوصّله بشكل منفصل.</span>
          </div>
        )}
        {/* مجموعات المتاجر: كل متجر بمنتجاته ومجموعه الفرعي */}
        {cart.groups.map((g, gi) => (
          <div key={g.storeId} className="card overflow-hidden animate-fade-in">
            <button onClick={() => navigate('store', { id: g.storeId })} className="w-full flex items-center gap-3 px-3 py-2.5 bg-ink-50/70 border-b border-ink-100 text-right">
              <StoreAvatar store={g.store} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-extrabold text-ink-900 truncate flex items-center gap-1">{cart.storeCount > 1 && <span className="text-ink-400 font-bold">الطلب {gi + 1} ·</span>} {g.store?.name} {g.store?.verified && <ShieldCheck size={12} className="text-primary shrink-0" />}</p>
                <p className="text-[10px] font-medium text-ink-500 flex items-center gap-1"><Truck size={11} /> التوصيل خلال {g.store?.deliveryTime} · {g.itemCount} قطعة</p>
              </div>
              {g.storeClosed ? <Chip tone="danger">مغلق حالياً</Chip> : <ChevronLeft size={16} className="text-ink-400" />}
            </button>
            <div className="divide-y divide-ink-100">
              {g.lines.map(({ product, qty, lineTotal }) => (
                <div key={product.id} className="p-3 flex items-center gap-3">
                  <ProductThumb product={product} className="w-16 h-16" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-ink-900 line-clamp-2 leading-snug">{product.shortName}</p>
                    <p className="text-[10px] text-ink-400 mt-0.5">{fmt(product.price)} {CURRENCY} × {qty}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Stepper size="sm" value={qty} max={product.stock} maxHint onChange={(v) => dispatch({ type: 'SET_QTY', productId: product.id, qty: v })} />
                      <Price value={lineTotal} size="sm" />
                    </div>
                  </div>
                  <button onClick={() => { dispatch({ type: 'REMOVE_FROM_CART', productId: product.id }); showToast('تم حذف المنتج من السلة') }} className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-danger hover:bg-danger-50 transition self-start" aria-label="حذف"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div className={`px-3 py-2.5 flex items-center justify-between border-t ${g.minOrderMet ? 'bg-white border-ink-100' : 'bg-warning-50 border-warning-100'}`}>
              <div>
                <p className="text-[11px] font-bold text-ink-500">مجموع طلب {g.store?.name?.split(' ').slice(0, 2).join(' ')}</p>
                {!g.minOrderMet && <p className="text-[10px] font-bold text-warning-700 flex items-center gap-1 mt-0.5"><AlertTriangle size={11} /> الحد الأدنى لهذا المتجر {fmt(g.store.minOrder)} {CURRENCY}</p>}
              </div>
              <Price value={g.subtotal} size="sm" tone="ink" />
            </div>
          </div>
        ))}

        {/* الملخص — محسوب رياضيًا (لكل متجر ثم الإجمالي) */}
        <div className="card p-4 space-y-2.5 text-[12px]">
          {cart.storeCount > 1 && cart.groups.map((g) => (
            <Row key={g.storeId} k={`${g.store?.name}:`} v={<span className="font-bold tabular text-ink-900">{fmt(g.total)} {CURRENCY}</span>} />
          ))}
          <Row k="المجموع الفرعي:" v={<Price value={cart.subtotal} size="xs" tone="ink" />} />
          <Row k="رسوم التوصيل:" v={<span className="font-bold text-success-700">{cart.deliveryFee ? `${fmt(cart.deliveryFee)} ${CURRENCY}` : `مجاني (داخل ${CITY})`}</span>} />
          <div className="border-t border-dashed border-ink-200 pt-3 flex items-center justify-between">
            <span className="text-[14px] font-extrabold text-ink-900">المجموع الكلي{cart.storeCount > 1 ? ` (${cart.storeCount} طلبات)` : ''}:</span>
            <Price value={cart.total} size="md" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 bg-ink-50">
        {closedStores.length > 0 ? (
          <p className="text-[10px] font-bold text-danger text-center mb-2">متجر «{closedStores[0].store.name}» مغلق حالياً ولا يستقبل طلبات جديدة — احذف منتجاته أو انتظر فتحه</p>
        ) : blockedStores.length > 0 ? (
          <p className="text-[10px] font-bold text-warning-700 text-center mb-2">أكمل الحد الأدنى لمتجر «{blockedStores[0].store.name}» أو احذف منتجاته للمتابعة</p>
        ) : null}
        <button onClick={() => requireAuth({ name: 'checkout', params: {} }, 'سجّل الدخول لإتمام الطلب') && navigate('checkout')} disabled={blockedStores.length > 0 || closedStores.length > 0} className="w-full btn-primary btn-lg">إتمام الطلب والدفع · {fmt(cart.total)} {CURRENCY}</button>
      </div>
      <HomeIndicator />
    </div>
  )
}

const Row = ({ k, v, tone = 'text-ink-500' }) => (
  <div className="flex items-center justify-between">
    <span className={`font-medium ${tone}`}>{k}</span>
    {v}
  </div>
)

// ─────────────────────────────────────────────────────────────
//  إتمام الطلب (عنوان + دفع) → نجاح (CUS-031) / فشل (CUS-032)
// ─────────────────────────────────────────────────────────────
const PAYMENTS = [
  { key: 'cod', Icon: Banknote, label: 'الدفع نقداً عند الاستلام', desc: 'ادفع للمندوب عند وصول الطلب' },
  { key: 'transfer', Icon: Landmark, label: 'تحويل بنكي / محفظة إلى التاجر', desc: 'حوّل المبلغ إلى حساب المتجر وأرفق صورة الإيصال' },
  { key: 'wallet', Icon: Wallet, label: 'محفظة جديد الرقمية', desc: 'الرصيد المتاح: 50 ر.ي' },
  { key: 'card', Icon: CreditCard, label: 'بطاقة بنكية', desc: 'قريباً' , disabled: true },
]

// بيانات الدفع الخاصة بكل تاجر + رفع إيصال التحويل لكل متجر (طلب لكل متجر)
function TransferPanel({ group, receipt, onReceipt, showToast }) {
  const pay = group.store?.payment
  if (!pay) return null
  const copy = (v) => { navigator.clipboard?.writeText(v).catch(() => {}); showToast('تم نسخ رقم الحساب', 'success') }
  return (
    <div className="rounded-card border border-primary-100 bg-primary-50/40 p-3 space-y-2.5">
      <div className="flex items-center gap-2">
        <StoreAvatar store={group.store} size={30} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-extrabold text-ink-900 truncate">حوّل إلى {group.store.name}</p>
          <p className="text-[10px] text-ink-500">المبلغ المطلوب لهذا المتجر: <b className="text-secondary tabular">{fmt(group.total)} {CURRENCY}</b></p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-ink-100 divide-y divide-ink-100 text-[11px]">
        <div className="flex items-center justify-between px-3 py-2"><span className="text-ink-500">البنك / الجهة</span><span className="font-bold text-ink-900">{pay.bank}</span></div>
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          <span className="text-ink-500 shrink-0">رقم الحساب</span>
          <button type="button" onClick={() => copy(pay.account)} className="flex items-center gap-1.5 font-bold text-primary tabular" dir="ltr" aria-label="نسخ رقم الحساب">{pay.account} <Copy size={12} /></button>
        </div>
        <div className="flex items-center justify-between px-3 py-2"><span className="text-ink-500">اسم صاحب الحساب</span><span className="font-bold text-ink-900">{pay.holder}</span></div>
        <div className="flex items-center justify-between px-3 py-2"><span className="text-ink-500">محفظة إلكترونية</span><span className="font-bold text-ink-900 tabular" dir="ltr">{pay.wallet}</span></div>
      </div>
      {receipt ? (
        <div className="flex items-center gap-3 bg-white rounded-xl border border-success-100 p-2.5 animate-slide-up">
          <div className="w-11 h-11 rounded-lg bg-success-50 text-success flex items-center justify-center shrink-0"><ImageIcon size={18} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-ink-900 truncate" dir="ltr">{receipt.name}</p>
            <p className="text-[10px] text-success-700 font-bold flex items-center gap-1"><Check size={11} strokeWidth={3} /> تم إرفاق إيصال التحويل · {receipt.size}</p>
          </div>
          <button type="button" onClick={() => onReceipt(null)} className="text-ink-400 hover:text-danger" aria-label="إزالة الإيصال"><X size={16} /></button>
        </div>
      ) : (
        <button type="button" onClick={() => onReceipt({ name: `receipt-${group.storeId}.jpg`, size: '1.2 ميجابايت', at: 'الآن' })} className="w-full h-12 rounded-xl border-2 border-dashed border-primary-300 bg-white text-primary text-[12px] font-bold flex items-center justify-center gap-2 active:scale-[0.99] transition">
          <Upload size={16} /> رفع صورة إيصال التحويل لهذا المتجر
        </button>
      )}
    </div>
  )
}

export function Checkout() {
  const { cart, currentAddress, navigate, dispatch, state, showToast } = useApp()
  // بيانات العميل المطلوبة للتوصيل: تُملأ مسبقاً من الحساب/الموقع المحفوظ ويمكن تعديلها، ولا يُرسل الطلب بدونها
  const [contact, setContact] = useState({ name: currentAddress?.name || '', phone: currentAddress?.phone || '', details: currentAddress?.details || '', notes: '' })
  const [contactErrors, setContactErrors] = useState({})
  const setC = (k) => (e) => { setContact({ ...contact, [k]: e.target.value }); if (contactErrors[k]) setContactErrors({ ...contactErrors, [k]: undefined }) }
  const validateContact = () => {
    const er = {}
    if (contact.name.trim().length < 3) er.name = 'اسم المستلم مطلوب'
    if (!/^(\+?967)?7\d{8}$/.test(contact.phone.replace(/\s/g, ''))) er.phone = 'رقم جوال صحيح يبدأ بـ 7 (9 أرقام)'
    if (contact.details.trim().length < 5) er.details = 'اكتب تفاصيل العنوان (الحي، الشارع، أقرب معلم)'
    setContactErrors(er)
    return Object.keys(er).length === 0
  }
  const [pay, setPay] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [simulateFail, setSimulateFail] = useState(false)
  const [receipts, setReceipts] = useState({}) // storeId → { name, size }
  const groups = cart.groups
  const missingReceipts = pay === 'transfer' ? groups.filter((g) => !receipts[g.storeId]) : []
  const payLabel = PAYMENTS.find((p) => p.key === pay).label

  const place = () => {
    const closed = groups.find((g) => g.storeClosed)
    if (closed) return showToast(`متجر «${closed.store.name}» مغلق حالياً ولا يستقبل طلبات جديدة`, 'danger')
    if (!validateContact()) return showToast('أكمل بيانات التواصل والتوصيل أولاً', 'danger')
    if (missingReceipts.length) return showToast(`أرفق إيصال التحويل لمتجر ${missingReceipts[0].store.name}`, 'danger')
    // حفظ بيانات التواصل في موقع الحساب الوحيد حتى تُستخدم في الطلبات القادمة
    dispatch({ type: 'UPDATE_ADDRESS', patch: { name: contact.name.trim(), phone: contact.phone.replace(/\s/g, ''), details: contact.details.trim() } })
    setPlacing(true)
    setTimeout(() => {
      setPlacing(false)
      if (simulateFail) return navigate('orderFailed')
      // طلب مستقل لكل متجر — كل طلب بمنتجاته ومجموعه وإيصاله الخاص
      const orders = groups.map((g) => ({
        storeId: g.storeId,
        items: g.lines.map((l) => ({ productId: l.product.id, qty: l.qty, price: l.product.price })),
        subtotal: g.subtotal,
        discount: g.discount,
        deliveryFee: g.deliveryFee,
        total: g.total,
        payment: payLabel,
        paymentStatus: pay === 'transfer' ? 'pending_confirmation' : pay === 'wallet' ? 'wallet' : 'cod',
        receipt: pay === 'transfer' ? receipts[g.storeId] : null,
        addressId: state.addressId,
        customer: { name: contact.name.trim(), phone: contact.phone.replace(/\s/g, ''), details: contact.details.trim(), notes: contact.notes.trim() || null },
        coupon: g.discount ? cart.couponCode : null,
      }))
      dispatch({ type: 'PLACE_ORDERS', orders })
      const ids = orders.map((_, i) => `JD-${state.orderCounter + i}`)
      navigate('orderSuccess', { orderId: ids[0], orderIds: ids }, { resetTo: true })
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="إتمام الطلب والدفع" subtitle="راجع عنوانك وطريقة الدفع قبل التأكيد" />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-extrabold text-ink-900 flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> عنوان التوصيل</p>
            <button onClick={() => navigate('addresses')} className="link text-secondary">تغيير</button>
          </div>
          <p className="text-[13px] font-bold text-ink-900">{currentAddress.title}</p>
          <p className="text-[11px] text-ink-500">{currentAddress.details}</p>
        </div>

        {/* بيانات التواصل والاستلام — مطلوبة لإتمام الطلب */}
        <div className="card p-4">
          <p className="text-[13px] font-extrabold text-ink-900 mb-3 flex items-center gap-1.5"><Phone size={14} className="text-primary" /> بيانات التواصل والاستلام</p>
          <div className="space-y-3">
            <div>
              <label className="label">اسم المستلم</label>
              <input className={`field bg-white ${contactErrors.name ? 'field-error' : ''}`} value={contact.name} onChange={setC('name')} placeholder="الاسم الكامل" />
              {contactErrors.name && <p className="text-[11px] font-bold text-danger mt-1">{contactErrors.name}</p>}
            </div>
            <div>
              <label className="label">رقم الجوال للتواصل</label>
              <input dir="ltr" inputMode="tel" className={`field bg-white text-left tabular ${contactErrors.phone ? 'field-error' : ''}`} value={contact.phone} onChange={setC('phone')} placeholder="7xxxxxxxx" />
              {contactErrors.phone && <p className="text-[11px] font-bold text-danger mt-1">{contactErrors.phone}</p>}
            </div>
            <div>
              <label className="label">تفاصيل العنوان (الحي، الشارع، أقرب معلم)</label>
              <input className={`field bg-white ${contactErrors.details ? 'field-error' : ''}`} value={contact.details} onChange={setC('details')} placeholder="المسبح، قرب جولة المسبح" />
              {contactErrors.details && <p className="text-[11px] font-bold text-danger mt-1">{contactErrors.details}</p>}
            </div>
            <div>
              <label className="label">ملاحظات للمندوب (اختياري)</label>
              <input className="field bg-white" value={contact.notes} onChange={setC('notes')} placeholder="مثال: اتصل قبل الوصول" />
            </div>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-[13px] font-extrabold text-ink-900 mb-3">طريقة الدفع</p>
          <div className="space-y-2">
            {PAYMENTS.map(({ key, Icon, label, desc, disabled }) => {
              const active = pay === key
              return (
                <button key={key} disabled={disabled} onClick={() => setPay(key)} className={`w-full flex items-center gap-3 rounded-field border p-3 text-right transition disabled:opacity-50 ${active ? 'border-primary bg-primary-50/50' : 'border-ink-200'}`}>
                  <Icon size={20} className={active ? 'text-primary' : 'text-ink-400'} />
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-ink-900">{label}</div>
                    <div className="text-[10px] text-ink-500">{desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-primary border-primary text-white' : 'border-ink-300'}`}>{active && <Check size={11} strokeWidth={3.5} />}</div>
                </button>
              )
            })}
          </div>
          {pay === 'transfer' && (
            <div className="mt-3 space-y-3 animate-fade-in">
              <p className="text-[11px] font-medium text-ink-500 leading-relaxed">حوّل قيمة كل طلب إلى حساب متجره ثم أرفق صورة الإيصال. يصل الإيصال مع الطلب إلى التاجر، وعند تأكيده استلام المبلغ ينتقل طلبك مباشرة إلى التجهيز.</p>
              {groups.map((g) => (
                <TransferPanel key={g.storeId} group={g} receipt={receipts[g.storeId]} onReceipt={(r) => setReceipts({ ...receipts, [g.storeId]: r })} showToast={showToast} />
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <p className="text-[13px] font-extrabold text-ink-900 mb-2">ملخص الطلب ({cart.itemCount} قطعة · {groups.length} {groups.length === 1 ? 'طلب من متجر واحد' : 'طلبات مستقلة'})</p>
          <div className="space-y-3 text-[12px]">
            {groups.map((g, gi) => (
              <div key={g.storeId} className="rounded-xl border border-ink-100 p-2.5">
                <p className="text-[11px] font-extrabold text-primary flex items-center gap-1 mb-1.5"><Store size={12} /> {groups.length > 1 && `الطلب ${gi + 1}: `}{g.store?.name} <span className="text-ink-400 font-medium mr-auto">التوصيل {g.store?.deliveryTime}</span></p>
                {g.lines.map((l) => (
                  <div key={l.product.id} className="flex items-center justify-between py-0.5">
                    <span className="text-ink-600 font-medium truncate flex-1">{l.product.shortName} <span className="text-ink-400">× {l.qty}</span></span>
                    <span className="font-bold tabular">{fmt(l.lineTotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-dashed border-ink-200 mt-1.5 pt-1.5 font-bold text-ink-900"><span>مجموع هذا الطلب</span><span className="tabular">{fmt(g.total)} {CURRENCY}</span></div>
              </div>
            ))}
            <div className="border-t border-ink-100 pt-2 space-y-1">
              <div className="flex justify-between text-ink-500"><span>المجموع الفرعي</span><span className="tabular">{fmt(cart.subtotal)}</span></div>
              <div className="flex justify-between text-ink-500"><span>التوصيل</span><span>{cart.deliveryFee ? fmt(cart.deliveryFee) : 'مجاني'}</span></div>
              <div className="flex justify-between text-[14px] font-extrabold text-ink-900 pt-1"><span>الإجمالي</span><Price value={cart.total} size="sm" /></div>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-[11px] text-ink-500 font-medium cursor-pointer px-1">
          <input type="checkbox" checked={simulateFail} onChange={(e) => setSimulateFail(e.target.checked)} className="w-4 h-4 accent-danger" />
          محاكاة فشل الشبكة أثناء الإرسال
        </label>
      </div>
      <div className="px-4 pb-4 pt-2">
        <button onClick={place} disabled={placing} className="w-full btn-primary btn-lg">
          {placing ? 'جارٍ إرسال الطلب إلى المتجر...' : pay === 'transfer' && missingReceipts.length ? `أرفق ${missingReceipts.length === 1 ? 'إيصال التحويل' : `${missingReceipts.length} إيصالات`} للمتابعة` : `تأكيد ${groups.length > 1 ? `${groups.length} طلبات` : 'الطلب'} · ${fmt(cart.total)} ${CURRENCY}`}
        </button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function OrderSuccess() {
  const { current, navigate, switchTab, state } = useApp()
  const ids = current.params.orderIds || [current.params.orderId]
  const orders = ids.map((id) => state.orders.find((o) => o.id === id)).filter(Boolean)
  const order = orders[0] || state.orders[0]
  const transfer = order.paymentStatus === 'pending_confirmation'
  return (
    <StateScreen
      tone="info"
      icon={Check}
      showBack={false}
      title={orders.length > 1 ? `تم إرسال ${orders.length} طلبات بنجاح!` : 'تم إرسال طلبك بنجاح!'}
      description={
        orders.length > 1
          ? `تم إنشاء طلب مستقل لكل متجر، وكل متجر سيجهّز طلبه ويوصّله بشكل منفصل.`
          : transfer
            ? `وصل طلبك وإيصال التحويل إلى ${storeById(order.storeId).name}. سيبدأ التجهيز فور تأكيد التاجر استلام المبلغ.`
            : `وصل طلبك إلى ${storeById(order.storeId).name} وهو الآن بانتظار قبول التاجر وبدء التجهيز.`
      }
      primary={{ label: orders.length > 1 ? 'متابعة طلباتي' : 'تتبع حالة الطلب', onClick: () => (orders.length > 1 ? switchTab('orders') : navigate('tracking', { orderId: order.id })) }}
      secondary={{ label: 'العودة للرئيسية', onClick: () => switchTab('home') }}
    >
      {orders.length > 1 ? (
        <KeyValue rows={orders.map((o) => [`${storeById(o.storeId).name}:`, `${o.id} · ${fmt(o.total)} ${CURRENCY}`, 'text-primary'])} />
      ) : (
        <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['إجمالي الفاتورة:', `${fmt(order.total)} ${CURRENCY}`], ['طريقة الدفع:', order.payment, transfer ? 'text-warning-700' : 'text-success-700'], ['الوقت المتوقع للتوصيل:', storeById(order.storeId).deliveryTime, 'text-success-700']]} />
      )}
    </StateScreen>
  )
}

export function OrderFailed() {
  const { back, switchTab } = useApp()
  return (
    <div className="flex-1 flex flex-col relative bg-ink-100">
      <StatusBar />
      <div className="absolute inset-0 bg-ink-900/70 flex items-center justify-center px-6 animate-fade-in">
        <div className="w-full bg-white rounded-modal shadow-modal p-6 text-center animate-pop">
          <p className="text-[12px] font-bold text-ink-500">فشل إتمام الطلب</p>
          <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger flex items-center justify-center mx-auto mt-4"><XCircle size={30} strokeWidth={2} /></div>
          <h2 className="text-[18px] font-extrabold text-ink-900 mt-4">تعذر إرسال الطلب إلى المتجر</h2>
          <p className="text-[12px] text-ink-500 leading-relaxed mt-2">حدث خطأ في شبكة الاتصال أثناء إرسال بيانات طلبك. لم يتم خصم أي مبالغ أو اعتماد الطلب بعد.</p>
          <button onClick={back} className="w-full btn-primary btn-md mt-5"><RefreshCcw size={16} /> إعادة محاولة إرسال الطلب</button>
          <button onClick={() => switchTab('home')} className="w-full btn-ghost btn-md mt-2">العودة للرئيسية</button>
        </div>
      </div>
    </div>
  )
}

export function OutOfStock() {
  const { current, back, dispatch, navigate } = useApp()
  const p = productById(current.params.id)
  return (
    <StateScreen
      tone="warning"
      icon={PackageX}
      code="CUS-029"
      title="عذراً، نفدت الكمية من المخزون"
      description="أحد المنتجات التي اخترتها أصبح غير متوفر في المتجر حالياً. يرجى إزالته للمتابعة في إتمام الطلب."
      primary={{ label: 'العودة للتسوق', onClick: () => navigate('home', {}, { resetTo: true }) }}
    >
      <div className="bg-gradient-to-l from-primary to-primary-400 text-white rounded-card p-4 flex items-center justify-between text-right">
        <div>
          <p className="text-[13px] font-bold">{p.shortName}</p>
          <p className="text-[10px] text-white/80">الكمية المطلوبة غير متوفرة</p>
        </div>
        <button onClick={() => { dispatch({ type: 'REMOVE_FROM_CART', productId: p.id }); back() }} className="h-8 px-3 rounded-full bg-danger text-white text-[11px] font-bold">حذف من السلة</button>
      </div>
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  سجل طلباتي (CUS-036 / CUS-037)
// ─────────────────────────────────────────────────────────────
export function Orders() {
  const { state, navigate, switchTab } = useApp()
  const orders = state.orders
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <StatusBar />
      <div className="bg-white border-b border-ink-100 px-4 pb-3">
        <h1 className="text-[18px] font-extrabold text-ink-900">سجل طلباتي</h1>
        <p className="text-[11px] text-ink-500 font-medium">متابعة وتفاصيل جميع طلباتك الحالية والسابقة</p>
      </div>
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-3">
        {orders.length ? (
          orders.map((o) => {
            const first = productById(o.items[0].productId)
            const store = storeById(o.storeId)
            return (
              <button key={o.id} onClick={() => navigate('orderDetails', { orderId: o.id })} className="w-full card p-3 text-right active:scale-[0.99] transition">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold text-primary tabular" dir="ltr">{o.id}</span>
                  <div className="flex items-center gap-1.5">{o.paymentStatus === 'pending_confirmation' && <PaymentChip status={o.paymentStatus} />}<StageChip stage={o.stage} by={o.cancelledBy} /></div>
                </div>
                <div className="flex items-center gap-3 mt-2.5">
                  <ProductThumb product={first} className="w-14 h-14" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-ink-900 truncate">{first.shortName}{o.items.length > 1 && ` + ${o.items.length - 1} أخرى`}</p>
                    <p className="text-[10px] text-ink-500">{store.name} · {o.createdAt}</p>
                    <Price value={o.total} size="sm" />
                  </div>
                </div>
                <div className="border-t border-ink-100 mt-2.5 pt-2 flex items-center justify-between text-[11px] font-bold text-primary">
                  <span>عرض تفاصيل وتتبع الطلب</span>
                  <ChevronLeft size={14} />
                </div>
              </button>
            )
          })
        ) : (
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><ReceiptText size={40} strokeWidth={1.6} /></div>
            <h2 className="text-[20px] font-extrabold">ليس لديك أي طلبات سابقة</h2>
            <p className="text-[12px] text-ink-500 mt-2">ستظهر هنا جميع طلباتك الحالية والسابقة مع إمكانية تتبع مراحل التوصيل لحظة بلحظة.</p>
            <button onClick={() => switchTab('home')} className="btn-primary btn-md mt-6">ابدأ أول طلب لك الآن</button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تفاصيل الفاتورة والطلب (CUS-038) + إلغاء (CUS-034)
// ─────────────────────────────────────────────────────────────
export function OrderDetails() {
  const { current, state, navigate, dispatch, addressById, showToast } = useApp()
  const order = state.orders.find((o) => o.id === current.params.orderId)
  if (!order) return null
  const store = storeById(order.storeId)
  const address = addressById(order.addressId)
  const canCancel = order.stage === 'new' // الإلغاء متاح قبل بدء التجهيز فقط
  const active = STAGE_INDEX[order.stage] !== undefined && order.stage !== 'delivered'
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="تفاصيل الفاتورة والطلب" code="CUS-038" />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-primary tabular" dir="ltr">{order.id}</span>
            <StageChip stage={order.stage} by={order.cancelledBy} />
          </div>
          <h2 className="text-[15px] font-black text-ink-900 mt-2">{store.name}</h2>
          <p className="text-[11px] text-ink-400">{order.createdAt} · {order.payment}</p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <PaymentChip status={order.paymentStatus || 'cod'} />
            {order.receipt && <Chip tone="info">إيصال مرفق: {order.receipt.name}</Chip>}
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => showToast('جارٍ تجهيز الفاتورة PDF...')} className="flex-1 btn-ghost btn-sm"><Download size={14} /> تحميل الفاتورة PDF</button>
            {active && <button onClick={() => navigate('tracking', { orderId: order.id })} className="flex-1 btn-primary btn-sm"><Truck size={14} /> تتبع المراحل</button>}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[12px] font-bold text-ink-900 flex items-center gap-1"><MapPin size={13} className="text-primary" /> عنوان استلام الطلب والتوصيل</p>
            {canCancel && <button onClick={() => navigate('addresses')} className="text-[11px] font-bold text-secondary">تغيير</button>}
          </div>
          <p className="text-[12px] font-bold text-ink-800">{order.customer?.name || address?.name || address?.title}</p>
          <p className="text-[11px] text-ink-500">{order.customer?.details || address?.details}</p>
          {(order.customer?.phone || address?.phone) && <p className="text-[11px] font-bold text-primary tabular mt-0.5" dir="ltr">{order.customer?.phone || address?.phone}</p>}
          {order.customer?.notes && <p className="text-[10px] text-ink-400 mt-0.5">ملاحظات: {order.customer.notes}</p>}
        </div>
        {order.stage === 'cancelled' && order.cancelledBy === 'merchant' && (
          <div className="rounded-card bg-danger-50 border border-danger-100 px-3 py-2.5 text-[11px] font-bold text-danger-700 flex items-start gap-2">
            <XCircle size={14} className="shrink-0 mt-0.5" /> <span>ألغى المتجر هذا الطلب{order.cancelledFrom && order.cancelledFrom !== 'new' ? ' بعد قبوله' : ''}{order.cancelReason ? ` — السبب: ${order.cancelReason}` : ''}. لم يتم خصم أي مبالغ.</span>
          </div>
        )}

        <div className="card p-4">
          <p className="text-[12px] font-black text-ink-900 mb-2">قائمة الأصناف المشتراة ({order.items.length}):</p>
          <div className="divide-y divide-ink-100">
            {order.items.map((it) => {
              const p = productById(it.productId)
              return (
                <div key={it.productId} className="flex items-center gap-3 py-2.5">
                  <ProductThumb product={p} className="w-11 h-11" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-ink-900 truncate">{p.shortName}</p>
                    <p className="text-[10px] text-ink-400">الكمية: {it.qty} × {fmt(it.price)} {CURRENCY}</p>
                  </div>
                  <span className="text-[12px] font-bold tabular">{fmt(it.qty * it.price)}</span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-dashed border-ink-200 mt-2 pt-3 space-y-1.5 text-[12px]">
            <div className="flex justify-between text-ink-500"><span>المجموع الفرعي</span><span className="tabular">{fmt(order.subtotal)} {CURRENCY}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-success-700 font-bold"><span>الخصم {order.coupon && `(${order.coupon})`}</span><span className="tabular">- {fmt(order.discount)} {CURRENCY}</span></div>}
            <div className="flex justify-between text-ink-500"><span>رسوم التوصيل</span><span>{order.deliveryFee ? `${fmt(order.deliveryFee)} ${CURRENCY}` : 'مجاني'}</span></div>
            <div className="flex justify-between text-[14px] font-extrabold text-ink-900 pt-1"><span>تفاصيل الفاتورة المالية:</span><Price value={order.total} size="sm" /></div>
          </div>
        </div>

        {canCancel && (
          <button onClick={() => { dispatch({ type: 'CANCEL_ORDER', orderId: order.id }); navigate('orderCancelled', { orderId: order.id }, { replace: true }) }} className="w-full btn-outline btn-md !text-danger !border-danger-100 hover:!bg-danger-50">
            <XCircle size={16} /> إلغاء الطلب
          </button>
        )}
      </div>
      <HomeIndicator />
    </div>
  )
}

export function OrderCancelled() {
  const { current, switchTab } = useApp()
  return (
    <StateScreen tone="empty" icon={RefreshCcw} code="CUS-034" showBack={false} title="تم إلغاء الطلب بنجاح" description="تم إشعار المتجر بإلغاء الطلب بناءً على رغبتك." primary={{ label: 'العودة لقائمة طلباتي', onClick: () => switchTab('orders') }}>
      <p className="text-[12px] font-bold text-ink-900">رقم الطلب: <span className="text-primary tabular" dir="ltr">{current.params.orderId}</span></p>
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  تتبع الشحنة المباشر (CUS-033 / CUS-039) + تم التسليم (CUS-035)
// ─────────────────────────────────────────────────────────────
export function Tracking() {
  const { current, state, navigate, showToast } = useApp()
  const order = state.orders.find((o) => o.id === current.params.orderId)
  if (!order) return null
  const idx = STAGE_INDEX[order.stage] ?? -1
  const store = storeById(order.storeId)
  const times = ['10:30 ص', '10:45 ص', '11:20 ص', 'المتوقع قريباً']
  if (order.stage === 'delivered') {
    return (
      <StateScreen tone="success" icon={Check} code="CUS-035" title="تم استلام الطلب وتوصيله!" description="نتمنى أن تكون تجربتك مع جديد رائعة ومريحة." primary={{ label: 'العودة للرئيسية', onClick: () => navigate('home', {}, { resetTo: true }) }} secondary={{ label: 'تقييم التجربة', onClick: () => showToast('شكراً لتقييمك!', 'success') }}>
        <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['المتجر:', store.name], ['المبلغ المستحق:', `${fmt(order.total)} ${CURRENCY}`, 'text-success-700']]} />
      </StateScreen>
    )
  }
  if (['cancelled', 'rejected'].includes(order.stage)) {
    const byMerchant = order.stage === 'rejected' || order.cancelledBy === 'merchant'
    return (
      <StateScreen tone="error" icon={XCircle} title={order.stage === 'rejected' ? 'اعتذر المتجر عن تنفيذ الطلب' : byMerchant ? 'ألغى المتجر هذا الطلب' : 'تم إلغاء هذا الطلب'} description={byMerchant ? 'لم يتم خصم أي مبالغ، وإن كنت قد حوّلت مبلغاً فسيُعاد إليك. يمكنك إعادة الطلب من متجر آخر.' : 'لم يتم خصم أي مبالغ. يمكنك إعادة الطلب من متجر آخر.'} primary={{ label: 'العودة للطلبات', onClick: () => navigate('orders', {}, { resetTo: true }) }}>
        <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['الحالة:', order.stage === 'rejected' ? 'مرفوض من المتجر' : byMerchant ? 'ملغي من المتجر' : 'ملغي بطلبك', 'text-danger-700'], ...(order.cancelReason ? [['سبب الإلغاء:', order.cancelReason]] : []), ...(byMerchant && order.cancelledFrom && order.cancelledFrom !== 'new' ? [['أُلغي بعد مرحلة:', order.cancelledFrom === 'preparing' ? 'قيد التجهيز' : 'في الطريق']] : [])]} />
      </StateScreen>
    )
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="تتبع الشحنة المباشر" subtitle={<span>رقم الطلب: <span className="font-bold text-ink-800 tabular" dir="ltr">{order.id}</span></span>} right={<StageChip stage={order.stage} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        {idx >= STAGE_INDEX.out ? (
          <div className="card p-3 flex items-center gap-3 animate-slide-up">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-ink-100 shrink-0"><img src={COURIER.avatar} alt="" className="w-full h-full object-cover" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-ink-900">{COURIER.name}</p>
              <p className="text-[10px] text-ink-500 flex items-center gap-1"><Bike size={11} /> {COURIER.vehicle}</p>
              <p className="text-[10px] font-bold text-success-700">● مندوب توصيل معتمد</p>
            </div>
            <button onClick={() => showToast('جارٍ الاتصال بالكابتن...')} className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center"><Phone size={16} /></button>
            <button onClick={() => showToast('فتح المحادثة...')} className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center"><MessageCircle size={16} /></button>
          </div>
        ) : (
          <div className="card p-3 flex items-center gap-3 bg-primary-50/60 border-primary-100">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0"><Clock size={18} /></div>
            <div className="text-[11px] font-medium text-ink-700 leading-relaxed">{order.stage === 'new' && order.paymentStatus === 'pending_confirmation' ? 'إيصال التحويل وصل إلى التاجر — بمجرد تأكيده استلام المبلغ يبدأ التجهيز مباشرة.' : order.stage === 'new' ? 'طلبك بانتظار قبول المتجر وبدء التجهيز.' : `${store.name} يجهّز طلبك الآن — سيظهر الكابتن عند خروج الطلب للتوصيل (خلال ${store.deliveryTime}).`}</div>
          </div>
        )}

        <div className="card p-4">
          <p className="text-[13px] font-extrabold text-ink-900 mb-4">مراحل مسار الشحنة</p>
          <ol className="relative">
            {ORDER_STAGES.map((s, i) => {
              const done = i < idx
              const cur = i === idx
              return (
                <li key={s.key} className="flex gap-3 pb-6 last:pb-0 relative">
                  {i < ORDER_STAGES.length - 1 && <span className={`absolute right-[13px] top-7 bottom-0 w-0.5 ${done ? 'bg-primary' : 'bg-ink-200'}`} />}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-[11px] font-bold ${done ? 'bg-primary text-white' : cur ? 'bg-secondary text-white ring-4 ring-secondary-100 animate-pulse' : 'bg-ink-100 text-ink-400'}`}>
                    {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center justify-between">
                      <p className={`text-[13px] font-extrabold ${cur ? 'text-secondary' : done ? 'text-ink-900' : 'text-ink-400'}`}>{s.label}</p>
                      <span className="text-[10px] font-bold text-ink-400 tabular">{i <= idx ? times[i] : i === idx + 1 ? 'المتوقع قريباً' : ''}</span>
                    </div>
                    <p className={`text-[11px] font-medium ${i <= idx ? 'text-ink-500' : 'text-ink-300'}`}>{s.key === 'out' ? `مندوب التوصيل في طريقه إلى عنوانك` : s.desc}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2">
        <button onClick={() => navigate('orderDetails', { orderId: order.id })} className="w-full btn-outline btn-lg"><ReceiptText size={18} /> عرض تفاصيل الفاتورة</button>
      </div>
      <HomeIndicator />
    </div>
  )
}
