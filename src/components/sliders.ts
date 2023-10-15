// * COMPONENTS > SLIDERS */

/* DATA ATTRIBUTES:
[cs-el="slider"]
  [cs-el="slide"]
  [cs-el="slide"]
  ...

[cs-el="slider-nav"]
  [cs-el="slider-nav_prev"]
  [cs-el="slider-nav_next"]

[cs-el="slider-indicators"]
  [cs-el="slider-indicator"]

[slider-type="fade (default) | slide | updown"]
[slider-settings="nav, indicators, swipe, loop, togglecontrols, isPlaying"]

/*  HTML MARK-UP:

<div cs-el="slider" slider-type="" slider-settings="">
  <div cs-el="slide"></div>
  <div cs-el="slider-nav">
    <div cs-el="slider-nav_prev">
    <div cs-el="slider-nav_next">
  </div>
  <div cs-el="slider-indicators">
    <div cs-el="slider-indicator">
      <div cs-el="slider-indicator-inner"></div>
    </div>
  </div>  
*/
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);

import { gsapDuration, gsapEaseType } from '$utils/globalvars';

// Define a type for the slider settings.
interface SliderSettings {
  nav: boolean;
  indicators: boolean;
  swipe: boolean;
  loop: boolean;
  togglecontrols: boolean;
  autoplay: boolean;
  hascover: boolean;
}
// Function to parse slider settings from a data attribute.
function parseSliderSettings(slider: HTMLElement): SliderSettings | null {
  const sliderSettings = slider.getAttribute('slider-settings');
  if (!sliderSettings) return null;

  const settingsArray = sliderSettings.split(', ');

  return {
    nav: settingsArray.includes('nav'),
    indicators: settingsArray.includes('indicators'),
    loop: settingsArray.includes('loop'),
    swipe: settingsArray.includes('swipe'),
    autoplay: settingsArray.includes('autoplay'),
    togglecontrols: settingsArray.includes('togglecontrols'),
    hascover: settingsArray.includes('hascover'),
  };
}
// Export Initialize all sliders
export function initSliders() {
  const sliders = gsap.utils.toArray<HTMLElement>('[cs-el="slider"]');
  sliders.forEach((slider) => {
    if (slider) {
      initSlider(slider); // Call the function for each slider
    }
  });
} // End: Initialize all sliders

