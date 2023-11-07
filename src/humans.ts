/* humans.ts used on hh/humans */
console.log('humans.ts');

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { colors, darkenColor } from '$utils/colors';

window.Webflow ||= [];
window.Webflow.push(() => {
  //// Humans
  const humans = document.querySelector('[cs-el="humans"]');
  if (humans) {
    const humansListItems: string[] = gsap.utils.toArray('[cs-el="humans-list-item"]');
    if (humansListItems) {
      //// Fade in on page load
      // gsap.from(humansListItems, {
      //   autoAlpha: 0,
      //   duration: 0.5,
      //   stagger: 0.1,
      //   ease: 'power1.in',
      // });

      ScrollTrigger.batch(humansListItems, {
        onEnter: (batch) => gsap.from(batch, { y: '8px', opacity: 0, duration: 1, stagger: 0.1 }),
        //onEnter: (batch) => gsap.to(batch, { y: '0px', autoAlpha: 1, duration: 1, stagger: 0.1 }),
      });

      // // Scrolltrigger - Batch Fade-In
      // const batchElms: string[] = gsap.utils.toArray('[cs-st="batch-in"]');
      // if (batchElms) {
      //   ScrollTrigger.batch(batchElms, {
      //     onEnter: (batch) => gsap.to(batch, { y: '0px', autoAlpha: 1, duration: 1, stagger: 0.1 }),
      //     //onEnter: (batch) => gsap.to(batch, { y: '0px', autoAlpha: 1, duration: 1, stagger: 0.1 }),
      //   });
      // } // End: Scrolltrigger - Batch Fade-In
      // // Scrolltrigger - On Enter
      // if (document.querySelector('[cs-st="enter"]')) {
      //   const scrollInElms: string[] = gsap.utils.toArray('[cs-st="enter"]');
      //   scrollInElms.forEach((el: any) => {
      //     gsap.from(el, {
      //       opacity: 0,
      //       y: '50px',
      //       scrollTrigger: {
      //         trigger: el,
      //         start: 'top bottom',
      //         end: 'bottom 90%',
      //         scrub: true,
      //         markers: false,
      //         invalidateOnRefresh: true,
      //       },
      //     });
      //   });
      // } // End: Scrolltrigger - On Enter

      // Nav Hovers
      humansListItems.forEach((item: any) => {
        const overlay = item.querySelector('[cs-el="hhp_humans-overlay"]');
        const tagline = overlay.querySelector('[cs-el="hhp_humans-tagline"]');
        const details = item.querySelector('[cs-el="hhp_humans-details"]');
        const name = details.querySelector('[cs-el="hhp_humans-name"]');
        const icon = details.querySelector('[cs-el="hhp_humans-icon"]');
        const star = item.querySelectorAll<HTMLElement>('[cs-el="rating-star"]');

        const navItemHover_1 = gsap.timeline({ paused: true });
        const navItemHover_2 = gsap.timeline({ paused: true });

        navItemHover_1.to(item, { y: '-0.5rem', duration: 0.5, ease: 'sin.out' });
        navItemHover_2.to(overlay, { opacity: 1, duration: 0.25, ease: 'sin.in' }, '<');
        navItemHover_2.to(details, { color: colors['dark'], duration: 0.25, ease: 'sin.in' }, '<');
        navItemHover_2.to(star, { color: colors['light'], duration: 0.25, ease: 'sin.in' }, '<');
        navItemHover_2.to(name, { color: colors['dark'], duration: 0.25, ease: 'sin.in' }, '<');
        navItemHover_2.from(tagline, { opacity: 0, duration: 0.725, ease: 'sin.in' }, '.25');
        navItemHover_2.from(icon, { x: '-1rem', opacity: 0, duration: 0.25, ease: 'sin.in' }, '<');
        item.addEventListener('mouseenter', () => {
          navItemHover_1.timeScale(1).play();
          navItemHover_2.timeScale(1).play();
        });
        item.addEventListener('mouseleave', () => {
          navItemHover_1.timeScale(2).reverse();
          navItemHover_2.timeScale(4).reverse();
        });
      });
    }
  } //// End: Humans

  //// Search Bar
  // HHP User Card & Nav
  const humansSection = document.querySelector('[cs-el="humans-section"]');
  const searchBar = document.querySelector('[cs-el="search-bar"]');

  const stSearchBar = ScrollTrigger.create({
    trigger: humansSection,
    start: 'top 79px', // Nav height
    end: 'bottom top',
    markers: false,
    pin: searchBar,
    pinSpacing: false,
    invalidateOnRefresh: true,
    onEnter: () => gsap.to(searchBar, { backgroundColor: darkenColor('#d8d3cd', 0.025) }),
    onLeaveBack: () => gsap.to(searchBar, { backgroundColor: colors['lightGrey'] }),
  });
  //// End: Search Bar

  function setRatingStars() {
    ratingContainers.forEach((container) => {
      const rating = parseInt(container.getAttribute('rating') || '0', 10);
      const color = container.getAttribute('color') || 'green'; // Default to green if not specified

      const stars = container.querySelectorAll<HTMLElement>('[cs-el="rating-star"]');
      for (let i = rating; i < stars.length; i++) {
        stars[i].classList.add('is-muted');
      }
    });
  }

  // Call the function to set the rating stars.
  const ratingContainers = document.querySelectorAll<HTMLElement>('[cs-el="rating-stars"]');
  if (ratingContainers.length > 0) {
    setRatingStars();
  }

  function init() {}

  window.addEventListener('resize', () => {
    init();
  });
  window.addEventListener('load', () => {
    init();
  });
}); // End: Webflow Push
