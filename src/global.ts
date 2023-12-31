import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, Draggable, SplitType, Sortable);

//import { initMarquees } from 'src/components/marquees';
import { initSliders } from 'src/components/sliders';

import { colorArray } from '$utils/colors';
import { loopLogoLetters } from '$utils/colors';

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

  ///////////////////// Form Elements

  // Add/remove class on click Form Checkboxes
  const formCheckboxes = gsap.utils.toArray<HTMLElement>('.w-checkbox');
  if (formCheckboxes.length > 0) {
    formCheckboxes.forEach((el) => {
      // Define the event handler function
      function handleCheckboxClick() {
        if (el.classList.contains('is-checked')) {
          el.classList.remove('is-checked');
        } else {
          el.classList.add('is-checked');
        }
      }

      // Add a different event type, such as 'mousedown', to handle the click
      el.addEventListener('mousedown', handleCheckboxClick);
    });
  }

  // Add/remove class on click Form Radio Buttons
  const formRadioBtns = gsap.utils.toArray<HTMLElement>('.w-radio');
  if (formRadioBtns.length > 0) {
    formRadioBtns.forEach((el) => {
      // Define the event handler function
      function handleRadioClick() {
        formRadioBtns.forEach((radio) => {
          // Remove the 'is-checked' class from all radio buttons
          radio.classList.remove('is-checked');
        });

        // Add the 'is-checked' class to the clicked radio button
        el.classList.add('is-checked');
      }

      // Add a click event listener to the element
      el.addEventListener('click', handleRadioClick);
    });
  }
  // Sortable List
  const sortableLists = document.querySelectorAll<HTMLElement>('[cs-el="sortable-list"]');
  if (sortableLists.length > 0) {
    const sortableClasses = `.ghost { opacity: 0; }, .drag { opacity: 0.1; }`;
    // Then, you can insert this class into a style tag in your HTML document.
    const style = document.createElement('style');
    style.innerHTML = sortableClasses;
    document.head.appendChild(style);

    sortableLists.forEach((list) => {
      const sortable = Sortable.create(list, {
        handle: '.hha_icon-btn',
        ghostClass: 'ghost',
        //dragClass: 'drag',
        animation: 250,
        forceFallback: false,
      });
    });
  }
  ///////////////////// Form Elements

  const buttons = document.querySelectorAll<HTMLElement>('[cs-el="button"]');
  if (buttons.length > 0) {
    buttons.forEach((button) => {
      const icon = button.lastChild;
      const buttonHover = gsap.timeline({ paused: true });
      buttonHover.to(icon, { x: '0.5rem', duration: 0.25, delay: 0.25, ease: 'sin.in' });
      button.addEventListener('mouseenter', () => {
        buttonHover.timeScale(1).play();
      });
      button.addEventListener('mouseleave', () => {
        buttonHover.timeScale(2).reverse();
      });
    });
  }

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint}px)`,
      isMobile: `(max-width: ${breakPoint - 1}px)`,
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { isDesktop, isMobile, reduceMotion } = context.conditions;

      if (isDesktop) {
      }
      if (isMobile) {
      }
      if (reduceMotion) {
      }

      ///////////////////// Development Only

      // DEV: Check for wider DOM elements
      // const docWidth = document.documentElement.offsetWidth;
      // [].forEach.call(document.querySelectorAll('*'), function (el: HTMLElement) {
      //   if (el.offsetWidth > docWidth) {
      //     console.log(el);
      //   }
      // }); // End: DEV: Check for wider DOM elements

      ///////////////////// End: Development Only

      //// Loop Logo Letter Colors
      const logo = document.querySelector('[cs-el="logo"]');
      if (logo) {
        const logoLetters: string[] = gsap.utils.toArray('[cs-el="logo-letter"]');
        if (logoLetters.length > 0) {
          setInterval(() => loopLogoLetters(logoLetters), 1000);
        }
      } // End: Logo Letter Colors

      // Split text into spans
      const splitTextElms = gsap.utils.toArray<HTMLElement>('[txt-split]');
      if (splitTextElms.length > 0) {
        splitTextElms.forEach((el) => {
          const splitTextType = el.getAttribute('txt-split');
          if (splitTextType === 'words') {
            const typeSplit = new SplitType(el, {
              types: 'words',
              tagName: 'div',
              wordClass: 'el',
            });
          }
          if (splitTextType === 'chars') {
            const typeSplit = new SplitType(el, {
              types: 'chars',
              tagName: 'div',
              charClass: 'el',
            });
          }
          const letters = el.querySelectorAll<HTMLElement>('.el');
          if (letters.length > 0) {
            setInterval(() => loopLogoLetters(letters), 1000);
          }
        });
      }

      //// Loop Gradient Backsgrounds
      const animatedGradientBackgroundElms = gsap.utils.toArray(
        '[hh-background-color="gradient-loop"]'
      );
      if (animatedGradientBackgroundElms.length > 0) {
        animatedGradientBackgroundElms.forEach((el: any) => {
          let currentColorIndex = 0;

          function changeGradientColor() {
            currentColorIndex = (currentColorIndex + 1) % colorArray.length;

            const color1 = colorArray[currentColorIndex];
            const color2 = colorArray[(currentColorIndex + 1) % colorArray.length];
            const color3 = colorArray[(currentColorIndex + 2) % colorArray.length];
            const color4 = colorArray[(currentColorIndex + 3) % colorArray.length];

            gsap.to(el, {
              duration: 2, // Adjust the duration as needed
              background: `linear-gradient(to right, ${color1}, ${color2}, ${color3}, ${color4})`,
              onComplete: changeGradientColor,
            });
          }
          // Start the animation
          changeGradientColor();
        });
      }
      //// End: Loop Gradient Backsgrounds

      //// Login Modal
      const loginModal = gsap.utils.toArray('[cs-el="login-modal"]');
      if (loginModal.length > 0) {
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

      function init() {
        // Animate elements On Page Load
        const onPageLoadElms = gsap.utils.toArray<HTMLElement>('[cs-tr="pageload"]');
        if (onPageLoadElms.length > 0) {
          gsap.to(onPageLoadElms, {
            autoAlpha: 1,
            duration: globalDuration,
            ease: globalEase,
            stagger: 0.25,
          });
        }
        // Scrolltrigger elements On Enter Viewport
        const scrolltriggerOnEnterElms = gsap.utils.toArray<HTMLElement>('[cs-st*="scroll-in"]');
        if (scrolltriggerOnEnterElms.length > 0) {
          scrolltriggerOnEnterElms.forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              yPercent: 10,
              ease: 'sin.out',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'top 70%',
                scrub: 1,
              },
            });
          });
        }
      } // End: function init()
      // Scrolltrigger paralax auto
      const st_paralaxBgElms = gsap.utils.toArray<HTMLElement>('[cs-st*="paralax-bg"]');
      if (st_paralaxBgElms.length > 0) {
        st_paralaxBgElms.forEach((el) => {
          gsap.to(el, {
            yPercent: 20,
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 2 },
          });
        });
      }
      // End: HHP Hero Image Scrolltrigger

      window.addEventListener('resize', () => {
        init();
      });
      window.addEventListener('load', () => {
        init();
      });
      return () => {
        console.log('viewport size changed');
      };
    } // End: MM Context
  ); // End: Setup Match Media

  initSliders();
  //initMarquees();
}); // End: Webflow Push

// window.Webflow = window.Webflow || [];
// window.Webflow.push(() => {
//   // Define a breakpoint for responsive design
//   const breakpoint = 800;

//   // Initialize Match Media instance
//   const matchMedia = gsap.matchMedia();

//   // Define the media query conditions
//   const mediaQueries = {
//     isDesktop: `(min-width: ${breakpoint}px)`,
//     isMobile: `(max-width: ${breakpoint - 1}px)`,
//     reduceMotion: '(prefers-reduced-motion: reduce)',
//   };

//   // Callback function to handle media query changes
//   matchMedia.add(mediaQueries, (context) => {
//     const { isDesktop, isMobile, reduceMotion } = context.conditions || {};

//     // Your code to respond to media query changes
//     if (isDesktop) {
//       // Code for desktop view
//     } else if (isMobile) {
//       // Code for mobile view
//     }

//     if (reduceMotion) {
//       // Code for reduced motion setting
//     }
//   });
// });
