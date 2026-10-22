import { h } from '../dom';

interface AnimatedLogoOptions {
  /** Name of the WebM (with alpha) in public/video, without extension. */
  video: string;
  /** Static image shown when the animation cannot be played. */
  fallback: string;
  alt: string;
  className: string;
}

// Safari has no VP9 alpha support, so it gets the static logo.
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function canPlayAlphaWebm(): boolean {
  if (isSafari) return false;
  return document.createElement('video').canPlayType('video/webm; codecs="vp9"') !== '';
}

/** Plays the logo animation once on load and again on click; falls back to a still image. */
export function animatedLogo({ video, fallback, alt, className }: AnimatedLogoOptions): HTMLElement {
  const still = () => h('img', { class: className, src: fallback, alt, draggable: false });
  if (!canPlayAlphaWebm()) return still();

  const el = h('video', {
    class: `${className} logo-video`,
    src: `${import.meta.env.BASE_URL}video/${video}.webm`,
    'aria-label': alt,
    role: 'img',
    muted: true,
    playsinline: true,
    autoplay: true,
    preload: 'auto',
    title: alt,
  });
  el.muted = true; // the `muted` attribute alone is not enough for autoplay in every browser
  el.addEventListener('error', () => el.replaceWith(still()));
  el.addEventListener('click', () => {
    el.currentTime = 0;
    void el.play().catch(() => {});
  });
  return el;
}
