///* components.ts */

import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Observer);
gsap.registerPlugin(Draggable);

import { gsapDuration, gsapEaseType } from '$utils/globalvars';

// Define a type for the slider settings.
interface SliderSettings {
  nav: boolean;
  indicators: boolean;
  caption: boolean;
  loop: boolean;
  swipe: boolean;
  autoplay: boolean;
  togglecontrols: boolean;
}
// Function to parse slider settings from a data attribute.
function parseSliderSettings(slider: HTMLElement): SliderSettings | null {
  const sliderSettings = slider.getAttribute('slider-settings');
  if (!sliderSettings) return null;

  const settingsArray = sliderSettings.split(', ');

  return {
    nav: settingsArray.includes('nav'),
    indicators: settingsArray.includes('indicators'),
    caption: settingsArray.includes('caption'),
    loop: settingsArray.includes('loop'),
    swipe: settingsArray.includes('swipe'),
    autoplay: settingsArray.includes('autoplay'),
    togglecontrols: settingsArray.includes('togglecontrols'),
  };
}
// Export Initialize all sliders
export function initSliders() {
  const sliders = gsap.utils.toArray<HTMLElement>('[cs-el="slider"]');
  sliders.forEach((slider: any) => {
    if (slider) {
      initSlider(slider); // Call the function for each slider
    }
  });
} // End: Initialize all sliders

