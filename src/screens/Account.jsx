import React, { useState } from 'react'
import { ChevronLeft, MapPin, ReceiptText, Heart, Bell, Shield, HelpCircle, Store, LogOut, Truck, Tag, Wallet, ShieldCheck, LayoutDashboard, LogIn, UserPlus, FileText, Lock, Landmark, Phone, Package, BadgeCheck, UserRound, ShoppingBag, Clock, Ban } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, BottomNav, TopBar, Modal } from '../components/ui'
import { NOTIFICATIONS, USER, fmt, CURRENCY } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  الملف الشخصي وإدارة الحساب
// ─────────────────────────────────────────────────────────────
export function Account() {
  const { navigate, dispatch, state, switchTab, current, isMerchant, merchantStore } = useApp()
  const merchantMode = !!current.params?.merchant
  const guest = state.auth.status !== 'authenticated'
  const merchant = state.merchantStatus
  const accountType = state.auth.accountType
  const store = isMerchant ? merchantStore : null

  // ── الزائر: تصفح كزائر — زر دخول/إنشاء حساب + كل الخيارات ظاهرة (الإضافة للسلة والطلبات تتطلب حساباً)
  if (guest) {
    const guestItems = [
      { Icon: MapPin, label: 'موقع التوصيل', to: 'addresses' },
      { Icon: ReceiptText, label: 'سجل الطلبات', tab: 'orders', gated: true },
      { Icon: Heart, label: 'قائمة المفضلة', tab: 'favorites', gated: true },
      { Icon: HelpCircle, label: 'المساعدة والدعم الفني', to: 'support' },
    ]
    const guestLegal = [
      { Icon: FileText, label: 'شروط الاستخدام', to: 'legal', params: { doc: 'terms' } },
      { Icon: Lock, label: 'سياسة الخصوصية', to: 'legal', params: { doc: 'privacy' } },
    ]
    const handleGuestNav = (it) => {
      if (it.gated) {
        dispatch({ type: 'AUTH_GATE', returnTo: { name: it.tab } })
        navigate('login', { gated: true })
      } else if (it.tab) switchTab(it.tab)
      else navigate(it.to, it.params)
    }
    return (
      <div className="flex-1 flex flex-col bg-ink-50 relative">
        <StatusBar />
        <div className="bg-white border-b border-ink-100 px-4 pb-3">
          <h1 className="text-[18px] font-extrabold text-ink-900">حسابي</h1>
          <p className="text-[11px] text-ink-500 font-medium">أنت تتصفح كزائر — سجّل الدخول للاستفادة من السلة والطلبات والمفضلة</p>
        </div>
        <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-3">
          <div className="card p-4 bg-gradient-to-l from-primary-50 to-white border-primary-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0"><UserRound size={22} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-extrabold text-ink-900">مرحباً بك في جديد</p>
                <p className="text-[11px] text-ink-500 leading-relaxed">سجّل الدخول أو أنشئ حساباً كعميل للشراء والمتابعة</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button onClick={() => navigate('login')} className="btn-primary btn-sm"><LogIn size={15} /> تسجيل الدخول</button>
              <button onClick={() => navigate('register')} className="btn-outline btn-sm"><UserPlus size={15} /> إنشاء حساب</button>
            </div>
          </div>
          <div className="card divide-y divide-ink-100">
            {guestItems.map(({ Icon, label, gated }) => (
              <button key={label} onClick={() => handleGuestNav({ label, ...guestItems.find((x) => x.label === label) })} className="w-full flex items-center gap-3 px-4 h-[52px] text-right hover:bg-ink-50 transition">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center"><Icon size={18} strokeWidth={2} /></div>
                <span className="flex-1 text-[13px] font-bold text-ink-800">{label}</span>
                {gated && <span className="text-[10px] font-bold text-secondary bg-secondary-50 rounded-full px-2 h-5 flex items-center">يتطلب دخولاً</span>}
                <ChevronLeft size={16} className="text-ink-300" />
              </button>
            ))}
          </div>
          <div className="card divide-y divide-ink-100">
            {guestLegal.map(({ Icon, label, to, params }) => (
              <button key={label} onClick={() => navigate(to, params)} className="w-full flex items-center gap-3 px-4 h-[48px] text-right hover:bg-ink-50 transition">
                <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-500 flex items-center justify-center"><Icon size={17} /></div>
                <span className="flex-1 text-[12px] font-bold text-ink-700">{label}</span>
                <ChevronLeft size={16} className="text-ink-300" />
              </button>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    )
  }

  const items = [
    { Icon: MapPin, label: 'موقع التوصيل', to: 'addresses' },
    { Icon: ReceiptText, label: 'سجل الطلبات', tab: 'orders' },
    { Icon: Heart, label: 'قائمة المفضلة', tab: 'favorites' },
    { Icon: HelpCircle, label: 'المساعدة والدعم الفني', to: 'support' },
  ]
  const legal = [
    { Icon: FileText, label: 'شروط الاستخدام', to: 'legal', params: { doc: 'terms' } },
    { Icon: Lock, label: 'سياسة الخصوصية', to: 'legal', params: { doc: 'privacy' } },
  ]
  return (
    <div className="flex-1 flex flex-col bg-ink-50 relative">
      <div className="bg-gradient-to-l from-primary to-primary-400 text-white rounded-b-[28px] relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
        <StatusBar light />
        <div className="px-5 pb-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/30 bg-white/20 shrink-0">
            <img src={USER.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-extrabold truncate">{USER.name}</h1>
            <p className="text-[12px] text-white/85">{USER.area}، {USER.city} · <span dir="ltr" className="tabular">{USER.phone}</span></p>
            <p className="text-[11px] font-bold text-warning flex items-center gap-1 mt-0.5"><ShieldCheck size={12} /> {isMerchant ? 'حساب تاجر معتمد' : merchant === 'banned' ? 'حساب تاجر — المتجر محظور' : 'حساب عميل'} · {USER.city}، اليمن</p>
          </div>
          <span className="shrink-0 h-7 px-2.5 rounded-full bg-white/15 text-[10px] font-extrabold flex items-center gap-1">{isMerchant ? <><Store size={12} /> تاجر</> : <><UserRound size={12} /> عميل</>}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 pb-28 space-y-3">
        {isMerchant && store ? (
          <>
            {/* ── بيانات المتجر للتاجر المعتمد: الاسم، صاحب المتجر، الحساب المرتبط، التواصل، التوصيل، الدفع ── */}
            {/* التبديل بين واجهة التاجر وواجهة التسوق دون تسجيل خروج */}
            {merchantMode ? (
              <button onClick={() => switchTab('home')} className="w-full rounded-card bg-secondary text-white p-4 flex items-center gap-3 text-right shadow-accent active:scale-[0.99] transition">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><ShoppingBag size={22} /></div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold">الانتقال إلى واجهة التسوق</p>
                  <p className="text-[11px] text-white/85">تسوّق كعميل بنفس الحساب — تعود للوحة التاجر متى شئت</p>
                </div>
                <ChevronLeft size={18} />
              </button>
            ) : (
              <button onClick={() => switchTab('m-dashboard')} className="w-full rounded-card bg-primary text-white p-4 flex items-center gap-3 text-right shadow-brand active:scale-[0.99] transition">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><LayoutDashboard size={22} /></div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold">لوحة تحكم المتجر</p>
                  <p className="text-[11px] text-white/80">إدارة المنتجات والطلبات والمبيعات</p>
                </div>
                <ChevronLeft size={18} />
              </button>
            )}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-extrabold text-ink-900 flex items-center gap-1.5"><Store size={14} className="text-primary" /> بيانات متجري</p>
                <button onClick={() => navigate('m-store-edit')} className="link text-secondary">تعديل</button>
              </div>
              <div className="divide-y divide-ink-100 text-[12px]">
                {[
                  [BadgeCheck, 'اسم المتجر', store.name],
                  [UserRound, 'صاحب المتجر', store.owner],
                  [ShieldCheck, 'الحساب المرتبط', state.auth.email || USER.email, true],
                  [Phone, 'رقم التواصل', store.phone, true],
                  [Truck, 'وقت التوصيل المتوقع', store.deliveryTime],
                  [MapPin, 'الموقع', `${store.location?.label || store.area}، ${store.city}`],
                  [Landmark, 'حساب استلام المدفوعات', `${store.payment.bank} · ${store.payment.account}`, true],
                ].map(([Icon, k, v, ltr]) => (
                  <div key={k} className="flex items-center gap-2.5 py-2">
                    <Icon size={14} className="text-ink-400 shrink-0" />
                    <span className="text-ink-500 font-medium shrink-0">{k}</span>
                    <span className={`flex-1 font-bold text-ink-900 truncate text-left ${ltr ? 'tabular' : ''}`} dir={ltr ? 'ltr' : undefined}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : merchant === 'banned' ? (
          <button onClick={() => navigate('merchantBanned')} className="w-full rounded-card bg-danger-50 border-2 border-danger-100 p-4 flex items-center gap-3 text-right active:scale-[0.99] transition">
            <div className="w-11 h-11 rounded-xl bg-danger text-white flex items-center justify-center"><Ban size={22} /></div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-danger">متجرك محظور من قِبل الإدارة</p>
              <p className="text-[11px] text-ink-600">اضغط لعرض سبب الحظر وتقديم اعتراض</p>
            </div>
            <ChevronLeft size={18} className="text-danger" />
          </button>
        ) : (
          <button onClick={() => navigate(merchant === 'pending' ? 'merchantPending' : merchant === 'rejected' ? 'merchantRejected' : 'merchantIntro')} className={`w-full rounded-card bg-white border-2 p-4 flex items-center gap-3 text-right active:scale-[0.99] transition ${merchant === 'pending' ? 'border-warning' : merchant === 'rejected' ? 'border-danger' : 'border-secondary'}`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${merchant === 'pending' ? 'bg-warning-50 text-warning' : merchant === 'rejected' ? 'bg-danger-50 text-danger' : 'bg-secondary-50 text-secondary'}`}>{merchant === 'pending' ? <Clock size={22} /> : <Store size={22} />}</div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-ink-900 flex items-center gap-2">{merchant === 'pending' ? 'طلب متجرك قيد المراجعة' : merchant === 'rejected' ? 'تم رفض طلب المتجر' : 'انضم كتاجر وافتح متجرك'}{merchant === 'pending' && <span className="chip bg-warning-50 text-warning-700 !h-5 !text-[10px]">قيد المراجعة</span>}{merchant === 'rejected' && <span className="chip bg-danger-50 text-danger-700 !h-5 !text-[10px]">مرفوض</span>}</p>
              <p className="text-[11px] text-ink-500">{merchant === 'pending' ? 'سيُفعَّل حساب التاجر فور الاعتماد' : merchant === 'rejected' ? 'اضغط لعرض السبب وإعادة التقديم' : 'حسابك الحالي حساب عميل — يتحول إلى حساب تاجر بعد اعتماد طلب المتجر'}</p>
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

        <div className="card divide-y divide-ink-100">
          {legal.map(({ Icon, label, to, params }) => (
            <button key={label} onClick={() => navigate(to, params)} className="w-full flex items-center gap-3 px-4 h-[48px] text-right hover:bg-ink-50 transition first:rounded-t-card last:rounded-b-card">
              <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-500 flex items-center justify-center"><Icon size={17} strokeWidth={2} /></div>
              <span className="flex-1 text-[12px] font-bold text-ink-700">{label}</span>
              <ChevronLeft size={16} className="text-ink-300" />
            </button>
          ))}
        </div>

        <LogoutButton />
        <p className="text-center text-[10px] text-ink-400">جديد v1.0.0 — نموذج أولي تفاعلي</p>
      </div>
      <BottomNav variant={merchantMode ? 'merchant' : 'customer'} />
    </div>
  )
}

function LogoutButton() {
  const { dispatch } = useApp()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full card px-4 h-[52px] flex items-center gap-3 text-right text-danger hover:bg-danger-50 transition">
        <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center justify-center"><LogOut size={18} /></div>
        <span className="flex-1 text-[13px] font-bold">تسجيل الخروج</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-[18px] font-extrabold text-center">تأكيد تسجيل الخروج</h2>
        <p className="text-[12px] text-ink-500 text-center mt-1 leading-relaxed">هل تريد فعلاً تسجيل الخروج؟ ستبقى قادراً على التصفح كزائر، لكن المفضلة والطلبات تتطلب الدخول مجدداً.</p>
        <div className="flex gap-2 mt-5">
          <button onClick={() => { setOpen(false); dispatch({ type: 'LOGOUT' }) }} className="flex-1 btn-danger btn-md">تأكيد الخروج</button>
          <button onClick={() => setOpen(false)} className="flex-1 btn-ghost btn-md">إلغاء</button>
        </div>
      </Modal>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
//  شروط الاستخدام / سياسة الخصوصية (Legal)
// ─────────────────────────────────────────────────────────────
const LEGAL = {
  terms: {
    title: 'شروط الاستخدام',
    updated: '1 سبتمبر 2026',
    intro: 'باستخدامك تطبيق «جديد» فإنك توافق على الشروط التالية التي تنظم العلاقة بين المنصة والعملاء والتجار.',
    sections: [
      ['1. الحسابات', 'يجب أن تكون بيانات الحساب صحيحة ومحدّثة. أنت مسؤول عن سرية بيانات الدخول ورمز التحقق (OTP) وكل نشاط يتم عبر حسابك.'],
      ['2. حساب العميل وحساب التاجر', 'حساب العميل يتيح التصفح والشراء والمتابعة. حساب التاجر يُفعَّل بعد اعتماد طلب إنشاء المتجر والتحقق من الهوية، ويُلزم التاجر بصحة بيانات متجره ومنتجاته وأسعاره وحساب استلام المدفوعات.'],
      ['3. الطلبات والدفع', 'يُنشأ طلب مستقل لكل متجر. عند الدفع بالتحويل يرفق العميل إيصال التحويل ويبدأ التجهيز بعد تأكيد التاجر استلام المبلغ. لا تتحمل المنصة مسؤولية تحويلات إلى حسابات غير المعروضة داخل التطبيق.'],
      ['4. الإلغاء والإرجاع', 'يمكن إلغاء الطلب مجاناً ما دام في حالة «جديد». بعد بدء التجهيز يخضع الإلغاء لسياسة المتجر.'],
      ['5. التوصيل', 'أوقات التوصيل المعروضة تقديرية ويحددها كل متجر. التوصيل داخل مدينة تعز مجاني حالياً.'],
      ['6. السلوك المحظور', 'يُحظر نشر منتجات مخالفة للقانون، أو التلاعب بالتقييمات، أو إساءة استخدام المنصة بأي شكل.'],
      ['7. التعديلات', 'قد نحدّث هذه الشروط من وقت لآخر وسيتم إشعارك داخل التطبيق بأي تغيير جوهري.'],
    ],
  },
  privacy: {
    title: 'سياسة الخصوصية',
    updated: '1 سبتمبر 2026',
    intro: 'نحترم خصوصيتك. توضح هذه السياسة ما نجمعه من بيانات وكيف نستخدمها ونحميها.',
    sections: [
      ['1. البيانات التي نجمعها', 'الاسم، رقم الجوال، البريد الإلكتروني، عناوين التوصيل، وسجل الطلبات. للتجار: بيانات المتجر ووثائق التحقق وحساب استلام المدفوعات.'],
      ['2. الموقع الجغرافي', 'نستخدم موقعك (بإذنك) لعرض المتاجر القريبة وتحديد عنوان التوصيل فقط، ويمكنك تعطيله من إعدادات الجهاز في أي وقت.'],
      ['3. كيف نستخدم البيانات', 'لتنفيذ الطلبات والتواصل بشأنها، وتحسين التجربة، وإرسال إشعارات حالة الطلب والعروض (يمكن إيقاف العروض).'],
      ['4. المشاركة مع الغير', 'نشارك مع المتجر بيانات التوصيل اللازمة لتنفيذ طلبك فقط، ومع مندوب التوصيل الاسم والعنوان ورقم التواصل. لا نبيع بياناتك لأي طرف ثالث.'],
      ['5. إيصالات التحويل', 'صور الإيصالات تُعرض للتاجر المعني فقط لغرض تأكيد الدفع وتُحفظ بشكل مشفّر.'],
      ['6. حقوقك', 'يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذف حسابك عبر «المساعدة والدعم الفني».'],
      ['7. الأمان', 'نستخدم التشفير أثناء النقل والتخزين، ورمز تحقق (OTP) للدخول، وتقييد المحاولات الخاطئة لحماية حسابك.'],
    ],
  },
}

export function Legal() {
  const { current, navigate } = useApp()
  const key = current.params?.doc === 'privacy' ? 'privacy' : 'terms'
  const doc = LEGAL[key]
  const other = key === 'terms' ? 'privacy' : 'terms'
  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={doc.title} subtitle={`آخر تحديث: ${doc.updated}`} right={key === 'terms' ? <FileText className="text-primary" size={22} /> : <Lock className="text-primary" size={22} />} />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-3">
        <p className="text-[12px] font-medium text-ink-600 leading-relaxed">{doc.intro}</p>
        {doc.sections.map(([h, b]) => (
          <div key={h} className="card p-4">
            <p className="text-[13px] font-extrabold text-ink-900">{h}</p>
            <p className="text-[11px] font-medium text-ink-500 leading-relaxed mt-1">{b}</p>
          </div>
        ))}
        <button onClick={() => navigate('legal', { doc: other }, { replace: true })} className="w-full btn-outline btn-md">{key === 'terms' ? 'عرض سياسة الخصوصية' : 'عرض شروط الاستخدام'}</button>
        <p className="text-center text-[10px] text-ink-400 pb-2">للاستفسار: legal@jadeed.ye</p>
      </div>
      <HomeIndicator />
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
