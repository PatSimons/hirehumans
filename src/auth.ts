/* auth.ts used on hh/signup & hh/login */
console.log('auth.ts');

import { gsap } from 'gsap';

import { loopLogoLetters } from '$utils/colors';

window.Webflow ||= [];
window.Webflow.push(() => {
  //// Setup Match Media
  const mm = gsap.matchMedia();
  const breakPoint = 800;
  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isMobile: `(max-width: ${breakPoint - 1}px)`,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions;

      // On page load
      const entryPanel = document.querySelector('[cs-el="entry-panel"]');
      if (entryPanel) {
        gsap.to(entryPanel, { autoAlpha: 1, yPercent: -5, ease: 'back.out', duration: 2 });
      }
      // End: On page load

      function init() {} // End: function init()

      window.addEventListener('resize', () => {
        init();
      });
      window.addEventListener('load', () => {
        init();
      });
      return () => {};
    } // End: MM Context
  ); // End: Setup Match Media
}); // End: Webflow Push