// Init each Slider
function initSlider(slider: HTMLElement) {
  const slides: NodeListOf<HTMLElement> = slider.querySelectorAll<HTMLElement>('[cs-el="slide"]');
  const slidesLength = slides.length;

  // Abort if there are no slides.
  if (slidesLength === 0) return;
  // Remove Nav and Indicator and abort if there'e only 1 slide
  if (slidesLength === 1) {
    const sliderNav = slider.querySelector('[cs-el="slider-nav"]');
    sliderNav?.remove();
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    sliderIndicators?.remove();
    return;
  }

  // Parse the slider settings.
  const settings = parseSliderSettings(slider);
  if (!settings) return; // Skip if settings couldn't be parsed.

  let sliderType = slider.getAttribute('slider-type');
  if (!sliderType) sliderType = 'fade';

  let count: number;
  const transitionDuration = 0.5;
  const sliderEaseIn = 'power2.out';
  const sliderEaseOut = 'power2.out';
  let next: HTMLElement | null;
  let prev: HTMLElement | null;
  let isFirstSlide = false;
  let isLastSlide = false;
  const playDuration = 3000;
  const tl_slideIn: gsap.core.Timeline = gsap.timeline({ paused: true });
  const tl_slideOut: gsap.core.Timeline = gsap.timeline({ paused: true });
  let initialSlide = true;
  const allowNext = true;
  const allowPrev = true;
  const tl_toggleControls = gsap.timeline({ paused: true });

  // Set opacity 0 all slides.
  gsap.set(slides, { opacity: 0 });

  // Initialise all Prev/Next listeners ([cs-el="slider-next"] / [cs-el="slider-prev"])
  function initAllPrevNextButtons() {
    const allNextButtons: NodeListOf<HTMLElement> =
      slider.querySelectorAll('[cs-el="slider-next"]');
    const allPrevButtons: NodeListOf<HTMLElement> =
      slider.querySelectorAll('[cs-el="slider-prev"]');
    if (allNextButtons.length > 0) {
      allNextButtons.forEach((el: HTMLElement) => {
        el.addEventListener('click', goNext);
      });
    }
    if (allPrevButtons.length > 0) {
      allPrevButtons.forEach((el: HTMLElement) => {
        el.addEventListener('click', goPrev);
      });
    }
  }
  initAllPrevNextButtons();

  if (settings.nav) setupNav();
  if (!settings.nav) {
    const sliderNav = slider.querySelector('[cs-el="slider-nav"]');
    sliderNav?.remove();
  }
  if (settings.swipe) setupSwipe();
  let isPlaying: number | undefined;
  if (settings.autoplay) playSlider();
  if (settings.togglecontrols) setupToggleControls();

  let allIndicators: HTMLElement[] = [];
  if (settings.indicators) allIndicators = setupIndicators();
  if (!settings.indicators) {
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    sliderIndicators?.remove();
  }

  // Function to set up next/prev navigation.
  function setupNav() {
    const sliderNav = slider.querySelector<HTMLElement>('[cs-el="slider-nav"]');
    if (!sliderNav) return;

    next = sliderNav.querySelector<HTMLElement>('[cs-el="slider-nav_next"]');
    prev = sliderNav.querySelector<HTMLElement>('[cs-el="slider-nav_prev"]');

    // Set CSS pointer-events
    sliderNav.style.pointerEvents = 'none';
    next.style.pointerEvents = 'auto';
    prev.style.pointerEvents = 'auto';

    navAddEventListeners(null);
  }

  function playSlider() {
    isPlaying = setInterval(() => slideAction('next'), playDuration);
  }
  function stopSlider(ap: number | undefined) {
    clearInterval(ap);
  }

  // Function to set up indicator navigation.
  function setupIndicators(): HTMLElement[] {
    // Check if indicator wrapper is present
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    if (!sliderIndicators) {
      // eslint-disable-next-line no-console
      console.log('no sliderIndicators found');
      return [];
    }
    // Check if indicator elelemnt is present
    const indicator = sliderIndicators.querySelector<HTMLElement>('[cs-el="slider-indicator"]');
    if (!indicator) {
      // eslint-disable-next-line no-console
      console.log('no indicator found');
      return [];
    }
    // Clone the indicator element for each slide
    const slideArray = Array.from(slides);
    slideArray.slice(0, -1).forEach(() => {
      const clonedIndicator = indicator.cloneNode(true);
      indicator.parentNode?.appendChild(clonedIndicator);
    });
    //indicator.remove(); // Remove

    const indicatorsArray = sliderIndicators.querySelectorAll<HTMLElement>(
      '[cs-el="slider-indicator"]'
    );
    // Add EventListeners to all indicators
    indicatorsArray.forEach((indicator, i) => {
      indicator.addEventListener('click', () => goIndex(i));
    });
    return indicatorsArray;
  }

  // setup toggleControls
  function setupToggleControls() {
    tl_toggleControls.from(next, {
      autoAlpha: 0,
      duration: gsapDuration,
      ease: gsapEaseType,
      x: '-100%',
    });
    tl_toggleControls.from(
      prev,
      { autoAlpha: 0, duration: gsapDuration, ease: gsapEaseType, x: '100%' },
      '<'
    );
    const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
    tl_toggleControls.from(
      sliderIndicators,
      {
        autoAlpha: 0,
        delay: 0.25,
        duration: gsapDuration,
        ease: gsapEaseType,
      },
      '<'
    );
    slider.addEventListener('mouseenter', aL_mouseEnter);
    slider.addEventListener('mouseleave', aL_mouseLeave);
  }

  function aL_mouseEnter() {
    tl_toggleControls.timeScale(1).play();
  }
  function aL_mouseLeave() {
    tl_toggleControls.timeScale(2).reverse();
  }

  // Function to set up swipe navigation.
  function setupSwipe() {
    Observer.create({
      target: slider,
      type: 'touch',
      dragMinimum: 200,
      onLeft: () => goNext(),
      onRight: () => goPrev(),
    });
  }

  //// Function to handle slider transitions.
  function slideAction(dir: 'next' | 'prev' | null, index?: number | null) {
    // Disallow Prev/Next condition
    if (index && index > count && !allowNext) return;
    if (index && index < count && !allowPrev) return;

    // Set slider Type
    const transitionType = sliderType;

    // Fade out current slide, only if not initial slide
    if (!initialSlide) gsapSlideOut(count);
    initialSlide = false;

    // Go directly to slide index or to next/prev slide
    if (typeof index === 'number' && index >= 0 && index < slidesLength) {
      // Determine direction
      if (count > index) {
        dir = 'prev';
      }
      if (count < index) {
        dir = 'next';
      }
      count = index;
      gsapSlideIn(count);
    } else {
      if (dir === 'next') {
        // Set count to next slide index. If 'loopEnabled = true' slides will loop back to first slide
        count = count < slidesLength - 1 ? count + 1 : settings?.loop ? 0 : count;
        gsapSlideIn(count);
      } else if (dir === 'prev') {
        // Set count to previous slide index. If 'loopEnabled = true' slides will loop back to last slide
        count = count > 0 ? count - 1 : settings?.loop ? slidesLength - 1 : count;
        gsapSlideIn(count);
      }
    }
    // Check current slide
    checkSlideIndex(count);

    // if no loop
    if (!settings?.loop) {
      next?.classList.remove('is-muted');
      prev?.classList.remove('is-muted');
      navAddEventListeners(null);
      if (isFirstSlide) ifIsFirstSlide();
      if (isLastSlide) ifIsLastSlide();
    }
    // Set indicator to current slide
    if (settings?.indicators) {
      setActiveindicator(count);
    }

    // Do the actual slide animations In and Out
    function gsapSlideIn(i: number) {
      if (transitionType === 'fade') {
        tl_slideIn.fromTo(slides[i], { opacity: 0 }, { duration: transitionDuration, opacity: 1 });
      } else if (transitionType === 'slide') {
        const xPercent = dir === 'next' ? 50 : dir === 'prev' ? -50 : 0;
        tl_slideIn.fromTo(
          slides[i],
          { opacity: 0, xPercent },
          { duration: transitionDuration, opacity: 1, xPercent: 0, ease: sliderEaseIn }
        );
      } else if (transitionType === 'updown') {
        const yPercent = dir === 'next' ? 50 : dir === 'prev' ? -50 : 0;
        tl_slideIn.fromTo(
          slides[i],
          { opacity: 0, yPercent },
          { duration: transitionDuration, opacity: 1, yPercent: 0, ease: sliderEaseIn }
        );
      }

      gsap.set(slides, { zIndex: 1 });
      slides[i].style.zIndex = '2';
      tl_slideIn.timeScale(1).play();
    }

    function gsapSlideOut(i: number) {
      if (transitionType === 'fade') {
        tl_slideOut.to(slides[i], { duration: transitionDuration, opacity: 0 });
      } else if (transitionType === 'slide') {
        const xPercent = dir === 'next' ? -50 : dir === 'prev' ? 50 : 0;
        tl_slideOut.fromTo(
          slides[i],
          { opacity: 1, xPercent: 0 },
          { duration: transitionDuration, opacity: 0, xPercent, ease: sliderEaseOut }
        );
      } else if (transitionType === 'updown') {
        const yPercent = dir === 'next' ? -50 : dir === 'prev' ? 50 : 0;
        tl_slideOut.fromTo(
          slides[i],
          { opacity: 1, yPercent: 0 },
          { duration: transitionDuration, opacity: 0, yPercent, ease: sliderEaseOut }
        );
      }
      gsap.set(slides, { zIndex: 1 });
      slides[i].style.zIndex = '2';

      tl_slideOut.timeScale(1).play();
    }
  } // End: function Slide Action

  //// Function to check slide index and update navigation accordingly.
  function checkSlideIndex(count: number) {
    isFirstSlide = count === 0;
    isLastSlide = count === slidesLength - 1;
    //console.log('cnt= ' + count + 'length= ' + (slidesLength - 1));
  }
  //// If is First Slide
  function ifIsFirstSlide() {
    navRemoveEventListeners('prev');
    prev?.classList.add('is-muted');
  }
  //// If is Last Slide
  function ifIsLastSlide() {
    navRemoveEventListeners('next');
    next?.classList.add('is-muted');
    if (isPlaying) stopSlider(isPlaying);
  }

  //// Function to set the active indicators.
  function setActiveindicator(index: number) {
    allIndicators.forEach((indicator: HTMLElement, i) => {
      if (i === index) {
        if (indicator.firstChild instanceof Element) {
          indicator.firstChild.classList.add('is-active');
        }
      } else {
        if (indicator.firstChild instanceof Element) {
          indicator.firstChild.classList.remove('is-active');
        }
      }
    });
  }

  //// Function to go next slide
  function goNext() {
    if (!tl_slideIn.isActive() && allowNext) {
      gsap.killTweensOf(slideAction);
      slideAction('next');
      if (isPlaying) stopSlider(isPlaying);
    }
  }

  //// Function to go previous slide
  function goPrev() {
    if (!tl_slideOut.isActive() && allowPrev) {
      gsap.killTweensOf(slideAction);
      slideAction('prev');
      if (isPlaying) stopSlider(isPlaying);
    }
  }

  //// Function to go to slide Index
  function goIndex(i: number) {
    gsap.killTweensOf(slideAction);
    slideAction(null, i);
    if (isPlaying) stopSlider(isPlaying);
  }

  //// Function to add listeners to slider nav (prev/next)
  function navAddEventListeners(variable: null | 'next' | 'prev') {
    if (!variable) {
      //console.log('navAddEventListeners null called');
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

  //// function setCover
  function setCover() {
    console.log('hascover');
    const cover = slider.querySelector<HTMLElement>('[cs-el="slider-cover"]');
    if (!cover) slideAction(null, 0);
    if (settings?.nav) {
      const sliderNav = slider.querySelector<HTMLElement>('[cs-el="slider-nav"]');
      if (!sliderNav) return;
      gsap.set(sliderNav, { autoAlpha: 0 });
    }
    if (settings?.indicators) {
      const sliderIndicators = slider.querySelector('[cs-el="slider-indicators"]');
      if (!sliderIndicators) return;
      gsap.set(sliderIndicators, { autoAlpha: 0 });
    }
    if (settings?.togglecontrols) {
      slider.removeEventListener('mouseenter', aL_mouseEnter);
      slider.removeEventListener('mouseleave', aL_mouseLeave);
    }
  }
  //// Set initial slide
  function firstSlide() {
    slideAction(null, 0);
  }
  settings.hascover = true;

  //// Call initial slide
  if (!settings.hascover) {
    slideAction(null, 0);
  } else {
    setCover();
  }
} // End: initSlider

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
