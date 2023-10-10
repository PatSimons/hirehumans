import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);

window.Webflow ||= [];
window.Webflow.push(() => {
  //// Setup Match Media
  const mm = gsap.matchMedia();
  const breakPoint = 800;

  // //// Swipe Test
  // const swpy = document.querySelector('.swipe-test');
  // console.log('swwwwwipey!!');
  // Observer.create({
  //   target: swpy,
  //   type: 'wheel,touch,pointer',
  //   preventDefault: true,
  //   wheelSpeed: -1,
  //   onLeft: () => {
  //     console.log('left');
  //   },
  //   onDown: () => {
  //     console.log('right');
  //   },
  //   tolerance: 10,
  // });
  // //// End: Swipe test

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isMobile: `(max-width: ${breakPoint - 1}px)`,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions;

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
