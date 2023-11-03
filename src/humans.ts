/* humans.ts used on hh/humans */
console.log('humans.ts');

import { gsap } from 'gsap';

import { colors } from '$utils/colors';

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

      // Humans
      const humans = document.querySelector('[cs-el="humans"]');
      if (humans) {
        const humansListItems: string[] = gsap.utils.toArray('[cs-el="humans-list-item"]');
        if (humansListItems) {
          // Fade in on page load
          gsap.from(humansListItems, {
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power1.in',
          });
          // Nav Hovers
          humansListItems.forEach((item: any) => {
            const overlay = item.querySelector('[cs-el="hhp_humans-overlay"]');
            const tagline = overlay.querySelector('[cs-el="hhp_humans-tagline"]');
            const details = item.querySelector('[cs-el="hhp_humans-details"]');
            const name = details.querySelector('[cs-el="hhp_humans-name"]');
            const icon = details.querySelector('[cs-el="hhp_humans-icon"]');
            const navItemHover_1 = gsap.timeline({ paused: true });
            const navItemHover_2 = gsap.timeline({ paused: true });

            navItemHover_1.to(item, { y: '-0.5rem', duration: 0.5, ease: 'sin.out' });
            navItemHover_2.to(overlay, { opacity: 1, duration: 0.25, ease: 'sin.in' }, '<');
            navItemHover_2.to(
              details,
              { color: colors['darkGrey'], duration: 0.25, ease: 'sin.in' },
              '<'
            );
            navItemHover_2.to(name, { color: colors['dark'], duration: 0.25, ease: 'sin.in' }, '<');
            navItemHover_2.from(tagline, { opacity: 0, duration: 0.725, ease: 'sin.in' }, '.25');
            navItemHover_2.from(icon, { opacity: 0, duration: 0.25, ease: 'sin.in' }, '<');
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
      } // End: Humans

      function setRatingStars() {
        const ratingContainers = document.querySelectorAll<HTMLElement>('[cs-el="rating-stars"]');
        console.log(ratingContainers.length);
        ratingContainers.forEach((container) => {
          const rating = parseInt(container.getAttribute('rating') || '0', 10);
          const color = container.getAttribute('color') || 'green'; // Default to green if not specified

          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            const stars = container.querySelectorAll<HTMLElement>('[cs-el="rating-star"]');

            if (stars.length === 0) return; // No stars found, exit the loop.

            for (let i = 0; i < rating; i++) {
              stars[i].classList.add('is-active');
              gsap.set(stars[i], { color: colors[color] });
              // if (stars[i]) {
              //   gsap.to(stars[i], {
              //     opacity: 1,
              //     duration: 0,
              //     color: colors[color],
              //     stagger: 0, // Stagger the animation with 0.2 seconds between each star.
              //     onComplete: () => {
              //       stars[i].classList.add('is-active'); // Add the 'filled' class to the stars.
              //     },
              //   });
              // }
            }
          }
        });
      }

      // Call the function to set the rating stars.
      setRatingStars();

      function init() {}

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
