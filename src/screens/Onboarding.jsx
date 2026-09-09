import React, { useEffect, useRef, useState } from 'react'
import { ShoppingBag, Sparkles, Store, ChevronLeft, Check, ShieldCheck, Briefcase, User, Mail, Lock, Clock, KeyRound, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { useApp, OTP_LENGTH, OTP_MAX_ATTEMPTS, DEMO_OTP } from '../store/AppContext'
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
  { key: 'both', Icon: Briefcase, title: 'كلاهما (متسوق وتاجر)', desc: 'تمتع بتجربة كاملة للشراء والبيع في نفس الحساب بسلاسة.' },
]

export function AccountType() {
  const { navigate, dispatch, state } = useApp()
  const [sel, setSel] = useState(state.auth.accountType)
  const go = () => {
    dispatch({ type: 'SET_ACCOUNT_TYPE', accountType: sel })
    navigate('login', {}, { resetTo: true })
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <div className="px-5 pt-1 flex justify-start">
        <button onClick={go} className="h-8 px-4 rounded-full bg-ink-100 text-[13px] font-bold">تخطي</button>
      </div>
      <div className="px-6 pt-6">
        <h1 className="text-[28px] font-extrabold text-ink-900">
          مرحباً بك في <span className="text-primary">جديد</span>
        </h1>
        <p className="text-[12px] font-medium text-ink-500 mt-1">حدد نوع حسابك لنخصص لك أفضل تجربة تسوق وإدارة أعمال:</p>
        <div className="space-y-3 mt-6">
          {TYPES.map(({ key, Icon, title, desc }) => {
            const active = sel === key
            return (
              <button key={key} onClick={() => setSel(key)} className={`w-full text-right rounded-card p-4 flex items-start gap-3 border transition-all ${active ? 'bg-secondary border-secondary text-white shadow-secondary' : 'bg-white border-ink-200 text-ink-900 hover:border-ink-300'}`}>
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
      <div className="px-6 pb-4 space-y-2.5">
        <button onClick={go} className="w-full btn-primary btn-lg">متابعة</button>
        <button onClick={go} className="w-full btn-outline btn-lg">تخطي</button>
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
  const { navigate, dispatch, switchTab, current } = useApp()
  const preset = current.params?.preset // 'invalid' → معاينة حالة CUS-002 مباشرة
  const [value, setValue] = useState(preset === 'invalid' ? 'user@invalid-mail' : '')
  const [error, setError] = useState(preset === 'invalid' ? 'البريد الإلكتروني المدخل غير صالح أو ناقص' : '')
  const [loading, setLoading] = useState(false)
  const submit = (e) => {
    e?.preventDefault()
    const v = value.trim()
    if (!v) return setError('يرجى إدخال البريد الإلكتروني أو رقم الجوال')
    if (!EMAIL_RE.test(v) && !PHONE_RE.test(v.replace(/\s/g, ''))) return setError('البريد الإلكتروني المدخل غير صالح أو ناقص')
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      dispatch({ type: 'SET_EMAIL', email: v })
      navigate('otpSent')
    }, 700)
  }
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <div className="px-4 pt-1 flex items-center justify-between">
        <button onClick={() => navigate('accountType', {}, { resetTo: true })} className="icon-btn" aria-label="رجوع">
          <ChevronLeft size={18} className="rotate-180" strokeWidth={2.4} />
        </button>
        <button onClick={() => switchTab('home')} className="text-[13px] font-bold text-primary">تصفح كزائر</button>
      </div>
      <div className="flex flex-col items-center pt-6">
        <Logo size={64} />
      </div>
      <form onSubmit={submit} className="px-6 pt-8">
        <h1 className="text-[20px] font-extrabold text-ink-900">تسجيل الدخول بالبريد الإلكتروني</h1>
        <p className="text-[12px] font-medium text-ink-500 mt-1 leading-relaxed">أدخل بريدك الإلكتروني أو رقم هاتفك لتلقي رمز التحقق السريع (OTP) والدخول بأمان</p>
        <label className="label mt-6">البريد الإلكتروني أو رقم الجوال</label>
        <div className="relative">
          <input
            dir="ltr"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError('')
            }}
            placeholder="salem@example.com"
            className={`field text-left pl-11 ${error ? 'field-error' : ''}`}
            autoComplete="email"
            inputMode="email"
          />
          <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-danger' : 'text-ink-400'}`} />
        </div>
        {error ? (
          <p className="flex items-center gap-1 text-[11px] font-bold text-danger mt-2">
            <AlertCircle size={13} /> {error}
          </p>
        ) : (
          <p className="text-[11px] font-medium text-ink-400 mt-2">للتجربة: أي بريد صحيح، ورمز التحقق هو <b className="text-primary tabular">{DEMO_OTP}</b></p>
        )}
        <button type="submit" disabled={loading} className="w-full btn-primary btn-lg mt-8">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'إرسال رمز التحقق (OTP)'}
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
//  تم إرسال رمز التحقق (CUS-004) — OTP من 4 أرقام موحّد
// ─────────────────────────────────────────────────────────────
export function OtpSent() {
  const { navigate, state } = useApp()
  return (
    <StateScreen
      tone="success"
      icon={Mail}
      title="تم إرسال رمز التحقق (OTP)"
      description={`أرسلنا رمز تحقق مكوّناً من ${OTP_LENGTH} أرقام إلى:`}
      primary={{ label: 'الانتقال لإدخال الرمز', onClick: () => navigate('otp', {}, { replace: true }) }}
    >
      <div className="inline-block bg-primary-50 text-primary text-[12px] font-bold rounded-full px-4 py-1.5 mb-4" dir="ltr">{state.auth.email || USER.email}</div>
      <div className="card p-4 text-right">
        <div className="flex items-center gap-2 text-[12px] font-bold text-ink-900">
          <Clock size={14} className="text-primary" /> صلاحية الرمز: 10 دقائق
        </div>
        <p className="text-[11px] font-medium text-ink-400 leading-relaxed mt-1">إذا لم تجد الرسالة في صندوق البريد الوارد، يرجى مراجعة مجلد الرسائل غير المرغوب فيها (Spam).</p>
      </div>
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  التحقق من رمز OTP (4 خانات) + خطأ (CUS-005) + حظر (CUS-006)
// ─────────────────────────────────────────────────────────────
export function OtpVerify() {
  const { navigate, dispatch, state, back, current } = useApp()
  const preset = current.params?.preset // 'wrong' → معاينة حالة CUS-005 مباشرة
  const [digits, setDigits] = useState(preset === 'wrong' ? ['9', '9', '9', '9'] : Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState(preset === 'wrong')
  const [timer, setTimer] = useState(46)
  const refs = useRef([])
  const attemptsLeft = OTP_MAX_ATTEMPTS - state.auth.otpAttempts
  const locked = !!state.auth.lockedUntil

  useEffect(() => {
    if (timer <= 0) return
    const t = setTimeout(() => setTimer(timer - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  useEffect(() => {
    if (locked) navigate('otpLocked', {}, { replace: true })
  }, [locked, navigate])

  const setAt = (idx, v) => {
    const d = v.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = d
    setDigits(next)
    setError(false)
    if (d && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus()
    if (next.every(Boolean)) verify(next.join(''))
  }
  const onKey = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus()
  }
  const onPaste = (e) => {
    const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (t.length === OTP_LENGTH) {
      e.preventDefault()
      const next = t.split('')
      setDigits(next)
      verify(t)
    }
  }
  const verify = (code) => {
    if (code === DEMO_OTP) {
      dispatch({ type: 'LOGIN' })
      navigate('loginSuccess', {}, { resetTo: true })
    } else {
      setError(true)
      dispatch({ type: 'OTP_FAIL' })
      setTimeout(() => {
        setDigits(Array(OTP_LENGTH).fill(''))
        refs.current[0]?.focus()
      }, 500)
    }
  }
  const masked = '+967 773 *** 064'
  return (
    <div className="flex-1 flex flex-col bg-white">
      <StatusBar />
      <div className="px-4 pt-1">
        <button onClick={back} className="icon-btn" aria-label="رجوع">
          <ChevronLeft size={18} className="rotate-180" strokeWidth={2.4} />
        </button>
      </div>
      <div className="px-6 pt-8">
        <h1 className="text-[24px] font-extrabold text-ink-900">التحقق من رمز OTP</h1>
        <p className="text-[13px] font-medium text-ink-500 mt-1">أدخل الرمز المكوّن من {OTP_LENGTH} أرقام المرسل إلى هاتفك المحمول</p>
        <p className="text-[14px] font-bold text-primary mt-1 tabular" dir="ltr">{masked}</p>

        <div className="flex justify-center gap-3 mt-10" dir="ltr" onPaste={onPaste}>
          {digits.map((d, idx) => (
            <input
              key={idx}
              ref={(el) => (refs.current[idx] = el)}
              value={d}
              onChange={(e) => setAt(idx, e.target.value)}
              onKeyDown={(e) => onKey(idx, e)}
              inputMode="numeric"
              maxLength={1}
              autoFocus={idx === 0}
              className={`w-14 h-16 rounded-2xl text-center text-[24px] font-extrabold tabular outline-none border-2 transition ${
                error ? 'border-danger bg-danger-50 text-danger animate-bounce-soft' : d ? 'border-primary bg-primary-50 text-ink-900' : 'border-transparent bg-ink-100 text-ink-900 focus:border-primary focus:bg-white'
              }`}
            />
          ))}
        </div>

        {error ? (
          <div className="mt-5 bg-danger-50 border border-danger-100 rounded-field px-4 py-3 flex items-center gap-2 text-[12px] font-bold text-danger-700">
            <AlertCircle size={16} /> رمز التحقق المدخل غير صحيح — المحاولات المتبقية: {attemptsLeft} من {OTP_MAX_ATTEMPTS}
          </div>
        ) : (
          <div className="text-center mt-8">
            {timer > 0 ? (
              <p className="text-[12px] font-semibold text-primary">
                إعادة إرسال الرمز خلال <span className="font-bold tabular">00:{String(timer).padStart(2, '0')}</span>
              </p>
            ) : (
              <button onClick={() => setTimer(46)} className="text-[12px] font-bold text-primary underline underline-offset-4">إعادة إرسال الرمز</button>
            )}
            <p className="text-[11px] font-medium text-ink-400 mt-1">المحاولات المتبقية: {attemptsLeft} من {OTP_MAX_ATTEMPTS}</p>
          </div>
        )}
      </div>
      <div className="flex-1" />
      <div className="px-6 pb-4">
        <button onClick={() => verify(digits.join(''))} disabled={!digits.every(Boolean)} className="w-full btn-primary btn-lg">
          تأكيد ومتابعة
        </button>
      </div>
      <HomeIndicator />
    </div>
  )
}

export function OtpLocked() {
  const { navigate, dispatch } = useApp()
  const [left, setLeft] = useState(14 * 60 + 59)
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(t)
  }, [])
  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')
  return (
    <StateScreen
      tone="warning"
      icon={Lock}
      code="CUS-006"
      showBack={false}
      title="تم تقييد المحاولات مؤقتاً"
      description="لحماية أمان حسابك، لقد تجاوزت عدد محاولات إدخال الرمز المسموح بها."
      primary={{
        label: 'العودة لصفحة الدخول',
        onClick: () => {
          dispatch({ type: 'OTP_RESET' })
          navigate('login', {}, { resetTo: true })
        },
      }}
    >
      <div className="card p-5">
        <p className="text-[12px] font-medium text-ink-500">الوقت المتبقي لفك الحظر المؤقت:</p>
        <p className="text-[34px] font-black text-secondary tabular leading-none mt-2" dir="ltr">{mm} : {ss}</p>
        <p className="text-[11px] font-medium text-ink-400 mt-2">يمكنك طلب رمز تحقق جديد بعد انقضاء الوقت المحدد أعلاه.</p>
      </div>
    </StateScreen>
  )
}

export function LoginSuccess() {
  const { switchTab } = useApp()
  return (
    <StateScreen
      tone="info"
      icon={Check}
      showBack={false}
      title="أهلاً بك مجدداً في جديد!"
      description="تم التحقق من هويتك بنجاح ومصادقة الدخول إلى حسابك."
      primary={{ label: 'المتابعة للرئيسية والتسوق', onClick: () => switchTab('home') }}
    >
      <KeyValue rows={[['طريقة التحقق:', `رمز البريد (OTP)`, 'text-primary'], ['حالة الجلسة:', 'نشطة وآمنة', 'text-success-700']]} />
    </StateScreen>
  )
}

// ─────────────────────────────────────────────────────────────
//  إنشاء حساب جديد (CUS-008) + نجاح (CUS-009) + فشل (CUS-010)
// ─────────────────────────────────────────────────────────────
export function Register() {
  const { navigate, dispatch, back, current } = useApp()
  const preset = current.params?.preset
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', agree: false })
  const [errors, setErrors] = useState(preset === 'errors' ? { name: 'أدخل الاسم الكامل (3 أحرف على الأقل)', email: 'البريد الإلكتروني غير صالح', phone: 'رقم الجوال يجب أن يبدأ بـ 7 ويتكون من 9 أرقام', password: 'كلمة المرور 8 أحرف على الأقل', agree: 'يجب الموافقة على الشروط' } : {})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
    if (errors[k]) setErrors({ ...errors, [k]: undefined })
  }
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 3) er.name = 'أدخل الاسم الكامل (3 أحرف على الأقل)'
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
      else {
        dispatch({ type: 'LOGIN' })
        navigate('registerSuccess', { name: form.name }, { resetTo: true })
      }
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
        <F k="name" label="الاسم الكامل" placeholder="محمد سعيد" />
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
            أوافق على <b className="text-primary">شروط الاستخدام</b> و <b className="text-primary">سياسة الخصوصية</b> الخاصة بمنصة جديد.
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
  const { navigate, current } = useApp()
  const name = current.params?.name || USER.name
  return (
    <StateScreen
      tone="info"
      icon={Check}
      showBack={false}
      title="تم حفظ بيانات الحساب بنجاح!"
      description="أهلاً بك في منصة جديد للتسوق الذكي في محافظة تعز."
      primary={{ label: 'تحديد موقع التوصيل الأول', onClick: () => navigate('locationPermission', {}, { resetTo: true }) }}
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
