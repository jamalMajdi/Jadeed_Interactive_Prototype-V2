// فحص RC-9 (تعديلان): 1) الزائر يتصفح ولا يضيف للسلة — نافذة مطالبة واضحة (دخول / إنشاء حساب عميل) مع العودة لنفس المكان
//                     2) شريط العروض في الرئيسية: أكثر من إعلان + نقاط تنقل + تمرير + إجراءات كل إعلان
const PW = process.env.PLAYWRIGHT_PATH || '/home/user/jadeed-app/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const browser = await chromium.launch()
const errors = []
let pass = 0, fail = 0
const check = (n, ok, x = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'} — ${n}${x ? ' · ' + x : ''}`) }
const T = (ms) => new Promise((r) => setTimeout(r, ms))
async function fresh(hash = '#/prototype') {
  const page = await browser.newPage({ viewport: { width: 1400, height: 980 }, hasTouch: true })
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()) }); page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto('http://localhost:5173/' + hash); await T(hash === '#/prototype' ? 3600 : 900)
  const phone = () => page.locator('div[style*="width: 390px"]').first()
  const nav = () => phone().locator('nav')
  const has = (t) => phone().getByText(t, { exact: false }).first().isVisible().catch(() => false)
  const btn = (name, exact = true) => phone().getByRole('button', { name, exact })
  return { page, phone, nav, has, btn }
}
async function login(c) {
  const { phone, btn } = c
  await phone().locator('input').first().fill('773030064'); await btn(/إرسال رمز/, false).click(); await T(600)
  await btn(/الانتقال لإدخال/, false).click(); await T(400)
  const inputs = phone().locator('input'); for (let i = 0; i < 4; i++) await inputs.nth(i).fill(String('1234'[i])); await T(1700)
}
async function toGuestHome(c) { const { btn } = c; await btn('تخطي').click(); await T(400); await btn('تصفح كزائر بدون تسجيل').click(); await T(700) }

