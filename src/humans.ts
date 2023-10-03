/* signup.ts used on hh/humans */
console.log('humans.ts');

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
      const logo = document.querySelector('[cs-el="logo"]');
      if (logo) {
        const logoLetters: string[] = gsap.utils.toArray('[cs-el="logo-letter"]');
        setInterval(() => loopLogoLetters(logoLetters), 1000);
      } // End: Logo Letter Colors

      // Humans
      const humans = document.querySelector('[cs-el="humans"]');
      if (humans) {
        const humansListItems: string[] = gsap.utils.toArray('[cs-el="humans-list-item"]');
        if (humansListItems) {
          // Fade in on page load
          gsap.from(humansListItems, {
            autoAlpha: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'power1.out',
          });
          // Nav Hovers
          humansListItems.forEach((item: HTMLElement) => {
            const navItemHover = gsap.timeline({ paused: true });
            navItemHover.to(item, { y: '-0.5rem', duration: 0.5, ease: 'power1.out' });
            item.addEventListener('mouseenter', () => {
              navItemHover.timeScale(1).play();
            });
            item.addEventListener('mouseleave', () => {
              navItemHover.timeScale(3).reverse();
            });
          });
        }
      } // End: Humans

      function init() {
        console.log('init called');
      } // End: function init()

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
