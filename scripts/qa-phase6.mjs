// فحص المرحلة 6 (RC-7) في وضع النموذج التفاعلي: OTP (تحميل/انتهاء/إعادة إرسال) · المخزون · البحث المدمج · الموقع الواحد ·
// بيانات العميل عند الطلب · إلغاء التاجر بعد القبول وأثره على العميل · متجر واحد للتاجر · زر التسوق · الانقطاع · Toast من الأسفل · أيقونة السلة
const PW = process.env.PLAYWRIGHT_PATH || '/home/user/jadeed-app/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const browser = await chromium.launch()
const errors = []
let pass = 0, fail = 0
const check = (n, ok, x = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} — ${n}${x ? ' · ' + x : ''}`) }
const T = (ms) => new Promise((r) => setTimeout(r, ms))
async function fresh() {
  const page = await browser.newPage({ viewport: { width: 1400, height: 980 } })
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()) }); page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto('http://localhost:5173/#/prototype'); await T(3600)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const nav = () => phone().locator('nav')
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(() => false)
  const btn = (name, exact = true) => phone().getByRole('button', { name, exact })
  const demo = (name) => page.getByRole('button', { name })
  return { page, phone, nav, has, btn, demo }
}

// ── A) OTP: حالة التحميل، الخطأ، انتهاء الصلاحية وإعادة الإرسال ──
{
  const c = await fresh(); const { phone, has, btn, page } = c
  await btn('تخطي').click(); await T(400)
  await btn(/متسوق \(مشتري\)/, false).click(); await btn('متابعة').click(); await T(500)
  await phone().locator('input').first().fill('773030064'); await btn(/إرسال رمز/, false).click(); await T(600)
  await btn(/الانتقال لإدخال/, false).click(); await T(400)
  check('2) عدّاد صلاحية الرمز ظاهر', await has('صلاحية الرمز تنتهي خلال'))
  const inputs = phone().locator('input'); for (let i = 0; i < 4; i++) await inputs.nth(i).fill('9'); await T(150)
  check('2) حالة التحميل أثناء التحقق', await has('جارٍ التحقق'))
  await T(1300)
  check('2) حالة الرمز الخاطئ بعد التحميل', await has('رمز التحقق المدخل غير صحيح'))
  // محاكاة انتهاء الصلاحية: تسريع المؤقت عبر إعادة فتح الشاشة بحالة expired من المعرض
  await page.goto('http://localhost:5173/#/gallery/otp-expired'); await T(600)
  check('2) حالة انتهاء صلاحية الرمز + الحقول معطّلة', (await has('انتهت صلاحية رمز التحقق')) && (await phone().locator('input').first().isDisabled()))
  await btn('إعادة إرسال الرمز').click(); await T(300)
  check('2) إعادة الإرسال تعيد المؤقت وتفعّل الحقول', (await has('تم إرسال رمز جديد')) && !(await phone().locator('input').first().isDisabled()))
  await page.close()
}

// ── B) المخزون + البحث المدمج + الموقع الواحد + بيانات العميل عند الطلب + Toast + أيقونة السلة ──
{
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/الدخول مباشرة كعميل/).click(); await T(600)
  check('9) لا جرس إشعارات في رأس الرئيسية (النظام موقوف)', (await phone().getByLabel('التنبيهات').count()) === 0)
  check('13) أيقونة السلة في الرئيسية هي أيقونة عربة (lucide-shopping-cart)', (await phone().getByLabel('السلة').locator('svg.lucide-shopping-cart').count()) === 1)
  check('8) شارة التوفر «متوفر» ظاهرة على بطاقات الرئيسية', (await phone().getByText('متوفر', { exact: true }).count()) >= 2)
  check('9) لا شارات خصم/أسعار قديمة في الرئيسية', !(await has('خصم')) && (await phone().locator('.line-through').count()) === 0)
  // 5) المخزون: منتج مخزونه 12 (إسبريسو) — البحث ثم صفحة المنتج
  await phone().getByLabel('الفلاتر').click(); await T(500)
  check('6) زر الفلاتر من الرئيسية يفتح البحث مع لوحة الفلترة المدمجة', (await has('البحث الذكي')) && (await has('الحد الأقصى للسعر')) && (await has('المتوفر في المخزون فقط')))
  await phone().locator('input[placeholder*="ابحث"]').fill('ثلاجة'); await T(400)
  check('6) حالة عدم وجود نتائج: إيضاح + زر العودة للمنتجات المقترحة', (await has('لم نعثر على منتجات أو متاجر مطابقة')) && (await btn(/العودة إلى المنتجات المقترحة/, false).count()) === 1 && (await phone().locator('svg[aria-hidden="true"]').count()) >= 1)
  await btn(/العودة إلى المنتجات المقترحة/, false).click(); await T(400)
  check('6) العودة تعرض المنتجات المقترحة', await has('منتجات مقترحة لك'))
  await phone().locator('input[placeholder*="ابحث"]').fill('إسبريسو'); await T(400)
  await phone().getByText('ماكينة تحضير الإسبريسو', { exact: false }).first().click(); await T(500)
  check('5) صفحة المنتج تعرض المخزون', await has('متوفر في المخزون (12)'))
  const plus = phone().getByLabel('زيادة')
  for (let i = 0; i < 14; i++) { if (await plus.isDisabled()) break; await plus.click() }
  check('5) زر + يتعطّل عند حد المخزون + رسالة «أقصى كمية متاحة»', (await plus.isDisabled()) && (await has('أقصى كمية متاحة')) && (await phone().getByText('12', { exact: true }).count()) >= 1)
  await btn(/إضافة إلى السلة/, false).click(); await T(300)
  check('12) Toast يظهر من أسفل الشاشة (فوق الشريط السفلي)', await phone().locator('[role="status"]').first().evaluate((el, ph) => { const r = el.getBoundingClientRect(); const p = ph.getBoundingClientRect(); return r.top > p.top + p.height * 0.75 && r.bottom < p.bottom }, await phone().elementHandle()))
  check('5) بعد الإضافة: المتبقي 0 والعدّاد يشرح أن الكمية كلها في السلة', await has('لديك 12 في السلة'))
  await phone().getByLabel('السلة').click(); await T(500)
  check('5) في السلة: + معطّل عند 12 مع رسالة الحد الأقصى', (await phone().getByLabel('زيادة').first().isDisabled()) && (await has('أقصى كمية متاحة (12)')))
  check('9) لا قسم كوبون في السلة', !(await has('كوبون الخصم')))
  await btn(/إتمام الطلب والدفع/, false).click(); await T(500)
  check('10) إتمام الطلب يطلب بيانات التواصل (اسم/جوال/عنوان)', (await has('بيانات التواصل والاستلام')) && (await has('اسم المستلم')) && (await has('رقم الجوال للتواصل')))
  const nameInput = phone().locator('input[placeholder="الاسم الكامل"]')
  await nameInput.fill(''); await btn(/تأكيد الطلب/, false).click(); await T(300)
  check('10) لا يُرسل الطلب بدون الاسم — رسالة تحقق', await has('اسم المستلم مطلوب'))
  await nameInput.fill('سالم أحمد'); await btn(/تأكيد الطلب/, false).click(); await T(1700)
  check('10) بعد استكمال البيانات: نجاح الطلب', await has('JD-'))
  await btn('العودة للرئيسية').click(); await T(400)
  // 7) الموقع الواحد: حُدّث اسم المستلم من الطلب
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  await btn(/موقع التوصيل/, false).click(); await T(400)
  check('7) شاشة الموقع: موقع واحد فقط + تعديل يدوي + تحديث من الخريطة، بلا «إضافة عنوان»', (await has('موقع التوصيل الحالي')) && (await btn('تعديل يدوياً').count()) === 1 && !(await has('إضافة عنوان جديد')) && (await phone().getByText('موقعي', { exact: true }).count()) === 1)
  await btn('تعديل يدوياً').click(); await T(300)
  await phone().locator('input[placeholder="الحوبان، خلف مستشفى الثورة"]').fill('الحوبان، خلف مستشفى الثورة'); await btn('حفظ الموقع').click(); await T(400)
  check('7) التحديث اليدوي يستبدل الموقع نفسه (لا يضيف ثانياً)', (await has('الحوبان، خلف مستشفى الثورة')) && !(await has('قرب جولة المسبح')) && (await phone().getByText('موقعي', { exact: true }).count()) === 1)
  await page.close()
}

// ── C) التاجر: متجر واحد + زر التسوق + فصل الطلبات + إلغاء بعد القبول وأثره على العميل + حالة الترقية ──
{
  const c = await fresh(); const { phone, nav, has, btn, page, demo } = c
  await demo(/لوحة التاجر/).click(); await T(700)
  check('3/9) زر «التسوق» داخل لوحة التاجر', (await btn(/التسوق/, false).count()) >= 1)
  check('9) لوحة التاجر مرتبطة بمتجر واحد: لا محوّل متاجر ولا زر إنشاء متجر إضافي', (await has('متجر التكنولوجيا الحديثة')) && (await phone().getByLabel('تبديل المتجر').count()) === 0 && (await btn(/إنشاء متجر جديد بنفس الحساب/, false).count()) === 0 && !(await has('متاجر')))
  await nav().getByRole('button', { name: 'المنتجات' }).click(); await T(400)
  check('9) قائمة المنتجات = منتجات متجر التاجر الوحيد', (await has('سماعات رأس')) && !(await has('بن يمني')))
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  check('9) حسابي (وضع التاجر): بطاقة «بيانات متجري» لمتجر واحد بزر تعديل، ولا قائمة «متاجري»', (await has('بيانات متجري')) && (await btn('تعديل').count()) >= 1 && !(await has('متاجري (')) && (await btn(/متجر جديد/, false).count()) === 0)
  check('3) حسابي (وضع التاجر): زر الانتقال إلى واجهة التسوق', (await btn(/الانتقال إلى واجهة التسوق/, false).count()) === 1)
  await btn('تعديل').first().click(); await T(400)
  check('9) تعديل بيانات المتجر (ميزة مستقلة) ما زال يعمل', await has('إدارة وتعديل بيانات المتجر'))
  await phone().getByLabel('رجوع').first().click(); await T(400)
  await nav().getByRole('button', { name: 'الرئيسية' }).click(); await T(400)
  // التبديل للتسوق ثم العودة بدون خروج
  await btn(/التسوق/, false).first().click(); await T(500)
  check('3) زر التسوق ينقل لواجهة العميل بنفس الحساب', await has('الأقسام والتصنيفات'))
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  check('3) حسابي (وضع العميل) للتاجر: زر «لوحة تحكم المتجر» — لا حاجة لتسجيل خروج', (await btn(/لوحة تحكم المتجر/, false).count()) === 1 && (await has('حساب تاجر معتمد')))
  // 4) الطلب: من العميل ثم إلغاء التاجر بعد القبول
  await nav().getByRole('button', { name: 'الرئيسية' }).click(); await T(400)
  await phone().getByRole('button', { name: /متجر التكنولوجيا الحديثة/ }).first().click(); await T(500)
  await btn(/أضف سماعات/, false).click(); await T(200)
  await btn('العودة إلى الرئيسية').click(); await T(400)
  await phone().getByLabel('السلة').first().click(); await T(500)
  await btn(/إتمام الطلب والدفع/, false).click(); await T(500)
  await btn(/تأكيد الطلب/, false).click(); await T(1700)
  check('4) الطلب أُنشئ (سماعات من متجر التكنولوجيا)', await has('JD-'))
  await btn('العودة للرئيسية').click(); await T(400)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(300); await btn(/لوحة تحكم المتجر/, false).click(); await T(500)
  await nav().getByRole('button', { name: 'الطلبات' }).click(); await T(500)
  const listTxt = await phone().innerText()
  check('4) قائمة طلبات التاجر مقسّمة: جديدة بانتظار القرار / قيد التنفيذ / منتهية', listTxt.includes('طلبات جديدة — بانتظار قرارك') && listTxt.includes('طلبات منتهية'))
  await phone().getByRole('button', { name: /JD-9842/ }).first().click(); await T(500)
  check('4) الطلب الجديد: قرار قبول/رفض ولا زر إلغاء-بعد-القبول', (await btn(/قبول الطلب وبدء/, false).count()) === 1 && (await btn(/إلغاء الطلب \(بعد القبول\)/, false).count()) === 0)
  await btn(/قبول الطلب وبدء/, false).click(); await T(600)
  await btn('فتح الطلب لمتابعة التجهيز').click(); await T(500)
  check('4) بعد القبول (قيد التجهيز): زر إلغاء التاجر متاح', (await btn(/إلغاء الطلب \(بعد القبول\)/, false).count()) === 1)
  await btn(/إلغاء الطلب \(بعد القبول\)/, false).click(); await T(400)
  check('4) نافذة تأكيد بسبب الإلغاء', (await has('إلغاء الطلب بعد قبوله؟')) && (await has('تعذر التوصيل إلى العنوان')))
  await phone().getByRole('button', { name: 'تعذر التوصيل إلى العنوان' }).click()
  await btn(/تأكيد إلغاء الطلب وإبلاغ العميل/, false).click(); await T(500)
  check('4) التاجر يرى الطلب ملغياً بسببه', (await has('ألغيت هذا الطلب')) && (await has('تعذر التوصيل إلى العنوان')))
  await btn('العودة للطلبات الواردة').click(); await T(400)
  check('4) الطلب انتقل إلى قسم «منتهية» بوسم «ألغيته أنت»', await has('ألغيته أنت'))
  // منظور العميل
  await nav().getByRole('button', { name: 'الرئيسية' }).click(); await T(300)
  await phone().getByLabel('التسوق').click(); await T(500)
  await nav().getByRole('button', { name: 'طلباتي' }).click(); await T(500)
  await phone().getByRole('button', { name: /JD-9842/ }).first().click(); await T(500)
  check('4) العميل: تفاصيل الطلب توضح أن المتجر ألغاه بعد قبوله مع السبب', (await has('ألغى المتجر هذا الطلب بعد قبوله')) && (await has('تعذر التوصيل إلى العنوان')) && (await has('ألغاه المتجر')))
  await page.close()
}

// ── D) حالة الترقية (قيد المراجعة → مقبول + زر واضح) + الانقطاع ──
{
  const c = await fresh(); const { phone, has, btn, page, demo, nav } = c
  await demo(/رحلة توثيق تاجر جديد/).first().click().catch(() => {}); await T(500)
  if (!(await has('يلزم تعبئة بياناتك كتاجر'))) { await demo(/الدخول مباشرة كعميل/).click(); await T(500); await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400); await btn(/انضم كتاجر/, false).click(); await T(400) }
  await btn('البدء بتعبئة نموذج التاجر').click(); await T(400)
  check('7) نموذج المتجر: صاحب المتجر والهاتف معبآن تلقائياً من الحساب', (await phone().locator('input[value="محمد سعيد"]').count()) >= 1 && (await phone().locator('input[value="773030064"]').count()) === 1)
  await phone().getByLabel('موقع المتجر').click(); await T(200)
  await phone().locator('input[placeholder="KR-3001-000000-00"]').fill('KR-3001-111111-01')
  await btn('تقديم طلب إنشاء المتجر').click(); await T(400)
  // RC-8: التوثيق = وجه البطاقة + ظهرها + صورتان لواجهة المتجر — الزر معطّل حتى الاكتمال
  check('RC-8/4) شاشة التوثيق تطلب صورتين للبطاقة وصور واجهة المتجر والزر معطّل قبل الاكتمال', (await has('وجه البطاقة')) && (await has('ظهر البطاقة')) && (await has('صور حقيقية لواجهة المتجر')) && (await btn(/متابعة لرفع صورة المتجر/, false).isDisabled()))
  await phone().getByLabel('رفع 1) وجه البطاقة (الأمام)').click(); await T(150)
  await phone().getByLabel('رفع 2) ظهر البطاقة (الخلف)').click(); await T(150)
  await phone().getByLabel('التقاط صورة لواجهة المتجر').click(); await T(150)
  check('RC-8/4) بعد صورة واجهة واحدة: ما زال ناقصاً (المطلوب صورتان) والزر معطّل', (await has('متبقٍ لإكمال التوثيق')) && (await btn(/متابعة لرفع صورة المتجر/, false).isDisabled()))
  await phone().getByLabel('التقاط صورة لواجهة المتجر').click(); await T(200)
  check('RC-8/4) اكتمال الصور المطلوبة يفعّل المتابعة', (await has('اكتملت صور التوثيق المطلوبة')) && !(await btn(/متابعة لرفع صورة المتجر/, false).isDisabled()))
  await btn(/متابعة لرفع صورة المتجر/, false).click(); await T(400)
  await phone().locator('button').filter({ hasText: /التقاط أو رفع صورة الواجهة/ }).first().click(); await T(200)
  await phone().locator('button').filter({ hasText: /شعار المتجر \(مربع 1:1\)/ }).first().click(); await T(200)
  await btn(/متابعة لمراجعة طلب المتجر/, false).click(); await T(500)
  check('1) شاشة «طلب المتجر قيد المراجعة»', await has('طلب المتجر قيد المراجعة'))
  await btn('العودة إلى حسابي').click(); await T(400)
  check('1) حسابي: بطاقة الحالة «قيد المراجعة» بوسم واضح', (await has('طلب متجرك قيد المراجعة')) && (await phone().getByText('قيد المراجعة', { exact: true }).count()) >= 1)
  await btn(/طلب متجرك قيد المراجعة/, false).click(); await T(400)
  await btn('محاكاة: اعتماد').click(); await T(500)
  check('1) بعد القبول: شاشة الاعتماد + زر واضح للدخول إلى لوحة التاجر', (await has('تهانينا! تم اعتماد متجرك')) && (await has('مقبول — المتجر نشط')) && (await btn(/الدخول إلى لوحة تحكم التاجر/, false).count()) === 1)
  await btn(/الدخول إلى لوحة تحكم التاجر/, false).click(); await T(500)
  check('1) الزر يفتح لوحة التاجر فعلياً', await has('لوحة إدارة المتجر والمبيعات'))
  // 11) الانقطاع
  await demo(/محاكاة: انقطاع الإنترنت/).click(); await T(400)
  check('11) شريط «لا يوجد اتصال بالإنترنت» مع زر إعادة المحاولة', (await has('لا يوجد اتصال بالإنترنت')) && (await btn(/إعادة المحاولة/, false).count()) === 1)
  await btn(/إعادة المحاولة/, false).click(); await T(1300)
  check('11) إعادة المحاولة (المتصفح متصل) تُزيل الشريط مع Toast', !(await has('لا يوجد اتصال بالإنترنت')) && (await has('عاد الاتصال بالإنترنت')))
  await page.close()
}

console.log(`\n${pass} PASS / ${fail} FAIL · console errors: ${errors.length ? errors.slice(0, 5) : 'none'}`)
await browser.close(); process.exit(fail || errors.length ? 1 : 0)
