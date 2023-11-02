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
            const navItemHover = gsap.timeline({ paused: true });
            navItemHover.to(item, { y: '-0.5rem', duration: 0.5, ease: 'power1.out' });
            item.addEventListener('mouseenter', () => {
              navItemHover.timeScale(1).play();
            });
            item.addEventListener('mouseleave', () => {
              navItemHover.timeScale(3).reverse();
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
              if (stars[i]) {
                gsap.to(stars[i], {
                  opacity: 1,
                  duration: 2,
                  color: colors[color],
                  stagger: 2, // Stagger the animation with 0.2 seconds between each star.
                  onComplete: () => {
                    stars[i].classList.add('is-active'); // Add the 'filled' class to the stars.
                  },
                });
              }
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