// Init Slider
function initSlider(slider: HTMLElement) {
  // Parse the slider settings.
  const settings = parseSliderSettings(slider);
  if (!settings) return; // Skip if settings couldn't be parsed.

  const slides = slider.querySelectorAll<HTMLElement>('[cs-el="slide"]');
  const slidesLength = slides.length;

  if (slidesLength <= 1) return; // Skip if there's only one slide.

  let next: HTMLElement | null;
  let prev: HTMLElement | null;

  let count = 0;
  const fadeTime = 1;

  // Initialize slides.
  gsap.set(slides, { opacity: 0 });
  gsap.set(slides[0], { opacity: 1 });

  if (settings.nav) setupNav();
  if (!settings.nav) {
    const sliderNav = slider.querySelector('[cs-el="slider-nav"]');
    sliderNav?.remove();
  }
  if (settings.swipe) setupSwipe();
  if (settings.autoplay) setupAutoPlay();
  if (settings.togglecontrols) setupToggleControls();

  let allIndicators: HTMLElement[] = [];
  if (settings.indicators) allIndicators = setupIndicators();
  if (!settings.indicators) {
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    sliderIndicators?.remove();
  }

  // Function to set up next/prev navigation.
  function setupNav() {
    const sliderNav = slider.querySelector('[cs-el="slider-nav"]');
    if (!sliderNav) return;

    next = sliderNav.querySelector<HTMLElement>('[cs-el="slider-nav_next"]');
    prev = sliderNav.querySelector<HTMLElement>('[cs-el="slider-nav_prev"]');

    navAddEventListeners();
  }

  // setup AutoPlay
  function setupAutoPlay() {
    const autoplay = setInterval(() => goNext(), 5000);
    //return autoplay;
  }

  // Function to set up indicator navigation.
  function setupIndicators(): HTMLElement[] {
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    if (!sliderIndicators) return [];

    const indicator = sliderIndicators.querySelector<HTMLElement>('[cs-el="slider-indicator"]');
    if (!indicator) return;

    slides.forEach(() => {
      const clonedIndicator = indicator.cloneNode(true);
      indicator.parentNode?.appendChild(clonedIndicator);
    });
    indicator.remove();

    const indicatorsArray = sliderIndicators.querySelectorAll<HTMLElement>(
      '[cs-el="slider-indicator"]'
    );
    // Add EventListeners to all indicators
    indicatorsArray.forEach((indicator, index) => {
      indicator.addEventListener('click', () => slideAction(null, index));
    });
    return indicatorsArray;
  }

  // setup toggleControls
  function setupToggleControls() {
    const tl_toggleControls = gsap.timeline({ paused: true });
    tl_toggleControls.from(next, {
      opacity: 0,
      duration: gsapDuration,
      ease: gsapEaseType,
      x: '-100%',
    });
    tl_toggleControls.from(
      prev,
      { opacity: 0, duration: gsapDuration, ease: gsapEaseType, x: '100%' },
      '<'
    );
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    tl_toggleControls.from(
      sliderIndicators,
      {
        opacity: 0,
        delay: 0.25,
        duration: gsapDuration,
        ease: gsapEaseType,
      },
      '<'
    );
    slider.addEventListener('mouseenter', () => {
      tl_toggleControls.timeScale(1).play();
    });
    slider.addEventListener('mouseleave', () => {
      tl_toggleControls.timeScale(2).reverse();
    });
  }
  // Function to set up swipe navigation.
  function setupSwipe() {
    Observer.create({
      target: slider,
      type: 'touch',
      onLeft: () => goPrev(),
      onRight: () => goNext(),
    });
  }

  //// Function to handle slider slide transitions.
  function slideAction(dir: 'next' | 'prev' | null, index?: number) {
    gsap.to(slides[count], { duration: fadeTime, opacity: 0 });

    if (settings?.autoplay) {
      //clearInterval(autoplay);
    }

    if (typeof index === 'number' && index >= 0 && index < slidesLength) {
      count = index;
      console.log(index);
    } else {
      if (dir === 'next') {
        // Set count to next slide index. If 'loopEnabled = true' slides will loop back to first slide
        count = count < slidesLength - 1 ? count + 1 : settings?.loop ? 0 : count;
      } else if (dir === 'prev') {
        // Set count to previous slide index. If 'loopEnabled = true' slides will loop back to last slide
        count = count > 0 ? count - 1 : settings?.loop ? slidesLength - 1 : count;
      }
    }
    // if no loop
    if (!settings?.loop) {
      console.log('if no loop called');
      next?.classList.remove('is-muted');
      prev?.classList.remove('is-muted');
      checkSlideIndex(count);
      navAddEventListeners(null);
    }
    // Set Prev Button to muted for initial load
    if (!settings?.loop && !dir) {
      navRemoveEventListeners('prev');
      prev?.classList.add('is-muted');
    }
    // Set indicator to current slide
    if (settings?.indicators) {
      setActiveindicator(count);
    }
    // Do the actual slide animation
    gsap.fromTo(slides[count], { opacity: 0 }, { duration: fadeTime, opacity: 1 });
  }

  //// Function to check slide index and update navigation accordingly.
  function checkSlideIndex(count: number) {
    //console.log('checkSlideIndex cont=' + count + 'slideslength=' + slidesLength - 1);
    if (count === slidesLength - 1) {
      navRemoveEventListeners('next');
      next?.classList.add('is-muted');
    }
    if (count === 0) {
      navRemoveEventListeners('prev');
      prev?.classList.add('is-muted');
    }
  }

  //// Function to set the active indicators.
  function setActiveindicator(index: number) {
    allIndicators.forEach((indicator: HTMLElement, i) => {
      if (i === index) {
        indicator.firstChild?.setAttribute('hh-background-color', 'p');
        indicator.firstChild?.classList.add('is-active');
      } else {
        indicator.firstChild?.removeAttribute('hh-background-color');
        indicator.firstChild?.classList.remove('is-active');
      }
    });
  }
  //// Function to go next slide
  function goNext() {
    gsap.killTweensOf(slideAction);
    slideAction('next');
  }
  //// Function to go previous slide
  function goPrev() {
    gsap.killTweensOf(slideAction);
    slideAction('prev');
  }
  //// Function to add listeners to slider nav (prev/next)
  function navAddEventListeners(variable: null | 'next' | 'prev') {
    if (!variable) {
      console.log('navAddEventListeners null called');
      next?.addEventListener('click', goNext);
      prev?.addEventListener('click', goPrev);
    } else if (variable === 'next') {
      next?.addEventListener('click', goNext);
    } else if (variable === 'prev') {
      prev?.addEventListener('click', goPrev);
    }
  }
  //// Function to remove listeners to slider nav (prev/next)
  function navRemoveEventListeners(variable: 'next' | 'prev') {
    if (variable === 'next') {
      next?.removeEventListener('click', goNext);
    }
    if (variable === 'prev') {
      prev?.removeEventListener('click', goPrev);
    }
  }
  // Make initial slide to first slide
  slideAction(null, 0);
} // End: initSlider

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import { gsap } from 'gsap';
// import { Draggable } from 'gsap/Draggable';
// import { Observer } from 'gsap/Observer';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger);
// gsap.registerPlugin(Observer);
// gsap.registerPlugin(Draggable);

// import { gsapDuration, gsapEaseType } from '$utils/globalvars';

// /* SLIDERS */
// /* Makes use of the following data attributes
//       cs-el="slider"
//       cs-el="slide"
//       cs-el="slider-nav"
//       cs-el="slider-nav_next"
//       cs-el="slider-nav_prev"
//       cs-el="slider-indicators"
//       cs-el="slider-indicator"
//       slider-settings="nav, indicators, caption, loop, swipe"
//       */
// export function initSliders() {
//   const sliders = gsap.utils.toArray<HTMLElement>('[cs-el="slider"]');
//   sliders.forEach((slider: any) => {
//     if (slider) {
//       let navEnabled = false;
//       let indicatorsEnabled = false;
//       let captionEnabled = false;
//       let loopEnabled = false;
//       const swipeEnabled = false;

//       let next: HTMLElement;
//       let prev: HTMLElement;

//       // Get slider settings (nav, indicators, caption, loop)
//       const sliderSettings = slider?.getAttribute('slider-settings');
//       if (sliderSettings) {
//         // Split the CSV values into an array
//         const settingsArray = sliderSettings.split(', ');
//         // Access individual values
//         navEnabled = settingsArray.includes('nav');
//         indicatorsEnabled = settingsArray.includes('indicators');
//         captionEnabled = settingsArray.includes('caption');
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

