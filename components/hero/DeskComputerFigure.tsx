'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export function DeskComputerFigure() {
  const { theme } = useTheme();
  const src = theme === 'light' ? '/desk-computer-light.html' : '/desk-computer.html';
  return (
    <div className="desk-stage">
      <div className="desk-glow" aria-hidden="true" />
      <iframe
        key={src}
        src={src}
        title="Desk computer — isometric figure"
        className="desk-computer-frame"
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
}
