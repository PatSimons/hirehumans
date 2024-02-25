import './global';

import { gsap } from './global';

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Show Entry Panel on page load
  const entryPanel = document.querySelector('[cs-el="entry-panel"]');
  if (entryPanel) {
    gsap.to(entryPanel, { autoAlpha: 1, yPercent: -5, ease: 'back.out', duration: 2 });
  }
}); // End: Webflow Push
