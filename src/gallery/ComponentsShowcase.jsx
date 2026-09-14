import React, { useState } from 'react'
import { Home, Search, Heart, ReceiptText, User, Store, Package, ClipboardList, BarChart3, Check, ShoppingBag, Mail, AlertCircle, Truck } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { StatusBar, HomeIndicator, TopBar, Logo, Chip, StageChip, Stepper, Price, ProductCard, StoreAvatar, Rating, VerifiedBadge, KeyValue, Modal } from '../components/ui'
import { PRODUCTS, STORES } from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  عرض المكونات المستقلة (Design System) — تُستخدم في معرض الشاشات
// ─────────────────────────────────────────────────────────────
const CUSTOMER_TABS = [
  ['الرئيسية', Home],
  ['البحث', Search],
  ['المفضلة', Heart, 2],
  ['طلباتي', ReceiptText, 1],
  ['حسابي', User],
]
const MERCHANT_TABS = [
  ['الرئيسية', Store],
  ['المنتجات', Package],
  ['الطلبات', ClipboardList, 3],
  ['الإحصائيات', BarChart3],
  ['حسابي', User],
]

function NavPreview({ tabs, activeIdx }) {
  const [active, setActive] = useState(activeIdx)
  return (
    <div className="bg-white/95 rounded-[20px] shadow-elevated border border-ink-100 h-[62px] grid grid-cols-5">
      {tabs.map(([label, Icon, badge], i) => {
        const on = i === active
        return (
          <button key={label} onClick={() => setActive(i)} className="relative flex flex-col items-center justify-center gap-1">
            <div className={`relative w-9 h-6 flex items-center justify-center rounded-lg ${on ? 'bg-primary-50' : ''}`}>
              <Icon size={20} strokeWidth={on ? 2.4 : 1.9} className={on ? 'text-primary' : 'text-ink-400'} fill={on && label === 'المفضلة' ? 'currentColor' : 'none'} />
              {badge && <span className="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-white text-[9px] font-extrabold flex items-center justify-center tabular">{badge}</span>}
            </div>
            <span className={`text-[10px] font-bold ${on ? 'text-primary' : 'text-ink-400'}`}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

const Section = ({ title, children, note }) => (
  <div className="card p-4">
    <p className="text-[13px] font-extrabold text-ink-900">{title}</p>
    {note && <p className="text-[10px] text-ink-500 mt-0.5">{note}</p>}
    <div className="mt-3 space-y-3">{children}</div>
  </div>
)

const TOKENS = [
  ['Primary', '#5002C9', 'bg-primary', 'الأساسي — الأزرار الرئيسية، التبويب النشط، الروابط'],
  ['Primary 50', '#F6F2FE', 'bg-primary-50', 'خلفيات خفيفة للأيقونات والحالات'],
  ['Secondary', '#FF5715', 'bg-secondary', 'الثانوي — الأسعار، الشارات، التنبيهات'],
  ['Secondary 50', '#FFF4EE', 'bg-secondary-50', 'خلفية الشرائح البرتقالية'],
  ['Ink 900', '#111827', 'bg-ink-900', 'النصوص الرئيسية'],
  ['Ink 500', '#6B7280', 'bg-ink-500', 'النصوص الثانوية'],
  ['Ink 100', '#F3F4F6', 'bg-ink-100', 'حقول الإدخال والفواصل'],
  ['Success', '#10B981', 'bg-success', 'نجاح · مجاني · تم التوصيل'],
  ['Danger', '#EF4444', 'bg-danger', 'أخطاء · حذف · رفض'],
  ['Warning', '#F59E0B', 'bg-warning', 'تحذير · قيد التحضير · التقييم'],
  ['Info', '#0284C7', 'bg-info', 'معلومات · مقبول'],
]

export function ComponentsShowcase() {
  const { current, showToast } = useApp()
  const section = current.params?.section || 'nav'
  const [qty, setQty] = useState(2)
  const [otp, setOtp] = useState(['1', '2', '', ''])
  const [modal, setModal] = useState(false)
  const product = PRODUCTS[0]
  const titles = { nav: 'شريط التنقل السفلي', header: 'رأس الشاشة الموحّد', buttons: 'الأزرار والشرائح', fields: 'الحقول وخانات OTP', cards: 'البطاقات والحالات', tokens: 'نظام الألوان (Tokens)' }

  return (
    <div className="flex-1 flex flex-col bg-ink-50">
      <StatusBar />
      <TopBar title={titles[section]} subtitle="مكوّن مستقل قابل لإعادة الاستخدام" />
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4 pb-8">
        {section === 'nav' && (
          <>
            <Section title="شريط تنقّل العميل (RTL · 5 تبويبات)" note="ترتيب ثابت في كل الشاشات: الرئيسية · البحث · المفضلة · طلباتي · حسابي — اضغط للتبديل">
              <NavPreview tabs={CUSTOMER_TABS} activeIdx={0} />
            </Section>
            <Section title="شريط تنقّل التاجر" note="نفس البنية والأيقونات الموحّدة مع شارة الطلبات الجديدة">
              <NavPreview tabs={MERCHANT_TABS} activeIdx={2} />
            </Section>
            <Section title="ما تم توحيده مقارنةً بالتصميم">
              <ul className="text-[11px] text-ink-600 space-y-1.5 list-disc pr-4 leading-relaxed">
                <li>في Figma اختلف ترتيب التبويبات وأيقوناتها بين الشاشات (مثلاً «المفضلة» قبل «البحث» في شاشة والعكس في أخرى).</li>
                <li>في النموذج: مكوّن واحد <code className="font-mono text-[10px]">BottomNav</code> يحسب الشارات من الحالة الحقيقية (المفضلة، الطلبات النشطة، الطلبات الجديدة).</li>
                <li>التبويب النشط يُستنتج من الشاشة الحالية تلقائياً.</li>
              </ul>
            </Section>
          </>
        )}

        {section === 'header' && (
          <>
            <Section title="HeaderSection — رأس بشعار وزر رجوع" note="زر الرجوع سهم لليمين (RTL) والشعار في الجهة المقابلة">
              <div className="rounded-card border border-ink-100 overflow-hidden">
                <TopBar title="عنوان الشاشة" subtitle="وصف مختصر تحت العنوان" onBack={() => showToast('رجوع')} />
              </div>
            </Section>
            <Section title="رأس مع رمز الشاشة (Screen Code)">
              <div className="rounded-card border border-ink-100 overflow-hidden">
                <TopBar title="تفاصيل الفاتورة والطلب" code="CUS-038" onBack={() => showToast('رجوع')} />
              </div>
            </Section>
            <Section title="رأس مع عنصر يمين مخصص (شريحة حالة)">
              <div className="rounded-card border border-ink-100 overflow-hidden">
                <TopBar title="تتبع الشحنة المباشر" subtitle="رقم الطلب: JD-984210" right={<StageChip stage="out" />} onBack={() => showToast('رجوع')} />
              </div>
            </Section>
            <Section title="رأس داكن (على خلفية بنفسجية)">
              <div className="rounded-card overflow-hidden bg-primary">
                <TopBar light title="مركز التنبيهات" subtitle="آخر التحديثات والعروض لطلبك" onBack={() => showToast('رجوع')} />
              </div>
            </Section>
            <Section title="الشعار الرسمي (Official Logo)" note="مصدر واحد: public/assets/logoo.png (الاسم العربي + JADEED + العلامة) — ارتفاع ثابت + عرض تلقائي + object-fit: contain (لا قصّ ولا تمطيط)">
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-1"><Logo size={72} /><span className="text-[10px] text-ink-500 font-bold">72px</span></div>
                <div className="flex items-end gap-5 flex-wrap justify-center">
                  <div className="flex flex-col items-center gap-1"><Logo size={40} /><span className="text-[10px] text-ink-500 font-bold">40px</span></div>
                  <div className="flex flex-col items-center gap-1"><Logo size={26} /><span className="text-[10px] text-ink-500 font-bold">26px (الهيدر)</span></div>
                  <div className="flex flex-col items-center gap-1"><Logo icon size={40} /><span className="text-[10px] text-ink-500 font-bold">أيقونة</span></div>
                </div>
              </div>
              <div className="mt-4 rounded-card bg-primary p-4 flex items-center justify-center gap-6 flex-wrap">
                <Logo size={30} light />
              </div>
            </Section>
          </>
        )}

        {section === 'buttons' && (
          <>
            <Section title="الأزرار الرئيسية" note="ارتفاعات موحّدة: lg 52px · md 44px · sm 36px · xs 28px">
              <button className="w-full btn-primary btn-lg" onClick={() => showToast('زر أساسي', 'primary')}>زر أساسي (Primary · lg)</button>
              <button className="w-full btn-secondary btn-lg" onClick={() => showToast('زر ثانوي', 'success')}>زر ثانوي (Secondary · lg)</button>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-outline btn-md">Outline · md</button>
                <button className="btn-ghost btn-md">Ghost · md</button>
                <button className="btn-danger btn-md">Danger · md</button>
                <button className="btn-success btn-md">Success · md</button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button className="btn-primary btn-sm">صغير · sm</button>
                <button className="btn-primary btn-xs"><ShoppingBag size={12} /> أضف للسلة · xs</button>
                <button className="btn-primary btn-md" disabled>معطّل</button>
              </div>
            </Section>
            <Section title="الشرائح (Chips) وحالات الطلب الموحّدة">
              <div className="flex flex-wrap gap-2">
                <Chip tone="ink">افتراضي</Chip>
                <Chip tone="primary">أساسي</Chip>
                <Chip tone="secondary">ثانوي</Chip>
                <Chip tone="solidPrimary">صلب أساسي</Chip>
                <Chip tone="solidSecondary">خصم 18%</Chip>
              </div>
              <div className="flex flex-wrap gap-2">
                {['new', 'accepted', 'preparing', 'ready', 'out', 'delivered', 'cancelled', 'rejected'].map((s) => <StageChip key={s} stage={s} />)}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <VerifiedBadge /> <Rating value={4.9} count={312} />
              </div>
            </Section>
            <Section title="عدّاد الكمية (Stepper) — LTR داخل RTL">
              <div className="flex items-center justify-between">
                <Stepper value={qty} onChange={setQty} min={1} max={9} />
                <Stepper value={qty} onChange={setQty} min={1} max={9} size="sm" />
                <Price value={product.price * qty} size="md" />
              </div>
            </Section>
            <Section title="نافذة تأكيد (Modal) وإشعار (Toast)">
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-outline btn-md" onClick={() => setModal(true)}>فتح نافذة تأكيد</button>
                <button className="btn-outline btn-md" onClick={() => showToast('أُضيف إلى السلة', 'success')}>إظهار Toast</button>
              </div>
            </Section>
          </>
        )}

        {section === 'fields' && (
          <>
            <Section title="حقول الإدخال" note="خلفية رمادية موحّدة، تتحول لبيضاء مع إطار بنفسجي عند التركيز">
              <div>
                <label className="label">حقل نصي عادي</label>
                <input className="field" placeholder="مثال: محمد سعيد" />
              </div>
              <div>
                <label className="label">حقل بريد (LTR) مع أيقونة</label>
                <div className="relative">
                  <input dir="ltr" className="field text-left pl-11" placeholder="salem@example.com" />
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                </div>
              </div>
              <div>
                <label className="label">حقل بحالة خطأ</label>
                <input dir="ltr" className="field text-left field-error" defaultValue="user@invalid-mail" />
                <p className="flex items-center gap-1 text-[11px] font-bold text-danger mt-2"><AlertCircle size={13} /> البريد الإلكتروني المدخل غير صالح أو ناقص</p>
              </div>
              <div>
                <label className="label">قائمة منسدلة</label>
                <select className="field"><option>إلكترونيات</option><option>عطور وجمال</option></select>
              </div>
            </Section>
            <Section title="خانات رمز التحقق OTP — 4 أرقام موحّدة" note="في Figma ظهر الرمز أحياناً 4 وأحياناً 6 خانات؛ تم توحيده على 4 في كل الشاشات">
              <div className="flex justify-center gap-3" dir="ltr">
                {otp.map((d, i) => (
                  <input key={i} value={d} maxLength={1} inputMode="numeric" onChange={(e) => { const n = [...otp]; n[i] = e.target.value.replace(/\D/g, '').slice(-1); setOtp(n) }} className={`w-14 h-16 rounded-2xl text-center text-[24px] font-extrabold tabular outline-none border-2 transition ${d ? 'border-primary bg-primary-50' : 'border-transparent bg-ink-100 focus:border-primary focus:bg-white'}`} />
                ))}
              </div>
              <div className="flex justify-center gap-3" dir="ltr">
                {['9', '9', '9', '9'].map((d, i) => <div key={i} className="w-14 h-16 rounded-2xl text-center text-[24px] font-extrabold tabular border-2 border-danger bg-danger-50 text-danger flex items-center justify-center">{d}</div>)}
              </div>
              <p className="text-center text-[11px] text-ink-500">الحالة العادية · حالة الخطأ</p>
            </Section>
            <Section title="مربع اختيار وخيار (Checkbox / Radio)">
              <label className="flex items-center gap-2 text-[12px] font-medium"><input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" /> أوافق على الشروط والأحكام</label>
              <label className="flex items-center gap-2 text-[12px] font-medium"><input type="radio" name="r" defaultChecked className="w-4 h-4 accent-primary" /> الدفع نقداً عند الاستلام</label>
              <label className="flex items-center gap-2 text-[12px] font-medium"><input type="radio" name="r" className="w-4 h-4 accent-primary" /> محفظة جديد الرقمية</label>
            </Section>
          </>
        )}

        {section === 'cards' && (
          <>
            <Section title="بطاقة المنتج (ProductCard)" note="مفضلة + شارة + سعر قديم/جديد + زر إضافة يعمل فعلياً">
              <div className="grid grid-cols-2 gap-3">
                <ProductCard product={PRODUCTS[0]} onOpen={() => showToast('فتح المنتج')} />
                <ProductCard product={PRODUCTS[1]} onOpen={() => showToast('فتح المنتج')} />
              </div>
            </Section>
            <Section title="بطاقة المتجر">
              {STORES.slice(0, 2).map((s) => (
                <div key={s.id} className="card p-3 flex items-center gap-3">
                  <StoreAvatar store={s} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-ink-900 truncate flex items-center gap-1">{s.name} {s.verified && <VerifiedBadge />}</p>
                    <p className="text-[11px] text-ink-500">{s.area} · {s.prepTime}</p>
                  </div>
                  <Rating value={s.rating} />
                </div>
              ))}
            </Section>
            <Section title="بطاقة مفتاح/قيمة (KeyValue) — للفواتير والملخصات">
              <KeyValue rows={[['رقم الطلب:', 'JD-984210', 'text-primary'], ['إجمالي الفاتورة:', '42,160 ر.ي'], ['طريقة الدفع:', 'الدفع نقداً عند الاستلام', 'text-success-700']]} />
            </Section>
            <Section title="بطاقة حالة (نجاح / خطأ / تحذير / فارغ)">
              <div className="grid grid-cols-4 gap-2">
                {[['bg-success-50 text-success', Check], ['bg-danger-50 text-danger', AlertCircle], ['bg-warning-50 text-warning', Truck], ['bg-ink-100 text-ink-400', ShoppingBag]].map(([cls, Icon], i) => (
                  <div key={i} className={`h-16 rounded-2xl flex items-center justify-center ${cls}`}><Icon size={26} /></div>
                ))}
              </div>
            </Section>
          </>
        )}

        {section === 'tokens' && (
          <>
            <Section title="لوحة الألوان الموحّدة" note="تم توحيد 10+ درجات برتقالي و6 درجات بنفسجي من Figma إلى سلّم واحد في tailwind.config.js">
              {TOKENS.map(([name, hex, cls, use]) => (
                <div key={name} className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl border border-ink-100 shrink-0 ${cls}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-ink-900">{name} <span className="font-mono text-[10px] text-ink-500" dir="ltr">{hex}</span></p>
                    <p className="text-[10px] text-ink-500 truncate">{use}</p>
                  </div>
                </div>
              ))}
            </Section>
            <Section title="الخط والأحجام" note="Cairo — أوزان 400 إلى 900 · أرقام لاتينية ثابتة العرض للأسعار">
              <p className="text-[24px] font-black">عنوان رئيسي · 24 / 900</p>
              <p className="text-[17px] font-extrabold">عنوان شاشة · 17 / 800</p>
              <p className="text-[14px] font-bold">عنوان قسم · 14 / 700</p>
              <p className="text-[12px] font-medium text-ink-600">نص عادي · 12 / 500</p>
              <p className="text-[10px] font-medium text-ink-400">نص مساعد · 10 / 500</p>
              <Price value={34500} size="lg" old={42000} />
            </Section>
            <Section title="أنصاف الأقطار والظلال">
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-ink-600 text-center">
                <div className="h-14 rounded-field bg-white shadow-card border border-ink-100 flex items-center justify-center">field · 12</div>
                <div className="h-14 rounded-card bg-white shadow-elevated flex items-center justify-center">card · 16</div>
                <div className="h-14 rounded-modal bg-white shadow-modal flex items-center justify-center">modal · 24</div>
              </div>
            </Section>
          </>
        )}
      </div>
      <Modal open={modal} onClose={() => setModal(false)}>
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary flex items-center justify-center mx-auto"><Check size={28} /></div>
        <h2 className="text-[18px] font-extrabold text-center mt-3">نافذة تأكيد موحّدة</h2>
        <p className="text-[12px] text-ink-500 text-center mt-1">تُستخدم لتأكيد الحذف وقرارات الطلب.</p>
        <button onClick={() => setModal(false)} className="w-full btn-primary btn-md mt-4">حسناً</button>
      </Modal>
      <HomeIndicator />
    </div>
  )
}
