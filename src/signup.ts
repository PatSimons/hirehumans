/* signup.ts used on hh/signup */
console.log('signup.ts');

import { gsap } from 'gsap';

import { colors } from '$utils/colors';

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

      //// Loop Logo Letter Color
      const logoLetters: string[] = gsap.utils.toArray('.logo_letter');
      if (logoLetters.length > 0) {
        function loopLogoLetters(letters: string[]) {
          gsap.utils.shuffle(colors);
          gsap.to(letters, { color: gsap.utils.wrap(colors), duration: 0.25 });
        }
        setInterval(() => loopLogoLetters(logoLetters), 1000);
      } // End: Logo Letter Color

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
