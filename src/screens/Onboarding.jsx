import React, { useEffect, useRef, useState } from 'react'
import { ShoppingBag, Sparkles, Store, ChevronLeft, Check, ShieldCheck, User, Mail, Lock, Clock, KeyRound, AlertCircle, Loader2, Eye, EyeOff, LifeBuoy } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Logo, StatusBar, HomeIndicator, StateScreen, KeyValue, TopBar } from '../components/ui'
import { USER } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  Splash
// ─────────────────────────────────────────────────────────────
export function Splash() {
  const { navigate } = useApp()
  useEffect(() => {
    const t = setTimeout(() => navigate('onboarding', {}, { resetTo: true }), 1400)
    return () => clearTimeout(t)
  }, [navigate])
  return (
    <div className="flex-1 flex flex-col bg-primary text-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-secondary/40 blur-2xl" />
      <StatusBar light />
      <div className="flex-1 flex flex-col items-center justify-center animate-pop">
        <div className="bg-white rounded-[28px] shadow-modal px-7 py-6">
          <Logo size={72} />
        </div>
        <p className="text-[14px] font-bold text-white/90 mt-8">سوقك الذكي والشامل في مكان واحد</p>
      </div>
      <div className="flex justify-center pb-10">
        <Loader2 className="animate-spin text-white/70" size={22} />
      </div>
      <HomeIndicator light />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  Onboarding (3 شرائح)
// ─────────────────────────────────────────────────────────────
const SLIDES = [
  {
    Icon: ShoppingBag,
    title: ['اشتري أغراضك بكل', 'سهولة'],
    desc: 'تسوق آلاف المنتجات من المتاجر الموثوقة مع تجربة شراء سلسة وتوصيل فائق السرعة لباب منزلك.',
    theme: 'light',
    accent: 'primary',
  },
  {
    Icon: Sparkles,
    title: ['اكتشف أفضل العروض', 'الحصرية'],
    desc: 'تخفيضات يومية وقسائم ترحيبية فورية مع طرق دفع مرنة وآمنة تناسب احتياجاتك.',
    theme: 'light',
    accent: 'secondary',
  },
  {
    Icon: Store,
    title: ['سوقك الذكي والشامل', 'في مكان واحد'],
    desc: 'انضم الآن إلى جديد واستمتع بمستقبل التسوق الرقمي وتتبع شحناتك المباشرة.',
    theme: 'orange',
    accent: 'white',
  },
]

export function Onboarding() {
  const { navigate, current } = useApp()
  const [i, setI] = useState(Math.min(SLIDES.length - 1, Number(current.params?.slide) || 0))
  const s = SLIDES[i]
  const last = i === SLIDES.length - 1
  const orange = s.theme === 'orange'
  const finish = () => navigate('accountType', {}, { resetTo: true })
  return (
    <div className={`flex-1 flex flex-col transition-colors duration-500 ${orange ? 'bg-secondary text-white' : 'bg-white text-ink-900'}`}>
      <StatusBar light={orange} />
      <div className="px-5 pt-1 flex justify-start">
        <button onClick={finish} className={`h-8 px-4 rounded-full text-[13px] font-bold ${orange ? 'bg-white text-ink-900' : 'bg-ink-100 text-ink-900'}`}>
          تخطي
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8" key={i}>
        <div className="relative animate-pop">
          <div className={`absolute inset-0 -m-10 rounded-full ${orange ? 'bg-white/10' : s.accent === 'primary' ? 'bg-primary-50' : 'bg-secondary-50'}`} />
          <div className={`relative w-40 h-40 rounded-[36px] flex items-center justify-center shadow-modal ${orange ? 'bg-white/20 backdrop-blur' : s.accent === 'primary' ? 'bg-primary' : 'bg-secondary'}`}>
            <s.Icon size={72} strokeWidth={1.6} className="text-white" />
            <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-elevated ${orange ? 'bg-white text-secondary' : s.accent === 'primary' ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
              <Check size={20} strokeWidth={3} />
            </div>
            <div className={`absolute -bottom-3 -left-3 w-8 h-8 rounded-xl ${orange ? 'bg-primary' : s.accent === 'primary' ? 'bg-secondary' : 'bg-secondary-300'}`} />
          </div>
        </div>
      </div>
      <div className="px-7 pb-2 animate-slide-up" key={`t${i}`}>
        <h1 className="text-[30px] font-extrabold leading-tight">
          {s.title[0]} <span className={orange ? 'text-white' : s.accent === 'primary' ? 'text-primary' : 'text-secondary'}>{s.title[1]}</span>
        </h1>
        <p className={`text-[14px] font-medium leading-relaxed mt-3 ${orange ? 'text-white/90' : 'text-ink-500'}`}>{s.desc}</p>
      </div>
      <div className="px-7 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5" dir="rtl">
          {SLIDES.map((_, k) => (
            <button key={k} onClick={() => setI(k)} className={`h-2 rounded-full transition-all ${k === i ? (orange ? 'w-7 bg-white' : 'w-7 bg-primary') : orange ? 'w-2 bg-white/40' : 'w-2 bg-ink-200'}`} aria-label={`شريحة ${k + 1}`} />
          ))}
        </div>
        <button onClick={() => (last ? finish() : setI(i + 1))} className={`${orange ? 'btn bg-white text-secondary shadow-elevated' : 'btn-primary'} h-12 px-6 rounded-full text-[15px]`}>
          {last ? 'ابدأ الآن' : 'التالي'}
          <ChevronLeft size={18} strokeWidth={2.6} />
        </button>
      </div>
      <HomeIndicator light={orange} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تحديد نوع الحساب
// ─────────────────────────────────────────────────────────────
const TYPES = [
  { key: 'customer', Icon: ShoppingBag, title: 'متسوق (مشتري)', desc: 'استكشف آلاف المتاجر والمنتجات واطلب بكل سهولة لباب منزلك.' },
  { key: 'merchant', Icon: Store, title: 'تاجر (صاحب متجر)', desc: 'اعرض منتجاتك، استقبل طلبات العملاء، وضاعف مبيعاتك وأرباحك.' },
]
// نوع الحساب واحد فقط (عميل أو تاجر) — لا يمكن تسجيل المستخدم نفسه بالنوعين معاً

export function AccountType() {
  const { navigate, dispatch, state, switchTab } = useApp()
  const [sel, setSel] = useState(TYPES.some((t) => t.key === state.auth.accountType) ? state.auth.accountType : 'customer')
  const go = () => {
    dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: sel })
    navigate('login', {}, { resetTo: true })
  }
  // الزائر يستطيع تصفح المنتجات والمتاجر والعروض بلا تسجيل؛ الإضافة للسلة تتطلب حساب عميل (نافذة مطالبة عند المحاولة)
  const browseAsGuest = () => {
    dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: 'customer' })
    switchTab('home')
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <div className="px-6 pt-8">
        <h1 className="text-[28px] font-extrabold text-ink-900">
          مرحباً بك في <span className="text-primary">جديد</span>
        </h1>
        <p className="text-[12px] font-medium text-ink-500 mt-1">حدد نوع حسابك لنخصص لك أفضل تجربة تسوق وإدارة أعمال (نوع واحد لكل حساب):</p>
        <div className="space-y-3 mt-6">
          {TYPES.map(({ key, Icon, title, desc }) => {
            const active = sel === key
            return (
              <button key={key} onClick={() => setSel(key)} className={`w-full text-right rounded-card p-4 flex items-start gap-3 border transition-all ${active ? 'bg-secondary border-secondary text-white shadow-accent' : 'bg-white border-ink-200 text-ink-900 hover:border-ink-300'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white/20' : 'bg-ink-100 text-ink-500'}`}>
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-bold">{title}</div>
                  <div className={`text-[11px] font-medium leading-relaxed mt-0.5 ${active ? 'text-white/85' : 'text-ink-400'}`}>{desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${active ? 'bg-white border-white text-secondary' : 'border-ink-300'}`}>{active && <Check size={13} strokeWidth={3.5} />}</div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1" />
      <div className="px-6 pb-4">
        <button onClick={go} className="w-full btn-primary btn-lg">متابعة</button>
        <button onClick={browseAsGuest} className="w-full h-10 mt-2 text-[12px] font-bold text-ink-500">تصفح كزائر بدون تسجيل</button>
        <p className="text-center text-[10px] text-ink-400 mt-0.5">التصفح متاح للجميع — الإضافة للسلة والشراء يتطلبان حساب عميل</p>
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تسجيل الدخول (CUS-001) + تحقق صيغة البريد (CUS-002)
// ─────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^(\+?967)?7\d{8}$/

export function Login() {
  const { navigate, dispatch, current, back, canGoBack, state, switchTab } = useApp()
  const preset = current.params?.preset // 'invalid' → معاينة حالة CUS-002 مباشرة
  const gated = !!current.params?.gated || !!state.auth.returnTo
  const [email, setEmail] = useState(preset === 'invalid' ? 'user@invalid-mail' : '')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState(preset === 'invalid' ? 'البريد الإلكتروني المدخل غير صالح أو ناقص' : '')
  const [loading, setLoading] = useState(false)
  const finishLogin = () => {
    dispatch({ type: 'SET_EMAIL', email: email.trim() })
    dispatch({ type: 'LOGIN', welcome: true })
    const returnTo = state.auth.returnTo
    if (state.auth.accountType === 'merchant' && state.merchantStatus === 'banned') return navigate('merchantBanned', {}, { resetTo: true })
    if (returnTo?.name) {
      dispatch({ type: 'CLEAR_RETURN_TO' })
      return navigate(returnTo.name, returnTo.params || {}, { resetTo: true })
    }
    if (state.auth.accountType === 'merchant') return switchTab('m-dashboard')
    switchTab('home')
  }
  const submit = (e) => {
    e?.preventDefault()
    const v = email.trim()
    if (!v) return setError('يرجى إدخال البريد الإلكتروني')
    if (!EMAIL_RE.test(v)) return setError('البريد الإلكتروني المدخل غير صالح أو ناقص')
    if (password.length < 8) return setError('كلمة المرور 8 أحرف على الأقل')
    setError('')
    setLoading(true)
    setTimeout(() => { setLoading(false); finishLogin() }, 700)
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <div className="px-4 pt-1 flex items-center justify-between">
        <button onClick={() => (canGoBack ? back() : navigate('accountType', {}, { resetTo: true }))} className="icon-btn" aria-label="رجوع">
          <ChevronLeft size={18} className="rotate-180" strokeWidth={2.4} />
        </button>
      </div>
      <div className="flex flex-col items-center pt-6">
        <Logo size={64} />
      </div>
      <form onSubmit={submit} className="px-6 pt-8">
        {gated && (
          <div className="mb-4 rounded-card bg-primary-50 border border-primary-100 px-3 py-2.5 text-[11px] font-bold text-primary flex items-center gap-2"><Lock size={14} className="shrink-0" /> هذه الميزة تتطلب تسجيل الدخول — ستعود إلى ما كنت تفعله بعد الدخول.</div>
        )}
        <h1 className="text-[20px] font-extrabold text-ink-900">تسجيل الدخول بالبريد الإلكتروني</h1>
        <p className="text-[12px] font-medium text-ink-500 mt-1 leading-relaxed">أدخل بريدك وكلمة المرور للدخول. تأكيد الحساب الجديد يتم عبر رابط يُرسل إلى بريدك (بدون رمز OTP).</p>
        <label className="label mt-6">البريد الإلكتروني</label>
        <div className="relative">
          <input
            dir="ltr"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError('') }}
            placeholder="salem@example.com"
            className={`field text-left pl-11 ${error ? 'field-error' : ''}`}
            autoComplete="email"
            inputMode="email"
          />
          <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-danger' : 'text-ink-400'}`} />
        </div>
        <label className="label mt-4">كلمة المرور</label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            dir="ltr"
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
            placeholder="••••••••"
            className={`field text-left pl-11 ${error ? 'field-error' : ''}`}
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-label="إظهار كلمة المرور">
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error ? (
          <p className="flex items-center gap-1 text-[11px] font-bold text-danger mt-2">
            <AlertCircle size={13} /> {error}
          </p>
        ) : (
          <p className="text-[11px] font-medium text-ink-400 mt-2">للتجربة: أي بريد صحيح وكلمة مرور من 8 أحرف على الأقل</p>
        )}
        <div className="flex justify-end mt-2">
          <button type="button" onClick={() => navigate('forgotPassword', { email })} className="text-[12px] font-bold text-secondary">نسيت كلمة المرور؟ الاستعادة عبر البريد</button>
        </div>
        <button type="submit" disabled={loading} className="w-full btn-primary btn-lg mt-6">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'تسجيل الدخول'}
        </button>
      </form>
      <div className="flex-1" />
      <p className="text-center text-[12px] font-medium text-ink-500 pb-5">
        ليس لديك حساب؟{' '}
        <button onClick={() => navigate('register')} className="font-bold text-secondary">إنشاء حساب جديد</button>
      </p>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  تم إرسال رابط التحقق — محاكاة تدفق Supabase (signUp → email confirm link)
// ─────────────────────────────────────────────────────────────
export function VerifyLinkSent() {
  const { navigate, dispatch, state, current } = useApp()
  const email = current.params?.email || state.auth.email || USER.email
  const name = current.params?.name || USER.name
  const purpose = current.params?.purpose || 'verify' // verify | reset
  const openLink = () => {
    if (purpose === 'reset') return navigate('resetPassword', { email }, { replace: true })
    dispatch({ type: 'SET_EMAIL', email })
    dispatch({ type: 'LOGIN' })
    navigate('registerSuccess', { name }, { resetTo: true })
  }
  const title = purpose === 'reset' ? 'تم إرسال رابط استعادة كلمة المرور' : 'تم إرسال رابط التحقق'
  const desc = purpose === 'reset'
    ? 'افتح الرابط المرسل إلى بريدك لتعيين كلمة مرور جديدة. لا نستخدم رمز OTP.'
    : 'افتح الرابط المرسل إلى بريدك لتأكيد الحساب والدخول مباشرة. لا نستخدم رمز OTP.'
  return (
    <StateScreen
      tone="success"
      icon={Mail}
      title={title}
      description={desc}
      primary={{ label: purpose === 'reset' ? 'فتح رابط الاستعادة (تجريبي)' : 'فتح رابط التحقق (تجريبي)', onClick: openLink }}
      secondary={{ label: 'العودة لتسجيل الدخول', onClick: () => navigate('login', {}, { resetTo: true }) }}
    >
      <div className="inline-block bg-primary-50 text-primary text-[12px] font-bold rounded-full px-4 py-1.5 mb-4" dir="ltr">{email}</div>
      <div className="card p-4 text-right">
        <div className="flex items-center gap-2 text-[12px] font-bold text-ink-900">
          <Clock size={14} className="text-primary" /> صلاحية الرابط: 24 ساعة
        </div>
        <p className="text-[11px] font-medium text-ink-400 leading-relaxed mt-1">إذا لم تجد الرسالة في صندوق الوارد، راجع مجلد الرسائل غير المرغوب فيها (Spam). الزر أعلاه يحاكي فتح الرابط في النموذج.</p>
      </div>
    </StateScreen>
  )
}

export function LoginSuccess() {
  const { switchTab, navigate, state, dispatch, isMerchant, isBanned } = useApp()
  const [sec, setSec] = useState(5)
  const returnTo = state.auth.returnTo
  const bannedMerchant = isBanned && state.auth.accountType === 'merchant'
  const proceed = () => {
    dispatch({ type: 'CLEAR_RETURN_TO' })
    dispatch({ type: 'WELCOME_CLOSE' })
    if (bannedMerchant) return navigate('merchantBanned', {}, { resetTo: true })
    if (returnTo?.name) return navigate(returnTo.name, returnTo.params || {}, { resetTo: true })
    if (isMerchant && state.auth.accountType === 'merchant') return switchTab('m-dashboard')
    switchTab('home')
  }
  useEffect(() => {
    const t = setInterval(() => setSec((n) => n - 1), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => { if (sec <= 0) proceed() }, [sec])
  return (
    <div className="flex-1 flex flex-col bg-ink-100 relative">
      <StatusBar />
      <div className="absolute inset-0 bg-ink-900/55 backdrop-blur-[3px]" />
      <div className="relative flex-1 flex items-center justify-center px-6">
        <div className="w-full bg-white rounded-modal shadow-modal p-6 text-center animate-pop">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto"><Check size={28} strokeWidth={2.6} /></div>
          <h2 className="text-[18px] font-extrabold text-ink-900 mt-3">أهلاً بك مجدداً في جديد</h2>
          <p className="text-[12px] text-ink-500 mt-1">تم تسجيل دخولك بنجاح. يُغلق هذا الإشعار تلقائياً خلال {Math.max(0, sec)} ث.</p>
          <button onClick={proceed} className="w-full btn-primary btn-lg mt-5">الذهاب للتسوق</button>
        </div>
      </div>
    </div>
  )
}

export function ForgotPassword() {
  const { navigate, back, dispatch, current } = useApp()
  const [value, setValue] = useState(current.params?.email || current.params?.value || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = (e) => {
    e?.preventDefault()
    const v = value.trim()
    if (!EMAIL_RE.test(v)) return setError('أدخل بريداً إلكترونياً صحيحاً')
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      dispatch({ type: 'SET_EMAIL', email: v })
      navigate('verifyLinkSent', { email: v, purpose: 'reset' }, { replace: true })
    }, 700)
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <div className="px-4 pt-1 flex items-center justify-between">
        <button onClick={back} className="icon-btn" aria-label="رجوع"><ChevronLeft size={18} className="rotate-180" strokeWidth={2.4} /></button>
        <Logo size={26} />
      </div>
      <form onSubmit={submit} className="px-6 pt-6">
        <div className="w-16 h-16 rounded-2xl bg-secondary-50 text-secondary flex items-center justify-center"><LifeBuoy size={30} strokeWidth={2} /></div>
        <h1 className="text-[22px] font-extrabold text-ink-900 mt-4">استعادة كلمة المرور</h1>
        <p className="text-[12px] font-medium text-ink-500 mt-1 leading-relaxed">أدخل بريدك الإلكتروني وسنرسل رابطاً لتعيين كلمة مرور جديدة. الاستعادة عبر البريد فقط — بدون رمز OTP.</p>
        <label className="label mt-5">البريد الإلكتروني</label>
        <input dir="ltr" value={value} onChange={(e) => { setValue(e.target.value); if (error) setError('') }} placeholder="salem@example.com" inputMode="email" className={`field text-left ${error ? 'field-error' : ''}`} />
        {error ? <p className="flex items-center gap-1 text-[11px] font-bold text-danger mt-2"><AlertCircle size={13} /> {error}</p> : <p className="text-[11px] font-medium text-ink-400 mt-2">سيصلك رابط استعادة صالح لمدة ساعة</p>}
        <button type="submit" disabled={loading} className="w-full btn-primary btn-lg mt-6">{loading ? <Loader2 className="animate-spin" size={18} /> : 'إرسال رابط الاستعادة'}</button>
      </form>
      <div className="flex-1" />
      <HomeIndicator />
    </div>
  )
}

export function ResetPassword() {
  const { navigate, dispatch, current, switchTab } = useApp()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (pw.length < 8) return setError('كلمة المرور 8 أحرف على الأقل')
    if (pw !== pw2) return setError('كلمتا المرور غير متطابقتين')
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      dispatch({ type: 'SET_EMAIL', email: current.params?.email || USER.email })
      dispatch({ type: 'LOGIN', welcome: true })
      switchTab('home')
    }, 700)
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <TopBar title="تعيين كلمة مرور جديدة" />
      <form onSubmit={submit} className="px-6 pt-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center"><KeyRound size={28} /></div>
        <h1 className="text-[20px] font-extrabold text-ink-900 mt-4">كلمة المرور الجديدة</h1>
        <p className="text-[12px] text-ink-500 mt-1">أدخل كلمة مرور جديدة لحسابك ثم ادخل مباشرة.</p>
        <label className="label mt-5">كلمة المرور الجديدة</label>
        <input type="password" dir="ltr" value={pw} onChange={(e) => { setPw(e.target.value); setError('') }} className="field text-left" placeholder="••••••••" />
        <label className="label mt-3">تأكيد كلمة المرور</label>
        <input type="password" dir="ltr" value={pw2} onChange={(e) => { setPw2(e.target.value); setError('') }} className="field text-left" placeholder="••••••••" />
        {error && <p className="flex items-center gap-1 text-[11px] font-bold text-danger mt-2"><AlertCircle size={13} /> {error}</p>}
        <button type="submit" disabled={loading} className="w-full btn-primary btn-lg mt-6">{loading ? <Loader2 className="animate-spin" size={18} /> : 'حفظ ودخول'}</button>
      </form>
      <HomeIndicator />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  إنشاء حساب جديد (CUS-008) + نجاح (CUS-009) + فشل (CUS-010)
// ─────────────────────────────────────────────────────────────
export function Register() {
  const { navigate, dispatch, back, current, state } = useApp()
  const preset = current.params?.preset
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', agree: false })
  const [errors, setErrors] = useState(preset === 'errors' ? { name: 'أدخل الاسم الرباعي (أربعة أسماء مفصولة بمسافات)', email: 'البريد الإلكتروني غير صالح', phone: 'رقم الجوال يجب أن يبدأ بـ 7 ويتكون من 9 أرقام', password: 'كلمة المرور 8 أحرف على الأقل', agree: 'يجب الموافقة على الشروط' } : {})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    if (errors[k]) setErrors({ ...errors, [k]: undefined })
  }
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().split(/\s+/).filter(Boolean).length < 4) er.name = 'أدخل الاسم الرباعي (أربعة أسماء مفصولة بمسافات)'
    if (!EMAIL_RE.test(form.email.trim())) er.email = 'البريد الإلكتروني غير صالح'
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) er.phone = 'رقم الجوال يجب أن يبدأ بـ 7 ويتكون من 9 أرقام'
    if (form.password.length < 8) er.password = 'كلمة المرور 8 أحرف على الأقل'
    if (!form.agree) er.agree = 'يجب الموافقة على الشروط'
    setErrors(er)
    if (Object.keys(er).length) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      dispatch({ type: 'SET_EMAIL', email: form.email.trim() })
      // محاكاة فشل الحفظ إذا احتوى البريد على كلمة fail (لعرض CUS-010)
      if (/fail/i.test(form.email)) navigate('registerFailed')
      else navigate('verifyLinkSent', { email: form.email.trim(), name: form.name.trim(), purpose: 'verify' }, { resetTo: true })
    }, 800)
  }
  const F = ({ k, label, type = 'text', placeholder, dir, icon }) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input type={type} value={form[k]} onChange={set(k)} placeholder={placeholder} dir={dir} className={`field ${dir === 'ltr' ? 'text-left' : ''} ${errors[k] ? 'field-error' : ''} ${icon ? 'pl-11' : ''}`} />
        {icon}
      </div>
      {errors[k] && <p className="text-[11px] font-bold text-danger mt-1">{errors[k]}</p>}
    </div>
  )
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <TopBar title="إنشاء حساب جديد" />
      <form onSubmit={submit} className="flex-1 overflow-y-auto scroll-thin px-6 pt-4 pb-6 space-y-4">
        <div className="flex justify-center pb-2">
          <Logo size={52} />
        </div>
        <F k="name" label="الاسم الرباعي" placeholder="محمد سعيد أحمد علي" />
        <F k="email" label="البريد الإلكتروني" type="email" placeholder="mohammed.saeed@gmail.com" dir="ltr" />
        <F k="phone" label="رقم الجوال" type="tel" placeholder="773030064" dir="ltr" />
        <div>
          <label className="label">كلمة المرور</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" dir="ltr" className={`field text-left pl-11 ${errors.password ? 'field-error' : ''}`} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] font-bold text-danger mt-1">{errors.password}</p>}
        </div>
        <label className="flex items-start gap-2 text-[11px] font-medium text-ink-500 cursor-pointer">
          <input type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-0.5 w-4 h-4 accent-primary" />
          <span>
            أوافق على <button type="button" onClick={() => navigate('legal', { doc: 'terms' })} className="font-bold text-primary underline underline-offset-2">شروط الاستخدام</button> و <button type="button" onClick={() => navigate('legal', { doc: 'privacy' })} className="font-bold text-primary underline underline-offset-2">سياسة الخصوصية</button> الخاصة بمنصة جديد.
          </span>
        </label>
        {errors.agree && <p className="text-[11px] font-bold text-danger -mt-2">{errors.agree}</p>}
        <button type="submit" disabled={loading} className="w-full btn-secondary btn-lg !mt-6">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'إنشاء حساب'}
        </button>
        <p className="text-center text-[12px] font-medium text-ink-500">
          لديك حساب بالفعل؟{' '}
          <button type="button" onClick={back} className="font-bold text-primary">تسجيل دخول</button>
        </p>
        <p className="text-center text-[10px] text-ink-400">تلميح للتجربة: بريد يحتوي كلمة "fail" يُظهر شاشة فشل الحفظ</p>
      </form>
      <HomeIndicator />
    </div>
  )
}

