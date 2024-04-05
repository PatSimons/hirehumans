import { gsap } from 'gsap';
export { gsap };

import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export { ScrollTrigger };

import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger, Draggable, SplitType);

import { initSliders } from 'src/components/sliders';

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Initite Sliders Functionality
  initSliders();
}); // End: Webflow Push
