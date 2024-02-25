import './global';

// import { Draggable } from 'gsap/Draggable';
// import { Observer } from 'gsap/Observer';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from './global';
import { ScrollTrigger } from './global';

////////////////////////////////////////////////////////////////////////////////////

// window.Webflow ||= [];
// window.Webflow.push(() => {
//   //// Setup Match Media
//   const mm = gsap.matchMedia();
//   const breakPoint = 800;

//   mm.add(
//     {
//       isDesktop: `(min-width: ${breakPoint}px)`,
//       isMobile: `(max-width: ${breakPoint - 1}px)`,
//       reduceMotion: '(prefers-reduced-motion: reduce)',
//     },
//     (context) => {
//       const { isDesktop, isMobile, reduceMotion } = context.conditions;

//       function init() {} // End: function init()

//       window.addEventListener('resize', () => {
//         init();
//       });
//       window.addEventListener('load', () => {
//         init();
//       });
//       return () => {};
//     } // End: MM Context
//   ); // End: Setup Match Media
// }); // End: Webflow Push
