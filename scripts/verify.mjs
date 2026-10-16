/**
 * Browser verification for the portfolio (production build).
 * Drives system Microsoft Edge in headless mode via puppeteer-core.
 * Usage: node scripts/verify.mjs [--quick]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.env.VERIFY_URL ?? 'http://localhost:3000'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT = new URL('../verification/', import.meta.url).pathname.replace(/^\/(C:)/i, '$1')
mkdirSync(OUT, { recursive: true })
const results = []
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-sandbox', '--window-size=1440,900', '--hide-scrollbars'],
})

try {
  /* ---------------- Desktop light ---------------- */
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: 'light' },
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ])
  const errors = []
  const missing = []
  page.on('pageerror', (err) => errors.push(String(err)))
  page.on('console', (msg) => {
    /* Net-layer failures (404s etc.) are verified separately and precisely by the response listener. */
    if (msg.type() !== 'error') return
    if (msg.text().includes('Failed to load resource')) return
    errors.push(msg.text())
  })
  page.on('response', (res) => { if (res.status() >= 400 && !res.url().includes('/_vercel/insights')) missing.push(`${res.status()} ${res.url()}`) })

  await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 45000 })
  await new Promise((r) => setTimeout(r, 1200))

  check('no page errors on load', errors.length === 0, errors.slice(0, 3).join(' | '))
  check('no 40x/50x assets', missing.length === 0, missing.join(' | '))
  const heroText = await page.$eval('h1', (el) => el.textContent.replace(/\s+/g, ' ').trim())
  check('hero headline', /build software/.test(heroText) && /constraints/.test(heroText), heroText)

  const headerOk = await page.$eval('.site-header', (el) => !!el.querySelector('.brand'))
  check('header renders with JS. brand', headerOk)

  /* Horizontal overflow scan across key widths */
  for (const width of [1920, 1600, 1440, 1280, 1024, 900, 800, 430, 390, 375]) {
    await page.setViewport({ width, height: 900 })
    await new Promise((r) => setTimeout(r, 350))
    const overflow = await page.evaluate(() => {
      const el = [...document.querySelectorAll('body *')].filter((n) => {
        const r = n.getBoundingClientRect()
        return r.right > window.innerWidth + 2 && r.width > 0 && getComputedStyle(n).position !== 'fixed'
      })
      return { sw: document.documentElement.scrollWidth, iw: window.innerWidth, worst: el.length ? el[0].className || el[0].tagName : null }
    })
    check(`no horizontal overflow @${width}`, overflow.sw <= overflow.iw + 2, `scrollWidth=${overflow.sw} innerWidth=${overflow.iw}${overflow.worst ? ` worst=${overflow.worst}` : ''}`)
  }

  await page.setViewport({ width: 1440, height: 900 })
  await new Promise((r) => setTimeout(r, 500))
  await page.screenshot({ path: `${OUT}/desktop-1440-hero.png` })

  /* Pinned project stage: scroll through and verify projects change one at a time */
  const stageState = async () => page.evaluate(() => ({
    active: [...document.querySelectorAll('.project-stage .project-case-study')].map((c) => ({
      v: getComputedStyle(c).visibility,
      o: Number(getComputedStyle(c).opacity),
    })),
    index: [...document.querySelectorAll('.project-index-numbers span')].map((s) => s.classList.contains('is-active')),
  }))

  const projects = await page.$$eval('.project-stage .project-case-study', (els) => els.map((el) => el.querySelector('.project-name [data-mask]')?.textContent))
  check('4 projects rendered in stage', projects.length === 4, projects.join(', '))

  const scrollDistance = await page.evaluate(async () => {
    const section = document.querySelector('.project-storytelling')
    return section ? Math.round(section.getBoundingClientRect().top + window.scrollY) : -1
  })
  check('stage reachable', scrollDistance > 0, `sectionTop=${scrollDistance}`)

  await page.evaluate((y) => window.scrollTo(0, y - 300), scrollDistance)
  await new Promise((r) => setTimeout(r, 1400))
  await page.screenshot({ path: `${OUT}/desktop-projects-approach.png` })

  /* Find pin span: same math the component uses — (4×1.0 hold + 3×0.42 exit + 3×0.62 enter) × 520px */
  const pinStart = await page.evaluate(() => {
    const section = document.querySelector('.project-storytelling')
    return Math.round(section.getBoundingClientRect().top + window.scrollY - 88)
  })
  const pinDistance = Math.round((4 * 1.0 + 3 * 0.42 + 3 * 0.62) * 520)

  const actives = []
  for (const frac of [0.03, 0.2, 0.36, 0.55, 0.7, 0.87, 1.0]) {
    await page.evaluate((f) => window.scrollTo(0, f), pinStart + Math.max(0, pinDistance) * frac)
    await new Promise((r) => setTimeout(r, 900))
    const st = await stageState()
    const visible = st.active.filter((c) => c.v === 'visible' && c.o > 0.05).length
    const idx = st.index.findIndex(Boolean)
    actives.push({ frac, visible, idx })
    check(`exactly one readable project at ${Math.round(frac * 100)}%`, visible === 1 && idx >= 0, `visible=${visible} activeIndex=${idx}`)
  }
  const seen = new Set(actives.map((a) => a.idx))
  check('all four projects activate across the pin', seen.size >= 4, `seen=${[...seen].join(',')}`)

  /* Reverse scroll keeps everything coherent */
  await page.evaluate((y) => window.scrollTo(0, y), pinStart + pinDistance * 0.2)
  await new Promise((r) => setTimeout(r, 900))
  await page.evaluate((y) => window.scrollTo(0, y), pinStart + pinDistance * 0.55)
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: `${OUT}/desktop-project-stage-mid.png` })

  /* Theme toggle: circular reveal fallback still applies theme */
  const before = await page.evaluate(() => document.documentElement.dataset.theme)
  await page.click('.theme-toggle')
  await new Promise((r) => setTimeout(r, 1100))
  const after = await page.evaluate(() => document.documentElement.dataset.theme)
  check('theme toggles', before !== after, `${before} → ${after}`)
  await page.screenshot({ path: `${OUT}/desktop-1440-${after}.png` })
  const darkText = await page.evaluate(() => {
    const bad = []
    for (const el of document.querySelectorAll('.site-header, .hero-copy, .project-copy, .process-section, .toolbox-section, .contact-section')) {
      const probeEl = el.querySelector('h1,h2,h3,.brand,.eyebrow,p,strong') ?? el
      const rgb = getComputedStyle(probeEl).color.match(/\d+/g)?.slice(0, 3).map(Number)
      if (!rgb) continue
      if (rgb.every((v) => v < 70)) bad.push(el.className)
    }
    return bad
  })
  check('dark theme: section headings not dark-on-dark', darkText.length === 0, darkText.join(','))

  /* Theme persistence across reload */
  await page.reload({ waitUntil: 'networkidle0' })
  const persisted = await page.evaluate(() => document.documentElement.dataset.theme)
  check('theme persists across reload', persisted === after, persisted)
  await page.click('.theme-toggle')
  await new Promise((r) => setTimeout(r, 700))

  /* Toolbox accordion animates open/closed and stays keyboard-usable.
     Note: Edge reports non-zero body rect heights even on closed details, so we assert
     state + animation side effects rather than raw heights. */
  await page.evaluate(() => document.querySelector('#toolbox').scrollIntoView({ block: 'start', behavior: 'instant' }))
  await new Promise((r) => setTimeout(r, 800))
  const readState = () => page.evaluate(() => {
    const details = document.querySelector('.skill-item')
    const body = details.querySelector('[data-acc-body]')
    return { open: details.open, inlineStyle: body.getAttribute('style'), midHeight: body.getBoundingClientRect().height }
  })
  const accBefore = await readState()
  await page.click('.skill-item summary')
  await new Promise((r) => setTimeout(r, 140))
  const mid = await readState()
  await new Promise((r) => setTimeout(r, 600))
  const opened = await readState()
  check('toolbox accordion opens (native + animated)', opened.open && (mid.inlineStyle || '').includes('height'), `${accBefore.inlineStyle} → mid:${mid.inlineStyle}`)
  await page.click('.skill-item summary')
  await new Promise((r) => setTimeout(r, 700))
  const closed = await readState()
  check('toolbox accordion closes cleanly', closed.open === false && (closed.inlineStyle === null || closed.inlineStyle === ''), JSON.stringify({ open: closed.open, inlineStyle: closed.inlineStyle }))

  /* Story section active states */
  await page.evaluate(() => document.querySelector('.process-grid').scrollIntoView({ block: 'center' }))
  await new Promise((r) => setTimeout(r, 900))
  const storyActive = await page.evaluate(() => [...document.querySelectorAll('.process-step')].map((s) => s.classList.contains('is-active') ? 'A' : s.classList.contains('is-passed') ? 'P' : '.').join(''))
  await page.screenshot({ path: `${OUT}/desktop-story.png` })
  check('story steps activate progressively', /A/.test(storyActive) || /P/.test(storyActive), storyActive)

  /* Footer + contact */
  await page.evaluate(() => document.querySelector('#contact').scrollIntoView())
  await new Promise((r) => setTimeout(r, 900))
  const contactOk = await page.evaluate(() => ({
    cta: !!document.querySelector('.contact-cta'),
    footer: !!document.querySelector('.site-footer .brand'),
    deadLinks: [...document.querySelectorAll('#contact a')].filter((a) => a.getAttribute('href') === '#').length,
  }))
  check('contact CTA + footer exist, no dead "#" links', contactOk.cta && contactOk.footer && contactOk.deadLinks === 0, JSON.stringify(contactOk))
  await page.screenshot({ path: `${OUT}/desktop-contact.png` })
} catch (error) {
  check('no fatal error', false, String(error))
}