// ── 1) الزائر ──
{
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await btn('تخطي').click(); await T(400)
  check('1) شاشة نوع الحساب فيها «تصفح كزائر بدون تسجيل» (ونوعا الحساب فقط)', (await btn('تصفح كزائر بدون تسجيل').count()) === 1 && (await btn(/كلاهما/, false).count()) === 0)
  await btn('تصفح كزائر بدون تسجيل').click(); await T(700)
  check('1) الزائر يصل إلى الرئيسية مع الشريط السفلي', (await has('الأقسام والتصنيفات')) && (await nav().count()) === 1)
  check('1) الزائر يرى العروض (شريط الإعلانات)', (await phone().getByLabel('العروض والإعلانات').count()) === 1)
  await nav().getByRole('button', { name: 'المتاجر' }).click(); await T(500)
  check('1) الزائر يتصفح قائمة المتاجر', await has('عطور الجزيرة الملكية'))
  await btn(/متجر التكنولوجيا الحديثة/, false).first().click(); await T(600)
  check('1) الزائر يفتح صفحة المتجر ومنتجاته', await has('قائمة منتجات المتجر'))
  await btn(/أضف سماعات/, false).click(); await T(400)
  const dlg = phone().getByText('سجّل الدخول لإضافة المنتج إلى السلة')
  check('1) محاولة الإضافة → نافذة مطالبة واضحة', await dlg.isVisible())
  check('1) النافذة تعرض اسم المنتج وخياري «تسجيل الدخول» و«إنشاء حساب كعميل»', (await has('سماعات رأس لاسلكية احترافية')) && (await btn(/^تسجيل الدخول$/, false).count()) === 1 && (await btn('إنشاء حساب كعميل').count()) === 1)
  check('1) لم يُضَف شيء للسلة', (await btn(/أضف سماعات/, false).innerText()).trim() !== '1')
  await btn('متابعة التصفح كزائر').click(); await T(300)
  check('1) «متابعة التصفح كزائر» يغلق النافذة ويبقيه في صفحة المتجر', !(await dlg.isVisible().catch(() => false)) && (await has('قائمة منتجات المتجر')))
  // من صفحة المنتج
  await phone().getByText('سماعات الرأس اللاسلكية الاحترافية').first().click(); await T(500)
  await btn(/^إضافة إلى السلة$/, false).click(); await T(400)
  check('1) صفحة المنتج: الإضافة تفتح النافذة نفسها', await dlg.isVisible())
  // تسجيل الدخول من النافذة → العودة لصفحة المنتج
  await btn(/^تسجيل الدخول$/, false).click(); await T(500)
  check('1) «تسجيل الدخول» من النافذة → شاشة الدخول مع تنبيه البوابة', await has('هذه الميزة تتطلب تسجيل الدخول'))
  await login(c)
  check('1) بعد OTP: زر العودة إلى حيث توقف', (await btn('المتابعة إلى حيث توقفت').count()) === 1)
  await btn('المتابعة إلى حيث توقفت').click(); await T(600)
  check('1) يعود إلى صفحة المنتج نفسها', (await btn(/^إضافة إلى السلة$/, false).count()) === 1)
  await btn(/^إضافة إلى السلة$/, false).click(); await T(400)
  check('1) بعد الدخول: الإضافة تعمل', await has('أُضيف 1 ×'))
  await page.close()
}
{
  // إنشاء حساب كعميل من النافذة → بعد النجاح يعود إلى المكان نفسه
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await toGuestHome(c)
  await phone().getByRole('button', { name: /أضف للسلة/ }).first().click(); await T(400)
  check('1) بطاقة الرئيسية: الإضافة كزائر تفتح النافذة', await has('سجّل الدخول لإضافة المنتج إلى السلة'))
  await btn('إنشاء حساب كعميل').click(); await T(500)
  check('1) «إنشاء حساب كعميل» يفتح شاشة التسجيل', (await has('إنشاء حساب')) && (await phone().locator('input').count()) >= 3)
  const inputs = phone().locator('input')
  await inputs.nth(0).fill('سالم أحمد'); await inputs.nth(1).fill('salem@example.com'); await inputs.nth(2).fill('773030064')
  const pw = phone().locator('input[type="password"]'); const n = await pw.count(); for (let i = 0; i < n; i++) await pw.nth(i).fill('Passw0rd!')
  const cb = phone().locator('input[type="checkbox"]'); if (await cb.count()) await cb.first().check()
  await btn('إنشاء حساب').click(); await T(1300)
  const ok = await has('تم حفظ بيانات الحساب بنجاح')
  check('1) التسجيل نجح', ok)
  if (ok) {
    check('1) شاشة النجاح تعرض «المتابعة إلى حيث توقفت»', (await btn('المتابعة إلى حيث توقفت').count()) === 1)
    await btn('المتابعة إلى حيث توقفت').click(); await T(600)
    check('1) العودة إلى الرئيسية (حيث كان) ويستطيع الإضافة الآن', (await has('الأقسام والتصنيفات')))
    await phone().getByRole('button', { name: /أضف للسلة/ }).first().click(); await T(400)
    check('1) الإضافة تعمل بعد إنشاء الحساب', await has('أُضيف إلى السلة'))
  }
  await page.close()
}
{
  // تسجيل الخروج يعيد للتصفح كزائر (لا إجبار)، والمفضلة/الطلبات ما زالتا مبوّبتين
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await page.getByRole('button', { name: /الدخول مباشرة كعميل/ }).click(); await T(600)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  await btn('تسجيل الخروج').click(); await T(600)
  check('1) تسجيل الخروج → الرئيسية كزائر (التصفح يبقى متاحاً)', (await has('الأقسام والتصنيفات')) && (await nav().count()) === 1)
  await nav().getByRole('button', { name: 'حسابي' }).click(); await T(400)
  check('1) حسابي للزائر: توضيح أن التصفح متاح والشراء يتطلب حساب عميل', await has('أنت تتصفح كزائر'))
  await page.close()
}

