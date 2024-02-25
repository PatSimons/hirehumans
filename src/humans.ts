import './global';

import { colors, darkenColor } from '$utils/colors';

import { gsap } from './global';
import { ScrollTrigger } from './global';

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Human Cards
  const humans = document.querySelector<HTMLElement>('[cs-el="humans"]');
  if (humans) {
    const humansListItems = gsap.utils.toArray<HTMLElement>('[cs-el="humans-list-item"]');
    if (humansListItems.length > 0) {
      // Human Cards Fade In on Enter Viewport
      ScrollTrigger.batch(humansListItems, {
        onEnter: (batch) => gsap.from(batch, { y: '8px', opacity: 0, duration: 1, stagger: 0.1 }),
      });

      // Human Card Mouse Hovers
      humansListItems.forEach((item: HTMLElement) => {
        const overlay = item.querySelector<HTMLElement>('[cs-el="hhp_humans-overlay"]');
        if (overlay) {
          const tagline = overlay.querySelector<HTMLElement>('[cs-el="hhp_humans-tagline"]');
          const details = item.querySelector<HTMLElement>('[cs-el="hhp_humans-details"]');
          const name = details?.querySelector<HTMLElement>('[cs-el="hhp_humans-name"]');
          const icon = details?.querySelector<HTMLElement>('[cs-el="hhp_humans-icon"]');
          const star = item.querySelectorAll<HTMLElement>('[cs-el="rating-star"]');

          const navItemHover_1 = gsap.timeline({ paused: true });
          const navItemHover_2 = gsap.timeline({ paused: true });

          if (name && icon && star) {
            navItemHover_1.to(item, { y: '-0.5rem', duration: 0.5, ease: 'sin.out' });
            navItemHover_2.to(overlay, { opacity: 1, duration: 0.25, ease: 'sin.in' }, '<');
            navItemHover_2.to(
              details,
              { color: colors['dark'], duration: 0.25, ease: 'sin.in' },
              '<'
            );
            navItemHover_2.to(
              star,
              { color: colors['light'], duration: 0.25, ease: 'sin.in' },
              '<'
            );
            navItemHover_2.to(name, { color: colors['dark'], duration: 0.25, ease: 'sin.in' }, '<');
            navItemHover_2.from(tagline, { opacity: 0, duration: 0.725, ease: 'sin.in' }, '.25');
            navItemHover_2.from(
              icon,
              { x: '-1rem', opacity: 0, duration: 0.25, ease: 'sin.in' },
              '<'
            );
            item.addEventListener('mouseenter', () => {
              navItemHover_1.timeScale(1).play();
              navItemHover_2.timeScale(1).play();
            });
            item.addEventListener('mouseleave', () => {
              navItemHover_1.timeScale(2).reverse();
              navItemHover_2.timeScale(4).reverse();
            });
          }
        }
      });
    }
  }

  //_______________________________________________________________________________________________________ Search Bar
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
    onLeaveBack: () => gsap.to(searchBar, { backgroundColor: 'transparent' }),
  });

  //_______________________________________________________________________________________________________ Set Rating Stars
  function setRatingStars() {
    ratingContainers.forEach((container) => {
      const rating = parseInt(container.getAttribute('rating') || '0', 10);
      //const color = container.getAttribute('color') || 'green'; // Default to green if not specified
      const stars = container.querySelectorAll<HTMLElement>('[cs-el="rating-star"]');
      for (let i = rating; i < stars.length; i++) {
        stars[i].classList.add('is-muted');
      }
    });
  }

  // Call setRatingStars()
  const ratingContainers = document.querySelectorAll<HTMLElement>('[cs-el="rating-stars"]');
  if (ratingContainers.length > 0) {
    setRatingStars();
  }
}); // End: Webflow Push
