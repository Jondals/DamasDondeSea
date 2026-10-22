export type ThemeId = 'classic' | 'forest' | 'lake' | 'mountain';

export interface Theme {
  id: ThemeId;
  /** CSS custom properties applied to the document root. */
  vars: Record<string, string>;
}

export const THEMES: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic',
    vars: {
      '--bg-1': '#15122e', '--bg-2': '#3b1a26', '--accent': '#ff4d6a',
      '--sq-light': '#f1dcc0', '--sq-dark': '#7c2f35', '--frame': '#3a1519',
    },
  },
  forest: {
    id: 'forest',
    vars: {
      '--bg-1': '#0d1d12', '--bg-2': '#21472a', '--accent': '#8ed36b',
      '--sq-light': '#e3ebc1', '--sq-dark': '#3e6b3a', '--frame': '#24401f',
    },
  },
  lake: {
    id: 'lake',
    vars: {
      '--bg-1': '#071626', '--bg-2': '#14406a', '--accent': '#5cc8ff',
      '--sq-light': '#d6ebf7', '--sq-dark': '#2d6f9e', '--frame': '#17405f',
    },
  },
  mountain: {
    id: 'mountain',
    vars: {
      '--bg-1': '#17171f', '--bg-2': '#3a3846', '--accent': '#ffb86b',
      '--sq-light': '#e8e2d9', '--sq-dark': '#6c6b76', '--frame': '#3f3e4a',
    },
  },
};

export function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(THEMES[id].vars)) root.style.setProperty(name, value);
}
