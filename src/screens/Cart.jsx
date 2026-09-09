import React, { useState } from 'react'
import { ShoppingBag, Trash2, Tag, X, Check, ChevronLeft, MapPin, Banknote, Wallet, CreditCard, AlertTriangle, PackageX, RefreshCcw, Truck, Bike, MessageCircle, Phone, ReceiptText, Download, Package, Clock, XCircle, ArrowRight } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, BottomNav, Price, Chip, ProductThumb, Stepper, StateScreen, KeyValue, StageChip, Logo } from '../components/ui'
import { COUPONS, COURIER, CURRENCY, ORDER_STAGES, STAGE_INDEX, fmt, productById, storeById, CITY } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  سلة المشتريات (CUS-026) — كل الأرقام محسوبة من computeCart
// ─────────────────────────────────────────────────────────────
export function CartScreen() {
  const { cart, state, dispatch, navigate, showToast, switchTab, canGoBack } = useApp()
  const [code, setCode] = useState(state.coupon || '')
  const [couponError, setCouponError] = useState('')

  const applyCoupon = () => {
    const c = code.trim().toUpperCase()
    if (!c) return
    if (!COUPONS[c]) {
      setCouponError('كود الكوبون غير صالح أو منتهي الصلاحية')
      return
    }
    setCouponError('')
    dispatch({ type: 'APPLY_COUPON', code: c })
    showToast(`تم تطبيق الكوبون: ${COUPONS[c].label}`, 'success')
  }

  if (!cart.lines.length) {
    return (
      <div className="flex-1 flex flex-col bg-ink-50 relative">
        <StatusBar />
        <TopBar title="سلة المشتريات" right={<ShoppingBag className="text-primary" size={22} />} />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pb-10">
          <div className="w-24 h-24 rounded-3xl bg-ink-100 text-ink-400 flex items-center justify-center mb-5"><ShoppingBag size={40} strokeWidth={1.6} /></div>
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

  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="سلة المشتريات" subtitle={`${cart.itemCount} عناصر مضافة`} right={<ShoppingBag className="text-primary" size={22} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        <div className="space-y-2.5">
          {cart.lines.map(({ product, qty, lineTotal }) => (
            <div key={product.id} className="card p-3 flex items-center gap-3 animate-fade-in">
              <ProductThumb product={product} className="w-16 h-16" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-ink-900 line-clamp-2 leading-snug">{product.shortName}</p>
                <p className="text-[10px] text-ink-400 mt-0.5">{fmt(product.price)} {CURRENCY} × {qty}</p>
                <div className="flex items-center justify-between mt-2">
                  <Stepper size="sm" value={qty} max={product.stock} onChange={(v) => dispatch({ type: 'SET_QTY', productId: product.id, qty: v })} />
                  <Price value={lineTotal} size="sm" />
                </div>
              </div>
              <button onClick={() => { dispatch({ type: 'REMOVE_FROM_CART', productId: product.id }); showToast('تم حذف المنتج من السلة') }} className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-danger hover:bg-danger-50 transition self-start" aria-label="حذف"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>

        {/* الكوبون */}
        <div className="card p-4">
          <p className="text-[13px] font-extrabold text-ink-900 mb-2 flex items-center gap-1.5"><Tag size={14} className="text-secondary" /> كوبون الخصم</p>
          {cart.coupon ? (
            <div className="flex items-center justify-between bg-success-50 border border-success-100 rounded-field px-3 h-11">
              <span className="text-[12px] font-bold text-success-700 flex items-center gap-1.5"><Check size={14} strokeWidth={3} /> {cart.couponCode} — {cart.coupon.label}</span>
              <button onClick={() => { dispatch({ type: 'REMOVE_COUPON' }); setCode('') }} className="text-ink-400 hover:text-danger" aria-label="إزالة"><X size={16} /></button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setCouponError('') }} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} placeholder="JADEED20" dir="ltr" className={`field text-left font-bold tracking-wider ${couponError ? 'field-error' : ''}`} />
                <button onClick={applyCoupon} className="btn-secondary btn-md shrink-0">تطبيق</button>
              </div>
              {couponError ? <p className="text-[11px] font-bold text-danger mt-2">{couponError}</p> : <p className="text-[10px] text-ink-400 mt-2">أكواد للتجربة: JADEED20 · WELCOME10 · FLAT2000</p>}
            </>
          )}
        </div>

        {/* الملخص — محسوب رياضيًا */}
        <div className="card p-4 space-y-2.5 text-[12px]">
          <Row k="المجموع الفرعي:" v={<Price value={cart.subtotal} size="xs" tone="ink" />} />
          <Row k="الخصم المطبق:" v={<span className="font-extrabold text-success-700 tabular">{cart.discount ? `- ${fmt(cart.discount)} ${CURRENCY}` : '—'}</span>} tone="text-success-700" />
          <Row k="رسوم التوصيل:" v={<span className="font-bold text-success-700">{cart.deliveryFee ? `${fmt(cart.deliveryFee)} ${CURRENCY}` : `مجاني (داخل ${CITY})`}</span>} />
          <div className="border-t border-dashed border-ink-200 pt-3 flex items-center justify-between">
            <span className="text-[14px] font-extrabold text-ink-900">المجموع الكلي:</span>
            <Price value={cart.total} size="md" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 bg-ink-50">
        <button onClick={() => navigate('checkout')} className="w-full btn-primary btn-lg">إتمام الطلب والدفع · {fmt(cart.total)} {CURRENCY}</button>
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
  { key: 'wallet', Icon: Wallet, label: 'محفظة جديد الرقمية', desc: 'الرصيد المتاح: 50 ر.ي' },
  { key: 'card', Icon: CreditCard, label: 'بطاقة بنكية', desc: 'قريباً' , disabled: true },
]

export function Checkout() {
  const { cart, currentAddress, navigate, dispatch, state } = useApp()
  const [pay, setPay] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const [simulateFail, setSimulateFail] = useState(false)
  const storeIds = [...new Set(cart.lines.map((l) => l.product.storeId))]

  const place = () => {
    setPlacing(true)
    setTimeout(() => {
      setPlacing(false)
      if (simulateFail) return navigate('orderFailed')
      const order = {
        storeId: storeIds[0],
        items: cart.lines.map((l) => ({ productId: l.product.id, qty: l.qty, price: l.product.price })),
        subtotal: cart.subtotal,
        discount: cart.discount,
        deliveryFee: cart.deliveryFee,
        total: cart.total,
        payment: PAYMENTS.find((p) => p.key === pay).label,
        addressId: state.addressId,
        coupon: cart.couponCode,
      }
      dispatch({ type: 'PLACE_ORDER', order })
      navigate('orderSuccess', { orderId: `JD-${state.orderCounter}` }, { resetTo: true })
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
          <p className="text-[11px] text-ink-500">{currentAddress.details} · <span dir="ltr">{currentAddress.phone}</span></p>
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
        </div>

        <div className="card p-4">
          <p className="text-[13px] font-extrabold text-ink-900 mb-2">ملخص الطلب ({cart.itemCount} قطعة من {storeIds.length} متجر)</p>
          <div className="space-y-1.5 text-[12px]">
            {cart.lines.map((l) => (
              <div key={l.product.id} className="flex items-center justify-between">
                <span className="text-ink-600 font-medium truncate flex-1">{l.product.shortName} <span className="text-ink-400">× {l.qty}</span></span>
                <span className="font-bold tabular">{fmt(l.lineTotal)}</span>
              </div>
            ))}
            <div className="border-t border-ink-100 pt-2 mt-2 space-y-1">
              <div className="flex justify-between text-ink-500"><span>المجموع الفرعي</span><span className="tabular">{fmt(cart.subtotal)}</span></div>
              {cart.discount > 0 && <div className="flex justify-between text-success-700 font-bold"><span>خصم ({cart.couponCode})</span><span className="tabular">- {fmt(cart.discount)}</span></div>}
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
          {placing ? 'جارٍ إرسال الطلب إلى المتجر...' : `تأكيد الطلب · ${fmt(cart.total)} ${CURRENCY}`}
        </button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function OrderSuccess() {
  const { current, navigate, switchTab, state } = useApp()
  const order = state.orders.find((o) => o.id === current.params.orderId) || state.orders[0]
  return (
    <StateScreen
      tone="info"
      icon={Check}
      code="CUS-031"
      showBack={false}
      title="تم إرسال طلبك بنجاح!"
      description={`وصل طلبك إلى ${storeById(order.storeId).name} وهو الآن بانتظار مراجعة وقبول التاجر.`}
      primary={{ label: 'تتبع حالة الطلب', onClick: () => navigate('tracking', { orderId: order.id }) }}
      secondary={{ label: 'العودة للرئيسية', onClick: () => switchTab('home') }}
    >
      <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['إجمالي الفاتورة:', `${fmt(order.total)} ${CURRENCY}`], ['طريقة الدفع:', order.payment, 'text-success-700'], ['الوقت المتوقع للتوصيل:', 'خلال 30 دقيقة', 'text-success-700']]} />
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
                  <StageChip stage={o.stage} />
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
  const canCancel = ['new', 'accepted'].includes(order.stage)
  const active = STAGE_INDEX[order.stage] !== undefined && order.stage !== 'delivered'
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="تفاصيل الفاتورة والطلب" code="CUS-038" />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-primary tabular" dir="ltr">{order.id}</span>
            <StageChip stage={order.stage} />
          </div>
          <h2 className="text-[15px] font-black text-ink-900 mt-2">{store.name}</h2>
          <p className="text-[11px] text-ink-400">{order.createdAt} · {order.payment}</p>
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
          <p className="text-[12px] font-bold text-ink-800">{address?.title}</p>
          <p className="text-[11px] text-ink-500">{address?.details}</p>
        </div>

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
  const times = ['10:30 ص', '10:45 ص', '11:15 ص', '12:10 م', '12:40 م', 'المتوقع قريباً']
  if (order.stage === 'delivered') {
    return (
      <StateScreen tone="success" icon={Check} code="CUS-035" title="تم استلام الطلب وتوصيله!" description="نتمنى أن تكون تجربتك مع جديد رائعة ومريحة." primary={{ label: 'العودة للرئيسية', onClick: () => navigate('home', {}, { resetTo: true }) }} secondary={{ label: 'تقييم التجربة', onClick: () => showToast('شكراً لتقييمك!', 'success') }}>
        <KeyValue rows={[['رقم الطلب:', order.id, 'text-primary'], ['المتجر:', store.name], ['المبلغ المدفوع:', `${fmt(order.total)} ${CURRENCY}`, 'text-success-700']]} />
      </StateScreen>
    )
  }
  if (['cancelled', 'rejected'].includes(order.stage)) {
    return <StateScreen tone="error" icon={XCircle} title={order.stage === 'cancelled' ? 'تم إلغاء هذا الطلب' : 'اعتذر المتجر عن تنفيذ الطلب'} description="لم يتم خصم أي مبالغ. يمكنك إعادة الطلب من متجر آخر." primary={{ label: 'العودة للطلبات', onClick: () => navigate('orders', {}, { resetTo: true }) }} />
  }
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="تتبع الشحنة المباشر" subtitle={<span>رقم الطلب: <span className="font-bold text-ink-800 tabular" dir="ltr">{order.id}</span></span>} right={<StageChip stage={order.stage} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        {idx >= STAGE_INDEX.ready ? (
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
            <div className="text-[11px] font-medium text-ink-700 leading-relaxed">المتجر يعالج طلبك الآن — تتحدث الحالة تلقائياً (أو فوراً من لوحة التاجر). سيظهر الكابتن عند جاهزية الطلب.</div>
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
