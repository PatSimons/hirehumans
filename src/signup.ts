/* signup.ts used on hh/signup & hh/login */
console.log('signup.ts');

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

      //// Loop Logo Letter Colors
      const logoLetters: string[] = gsap.utils.toArray('.logo_letter');
      if (logoLetters.length > 0) {
        setInterval(() => loopLogoLetters(logoLetters), 1000);
      } // End: Logo Letter Colors

      const loginModal = gsap.utils.toArray('[cs-el="login-modal"]');
      if (loginModal) {
        gsap.set(loginModal, { autoAlpha: 0 });
        let isOpen = false;
        const loginModalContainer = document.querySelector('[cs-el="login-modal-container"]');
        const loginModalPanel = document.querySelector('[cs-el="login-modal-panel"]');
        const loginModalTriggers = gsap.utils.toArray('[cs-el="login-modal-trigger"]');
        const openModal = gsap.timeline({ paused: true });
        openModal.to(loginModal, { autoAlpha: 1, duration: 1 });
        openModal.from(loginModalPanel, { opacity: 0, yPercent: 5, ease: 'back.out' }, '<.25');
        loginModalTriggers.forEach((trigger: any) => {
          trigger.addEventListener('click', () => {
            if (isOpen) {
              openModal.timeScale(2).reverse();
              isOpen = false;
            } else {
              openModal.timeScale(1).play();
              isOpen = true;
            }
          });
        });
      }

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
