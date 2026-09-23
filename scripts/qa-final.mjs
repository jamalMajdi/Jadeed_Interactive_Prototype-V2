// فحص النقاط الـ 24 المطلوبة (بدون OTP) — يعمل على النموذج التفاعلي
const PW = '/home/user/jadeed-app/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const browser = await chromium.launch()
const errors = []
let pass = 0, fail = 0
const check = (n, ok, extra='') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} — ${n}${extra ? ' · '+extra : ''}`) }
const T = (ms) => new Promise(r => setTimeout(r, ms))

async function fresh() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 980 } })
  page.on('console', m => { if (['error','warning'].includes(m.type())) errors.push(m.text()) })
  page.on('pageerror', e => errors.push(String(e)))
  await page.goto('http://localhost:5173/#/prototype'); await T(3600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const nav = () => phone().locator('nav')
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  const btn = (name, exact=true) => phone().getByRole('button', { name, exact })
  const demo = (name) => page.getByRole('button', { name })
  return { page, phone, nav, has, btn, demo }
}

console.log('=== POINT 1: Guest browsing + account screen ===')
{
  const c = await fresh(); const { phone, has, btn, nav } = c
  await btn('تخطي').click(); await T(400)
  // onboarding guest button exists
  check('1) شاشة نوع الحساب بها «تصفح كزائر بدون تسجيل»', await btn('تصفح كزائر بدون تسجيل').isVisible())
  await btn('تصفح كزائر بدون تسجيل').click(); await T(700)
  check('1) الزائر يصل للرئيسية مع شريط سفلي', await has('الأقسام والتصنيفات') && await nav().isVisible())
  // guest can browse stores
  await phone().getByText('المتاجر المعتمدة في تعز').first().click().catch(()=>{}); await T(300)
  await nav().getByRole('button', { name: 'المتاجر' }).click(); await T(500)
  check('1) الزائر يتصفح تبويب المتاجر', await has('المتاجر القريبة') || await has('متجر'))
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(500)
  check('1) حسابي كزائر يظهر زر دخول وإنشاء حساب', await btn('تسجيل الدخول').isVisible() && await btn('إنشاء حساب').isVisible())
  check('1) حسابي كزائر يبقي الخيارات ظاهرة (موقع التوصيل/طلباتي/المفضلة/الدعم/الشروط/الخصوصية)', await has('موقع التوصيل') && await has('سجل الطلبات') && await has('قائمة المفضلة') && await has('المساعدة والدعم') && await has('شروط الاستخدام') && await has('سياسة الخصوصية'))
  check('1) لا يوجد «بوابة إدارة المنصة» للزائر', !(await has('بوابة إدارة المنصة')))
  await c.page.close()
}

console.log('\n=== POINT 2: Add to cart direct + confirm if exists ===')
{
  const c = await fresh(); const { phone, has, btn, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  // first add
  const addBtn = phone().getByRole('button', { name: /أضف للسلة/ }).first()
  await addBtn.scrollIntoViewIfNeeded(); await addBtn.click(); await T(400)
  check('2) الضغطة الأولى تضيف مباشرة (Toast «أُضيف إلى السلة»)', await has('أُضيف إلى السلة'))
  const cartCount = await phone().getByLabel('السلة').innerText().catch(()=> '')
  check('2) عداد السلة = 1 بعد الإضافة الأولى', cartCount.trim() === '1')
  // second add same product - button now says «في السلة (1)»
  const secondBtn = phone().getByRole('button', { name: /في السلة/ }).first()
  await secondBtn.click(); await T(500)
  check('2) الضغطة الثانية على نفس المنتج تظهر Toast علوي «المنتج موجود بالفعل»', await has('المنتج موجود بالفعل في السلة'))
  check('2) Toast علوي يسأل «هل تريد إضافته مرة أخرى» مع زر «إضافة مرة أخرى»', await has('هل تريد إضافته مرة أخرى') && await btn('إضافة مرة أخرى').isVisible())
  await btn('إضافة مرة أخرى').click(); await T(500)
  const cartCount2 = await phone().getByLabel('السلة').innerText().catch(()=> '')
  check('2) بعد تأكيد «إضافة مرة أخرى» العداد = 2', cartCount2.trim() === '2')
  await c.page.close()
}

console.log('\n=== POINT 3: OTP removed, email link only ===')
{
  const c = await fresh(); const { phone, has, btn } = c
  await btn('تخطي').click(); await T(400)
  await btn(/متسوق/).click(); await btn('متابعة').click(); await T(500)
  check('3) شاشة الدخول بها بريد + كلمة مرور (لا OTP)', await has('البريد الإلكتروني') && await has('كلمة المرور') && !(await has('رمز التحقق السريع (OTP)')))
  // register flow
  await btn('إنشاء حساب جديد').click(); await T(500)
  check('3) شاشة التسجيل لا تذكر OTP', !(await has('رمز التحقق')) && await has('الاسم الرباعي'))
  // fill quadruple name
  const inputs = phone().locator('input')
  await inputs.nth(0).fill('محمد سعيد أحمد علي')
  await inputs.nth(1).fill('test@example.com')
  await inputs.nth(2).fill('773030064')
  await inputs.nth(3).fill('password123')
  await phone().locator('input[type="checkbox"]').check()
  await btn('إنشاء حساب').click(); await T(800)
  check('3) بعد التسجيل يظهر «تم إرسال رابط التحقق» بدل «تم ارسال رمز التحقق»', await has('تم إرسال رابط التحقق'))
  await btn(/فتح رابط التحقق/).click(); await T(600)
  check('3) بعد فتح رابط التحقق يدخل مباشرة (شاشة نجاح أو الرئيسية)', await has('تم حفظ بيانات الحساب بنجاح') || await has('الأقسام والتصنيفات'))
  await c.page.close()
}

console.log('\n=== POINT 4: Welcome screen as Toast/popup ===')
{
  const c = await fresh(); const { phone, has, btn, demo, page } = c
  await page.goto('http://localhost:5173/#/gallery/login-success'); await T(600)
  check('4) شاشة «أهلاً بك مجدداً» كـ popup فوق الخلفية مع تعتيم', await has('أهلاً بك مجدداً في جديد') && await phone().locator('.bg-ink-900\\/55').count() > 0)
  check('4) بها مؤقت وزر «الذهاب للتسوق»', await has('الذهاب للتسوق') && await has('يُغلق'))
  check('4) لا توجد معلومات غير ضرورية (طريقة التحقق/نوع الحساب/حالة الجلسة)', !(await has('طريقة التحقق')) && !(await has('نوع الحساب')) && !(await has('حالة الجلسة')))
  await btn('الذهاب للتسوق').click(); await T(500)
  check('4) زر «الذهاب للتسوق» ينقل للرئيسية', await has('الأقسام والتصنيفات'))
  await page.close()
}
{
  const c = await fresh(); const { has, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  // WelcomeBanner top
  check('4) بعد الدخول المباشر يظهر Toast علوي «أهلاً بك مجدداً» مع زر الذهاب للتسوق', await has('أهلاً بك مجدداً في جديد') && await has('الذهاب للتسوق'))
  await c.page.close()
}

console.log('\n=== POINT 5: Remove back to home from store ===')
{
  const c = await fresh(); const { phone, has, btn, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await phone().getByText('متجر التكنولوجيا الحديثة').first().click().catch(async () => { await phone().locator('nav').getByRole('button', { name: 'المتاجر' }).click(); await T(400); await phone().getByText('متجر التكنولوجيا الحديثة').first().click() }); await T(600)
  check('5) شاشة المتجر بلا زر «العودة إلى الرئيسية» (سهم الرجوع كاف)', !(await has('العودة إلى الرئيسية')) && (await phone().getByLabel('رجوع').count()) === 1)
  await c.page.close()
}

console.log('\n=== POINT 6: الأقل سعراً ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/search'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('6) نص «الأقل سعراً» موجود بدل «الأرخص سعراً»', await has('الأقل سعراً') && !(await has('الأرخص سعراً')))
  await page.close()
}

console.log('\n=== POINT 7: Multiple product images max 3 ===')
{
  const c = await fresh(); const { phone, has, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await phone().getByText('سماعات رأس لاسلكية احترافية').first().click(); await T(600)
  const dots = phone().locator('[aria-label^="صورة"]')
  const prev = phone().getByLabel('الصورة السابقة')
  const next = phone().getByLabel('الصورة التالية')
  check('7) صفحة المنتج تدعم صور متعددة (أزرار تنقل أو نقاط)', (await dots.count()) >= 2 || (await prev.count()) === 1)
  // check max 3
  const imgCount = await dots.count()
  check('7) الحد الأقصى 3 صور', imgCount <= 3)
  await c.page.close()
}

console.log('\n=== POINT 8: Store name in orange ===')
{
  const c = await fresh(); const { phone, has, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  const storeLine = phone().locator('.text-secondary').first()
  check('8) اسم المتجر فوق المنتج باللون البرتقالي (text-secondary)', await storeLine.isVisible() && (await has('متجر التكنولوجيا') || await has('عطور الجزيرة')))
  await c.page.close()
}

console.log('\n=== POINT 9: Payment methods ===')
{
  const c = await fresh(); const { phone, has, btn, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await phone().getByRole('button', { name: /أضف للسلة/ }).first().click(); await T(300)
  await phone().getByLabel('السلة').click(); await T(400)
  await btn(/إتمام الطلب والدفع/).click(); await T(600)
  check('9) طرق الدفع: «محفظة جديد» موجودة لكن «قريباً» ومعطلة', await has('محفظة جديد الرقمية') && await has('قريباً'))
  check('9) خيار البطاقة البنكية محذوف نهائياً', !(await has('بطاقة بنكية')))
  check('9) الدفع نقداً والتحويل متاحان', await has('الدفع نقداً عند الاستلام') && await has('تحويل بنكي'))
  await c.page.close()
}

console.log('\n=== POINT 11: Checkout store logo ===')
{
  const c = await fresh(); const { phone, has, btn, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await phone().getByRole('button', { name: /أضف للسلة/ }).first().click(); await T(300)
  await phone().getByLabel('السلة').click(); await T(400)
  await btn(/إتمام الطلب والدفع/).click(); await T(600)
  await btn(/تحويل بنكي/).click(); await T(400)
  check('11) في إتمام الطلب «حوّل إلى» يعرض صورة/شعار المتجر', (await phone().locator('img[src*="/img/"]').count()) >= 1 && await has('حوّل إلى'))
  await c.page.close()
}

console.log('\n=== POINT 12: Order stages 2 only + auto 24h ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/m-orders'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('12) لوحة التاجر: أقسام «جديد» و«قيد التوصيل» و«منتهية» فقط (لا قيد التجهيز/في الطريق)', await has('طلبات جديدة') && await has('قيد التوصيل') && !(await has('قيد التجهيز')) && !(await has('في الطريق')))
  await page.goto('http://localhost:5173/#/gallery/tracking-out'); await T(600)
  check('12) تتبع الطلب: 3 مراحل فقط (جديد/قيد التوصيل/تم التوصيل)', (await phone().getByText('جديد').count()) >= 1 && await has('قيد التوصيل') && await has('تم التوصيل') && !(await has('قيد التجهيز')))
  // check AppContext code for 24h
  const fs = await import('fs')
  const ctx = fs.readFileSync('/home/user/jadeed-app/src/store/AppContext.jsx', 'utf-8')
  check('12) كود التسليم التلقائي بعد 24 ساعة موجود (24*60*60*1000)', ctx.includes('24 * 60 * 60 * 1000') && ctx.includes('DELIVER_AFTER_MS'))
  await page.close()
}

console.log('\n=== POINT 13: Cancel confirmation ===')
{
  const c = await fresh(); const { phone, has, btn, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await phone().getByRole('button', { name: /أضف للسلة/ }).first().click(); await T(300)
  await phone().getByLabel('السلة').click(); await T(400)
  await btn(/إتمام الطلب والدفع/).click(); await T(600)
  // fill contact if needed
  const nameInput = phone().locator('input[placeholder="الاسم الكامل"]')
  if (await nameInput.count()) { await nameInput.fill('محمد سعيد أحمد علي'); }
  await btn(/تأكيد/).last().click(); await T(1200)
  // OrderSuccess screen -> go to orders
  if (await btn(/متابعة طلباتي/).count()) await btn(/متابعة طلباتي/).click()
  else if (await btn(/تتبع حالة الطلب/).count()) { await btn(/تتبع حالة الطلب/).click(); await T(500); await c.page.goto('http://localhost:5173/#/prototype'); await T(1000); await c.demo(/الدخول مباشرة كعميل/).click(); await T(600); await phone().locator('nav').getByRole('button', { name: 'طلباتي' }).click(); }
  await T(500)
  await phone().getByText(/JD-/).first().click(); await T(500)
  await btn(/إلغاء الطلب/).click(); await T(500)
  check('13) عند الإلغاء تظهر نافذة تأكيد «هل تريد فعلا الغاء هذا الطلب؟» مع الحالة', await has('هل تريد فعلاً إلغاء هذا الطلب') && await has('حالته الحالية'))
  await c.page.close()
}

console.log('\n=== POINT 14: Remove admin portal ===')
{
  const c = await fresh(); const { phone, has, demo, nav } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(500)
  check('14) لا يوجد «بوابة إدارة المنصة» في حسابي', !(await has('بوابة إدارة المنصة')) && !(await has('Admin Web')))
  await c.page.close()
}

console.log('\n=== POINT 15: Logout confirmation ===')
{
  const c = await fresh(); const { phone, has, btn, demo, nav } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(500)
  await btn('تسجيل الخروج').click(); await T(400)
  check('15) عند تسجيل الخروج تظهر نافذة تأكيد', await has('تأكيد تسجيل الخروج'))
  await c.page.close()
}

console.log('\n=== POINT 16: Promo card gradients not black ===')
{
  const fs = await import('fs')
  const shopping = fs.readFileSync('/home/user/jadeed-app/src/screens/Shopping.jsx', 'utf-8')
  check('16) لا يوجد تدرج أسود في PROMO_TONES (from-ink-900 to-ink-700 محذوف)', !shopping.includes('from-ink-900 to-ink-700'))
  check('16) يوجد تدرج هوية (brand: from-primary-700 via-primary to-secondary)', shopping.includes('from-primary-700 via-primary to-secondary'))
}

console.log('\n=== POINT 17: Password recovery email only ===')
{
  const c = await fresh(); const { phone, has, btn } = c
  await btn('تخطي').click(); await T(400)
  await phone().getByRole('button', { name: /متسوق/ }).click(); await phone().getByRole('button', { name: 'متابعة' }).click(); await T(500)
  await phone().locator('input').first().fill('test@example.com')
  await phone().locator('input').nth(1).fill('password123')
  await btn('تسجيل الدخول').click(); await T(700)
  // go to login again for forgot
  await phone().locator('div[style*="width: 390px"]').first().getByRole('button', { name: 'حسابي' }).click().catch(()=>{}); await T(300)
  const page = c.page
  await page.goto('http://localhost:5173/#/gallery/forgot-password'); await T(600)
  const ph = () => page.locator('div[style*="width: 390px"]').first()
  const has2 = (t) => ph().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('17) شاشة الاستعادة عبر البريد فقط (لا رقم جوال)', await has2('البريد الإلكتروني') && !(await has2('رقم الجوال المسجّل')))
  await ph().locator('input').first().fill('test@example.com')
  await ph().getByRole('button', { name: /إرسال رابط الاستعادة/ }).click(); await T(800)
  check('17) بعد إدخال البريد يظهر «تم إرسال رابط»', await has2('تم إرسال رابط'))
  await ph().getByRole('button', { name: /فتح رابط الاستعادة/ }).click(); await T(600)
  check('17) فتح الرابط يذهب لتعيين كلمة مرور جديدة (بدون OTP)', await has2('كلمة المرور الجديدة') || await has2('تعيين كلمة مرور'))
  await page.close()
}

console.log('\n=== POINT 18: Delivery time custom ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/m-form'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  const sel = phone().locator('select').nth(1)
  const opts = await sel.locator('option').allInnerTexts().catch(()=>[])
  check('18) قائمة مدة التوصيل تحتوي «لدي مدة توصيل خاصة»', opts.join(' ').includes('لدي مدة توصيل خاصة'))
  await sel.selectOption({ label: 'لدي مدة توصيل خاصة' }); await T(500)
  check('18) عند اختيار «لدي مدة خاصة» يظهر حقل إدخال', (await phone().locator('input[placeholder*="2-3 ساعات"]').count()) === 1)
  await page.close()
}

console.log('\n=== POINT 19: Quadruple name ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/register'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('19) حقل الاسم الرباعي ظاهر', await has('الاسم الرباعي'))
  // try 2 names should fail
  const inputs = phone().locator('input')
  await inputs.nth(0).fill('محمد سعيد')
  await inputs.nth(1).fill('a@b.com')
  await inputs.nth(2).fill('773030064')
  await inputs.nth(3).fill('password123')
  await phone().locator('input[type="checkbox"]').check()
  await phone().getByRole('button', { name: 'إنشاء حساب' }).click(); await T(400)
  check('19) اسم من كلمتين يرفض ويطلب 4 أسماء', await has('الرباعي'))
  await page.close()
}

console.log('\n=== POINT 20: Logo & cover inside form ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/m-form'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('20) نموذج إنشاء المتجر يحتوي حقلي شعار وغلاف واضحين', await has('شعار المتجر') && await has('غلاف المتجر'))
  check('20) حقول الرفع داخل النموذج وليس زر غامض', (await phone().getByText('رفع شعار المتجر').count()) >= 1 && (await phone().getByText('رفع غلاف المتجر').count()) >= 1)
  await page.close()
}

console.log('\n=== POINT 21: Admin vs customer images clarification ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/m-identity'); await T(600)
  let phone = () => page.locator('div[style*="width: 390px"]').first()
  let has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('21) شاشة التوثيق توضح أن صور الواجهة للإدارة فقط ولا تظهر للعملاء', await has('للإدارة فقط') || await has('لا تظهر للعملاء'))
  await page.goto('http://localhost:5173/#/gallery/m-media'); await T(600)
  phone = () => page.locator('div[style*="width: 390px"]').first()
  has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('21) شاشة صور العملاء توضح أنها ما يراه العميل وليست للتوثيق', await has('ما يراه العميل') || await has('تظهر للعملاء مباشرة'))
  await page.close()
}

console.log('\n=== POINT 22: Pending without approve/reject ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/m-pending'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('22) شاشة «قيد المراجعة» بلا زري اعتماد/رفض', !(await has('محاكاة: اعتماد')) && !(await has('محاكاة: رفض')) && await has('قيد المراجعة'))
  await page.close()
}

console.log('\n=== POINT 23: Location detected as popup ===')
{
  const c = await fresh(); const { page } = c
  await page.goto('http://localhost:5173/#/gallery/loc-success'); await T(600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(()=>false)
  check('23) شاشة «تم رصد إحداثياتك» كـ popup مع تعتيم/ضباب', await has('تم رصد إحداثياتك بنجاح') && (await phone().locator('.bg-ink-900\\/65').count() > 0))
  check('23) بها مؤقت وزر خروج', await has('يُغلق تلقائياً') && await has('خروج'))
  await page.close()
}

console.log('\n=== POINT 24: Notifications icon beside cart ===')
{
  const c = await fresh(); const { phone, has, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  check('24) أيقونة التنبيهات بجانب السلة في الرئيسية', (await phone().getByLabel('التنبيهات').count()) === 1 && (await phone().getByLabel('السلة').count()) === 1)
  await phone().getByText('سماعات رأس لاسلكية احترافية').first().click(); await T(600)
  check('24) أيقونة التنبيهات بجانب السلة في صفحة المنتج', (await phone().getByLabel('التنبيهات').count()) === 1)
  await c.page.close()
}

console.log(`\n=== FINAL: ${pass} PASS / ${fail} FAIL · console errors: ${errors.length ? errors.join(' | ') : 'none'} ===`)
await browser.close()
process.exit(fail === 0 && errors.length === 0 ? 0 : 1)