/* ---------------- Mobile pass ---------------- */
try {
  const mobile = await browser.newPage()
  await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
  await mobile.goto(BASE, { waitUntil: 'networkidle0', timeout: 45000 })
  await new Promise((r) => setTimeout(r, 1000))

  const mob = await mobile.evaluate(() => ({
    stageHidden: getComputedStyle(document.querySelector('.project-stage')).display === 'none',
    flowCards: [...document.querySelectorAll('.project-mobile-cards .project-case-study')].length,
    menuBtn: !!document.querySelector('.menu-button'),
    navHidden: getComputedStyle(document.querySelector('.desktop-nav')).display === 'none',
  }))
  check('mobile: flow cards replace pinned stage', mob.stageHidden && mob.flowCards === 4 && mob.menuBtn && mob.navHidden, JSON.stringify(mob))

  /* Mobile menu opens and is usable */
  await mobile.click('.menu-button')
  await new Promise((r) => setTimeout(r, 450))
  const menuOpen = await mobile.$eval('.mobile-nav', (el) => getComputedStyle(el).visibility === 'visible' && getComputedStyle(el).opacity === '1')
  check('mobile menu opens', menuOpen)
  await mobile.screenshot({ path: `${OUT}/mobile-390-top.png` })

  /* Reduced motion: everything in flow, no pinned surprises */
  const rm = await browser.newPage()
  await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await rm.setViewport({ width: 1440, height: 900 })
  await rm.goto(BASE, { waitUntil: 'networkidle0', timeout: 45000 })
  await new Promise((r) => setTimeout(r, 800))
  const rmState = await rm.evaluate(() => {
    const flow = [...document.querySelectorAll('.project-mobile-cards .project-case-study')].map((el) => getComputedStyle(el).visibility)
    return { stageHidden: getComputedStyle(document.querySelector('.project-stage')).display === 'none', flowAllVisible: flow.length === 4 && flow.every((v) => v === 'visible') }
  })
  check('reduced motion: projects in readable flow', rmState.stageHidden && rmState.flowAllVisible, JSON.stringify(rmState))
  await rm.screenshot({ path: `${OUT}/reduced-motion-projects.png` })
} catch (error) {
  check('mobile pass: no fatal error', false, String(error))
}

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
writeFileSync(`${OUT}results.json`, JSON.stringify(results, null, 2))
process.exit(failed.length ? 1 : 0)
