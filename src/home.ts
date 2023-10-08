import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);

window.Webflow ||= [];
window.Webflow.push(() => {
  //// Setup Match Media
  const mm = gsap.matchMedia();
  const breakPoint = 800;

  //// Swipe Test
  const swipeTest: any = document.querySelector('.swipe-test');
  if (swipeTest) {
    console.log('swipetest going on');
    Observer.create({
      target: swipeTest,
      type: 'touch',
      onUp: () => {
        swipeTest.innerHTML('onUp');
        //   console.log('swipe');
      },
      onLeft: () => {
        swipeTest.innerHTML('onLeft');
        //console.log('onLeft');
      },
      onRight: () => {
        //console.log('onRight');
        swipeTest.innerHTML('onRight');
      },
    });
  }
  //// End: Swipe test

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
