import { gsap } from 'gsap';
export { gsap };

import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export { ScrollTrigger };

import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, Draggable, SplitType);

import { initSliders } from 'src/components/sliders';

import { colorArray } from '$utils/colors';
import { loopLogoLetters } from '$utils/colors';

//_______________________________________________________________________________________________________ Global Declarations
const globalEase = 'back.out';
const globalDuration = 0.75;

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Buttons with Icon Mouse Overs
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

  //_______________________________________________________________________________________________________ Loop Logo Letter Colors
  const logo = document.querySelector('[cs-el="logo"]');
  if (logo) {
    const logoLetters: string[] = gsap.utils.toArray('[cs-el="logo-letter"]');
    if (logoLetters.length > 0) {
      setInterval(() => loopLogoLetters(logoLetters), 1000);
    }
  }

  //_______________________________________________________________________________________________________ Split text into spans
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

  //_______________________________________________________________________________________________________ Loop Gradient Backgrounds
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
      changeGradientColor();
    });
  }
  //_______________________________________________________________________________________________________ Login Modal
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

  //_______________________________________________________________________________________________________ DEV: Check for wider DOM elements
  // const docWidth = document.documentElement.offsetWidth;
  // [].forEach.call(document.querySelectorAll('*'), function (el: HTMLElement) {
  //   if (el.offsetWidth > docWidth) {
  //     console.log(el);
  //   }
  // });

  //_______________________________________________________________________________________________________ Initiate Function when DOM ready
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
    initSliders();
  }
  //_______________________________________________________________________________________________________ Add Window Event Listeners
  window.addEventListener('resize', () => {
    init();
  });
  window.addEventListener('load', () => {
    init();
  });
}); // End: Webflow Push
