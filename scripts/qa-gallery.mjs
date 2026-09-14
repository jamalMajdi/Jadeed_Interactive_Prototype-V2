// فحص آلي لمعرض الشاشات: لا شاشة فارغة، لا أخطاء كونسول، الشريط السفلي داخل الإطار، لا جذور أطول من 844، لا أكواد Figma داخل الهاتف
// التشغيل: node scripts/qa-gallery.mjs  (يتطلب تشغيل السيرفر على 5173 و playwright متاحاً عبر PLAYWRIGHT_PATH أو npx)
import fs from 'fs'
const PW = process.env.PLAYWRIGHT_PATH || '/home/user/.npm/_npx/f0a362733743bae2/node_modules/playwright/index.mjs'
const { chromium } = await import(PW)
const src = fs.readFileSync(new URL('../src/gallery/catalog.js', import.meta.url), 'utf8')
const keys = [...src.matchAll(/key: '([^']+)'/g)].map(m => m[1])
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 980 } })
const errors = []
page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`) })
page.on('pageerror', e => errors.push(`[pageerror] ${e}`)); page.on('requestfailed', r => errors.push(`[requestfailed] ${r.url()}`))
let blank = 0; const navHidden = [], tall = [], codes = []
for (const k of keys) {
  await page.goto(`http://localhost:5173/#/gallery/${k}`); await page.waitForTimeout(230)
  const r = await page.locator('div[style*="width: 390px"]').first().evaluate((ph) => {
    const pr = ph.getBoundingClientRect(); const root = ph.querySelector('.animate-fade-in'); const screen = root && root.firstElementChild
    const nav = ph.querySelector('nav'); const nr = nav && nav.getBoundingClientRect()
    return { text: ph.innerText, screenH: screen ? Math.round(screen.getBoundingClientRect().height) : 0, navHidden: !!nav && !(nr.bottom <= pr.bottom + 1 && nr.top >= pr.top) }
  })
  if (r.text.trim().length < 5) { blank++; console.log('BLANK:', k) }
  if (r.navHidden) navHidden.push(k); if (r.screenH > 845) tall.push(k)
  const m = r.text.match(/\b(CUS|M)-0\d\d\b/); if (m) codes.push(`${k}:${m[0]}`)
}
console.log(`gallery items: ${keys.length}\nchecked: ${keys.length} blank: ${blank} with errors: ${errors.length}`)
console.log('nav hidden:', navHidden.length ? navHidden : 'none', '| roots >844:', tall.length ? tall : 'none', '| figma codes in UI:', codes.length ? codes : 'none')
console.log('console errors/warnings total:', errors.length ? errors.slice(0, 8) : 'none')
await browser.close(); process.exit(blank || errors.length || navHidden.length || tall.length || codes.length ? 1 : 0)
