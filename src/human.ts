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

      // HHP Slider
      const slider = document.querySelector('[cs-el="hhp-slider"]');

      if (slider) {
        const slides = document.querySelectorAll('[cs-el="hhp-slide"]');
        const slidesLength = slides.length;
        if (slidesLength > 0) {
          let count = 0;
          const fadeTime = 2;
          const turnTime = 5;

          Observer.create({
            target: slider,
            type: 'touch',
            onLeft: () => {
              console.log('left');
              goPrev();
            },
            onRight: () => {
              console.log('right');
              goNext();
            },
          });

          const next = document.querySelector('[cs-el="hhp-slider-nav-next"]');
          const prev = document.querySelector('[cs-el="hhp-slider-nav-prev"]');
          const thumbsWrap = document.querySelector('[cs-el="hhp-slider-thumbs-wrap"]');
          let allThumbs: HTMLElement[] = [];

          const toggleControls = gsap.timeline({ paused: true });
          toggleControls.from(next, {
            opacity: 0,
            duration: globalDuration,
            ease: globalEase,
            x: '-100%',
          });
          toggleControls.from(
            prev,
            { opacity: 0, duration: globalDuration, ease: globalEase, x: '100%' },
            '<'
          );
          if (thumbsWrap) {
            const thumb = thumbsWrap.querySelector('[cs-el="hhp-slider-thumb"]');
            thumb?.classList.remove('is-active');
            slides.forEach((slide: any) => {
              const clonedThumb = thumb?.cloneNode(true);

              thumb?.parentNode?.appendChild(clonedThumb);
            });
            thumb?.remove();
            allThumbs = gsap.utils.toArray('[cs-el="hhp-slider-thumb"]');
            setActiveThumb(0);
            allThumbs.forEach((element: any, index) => {
              element.addEventListener('click', () => {
                fadeIt(null, index);
              });
            });
            toggleControls.from(
              thumbsWrap,
              {
                opacity: 0,
                delay: 0.25,
                duration: globalDuration,
                ease: globalEase,
              },
              '<'
            );
          }
          slider.addEventListener('mouseenter', () => {
            toggleControls.timeScale(1).play();
          });
          slider.addEventListener('mouseleave', () => {
            toggleControls.timeScale(2).reverse();
          });
          next?.addEventListener('click', () => goNext());
          prev?.addEventListener('click', () => goPrev());
          gsap.set(slides, { opacity: 0 });
          gsap.set(slides[0], { opacity: 1 });

          function fadeIt(dir?: string, index?: number) {
            gsap.to(slides[count], { duration: fadeTime, opacity: 0 });
            if (typeof index === 'number' && index >= 0 && index < slidesLength) {
              count = index;
            } else {
              if (dir === 'next') {
                count = (count + 1) % slidesLength;
              }
              if (dir === 'prev') {
                count = (count - 1 + slidesLength) % slidesLength;
              }
            }
            setActiveThumb(count);
            gsap.fromTo(slides[count], { opacity: 0 }, { duration: fadeTime, opacity: 1 });
          }
          function setActiveThumb(index: number) {
            allThumbs.forEach((thumb: HTMLElement) => {
              thumb.firstChild?.removeAttribute('hh-background-color');
            });
            allThumbs[index].firstChild?.setAttribute('hh-background-color', 'p');
          }
          function goNext() {
            fadeIt('next');
          }
          function goPrev() {
            gsap.killTweensOf(fadeIt);
            fadeIt('prev');
          }
        }
      }
      // END: HHP Slider

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
