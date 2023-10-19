import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(Draggable);

import { colorArray } from '$utils/colors';
import { loopLogoLetters } from '$utils/colors';

const globalEase = 'back.out';
const globalDuration = 0.75;

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

      // HHP Hero Image Scrolltrigger
      const hhpHeroImg = document.querySelector('[cs-el="hhp-hero-img"]');
      if (hhpHeroImg) {
        gsap.to(hhpHeroImg, {
          yPercent: 20,
          scrollTrigger: { trigger: hhpHeroImg, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      }
      // End: HHP Hero Image Scrolltrigger

      // HHP Section Scrolltrigger
      const hhpSections = gsap.utils.toArray('[cs-el="hhp-profile-section"]');
      if (hhpSections.length > 0) {
        hhpSections.forEach((el: any) => {
          gsap.from(el, {
            opacity: 0,
            xPercent: 15,
            ease: 'sin.out',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'top 75%',
              scrub: 1,
            },
          });
        });
      }

      // HHP User Card & Nav
      const hhpAside = document.querySelector('[cs-el="hhp-aside"]');
      const hhpUserCard = document.querySelector('[cs-el="hhp-user-card"]');
      const hhpBody = document.querySelector('[cs-el="hhp-body"]');
      //console.log();
      const toggleNav = gsap.timeline({ paused: true });

      const stNav = ScrollTrigger.create({
        trigger: hhpAside,
        start: 'top 34rem',
        endTrigger: hhpBody,
        end: () => `bottom ${hhpUserCard.offsetHeight + 64}`,
        markers: false,
        pin: hhpUserCard,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onEnter: () => toggleNav.delay(2).timeScale(1).play(),
        onLeaveBack: () => toggleNav.timeScale(4).reverse(),
      });
      const hhpNav = document.querySelector('[cs-el="hhp-nav"]');
      if (hhpNav) {
        const navItems = gsap.utils.toArray('[cs-el="hhp-nav-item"]');
        toggleNav.from(navItems, {
          autoAlpha: 0,
          duration: 0.3,
          y: '-2rem',
          ease: globalEase,
          stagger: 0.1,
        });
        // Nav Hovers
        navItems.forEach((item: any) => {
          const navItemHover = gsap.timeline({ paused: true });
          navItemHover.to(item, { x: '0.25rem', duration: 1, ease: globalEase });
          item.addEventListener('mouseenter', () => {
            navItemHover.timeScale(0.5).play();
          });
          item.addEventListener('mouseleave', () => {
            navItemHover.timeScale(1.5).reverse();
          });
        });
      }

      // End: HHP User Card & Nav

      // // SLIDERS
      // /* Makes use of the following data attributes
      // cs-el="slider"
      // cs-el="slide"
      // cs-el="slider-nav"
      // cs-el="slider-nav_next"
      // cs-el="slider-nav_prev"
      // cs-el="slider-thumbs"
      // cs-el="slider-thumb"
      // slider-settings="nav, thumbs, caption, loop, swipe"
      // */
      // function initSliders() {
      //   const sliders = gsap.utils.toArray<HTMLElement>('[cs-el="slider"]');
      //   //console.log(sliders.length);
      //   sliders.forEach((slider: any) => {
      //     if (slider) {
      //       let navEnabled = false;
      //       let thumbsEnabled = false;
      //       let captionEnabled = false;
      //       let loopEnabled = false;
      //       const swipeEnabled = false;

      //       // Get slider settings (nav, thumbs, caption, loop)
      //       const sliderSettings = slider?.getAttribute('slider-settings');
      //       if (sliderSettings) {
      //         // Split the CSV values into an array
      //         const settingsArray = sliderSettings.split(', ');
      //         // Access individual values
      //         navEnabled = settingsArray.includes('nav');
      //         thumbsEnabled = settingsArray.includes('thumbs');
      //         captionEnabled = settingsArray.includes('thumbs');
      //         loopEnabled = settingsArray.includes('loop');
      //       }

      //       //captionEnabled = false;
      //       //swipeEnabled = true;

      //       // Setup sildes
      //       const slides = slider.querySelectorAll('[cs-el="slide"]');
      //       const slidesLength = slides.length;
      //       if (slidesLength > 1) {
      //         let count = 0;
      //         const fadeTime = 2;
      //         const turnTime = 5;

      //         gsap.set(slides, { opacity: 0 });
      //         gsap.set(slides[0], { opacity: 1 });

      //         Observer.create({
      //           target: slider,
      //           type: 'touch',
      //           onUp: () => {
      //             //   console.log('swipe');
      //           },
      //           onLeft: () => {
      //             //console.log('onLeft');
      //             goPrev();
      //           },
      //           onRight: () => {
      //             //console.log('onRight');
      //             goNext();
      //           },
      //         });

      //         // Show/hide slider controls in hover.
      //         const toggleControls = gsap.timeline({ paused: true });
      //         slider.addEventListener('mouseenter', () => {
      //           toggleControls.timeScale(1).play();
      //         });
      //         slider.addEventListener('mouseleave', () => {
      //           toggleControls.timeScale(2).reverse();
      //         });
      //         const sliderNav = slider.querySelector('[cs-el="slider-nav"]');
      //         if (navEnabled && sliderNav) {
      //           const next = sliderNav.querySelector('[cs-el="slider-nav_next"]');
      //           const prev = sliderNav.querySelector('[cs-el="slider-nav_prev"]');

      //           next?.addEventListener('click', () => goNext());
      //           prev?.addEventListener('click', () => goPrev());
      //           toggleControls.from(next, {
      //             opacity: 0,
      //             duration: globalDuration,
      //             ease: globalEase,
      //             x: '-100%',
      //           });
      //           toggleControls.from(
      //             prev,
      //             { opacity: 0, duration: globalDuration, ease: globalEase, x: '100%' },
      //             '<'
      //           );
      //         } else {
      //           sliderNav?.remove();
      //         }
      //         // End: if (navEnabled && sliderNav) {

      //         // Slider Thumbs
      //         const sliderThumbs = slider.querySelector('[cs-el="slider-thumbs"]');
      //         let allThumbs: HTMLElement[] = [];
      //         if (thumbsEnabled && sliderThumbs) {
      //           // Check for initial thumb element and clone
      //           const thumbs = sliderThumbs.querySelectorAll<HTMLElement>('[cs-el="slider-thumb"]');
      //           // Avoid doing this again and again on Window Resize etc.
      //           if (thumbs.length == 1) {
      //             thumbs.forEach((thumb: any) => {
      //               //const thumb = sliderThumbs.querySelector('[cs-el="slider-thumb"]');
      //               thumb?.classList.remove('is-active');
      //               slides.forEach((slide: any) => {
      //                 const clonedThumb = thumb?.cloneNode(true);

      //                 thumb?.parentNode?.appendChild(clonedThumb);
      //               });
      //               thumb?.remove();
      //               allThumbs = slider.querySelectorAll('[cs-el="slider-thumb"]');
      //               setActiveThumb(0);
      //               allThumbs.forEach((element: any, index) => {
      //                 element.addEventListener('click', () => {
      //                   sliderSlide(null, index, false);
      //                 });
      //               });
      //               toggleControls.from(
      //                 sliderThumbs,
      //                 {
      //                   opacity: 0,
      //                   delay: 0.25,
      //                   duration: globalDuration,
      //                   ease: globalEase,
      //                 },
      //                 '<'
      //               );
      //             }); // End: thumbs.forEach
      //           } // End: if thumbs.length > 1
      //         } else {
      //           sliderThumbs?.remove();
      //         } // End: if (thumbsEnabled && sliderThumbs) {
      //         // End: Slider Thumbs

      //         function sliderSlide(dir: 'next' | 'prev', index?: number) {
      //           gsap.to(slides[count], { duration: fadeTime, opacity: 0 });
      //           if (typeof index === 'number' && index >= 0 && index < slidesLength) {
      //             count = index;
      //           } else {
      //             if (dir === 'next') {
      //               // Set count to next slide index. If 'loopEnabled = true' slides will loop back to first slide
      //               count = count < slidesLength - 1 ? count + 1 : loopEnabled ? 0 : count;
      //             } else if (dir === 'prev') {
      //               // Set count to previous slide index. If 'loopEnabled = true' slides will loop back to last slide
      //               count = count > 0 ? count - 1 : loopEnabled ? slidesLength - 1 : count;
      //             }
      //           }
      //           if (thumbsEnabled) {
      //             setActiveThumb(count);
      //           }
      //           gsap.fromTo(slides[count], { opacity: 0 }, { duration: fadeTime, opacity: 1 });
      //         }
      //         function setActiveThumb(index: number) {
      //           allThumbs.forEach((thumb: HTMLElement) => {
      //             thumb.firstChild?.removeAttribute('hh-background-color');
      //           });
      //           allThumbs[index].firstChild?.setAttribute('hh-background-color', 'p');
      //         }
      //         function goNext() {
      //           sliderSlide('next');
      //         }
      //         function goPrev() {
      //           gsap.killTweensOf(sliderSlide);
      //           sliderSlide('prev');
      //         }
      //       }
      //     } // END: Slider
      //   }); // End: sliders.forEach
      // } // End: function initSliders()

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