export function RegisterSuccess() {
  const { navigate, current, state, dispatch } = useApp()
  const name = current.params?.name || USER.name
  const returnTo = state.auth.returnTo // سجّل من نافذة المطالبة أثناء التصفح → يعود إلى المنتج/المتجر نفسه
  const proceed = () => {
    if (returnTo?.name) {
      dispatch({ type: 'CLEAR_RETURN_TO' })
      return navigate(returnTo.name, returnTo.params || {}, { resetTo: true })
    }
    navigate('locationPermission', {}, { resetTo: true })
  }
  return (
    <StateScreen
      tone="info"
      icon={Check}
      showBack={false}
      title="تم حفظ بيانات الحساب بنجاح!"
      description="أهلاً بك في منصة جديد للتسوق الذكي في محافظة تعز."
      primary={{ label: returnTo?.name ? 'المتابعة إلى حيث توقفت' : 'تحديد موقع التوصيل الأول', onClick: proceed }}
    >
      <KeyValue rows={[['الاسم:', name], ['المدينة:', 'تعز'], ['الحي:', 'شارع جمال']]} />
    </StateScreen>
  )
}

export function RegisterFailed() {
  const { back } = useApp()
  return (
    <StateScreen
      tone="error"
      icon={AlertCircle}
      code="CUS-010"
      title="تعذر حفظ بيانات الحساب"
      description="حدث خطأ غير متوقع أثناء محاولة حفظ معلوماتك. يرجى المحاولة مرة أخرى أو التأكد من اتصال الإنترنت."
      primary={{ label: 'إعادة المحاولة', onClick: back }}
    >
      <div className="bg-danger-50 border border-danger-100 rounded-card p-4 text-right">
        <p className="text-[11px] font-bold text-danger-700">
          رمز الخطأ: <span className="font-mono" dir="ltr">ERR_ACCOUNT_SAVE_FAILED</span>
        </p>
        <p className="text-[11px] font-medium text-danger-700/80 mt-1">فشل في مزامنة قاعدة البيانات المحلية.</p>
      </div>
    </StateScreen>
  )
}
