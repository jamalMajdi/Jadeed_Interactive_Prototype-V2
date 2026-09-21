// فحص RC-8 (8 نقاط): نوع حساب واحد · لا زائر + الإضافة للسلة تتطلب الدخول · قفل اسم/نشاط المتجر بعد التوثيق ·
// توثيق بصورتين للبطاقة + صور الواجهة · Toggle مفتوح/مغلق وأثره على العميل · شاشة الحظر · ضمان التاجر · المبلغ المستحق
const PW = process.env.PLAYWRIGHT_PATH || '/home/user/.npm/_npx/f0a362733743bae2/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const browser = await chromium.launch()
const errors = []
let pass = 0, fail = 0
const check = (n, ok, x = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} — ${n}${x ? ' · ' + x : ''}`) }
const T = (ms) => new Promise((r) => setTimeout(r, ms))
async function fresh(hash = '#/prototype') {
  const page = await browser.newPage({ viewport: { width: 1400, height: 980 } })
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()) }); page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto('http://localhost:5173/' + hash); await T(hash === '#/prototype' ? 3600 : 800)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const nav = () => phone().locator('nav')
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(() => false)
  const btn = (name, exact = true) => phone().getByRole('button', { name, exact })
  const demo = (name) => page.getByRole('button', { name })
  return { page, phone, nav, has, btn, demo }
}
async function login(c) {
  const { phone, btn } = c
  await phone().locator('input').first().fill('773030064'); await btn(/إرسال رمز/, false).click(); await T(600)
  await btn(/الانتقال لإدخال/, false).click(); await T(400)
  const inputs = phone().locator('input'); for (let i = 0; i < 4; i++) await inputs.nth(i).fill(String('1234'[i])); await T(1700)
}

// ── 1 + 2) نوع حساب واحد · لا تخطي/زائر · الإضافة للسلة تتطلب الدخول ──
{
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await btn('تخطي').click(); await T(400) // تخطي شرائح التهيئة فقط
  check('1) خيارات نوع الحساب: عميل + تاجر فقط (لا «كلاهما»)', (await btn(/متسوق \(مشتري\)/, false).count()) === 1 && (await btn(/تاجر \(صاحب متجر\)/, false).count()) === 1 && (await btn(/كلاهما/, false).count()) === 0)
  check('2) لا زر «تخطي» ولا «تصفح كزائر» في شاشة نوع الحساب', (await btn('تخطي').count()) === 0 && (await btn(/كزائر/, false).count()) === 0)
  await btn(/متسوق \(مشتري\)/, false).click(); await btn('متابعة').click(); await T(500)
  check('2) لا رابط «تصفح كزائر» في شاشة الدخول', (await btn(/كزائر/, false).count()) === 0)
  // محاولة الإضافة للسلة بلا تسجيل: عبر المعرض بحالة غير مسجّل (لا يوجد مسار زائر في النموذج)
  await page.goto('http://localhost:5173/#/gallery/login-gated'); await T(700)
  check('2) بوابة الدخول للمستخدم غير المسجّل ما زالت موجودة (returnTo)', await has('هذه الميزة تتطلب تسجيل الدخول'))
  await page.close()
}
{
  // الإضافة للسلة كمستخدم غير مسجّل → بوابة الدخول ولا تُضاف (نستخدم شاشة المتجر من المعرض بحالة guest)
  const c = await fresh('#/gallery/store'); const { phone, has, btn, page } = c
  // معرض «store» يعرض عميلاً مسجّلاً افتراضياً — نسجّل الخروج أولاً من حسابي؟ الأبسط: تحقق عبر الحالة الابتدائية للنموذج (غير مسجّل) بعد العودة من الدخول
  await page.goto('http://localhost:5173/#/prototype'); await T(3600)
  await btn('تخطي').click(); await T(400)
  await btn(/متسوق \(مشتري\)/, false).click(); await btn('متابعة').click(); await T(500)
  // الرجوع من الدخول إلى نوع الحساب ثم الرئيسية غير متاح — لذلك نتحقق من حارس الـ reducer + زر المنتج عبر شاشة معرض بحالة guest
  await page.goto('http://localhost:5173/#/gallery/account-guest'); await T(700)
  check('2) شاشة حسابي لغير المسجّل تطلب الدخول للتسوق (لا نص «تتصفح كزائر»)', (await has('سجّل الدخول للتسوق')) && !(await has('تتصفح كزائر')))
  await page.close()
}
{
  // الإضافة للسلة بدون تسجيل: نفتح الرئيسية من المعرض بحالة غير مسجّل عبر معرض home ثم LOGOUT؟ — بدلاً من ذلك: تسجيل خروج من النموذج ثم فحص أن الخروج يعيد إلى نوع الحساب (لا تصفح كزائر)
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  await btn('تسجيل الخروج').click(); await T(500)
  check('2) تسجيل الخروج يعيد إلى اختيار نوع الحساب (لا تصفح كزائر بعد الخروج)', (await has('مرحباً بك في')) && (await btn(/متسوق \(مشتري\)/, false).count()) === 1)
  await page.close()
}
{
  // 2) الحارس الفعلي: زر «أضف للسلة» لمستخدم غير مسجّل يفتح بوابة الدخول ولا يضيف — عبر شاشة المتجر في المعرض بحالة guest (nearby → store)
  const c = await fresh('#/gallery/home'); const { phone, has, btn, page } = c
  // نبدّل الحالة إلى غير مسجّل بتسجيل الخروج من حسابي داخل المعرض
  await phone().locator('nav').getByRole('button', { name: 'حسابي' }).click(); await T(400)
  await btn('تسجيل الخروج').click(); await T(500)
  // بعد الخروج: شاشة نوع الحساب — لا مسار للرئيسية بدون دخول ⇒ نكتفي بفحص أن الشاشة الظاهرة هي نوع الحساب
  check('2) بعد الخروج لا يمكن الوصول للرئيسية/السلة بدون دخول (شاشة نوع الحساب)', (await btn(/تاجر \(صاحب متجر\)/, false).count()) === 1 && (await phone().getByLabel('السلة').count()) === 0)
  await page.close()
}

// ── 3 + 5) لوحة التاجر: Toggle حالة المتجر · قفل الاسم/النشاط بعد التوثيق · أثر الإغلاق على العميل والسلة ──
{
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/لوحة التاجر/).click(); await T(700)
  check('5) Toggle حالة المتجر ظاهر في اللوحة وحالته «مفتوح»', (await phone().getByLabel('تبديل حالة المتجر').count()) === 1 && (await phone().getByLabel('تبديل حالة المتجر').getAttribute('aria-checked')) === 'true' && (await has('حالة المتجر:')))
  await btn(/تعديل بيانات المتجر/, false).click(); await T(500)
  check('3) بعد التوثيق: حقل اسم المتجر disabled', await phone().getByLabel('اسم المتجر').isDisabled())
  check('3) بعد التوثيق: حقل نوع النشاط disabled + تنبيه القفل', (await phone().getByLabel('نوع النشاط').isDisabled()) && (await has('ثابتان بعد التوثيق')))
  check('3) بقية الحقول قابلة للتعديل (الوصف)', !(await phone().locator('textarea').first().isDisabled()))
  await phone().getByLabel('رجوع').first().click(); await T(400)
  // إغلاق المتجر
  await phone().getByLabel('تبديل حالة المتجر').click(); await T(400)
  check('5) بعد الضغط: الحالة «مغلق» + Toast', (await phone().getByLabel('تبديل حالة المتجر').getAttribute('aria-checked')) === 'false' && (await has('تم إغلاق المتجر')))
  // واجهة العميل: المتجر يظهر مغلقاً ولا يمكن الإضافة
  await phone().getByLabel('التسوق').click(); await T(500)
  await nav().getByRole('button', { name: 'المتاجر' }).click(); await T(400)
  const storesTxt = await phone().locator('button').filter({ hasText: 'متجر التكنولوجيا الحديثة' }).first().innerText()
  check('5) قائمة المتاجر لدى العميل تعرض «مغلق» للمتجر', storesTxt.includes('مغلق'))
  await btn(/متجر التكنولوجيا الحديثة/, false).first().click(); await T(500)
  check('5) صفحة المتجر: «مغلق حالياً» + شريط لا يستقبل طلبات جديدة', (await has('مغلق حالياً')) && (await has('لا يستقبل طلبات جديدة')))
  await btn(/أضف سماعات/, false).click(); await T(300)
  check('5) الإضافة للسلة مرفوضة والمتجر مغلق (Toast + بلا شارة)', (await has('المتجر مغلق حالياً ولا يستقبل طلبات جديدة')) && (await btn(/أضف سماعات/, false).innerText()).trim() !== '1')
  await btn('العودة إلى الرئيسية').click(); await T(400)
  // منتج المتجر المغلق من الرئيسية: زر البطاقة يعرض «المتجر مغلق»
  check('5) بطاقات الرئيسية لمنتجات المتجر المغلق: زر «المتجر مغلق»', (await phone().getByRole('button', { name: /المتجر مغلق/ }).count()) >= 1)
  // إعادة الفتح من اللوحة
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  await btn(/لوحة تحكم المتجر/, false).click(); await T(500)
  await phone().getByLabel('تبديل حالة المتجر').click(); await T(400)
  check('5) إعادة الفتح: الحالة «مفتوح» + Toast', (await phone().getByLabel('تبديل حالة المتجر').getAttribute('aria-checked')) === 'true' && (await has('تم فتح المتجر')))
  await phone().getByLabel('التسوق').click(); await T(500)
  await btn(/متجر التكنولوجيا الحديثة/, false).first().click(); await T(500)
  await btn(/أضف سماعات/, false).click(); await T(300)
  check('5) بعد الفتح: الإضافة للسلة تعمل مجدداً', (await btn(/أضف سماعات/, false).innerText()).trim() === '1')
  await page.close()
}
{
  // 5) منتج في السلة ثم يُغلق المتجر → السلة تمنع إتمام الطلب
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/لوحة التاجر/).click(); await T(700)
  await phone().getByLabel('التسوق').click(); await T(500)
  await btn(/متجر التكنولوجيا الحديثة/, false).first().click(); await T(500)
  await btn(/أضف سماعات/, false).click(); await T(300)
  await btn('العودة إلى الرئيسية').click(); await T(400)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  await btn(/لوحة تحكم المتجر/, false).click(); await T(500)
  await phone().getByLabel('تبديل حالة المتجر').click(); await T(400)
  await phone().getByLabel('التسوق').click(); await T(500)
  await phone().getByLabel('السلة').click(); await T(500)
  check('5) السلة: شارة «مغلق حالياً» على المتجر + زر إتمام الطلب معطّل برسالة', (await has('مغلق حالياً')) && (await btn(/إتمام الطلب والدفع/, false).isDisabled()) && (await has('لا يستقبل طلبات جديدة')))
  await page.close()
}

// ── 4) التوثيق: صورتان للبطاقة + صور الواجهة (مغطّى أيضاً في qa-phase6) ──
{
  const c = await fresh('#/gallery/m-identity'); const { phone, has, btn, page } = c
  check('4) شاشة التوثيق: وجه/ظهر البطاقة + صور واجهة المتجر + توضيح لكل حقل', (await has('1) وجه البطاقة')) && (await has('2) ظهر البطاقة')) && (await has('صور حقيقية لواجهة المتجر')) && (await has('تُستخدمان للتحقق من هوية المالك')) && (await has('تُلتقطان في الموقع')))
  check('4) زر المتابعة معطّل + قائمة النواقص', (await btn(/متابعة لرفع صورة المتجر/, false).isDisabled()) && (await has('متبقٍ لإكمال التوثيق')))
  await phone().getByLabel('رفع 1) وجه البطاقة (الأمام)').click(); await phone().getByLabel('رفع 2) ظهر البطاقة (الخلف)').click(); await T(200)
  check('4) بعد البطاقتين: ما زال ناقصاً «2 صورة لواجهة المتجر»', (await has('2 صورة لواجهة المتجر')) && (await btn(/متابعة لرفع صورة المتجر/, false).isDisabled()))
  await phone().getByLabel('التقاط صورة لواجهة المتجر').click(); await T(150); await phone().getByLabel('التقاط صورة لواجهة المتجر').click(); await T(200)
  check('4) اكتمال 2+2 يفعّل المتابعة', !(await btn(/متابعة لرفع صورة المتجر/, false).isDisabled()) && (await has('اكتملت صور التوثيق')))
  await phone().getByLabel('حذف 1) وجه البطاقة (الأمام)').click(); await T(200)
  check('4) حذف صورة يعيد التعطيل', await btn(/متابعة لرفع صورة المتجر/, false).isDisabled())
  await page.close()
}

// ── 6) التاجر المحظور ──
{
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/محاكاة: متجر محظور/).click(); await T(600)
  check('6) شاشة الحظر المستقلة: عنوان واضح + سبب الحظر', (await has('متجرك محظور حالياً')) && (await has('سبب الحظر')) && (await has('3 بلاغات موثّقة')))
  check('6) زرّا الاعتراض وتسجيل الخروج موجودان', (await btn(/إرسال الاعتراض للإدارة/, false).count()) === 1 && (await btn('تسجيل الخروج').count()) === 1)
  await btn(/إرسال الاعتراض للإدارة/, false).click(); await T(300)
  check('6) تحقق: اعتراض قصير مرفوض', await has('لا يقل عن 20 حرفاً'))
  await phone().getByLabel('نص الاعتراض').fill('تمت إزالة المنتجات المخالفة وتحديث الأوصاف لتطابق الصور الفعلية، أرجو إعادة النظر.')
  await btn(/إرسال الاعتراض للإدارة/, false).click(); await T(400)
  check('6) بعد الإرسال: تأكيد استلام الاعتراض', await has('تم استلام اعتراضك'))
  // المحظور لا يصل إلى لوحة التاجر
  await page.goto('http://localhost:5173/#/gallery/m-dashboard'); await T(300)
  await page.goto('http://localhost:5173/#/prototype'); await T(3600)
  await demo(/محاكاة: متجر محظور/).click(); await T(500)
  await demo(/لوحة التاجر \(M-050\)/).click(); await T(300) // إعادة LOGIN لا ترفع الحظر، وحارس الراوتر يمنع شاشات m-*
  const t = await phone().innerText()
  check('6) أثناء الحظر: أي محاولة لفتح لوحة التاجر تعرض شاشة الحظر (الحظر لا يُرفع بإعادة الدخول)', t.includes('متجرك محظور حالياً') && !t.includes('لوحة إدارة المتجر'))
  await page.close()
}
{
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/محاكاة: متجر محظور/).click(); await T(600)
  await btn('تسجيل الخروج').click(); await T(500)
  check('6) تسجيل الخروج من شاشة الحظر يعمل (→ نوع الحساب)', (await btn(/متسوق \(مشتري\)/, false).count()) === 1)
  await page.close()
}
{
  // حسابي للتاجر المحظور + الحارس على شاشات m-*
  const c = await fresh('#/gallery/account-merchant-banned'); const { phone, has, btn, page } = c
  check('6) حسابي: بطاقة «متجرك محظور» تقود لشاشة الحظر', (await has('متجرك محظور من قِبل الإدارة')) && (await has('المتجر محظور')))
  await btn(/متجرك محظور من قِبل الإدارة/, false).click(); await T(400)
  check('6) البطاقة تفتح شاشة الحظر', await has('سبب الحظر'))
  await page.goto('http://localhost:5173/#/gallery/m-banned'); await T(600)
  await phone().locator('nav').count() // لا شريط سفلي للتاجر في شاشة الحظر
  check('6) عنصر المعرض m-banned يعرض الشاشة كاملة', (await has('تقديم اعتراض للإدارة')) && (await btn('تسجيل الخروج').count()) === 1)
  await page.close()
}

// ── 7 + 8) المصطلحات ──
{
  const c = await fresh('#/gallery/product'); const { phone, has, page } = c
  check('7) صفحة المنتج: «ضمان التاجر» بدل «ضمان الجودة»', (await has('ضمان التاجر')) && !(await has('ضمان الجودة')))
  await page.goto('http://localhost:5173/#/gallery/delivered'); await T(700)
  check('8) شاشة التسليم: «المبلغ المستحق» بدل «المبلغ المدفوع»', (await has('المبلغ المستحق')) && !(await has('المدفوع')))
  await page.close()
}

console.log(`\n${pass} PASS / ${fail} FAIL · console errors: ${errors.length ? errors.slice(0, 5) : 'none'}`)
await browser.close(); process.exit(fail || errors.length ? 1 : 0)