// ── 2) شريط العروض ──
{
  const c = await fresh(); const { phone, nav, has, btn, page } = c
  await page.getByRole('button', { name: /الدخول مباشرة كعميل/ }).click(); await T(700)
  const track = phone().getByLabel('العروض والإعلانات')
  const slides = track.locator('[aria-roledescription="slide"]')
  const dots = phone().getByRole('tablist', { name: 'التنقل بين الإعلانات' }).getByRole('tab')
  check('2) الشريط يحتوي أكثر من إعلان (4) ونقاط تنقل بعددها', (await slides.count()) === 4 && (await dots.count()) === 4)
  check('2) الإعلان الأصلي محفوظ كأول إعلان', (await slides.nth(0).innerText()).includes('توصيل مجاني داخل المدينة'))
  check('2) النقطة الأولى نشطة ابتداءً', (await dots.nth(0).getAttribute('aria-selected')) === 'true')
  const box = await track.boundingBox(); const s0 = await slides.nth(0).boundingBox()
  check('2) عرض كل إعلان = عرض الشريط (Snap صفحة كاملة)', Math.abs(s0.width - (box.width - 32)) < 4 || Math.abs(s0.width - box.width) < 40, `slide ${s0.width} / track ${box.width}`)
  // التنقل بالنقاط
  await dots.nth(2).click(); await T(700)
  check('2) النقر على نقطة ينقل إلى الإعلان الثالث', (await dots.nth(2).getAttribute('aria-selected')) === 'true' && (await slides.nth(2).boundingBox()).x >= box.x - 2 && (await slides.nth(2).boundingBox()).x <= box.x + 20)
  // التمرير اليدوي (سحب) يحرّك النقطة
  await track.evaluate((el) => { el.scrollBy({ left: el.clientWidth * (getComputedStyle(el).direction === 'rtl' ? 1 : -1), behavior: 'instant' }) }); await T(500)
  check('2) التمرير اليدوي يزامن النقطة النشطة', (await dots.nth(1).getAttribute('aria-selected')) === 'true')
  // التقدّم التلقائي
  await page.mouse.move(5, 5) // إبعاد المؤشر: التحويم فوق الشريط يوقف التقدّم التلقائي عمداً
  const before = await phone().getByRole('tab', { selected: true }).getAttribute('aria-label')
  await T(5600)
  const after = await phone().getByRole('tab', { selected: true }).getAttribute('aria-label')
  check('2) تقدّم تلقائي بعد ~5 ثوانٍ', before !== after, `${before} → ${after}`)
  // إجراءات الإعلانات
  await dots.nth(1).click(); await T(600)
  await slides.nth(1).getByRole('button', { name: 'زيارة المتجر' }).click(); await T(600)
  check('2) إعلان المتجر يفتح صفحة المتجر المرتبط', await has('عالم الباريستا المنزلي'))
  await btn('العودة إلى الرئيسية').click(); await T(500)
  await dots.nth(2).click(); await T(600)
  await slides.nth(2).getByRole('button', { name: 'اكتشف العطور' }).click(); await T(400)
  check('2) إعلان التصنيف يفلتر الرئيسية (عطور وجمال نشط)', (await phone().getByRole('button', { name: 'عطور وجمال', exact: true }).getAttribute('class')).includes('bg-primary'))
  await dots.nth(3).click(); await T(600)
  await slides.nth(3).getByRole('button', { name: 'كل المتاجر' }).click(); await T(500)
  check('2) إعلان المتاجر يبدّل إلى تبويب المتاجر', await has('عطور الجزيرة الملكية'))
  await page.close()
}
{
  // الزائر أيضاً يرى الشريط ويستخدمه
  const c = await fresh(); const { phone, has, page } = c
  await toGuestHome(c)
  const dots = phone().getByRole('tablist', { name: 'التنقل بين الإعلانات' }).getByRole('tab')
  await dots.nth(1).click(); await T(600)
  await phone().getByRole('button', { name: 'زيارة المتجر' }).click(); await T(600)
  check('2) الزائر: التنقل بين الإعلانات وفتح متجر من إعلان يعمل', await has('عالم الباريستا المنزلي'))
  await page.close()
}

console.log(`\n${pass} PASS / ${fail} FAIL · console errors: ${errors.length ? errors.slice(0, 5) : 'none'}`)
await browser.close(); process.exit(fail || errors.length ? 1 : 0)
