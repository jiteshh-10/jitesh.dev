/**
 * Builds the desk-computer figure used in the hero.
 *
 * The anatomy example is authored as a standalone page. This script:
 *  1. scopes every style rule under `.iso-host` so nothing leaks into the site,
 *  2. strips the standalone palette (the site supplies brand tokens),
 *  3. writes a self-contained figure file to public/figure/,
 *  4. generates the React component that loads it at runtime (so the ~250 KB of
 *     markup never lands in the JS bundle and hydration stays fast).
 *
 * Run: node scripts/build-desk-figure.cjs
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILL_KIT = path.join(
  process.env.USERPROFILE || process.env.HOME,
  '.config/opencode/skills/anatomy/kit/iso-kit.mjs',
);
const SOURCE = path.join(ROOT, 'scripts/figure-source');
const OUT = path.join(ROOT, 'public/figure');

const strip = (s) => s.replace(/^export /gm, '');

function matchBrace(css, open) {
  let depth = 0;
  for (let j = open; j < css.length; j++) {
    if (css[j] === '{') depth++;
    else if (css[j] === '}') {
      depth--;
      if (depth === 0) return j;
    }
  }
  return css.length - 1;
}

/** Scope every rule under `.iso-host`; drop page-level selectors. */
function scopeCss(css) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    const prelude = css.slice(i, open).trim();
    if (prelude.startsWith('@')) {
      const close = matchBrace(css, open);
      out += prelude + '{' + scopeCss(css.slice(open + 1, close)) + '}';
      i = close + 1;
      continue;
    }
    const close = matchBrace(css, open);
    const body = css.slice(open + 1, close);
    const selectors = prelude
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !/^(html|body|\*|:root)$/i.test(s));
    if (selectors.length) {
      out += selectors.map((s) => '.iso-host ' + s).join(',') + '{' + body + '}';
    }
    i = close + 1;
  }
  return out;
}

function build(source, target) {
  const html = fs.readFileSync(source, 'utf8');
  const mainMatch = html.match(/<main class="iso-page">([\s\S]*?)<\/main>/);
  const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  let body = mainMatch ? mainMatch[1] : '';
  const styles = [];
  html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => {
    styles.push(css);
    return '';
  });
  body = body.replace(/<style>[\s\S]*?<\/style>/g, '');

  let css = styles.join('\n');
  css = css.replace(/\.iso\s*\{[\s\S]*?\n\}/, '');
  css = css.replace(/\.iso\[data-theme="light"\]\s*\{[\s\S]*?\n\}/, '');
  const scoped = scopeCss(css);

  /* The built page already embeds the kit followed by the live script in a
     single module, so we reuse it verbatim. The literal `</script>` inside the
     kit source must be escaped or the browser closes the element early. */
  const code = (scriptMatch ? scriptMatch[1] : '').replace(/<\/(script)/gi, '<\\/$1');

  const page =
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<style>' + scoped + '</style></head>' +
    '<body class="iso-host iso"><main class="iso-page">' + body + '</main>' +
    '<script type="module">' + code + '<\/script></body></html>';

  fs.writeFileSync(target, page);
  return page.length;
}

fs.mkdirSync(OUT, { recursive: true });
console.log('dark ', build(path.join(SOURCE, 'desk-computer.html'), path.join(OUT, 'desk-computer.html')));
console.log('light', build(path.join(SOURCE, 'desk-computer-light.html'), path.join(OUT, 'desk-computer-light.html')));
