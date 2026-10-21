'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

/**
 * The desk-computer figure is built from the anatomy example and shipped as a
 * static asset (see scripts/build-desk-figure.cjs). It is fetched at runtime
 * and injected into the page so its markup never sits in the JS bundle and
 * hydration stays fast; the figure's own CSS is already scoped to `.iso-host`.
 */
export function DeskComputerLocal() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    const src = isLight ? '/figure/desk-computer-light.html' : '/figure/desk-computer.html';

    fetch(src, { cache: 'force-cache' })
      .then((response) => response.text())
      .then((html) => {
        if (cancelled || !host) return;
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const style = doc.querySelector('style');
        const main = doc.querySelector('main.iso-page');
        const script = doc.querySelector('script[type="module"]');

        host.replaceChildren();
        if (style) {
          const el = document.createElement('style');
          el.textContent = style.textContent || '';
          host.appendChild(el);
        }
        if (main) {
          const wrap = document.createElement('div');
          wrap.innerHTML = main.innerHTML;
          host.appendChild(wrap);
        }
        if (script) {
          const el = document.createElement('script');
          el.type = 'module';
          el.textContent = script.textContent || '';
          host.appendChild(el);
        }
        setReady(true);
        /* Tell the page the figure exists so scroll-linked work on its
           internals (screen glow, scanlines) can attach. */
        window.dispatchEvent(new CustomEvent('figure:ready'));
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isLight]);

  return (
    <div
      ref={hostRef}
      className="desk-stage iso-host iso"
      data-theme={isLight ? 'light' : 'dark'}
      data-ready={ready ? 'true' : 'false'}
    />
  );
}
