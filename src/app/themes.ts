export type ThemeId = 'classic' | 'forest' | 'lake' | 'mountain';

export interface Theme {
  id: ThemeId;
  /** CSS custom properties applied to the document root. */
  vars: Record<string, string>;
}

// The art is always the original; each map only shifts the colors of the background.
export const THEMES: Record<ThemeId, Theme> = {
  classic: { id: 'classic', vars: { '--bg-filter': 'none' } },
  forest: { id: 'forest', vars: { '--bg-filter': 'hue-rotate(110deg) saturate(1.4)' } },
  lake: { id: 'lake', vars: { '--bg-filter': 'hue-rotate(205deg) saturate(1.5)' } },
  mountain: { id: 'mountain', vars: { '--bg-filter': 'hue-rotate(25deg) saturate(0.5) brightness(1.15)' } },
};

export function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(THEMES[id].vars)) root.style.setProperty(name, value);
}
