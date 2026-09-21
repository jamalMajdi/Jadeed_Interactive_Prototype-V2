// فحص E2E لنقاط المراجعة العشر في وضع النموذج التفاعلي (#/prototype)
// التشغيل: node scripts/qa-phase5.mjs  (السيرفر على 5173)
const PW = process.env.PLAYWRIGHT_PATH || '/home/user/.npm/_npx/f0a362733743bae2/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const browser = await chromium.launch()
const errors = []
let pass = 0, fail = 0
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${extra ? ' · ' + extra : ''}`) }
const T = (ms) => new Promise((r) => setTimeout(r, ms))
async function fresh() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 980 } })
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()) }); page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto('http://localhost:5173/#/prototype'); await T(1900)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const nav = () => phone().locator('nav')
  const has = async (t) => (await phone().innerText()).includes(t)
  const btn = (name, exact = true) => phone().getByRole('button', { name, exact })
  return { page, phone, nav, has, btn }
}
async function login(ctx) {
  const { phone, btn } = ctx
  await phone().locator('input').first().fill('773030064'); await btn(/إرسال رمز/, false).click(); await T(600)
  await btn(/الانتقال لإدخال/, false).click(); await T(400)
  const inputs = phone().locator('input'); for (let i = 0; i < 4; i++) await inputs.nth(i).fill(String('1234'[i])); await T(1700) // RC-7: التحقق يمر بحالة تحميل (~0.9 ث)
}

// ── A) لا تصفح كزائر (RC-8): شاشة نوع الحساب بلا «تخطي/زائر» · الإضافة للسلة تتطلب الدخول · المتاجر · القانونية ──
{
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await btn('تخطي').click(); await T(400)                     // onboarding slides skip → accountType
  check('9→RC-8) شاشة نوع الحساب بلا «تخطي» ولا «تصفح كزائر» وبنوعين فقط', (await btn('تخطي').count()) === 0 && (await btn(/تصفح كزائر/, false).count()) === 0 && (await btn(/كلاهما/, false).count()) === 0 && (await btn(/متسوق \(مشتري\)/, false).count()) === 1 && (await btn(/تاجر \(صاحب متجر\)/, false).count()) === 1)
  await btn(/متسوق \(مشتري\)/, false).click(); await btn('متابعة').click(); await T(500)
  check('9→RC-8) شاشة الدخول بلا رابط «تصفح كزائر»', (await btn(/تصفح كزائر/, false).count()) === 0)
  await login(c)
  await btn('المتابعة للرئيسية والتسوق').click(); await T(600)
  check('9) الدخول يفتح الرئيسية', await has('الأقسام والتصنيفات'))
  check('1) تبويب «المتاجر» موجود في الشريط السفلي', (await nav().innerText()).includes('المتاجر'))
  check('3) بطاقات المنتجات في الرئيسية تعرض اسم المتجر', (await phone().getByLabel(/^متجر متجر التكنولوجيا/).count()) > 0)
  await nav().getByRole('button', { name: 'المتاجر' }).click(); await T(500)
  check('1) تبويب المتاجر يفتح قائمة المتاجر مع الشريط السفلي', (await has('عطور الجزيرة الملكية')) && (await nav().count()) === 1)
  await btn(/متجر التكنولوجيا الحديثة/, false).first().click(); await T(600)
  const t = await phone().innerText()
  check('10) صفحة المتجر: وصف + هاتف + وقت توصيل + صاحب المتجر + خريطة', ['عن المتجر', '777 200 300', '45-60 دقيقة', 'محمد سعيد', 'موقع المتجر على الخريطة', 'قائمة منتجات المتجر'].every((k) => t.includes(k)))
  await btn(/أضف سماعات/, false).click(); await T(300)
  check('9) العميل المسجّل يضيف للسلة', (await btn(/أضف سماعات/, false).innerText()).trim() === '1')
  await btn('العودة إلى الرئيسية').click(); await T(500)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(500)
  await btn('شروط الاستخدام').click(); await T(500)
  check('4) شروط الاستخدام تفتح من حسابي', await has('1. الحسابات'))
  await btn('عرض سياسة الخصوصية').click(); await T(500)
  check('4) التبديل إلى سياسة الخصوصية', await has('1. البيانات التي نجمعها'))
  await page.close()
}

// ── B) بوابة الدفع: سلة من متجرين كزائر → إتمام الطلب يطلب الدخول → بعد OTP يعود للدفع → طلبان مستقلان ──
{
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await btn('تخطي').click(); await T(400)
  await btn(/متسوق \(مشتري\)/, false).click(); await btn('متابعة').click(); await T(500)
  await login(c)
  await btn('المتابعة للرئيسية والتسوق').click(); await T(600)
  await btn(/متجر التكنولوجيا الحديثة/, false).first().click(); await T(500)
  await btn(/أضف سماعات/, false).click(); await T(200); await btn('العودة إلى الرئيسية').click(); await T(400)
  await nav().getByRole('button', { name: 'المتاجر' }).click(); await T(400)
  await btn(/عالم الباريستا/, false).first().click(); await T(500)
  await btn(/أضف بن/, false).click(); await T(200); await btn(/أضف بن/, false).click(); await T(300)
  await btn('العودة إلى الرئيسية').click(); await T(400)
  await phone().getByLabel('السلة').click(); await T(500)
  const cartTxt = await phone().innerText()
  check('2) السلة مفصولة: عنوانان لمتجرين + مجموع كل متجر', cartTxt.includes('الطلب 1') && cartTxt.includes('الطلب 2') && cartTxt.includes('مجموع طلب') && /34,500/.test(cartTxt) && /12,000/.test(cartTxt))
  check('2) الإجمالي الكلي 34,500 + 12,000 = 46,500', /46,500/.test(cartTxt))
  await btn(/إتمام الطلب والدفع/, false).click(); await T(600)
  check('9) إتمام الطلب (مسجّل) يفتح شاشة الدفع مباشرة', await has('طريقة الدفع'))
  // 6) تحويل بنكي + إيصال لكل متجر
  await btn(/تحويل بنكي/, false).click(); await T(400)
  const payTxt = await phone().innerText()
  check('6) بيانات حساب كل تاجر تظهر (بنك + رقم حساب + صاحب الحساب)', payTxt.includes('KR-3001-778899-01') && payTxt.includes('KR-3001-224488-07') && payTxt.includes('اسم صاحب الحساب'))
  check('6) زر التأكيد معطّل منطقياً حتى إرفاق الإيصالات', (await btn(/أرفق 2 إيصالات للمتابعة/, false).count()) === 1)
  const up = phone().getByRole('button', { name: /رفع صورة إيصال التحويل/ })
  await up.first().scrollIntoViewIfNeeded(); await up.first().click(); await T(300)
  await up.first().scrollIntoViewIfNeeded(); await up.first().click(); await T(300)
  check('6) إيصالان مرفقان', (await phone().innerText()).split('تم إرفاق إيصال التحويل').length - 1 === 2)
  const confirm = btn(/تأكيد 2 طلبات · 46,500/, false); await confirm.scrollIntoViewIfNeeded(); await confirm.click(); await T(1600)
  const okTxt = await phone().innerText()
  check('2) نجاح: «تم إرسال 2 طلبات» برقمين متتاليين لمتجرين مختلفين', okTxt.includes('تم إرسال 2 طلبات') && okTxt.includes('JD-984210') && okTxt.includes('JD-984211') && okTxt.includes('متجر التكنولوجيا الحديثة') && okTxt.includes('عالم الباريستا'))
  await btn('متابعة طلباتي').click(); await T(500)
  const ordersTxt = await phone().innerText()
  check('6) الطلبات تحمل حالة «بانتظار تأكيد التاجر للتحويل»', ordersTxt.split('بانتظار تأكيد التاجر للتحويل').length - 1 >= 2)
  // 6/7) التاجر يؤكد الاستلام → ينتقل الطلب مباشرة إلى «قيد التجهيز»
  await page.getByRole('button', { name: /لوحة التاجر/ }).click(); await T(600)
  await nav().getByRole('button', { name: 'الطلبات' }).click(); await T(500)
  await btn(/JD-984210/, false).first().click(); await T(500)
  check('6) شاشة التاجر تعرض الإيصال المرفق وزر تأكيد الاستلام', (await has('إيصال التحويل المرفق مع الطلب')) && (await btn(/تأكيد استلام المبلغ وبدء التجهيز/, false).count()) === 1)
  await btn(/تأكيد استلام المبلغ وبدء التجهيز/, false).click(); await T(600)
  check('6/7) بعد التأكيد: الحالة «قيد التجهيز» تلقائياً دون خطوة إضافية', (await has('تم تأكيد استلام المبلغ وبدء التجهيز')) && (await has('قيد التجهيز')))
  await btn('فتح الطلب لمتابعة التجهيز').click(); await T(500)
  check('7) انتقال يدوي واحد متبقٍ: «تسليم الطلب للمندوب — في الطريق»', (await btn(/تسليم الطلب للمندوب/, false).count()) === 1 && !(await has('تغيير مرحلة الطلب الحالية')))
  await btn(/تسليم الطلب للمندوب/, false).click(); await T(400)
  check('7) الحالة الآن «في الطريق» والزر التالي «تأكيد وصول الطلب»', (await btn(/تأكيد وصول الطلب للعميل/, false).count()) === 1)
  // العميل يرى الحالة نفسها
  await page.getByRole('button', { name: /الدخول مباشرة كعميل/ }).click(); await T(500)
  await nav().getByRole('button', { name: 'طلباتي' }).click(); await T(500)
  await btn(/JD-984210/, false).first().click(); await T(500)
  check('7) تفاصيل طلب العميل: «تم تأكيد استلام المبلغ» + «في الطريق» + لا إلغاء بعد التجهيز', (await has('تم تأكيد استلام المبلغ')) && (await has('في الطريق')) && (await btn(/إلغاء الطلب/, false).count()) === 0)
  await page.close()
}

// ── C) استعادة الحساب + روابط الشروط داخل التسجيل + تاجر: الدخول بحساب تاجر يفعّل اللوحة، والعميل لا يملك متجرًا ──
{
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await btn('تخطي').click(); await T(400)
  await btn(/متسوق \(مشتري\)/, false).click(); await btn('متابعة').click(); await T(500)
  check('8) رابط «نسيت بيانات الدخول؟ استعادة الحساب» في شاشة الدخول', (await btn(/استعادة الحساب/, false).count()) === 1)
  await btn(/استعادة الحساب/, false).click(); await T(500)
  check('8) شاشة استعادة الحساب بقناتين (جوال/بريد)', (await has('استعادة الوصول إلى حسابك')) && (await btn(/البريد الإلكتروني/, false).count()) >= 1)
  await btn('إرسال رمز الاستعادة').click(); await T(300)
  check('8) تحقق من صحة المدخل', await has('أدخل رقم جوال صحيح'))
  await phone().locator('input').first().fill('773030064'); await btn('إرسال رمز الاستعادة').click(); await T(900)
  check('8) تم إرسال رمز الاستعادة → إدخال OTP', (await has('تم إرسال رابط استعادة الحساب')) && (await btn('إدخال رمز التحقق').count()) === 1)
  await btn('العودة لتسجيل الدخول').click(); await T(400)
  await btn('إنشاء حساب جديد').click(); await T(400)
  check('4) روابط الشروط والخصوصية قابلة للنقر في التسجيل', (await btn('شروط الاستخدام').count()) === 1 && (await btn('سياسة الخصوصية').count()) === 1)
  await btn('سياسة الخصوصية').click(); await T(400)
  check('4) رابط الخصوصية من التسجيل يفتح الصفحة', await has('2. الموقع الجغرافي'))
  await phone().getByLabel('رجوع').first().click(); await T(300)
  // 5) عميل مسجّل: لا لوحة متجر، بطاقة «انضم كتاجر» تشرح التحويل
  await phone().getByRole('button', { name: 'تسجيل دخول' }).click(); await T(400)
  await login(c)
  await btn('المتابعة للرئيسية والتسوق').click(); await T(500)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(500)
  const accTxt = await phone().innerText()
  check('5) حساب العميل: شارة «عميل» + لا لوحة متجر + بطاقة انضم كتاجر', accTxt.includes('حساب عميل') && !accTxt.includes('لوحة تحكم المتجر') && accTxt.includes('انضم كتاجر وافتح متجرك'))
  await btn(/انضم كتاجر وافتح متجرك/, false).click(); await T(400)
  await btn('البدء بتعبئة نموذج التاجر').click(); await T(500)
  const formTxt = await phone().innerText()
  check('5) نموذج المتجر: الحساب المرتبط + صاحب المتجر + رقم التواصل + الموقع على الخريطة + وقت التوصيل + بيانات الدفع', ['الحساب المرتبط بالمتجر', 'اسم صاحب المتجر', 'رقم التواصل', 'موقع المتجر على الخريطة', 'وقت التوصيل المتوقع', 'بيانات استلام المدفوعات'].every((k) => formTxt.includes(k)))
  await btn('تقديم طلب إنشاء المتجر').click(); await T(300)
  check('5) التحقق يمنع الإرسال بدون موقع/حساب دفع', (await has('حدد موقع المتجر على الخريطة')) && (await has('رقم الحساب / المحفظة مطلوب')))
  await phone().getByLabel('موقع المتجر').click(); await T(300)
  check('5) النقر على الخريطة يثبّت الدبوس', await has('تم تثبيت الدبوس'))
  await page.close()
}

// ── D) الدخول بحساب «تاجر» يمنح لوحة التاجر ويعرض بيانات المتجر في حسابي ──
{
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await btn('تخطي').click(); await T(400)
  await btn(/تاجر \(صاحب متجر\)/, false).click(); await btn('متابعة').click(); await T(500)
  await login(c)
  check('5) نجاح الدخول كتاجر: «تاجر معتمد» + زر لوحة التحكم', (await has('تاجر معتمد')) && (await btn('الانتقال إلى لوحة تحكم المتجر').count()) === 1)
  await btn('الانتقال إلى لوحة تحكم المتجر').click(); await T(500)
  check('5) لوحة التاجر تفتح', await has('لوحة إدارة المتجر والمبيعات'))
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(500)
  const t = await phone().innerText()
  check('5) حسابي للتاجر: بيانات المتجر (الاسم، صاحب المتجر، الحساب المرتبط، التواصل، التوصيل، الموقع، حساب الدفع)', ['بيانات متجري', 'صاحب المتجر', 'الحساب المرتبط', 'رقم التواصل', 'وقت التوصيل المتوقع', 'الموقع', 'حساب استلام المدفوعات', 'حساب تاجر معتمد'].every((k) => t.includes(k)))
  await page.close()
}

console.log(`\n${pass} PASS / ${fail} FAIL · console errors: ${errors.length ? errors.slice(0, 5) : 'none'}`)
await browser.close(); process.exit(fail || errors.length ? 1 : 0)