//         // Slider Nav (next/prev)
//         const sliderNav = slider.querySelector('[cs-el="slider-nav"]');
//         if (navEnabled && sliderNav) {
//           next = sliderNav.querySelector('[cs-el="slider-nav_next"]');
//           prev = sliderNav.querySelector('[cs-el="slider-nav_prev"]');

//           navAddEventListeners();
//         } else {
//           sliderNav?.remove();
//         }
//         // End: if (navEnabled && sliderNav) {

//         // Slider indicators
//         const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
//         let allIndicators: HTMLElement[] = [];
//         //console.log('indicatorsEnabled=' + indicatorsEnabled + 'sliderIndicatorsElms=' + sliderIndicators);
//         if (indicatorsEnabled && sliderIndicators) {
//           // Check for initial indicator element and clone
//           const indicators = sliderIndicators.querySelectorAll('[cs-el="slider-indicator"]');
//           // Avoid doing this again and again on Window Resize etc.
//           if (indicators.length == 1) {
//             indicators.forEach((indicator: any) => {
//               //const indicator = sliderIndicators.querySelector('[cs-el="slider-indicator"]');
//               indicator?.classList.remove('is-active');
//               slides.forEach((slide: any) => {
//                 const clonedIndicator = indicator?.cloneNode(true);

//                 indicator?.parentNode?.appendChild(clonedIndicator);
//               });
//               indicator?.remove();
//               allIndicators = slider.querySelectorAll('[cs-el="slider-indicator"]');
//               setActiveindicator(0);
//               allIndicators.forEach((element: any, index) => {
//                 element.addEventListener('click', () => {
//                   slideAction(null, index, false);
//                 });
//               });
//             }); // End: indicators.forEach
//           } // End: if indicators.length > 1
//         } else {
//           sliderIndicators?.remove();
//         } // End: if (indicatorsEnabled && sliderIndicators) {
//         // End: Slider indicators

//         loopEnabled = false;
//         //
//         function slideAction(dir: 'next' | 'prev', index?: number) {
//           console.log('slide');
//           gsap.to(slides[count], { duration: fadeTime, opacity: 0 });
// if (typeof index === 'number' && index >= 0 && index < slidesLength) {
//   count = index;
// } else {
//   if (dir === 'next') {
//     // Set count to next slide index. If 'loopEnabled = true' slides will loop back to first slide
//     count = count < slidesLength - 1 ? count + 1 : loopEnabled ? 0 : count;
//     // if (count < slidesLength - 1) {
//     //   count = count + 1;
//     // } else if (loopEnabled) {
//     //   count = 0;
//     // }
//   } else if (dir === 'prev') {
//     // Set count to previous slide index. If 'loopEnabled = true' slides will loop back to last slide
//     count = count > 0 ? count - 1 : loopEnabled ? slidesLength - 1 : count;
//     // if (count > 0) {
//     //   count = count - 1;
//     // } else if (loopEnabled) {
//     //   count = slidesLength - 1;
//     // }
//   }
//   if (!loopEnabled) {
//     navAddEventListeners();
//     checkSlideIndex(count);
//   }
// }
//           if (indicatorsEnabled) {
//             setActiveindicator(count);
//           }
//           gsap.fromTo(slides[count], { opacity: 0 }, { duration: fadeTime, opacity: 1 });
//         }
//         function checkSlideIndex(index: number) {
//           if (count === slidesLength - 1) {
//             console.log('last');
//             navRemoveEventListeners('next');
//             next?.classList.toggle('is-muted');
//           }
//           if (count === 0) {
//             console.log('first');
//             navRemoveEventListeners('prev');
//             prev?.classList.toggle('is-muted');
//           }
//         }
//         function setActiveindicator(index: number) {
//           allIndicators.forEach((indicator: HTMLElement) => {
//             indicator.firstChild?.removeAttribute('hh-background-color');
//             indicator?.classList.remove('is-active');
//           });
//           allIndicators[index].firstChild?.setAttribute('hh-background-color', 'p');
//           allIndicators[index].classList.add('is-active');
//         }
//         function navAddEventListeners() {
//           next?.addEventListener('click', goNext);
//           prev?.addEventListener('click', goPrev);
//         }
//         function navRemoveEventListeners(el: 'next' | 'prev') {
//           if (el === 'next') {
//             next?.removeEventListener('click', goNext);
//           }
//           if (el === 'prev') {
//             prev?.removeEventListener('click', goPrev);
//           }
//         }
//         function goNext() {
//           gsap.killTweensOf(slideAction);
//           slideAction('next');
//         }
//         function goPrev() {
//           gsap.killTweensOf(slideAction);
//           slideAction('prev');
//         }
//       }
//     } // END: Slider
//   }); // End: sliders.forEach
// } // End: function initSliders()
