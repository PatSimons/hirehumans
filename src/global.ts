import { gsap } from 'gsap';
//import { Draggable } from 'gsap/Draggable';
//import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
//gsap.registerPlugin(Observer);
//gsap.registerPlugin(Draggable);

import { colorArray } from '$utils/colors';
import { loopLogoLetters } from '$utils/colors';
import { initSliders } from '$utils/components';

//// Global Declarations
const globalEase = 'back.out';
const globalDuration = 0.75;
//// End: Global Declarations

//// Global Functions
//// End: Global Functions

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

      ///////////////////// Development Only

      // DEV: Check for wider DOM elements
      const docWidth = document.documentElement.offsetWidth;
      [].forEach.call(document.querySelectorAll('*'), function (el: HTMLElement) {
        if (el.offsetWidth > docWidth) {
          console.log(el);
        }
      }); // End: DEV: Check for wider DOM elements

      ///////////////////// End: Development Only

      //// Loop Logo Letter Colors
      const logo = document.querySelector('[cs-el="logo"]');
      if (logo) {
        const logoLetters: string[] = gsap.utils.toArray('[cs-el="logo-letter"]');
        setInterval(() => loopLogoLetters(logoLetters), 1000);
      } // End: Logo Letter Colors

      //// Loop Gradient Backsgrounds
      // const animatedGradientBackgroundElms = gsap.utils.toArray(
      //   '[hh-background-color="gradient-loop"]'
      // );
      // if (animatedGradientBackgroundElms.length > 0) {
      //   animatedGradientBackgroundElms.forEach((el: any) => {
      //     let currentColorIndex = 0;

      //     function changeGradientColor() {
      //       currentColorIndex = (currentColorIndex + 1) % colorArray.length;

      //       const color1 = colorArray[currentColorIndex];
      //       const color2 = colorArray[(currentColorIndex + 1) % colorArray.length];
      //       const color3 = colorArray[(currentColorIndex + 2) % colorArray.length];
      //       const color4 = colorArray[(currentColorIndex + 3) % colorArray.length];

      //       gsap.to(el, {
      //         duration: 2, // Adjust the duration as needed
      //         background: `linear-gradient(to right, ${color1}, ${color2}, ${color3}, ${color4})`,
      //         onComplete: changeGradientColor,
      //       });
      //     }
      //     // Start the animation
      //     changeGradientColor();
      //   });
      // }
      //// End: Loop Gradient Backsgrounds

      //// Login Modal
      const loginModal = gsap.utils.toArray('[cs-el="login-modal"]');
      if (loginModal) {
        gsap.set(loginModal, { autoAlpha: 0 });
        let isOpen = false;
        const body = document.querySelector('body');
        const loginModalPanel = document.querySelector('[cs-el="login-modal-panel"]');
        const loginModalTriggers = gsap.utils.toArray('[cs-el="login-modal-toggle"]');

        const openModal = gsap.timeline({ paused: true });
        openModal.to(loginModal, { autoAlpha: 1, duration: 1 });
        openModal.from(loginModalPanel, { opacity: 0, yPercent: 5, ease: 'back.out' }, '<.25');
        loginModalTriggers.forEach((trigger: any) => {
          trigger.addEventListener('click', () => {
            if (isOpen) {
              openModal.timeScale(2).reverse();
              body?.classList.toggle('overflow-hidden');
              isOpen = false;
            } else {
              openModal.timeScale(1).play();
              body?.classList.toggle('overflow-hidden');
              isOpen = true;
            }
          });
        });
      }
      //// End: Login Modal

      initSliders();
      function init() {
        // Animate elements On Page Load
        const onPageLoadElms = gsap.utils.toArray('[cs-tr="pageload"]');
        if (onPageLoadElms.length > 0) {
          gsap.to(onPageLoadElms, {
            autoAlpha: 1,
            duration: globalDuration,
            ease: globalEase,
            stagger: 0.25,
          });
        }
        // Scrolltrigger elements On Enter Viewport
        // const scrolltriggerOnEnterElms = gsap.utils.toArray('[cs-tr="scroll"]');
        // if (scrolltriggerOnEnterElms.length > 0) {
        //   scrolltriggerOnEnterElms.forEach((el: any) => {
        //     gsap.from(el, {
        //       opacity: 0,
        //       yPercent: 10,
        //       //filter: 'blur(5px)',
        //       ease: 'sin.out',
        //       scrollTrigger: {
        //         trigger: el,
        //         start: 'top bottom',
        //         end: 'top 70%',
        //         scrub: 1,
        //       },
        //     });
        //   });
        // }
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
