import './global';

import { colorArray } from '$utils/colors';
import { loopLogoLetters } from '$utils/colors';

import { gsap } from './global';
import { ScrollTrigger } from './global';

const globalEase = 'back.out';
const globalDuration = 0.75;

//function init() {} // End: function init()

// window.addEventListener('resize', () => {
//   init();
// });
// window.addEventListener('load', () => {
//   init();
// });

window.Webflow ||= [];
window.Webflow.push(() => {
  // HHP Hero Image Scrolltrigger
  const hhpHeroImg = document.querySelector('[cs-el="userHeroImg"]');
  if (hhpHeroImg) {
    gsap.to(hhpHeroImg, {
      yPercent: 20,
      scrollTrigger: { trigger: hhpHeroImg, start: 'top top', end: 'bottom top', scrub: 1 },
    });
  }
  // End: HHP Hero Image Scrolltrigger

  // HHP Section Scrolltrigger
  const hhpSections = gsap.utils.toArray<HTMLElement>('[cs-el="userBodySection"]');
  //const hhpSections = document.querySelectorAll<HTMLElement>('[cs-el="userBodySection"]');
  //console.log('sctns >' + hhpSections.length);
  if (hhpSections.length > 0) {
    hhpSections.forEach((el: HTMLElement) => {
      gsap.from(el, {
        opacity: 0,
        yPercent: 20,
        ease: 'sin.out',

        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'top 75%',
          scrub: 1,
          markers: false,
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
  //_______________________________________________________________________________________________________ Human Aside Pin & Nav Items
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
  // Human Toggle Nav Items
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
    // Human Nav Hovers
    navItems.forEach((item: any) => {
      const navItemHover = gsap.timeline({ paused: true });
      navItemHover.to(item, { x: '0.25rem', duration: 1, ease: globalEase });
      item.addEventListener('mouseenter', () => {
        navItemHover.timeScale(1).play();
      });
      item.addEventListener('mouseleave', () => {
        navItemHover.timeScale(1.5).reverse();
      });
    });
  }

  // End: HHP User Card & Nav
}); // End: Webflow Push
