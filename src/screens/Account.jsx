import React from 'react'
import { ChevronLeft, MapPin, ReceiptText, Heart, Bell, Shield, HelpCircle, Store, LogOut, Truck, Tag, Wallet, ShieldCheck, LayoutDashboard } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, BottomNav, TopBar } from '../components/ui'
import { NOTIFICATIONS, USER } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  الملف الشخصي وإدارة الحساب
// ─────────────────────────────────────────────────────────────
export function Account() {
  const { navigate, dispatch, state, switchTab, current } = useApp()
  const merchantMode = !!current.params?.merchant
  const guest = state.auth.status !== 'authenticated'
  const merchant = state.merchantStatus
  const items = [
    { Icon: MapPin, label: 'عناويني المحفوظة', to: 'addresses' },
    { Icon: ReceiptText, label: 'سجل الطلبات', tab: 'orders' },
    { Icon: Heart, label: 'قائمة المفضلة', tab: 'favorites' },
    { Icon: Bell, label: 'مركز التنبيهات', to: 'notifications' },
    { Icon: Shield, label: 'بوابة إدارة المنصة (Admin Web)', to: 'adminLogin' },
    { Icon: HelpCircle, label: 'المساعدة والدعم الفني', to: 'support' },
  ]
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <div className="bg-gradient-to-l from-primary to-primary-400 text-white rounded-b-[28px] relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
        <StatusBar light />
        <div className="px-5 pb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/30 bg-white/20 shrink-0">
            {guest ? <div className="w-full h-full flex items-center justify-center text-[22px] font-black">ز</div> : <img src={USER.avatar} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-extrabold truncate">{guest ? 'زائر' : USER.name}</h1>
            {guest ? (
              <button onClick={() => navigate('login', {}, { resetTo: true })} className="text-[12px] font-bold underline underline-offset-4 text-white/90">سجّل الدخول للاستفادة من كل المزايا</button>
            ) : (
              <>
                <p className="text-[12px] text-white/85">{USER.area}، {USER.city} · <span dir="ltr" className="tabular">{USER.phone}</span></p>
                <p className="text-[11px] font-bold text-warning flex items-center gap-1 mt-0.5"><ShieldCheck size={12} /> عضو معتمد · {USER.city}، اليمن</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-3">
        {merchant === 'approved' ? (
          <button onClick={() => switchTab('m-dashboard')} className="w-full rounded-card bg-primary text-white p-4 flex items-center gap-3 text-right shadow-brand active:scale-[0.99] transition">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><LayoutDashboard size={22} /></div>
            <div className="flex-1">
              <p className="text-[14px] font-bold">لوحة تحكم المتجر</p>
              <p className="text-[11px] text-white/80">إدارة المنتجات والطلبات والمبيعات</p>
            </div>
            <ChevronLeft size={18} />
          </button>
        ) : (
          <button onClick={() => navigate(merchant === 'pending' ? 'merchantPending' : merchant === 'rejected' ? 'merchantRejected' : 'merchantIntro')} className="w-full rounded-card bg-white border-2 border-secondary p-4 flex items-center gap-3 text-right active:scale-[0.99] transition">
            <div className="w-11 h-11 rounded-xl bg-secondary-50 text-secondary flex items-center justify-center"><Store size={22} /></div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink-900">انضم كتاجر وافتح متجرك</p>
              <p className="text-[11px] text-ink-500">{merchant === 'pending' ? 'طلبك قيد المراجعة حالياً' : merchant === 'rejected' ? 'تم رفض طلبك — اضغط لعرض السبب' : `اعرض منتجاتك واستقبل الطلبات في ${USER.city}`}</p>
            </div>
            <ChevronLeft size={18} className="text-ink-400" />
          </button>
        )}

        <div className="card divide-y divide-ink-100">
          {items.map(({ Icon, label, to, tab }) => (
            <button key={label} onClick={() => (tab ? switchTab(tab) : navigate(to))} className="w-full flex items-center gap-3 px-4 h-[52px] text-right hover:bg-ink-50 transition first:rounded-t-card last:rounded-b-card">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center"><Icon size={18} strokeWidth={2} /></div>
              <span className="flex-1 text-[13px] font-bold text-ink-800">{label}</span>
              <ChevronLeft size={16} className="text-ink-300" />
            </button>
          ))}
        </div>

        <button onClick={() => dispatch({ type: 'LOGOUT' })} className="w-full card px-4 h-[52px] flex items-center gap-3 text-right text-danger hover:bg-danger-50 transition">
          <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center justify-center"><LogOut size={18} /></div>
          <span className="flex-1 text-[13px] font-bold">{guest ? 'تسجيل الدخول' : 'تسجيل الخروج'}</span>
        </button>
        <p className="text-center text-[10px] text-ink-400">جديد v1.0.0 — نموذج أولي تفاعلي</p>
      </div>
      <BottomNav variant={merchantMode ? 'merchant' : 'customer'} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  مركز التنبيهات
// ─────────────────────────────────────────────────────────────
const ICONS = { truck: Truck, tag: Tag, wallet: Wallet }
export function Notifications() {
  const { dispatch, navigate, state } = useApp()
  React.useEffect(() => {
    dispatch({ type: 'MARK_NOTIFICATIONS_SEEN' })
  }, [dispatch])
  const tones = { primary: 'bg-primary text-white', secondary: 'bg-secondary text-white', warning: 'bg-warning text-white' }
  const latest = state.orders.find((o) => !['delivered', 'cancelled', 'rejected'].includes(o.stage))
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="مركز التنبيهات" subtitle="آخر التحديثات والعروض لطلبك" right={<Bell className="text-primary" size={22} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-2.5">
        {NOTIFICATIONS.map((n) => {
          const Icon = ICONS[n.icon]
          return (
            <button key={n.id} onClick={() => n.icon === 'truck' && latest && navigate('tracking', { orderId: latest.id })} className="w-full card p-3.5 flex items-start gap-3 text-right">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[n.tone]}`}><Icon size={20} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-ink-900 truncate">{n.title}</p>
                  <span className="text-[10px] text-ink-400 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-[11px] text-ink-500 leading-relaxed mt-0.5">{n.icon === 'truck' && latest ? n.body.replace('JD-984210', latest.id) : n.body}</p>
              </div>
            </button>
          )
        })}
      </div>
      <HomeIndicator />
    </div>
  )
}

export function Support() {
  const { showToast } = useApp()
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title="المساعدة والدعم الفني" />
      <div className="flex-1 px-4 py-4 space-y-3">
        {[['كيف أتتبع طلبي؟', 'من تبويب "طلباتي" اختر الطلب ثم "تتبع المراحل".'], ['ما هي رسوم التوصيل؟', 'التوصيل مجاني داخل مدينة تعز لجميع الطلبات.'], ['كيف أستخدم كوبون الخصم؟', 'في السلة، أدخل الكود في خانة "كوبون الخصم" واضغط تطبيق.'], ['كيف أصبح تاجراً؟', 'من "حسابي" اضغط "انضم كتاجر" وأكمل بيانات التوثيق.']].map(([q, a]) => (
          <div key={q} className="card p-4">
            <p className="text-[13px] font-bold text-ink-900">{q}</p>
            <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">{a}</p>
          </div>
        ))}
        <button onClick={() => showToast('تم فتح محادثة مع فريق الدعم', 'primary')} className="w-full btn-primary btn-lg mt-2">تواصل مع الدعم الفني</button>
      </div>
      <HomeIndicator />
    </div>
  )
}
