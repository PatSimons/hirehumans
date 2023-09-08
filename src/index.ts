import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
//import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger);

//// Global Declarations
const green = '#9ccca1';
const aqua = '#96c1d4';
const marine = '#729dad';
const purple = '#c092b6';
const pink = '#ea958f';
const yellow = '#f4d791';

const colors: string[] = [green, aqua, marine, purple, yellow, pink];
//// End: Global Declarations

//// Functions
function loopLogoLetters(letters: string[]) {
  gsap.utils.shuffle(colors);
  gsap.to(letters, { color: gsap.utils.wrap(colors), duration: 0.25 });
}
//// End: Functions

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

      // Logo Letters
      const logoLetters = gsap.utils.toArray('.logo_letter');
      if (logoLetters.length > 0) {
        setInterval(() => loopLogoLetters(logoLetters), 1000);
      } // End: Logo Letter Color fades

      const docWidth = document.documentElement.offsetWidth;
      [].forEach.call(document.querySelectorAll('*'), function (el) {
        if (el.offsetWidth > docWidth) {
          console.log(el);
        }
      });

      // HHP User Card
      const hhpNav = document.querySelector('[cs-el="hhp-nav"]');
      const hhpAside = document.querySelector('[cs-el="hhp-aside"]');
      const hhpUserCard = document.querySelector('[cs-el="hhp-user-card"]');
      const hhpBody = document.querySelector('[cs-el="hha-body"]');

      ScrollTrigger.create({
        trigger: hhpAside,
        start: 'top 34rem',
        endTrigger: hhpBody,
        end: () => `bottom ${document.querySelector('.hhp_user-card-wrap').offsetHeight + 64}`,
        markers: false,
        pin: hhpUserCard,
        pinSpacing: true,
        invalidateOnRefresh: true,
      });
      // End: HHP User Card

      // HHP Slider
      const slider = document.querySelector('[cs-el="hhp-slider"]');
      if (slider) {
        let count = 0;
        const fadeTime = 2;
        const turnTime = 5;

        const slides = document.querySelectorAll('[cs-el="hhp-slide"]');
        if (slides.length > 0) {
          gsap.set(slides, { opacity: 0 });
          gsap.set(slides[0], { opacity: 1 });

          function fadeIt() {
            gsap.to(slides[count], { duration: fadeTime, opacity: 0 });
            count = count < slides.length - 1 ? ++count : 0;
            gsap.fromTo(slides[count], { opacity: 0 }, { duration: fadeTime, opacity: 1 });
            gsap.to({}, { duration: turnTime, onComplete: fadeIt });
          }
          gsap.delayedCall(turnTime, () => fadeIt());
        }
      }
      // END: HHP Slider

      // HHA Tab/Panel
      const hhaTab = document.querySelector('[cs-el="hha-tab"]');

      if (hhaTab) {
        const hhaPanel = document.querySelector('[cs-el="hha-admin-panel"]');

        let isOpen = false;
        const openPanel = gsap.timeline({ paused: true });
        openPanel.to(hhaPanel, { left: 0, ease: 'Power2.out' });
        hhaTab.addEventListener('click', () => {
          console.log('!');
          if (isOpen) {
            isOpen = false;
            openPanel.timeScale(1.75).reverse();
          } else {
            isOpen = true;
            openPanel.timeScale(1).play();
          }
        });
      }
      // End: HHA Tab/Panel

      // NAV Mobile FadeIn/Out
      const nav = document.querySelector('[cs-el="nav"]');
      if (nav && isMobile) {
        const toggleNavMob = gsap
          .from(nav, {
            yPercent: -100,
            paused: true,
            duration: 0.5,
            ease: 'Power1.out',
          })
          .progress(1);

        ScrollTrigger.create({
          start: 'top top',
          end: 99999,
          onUpdate: (self) => {
            self.direction === -1 ? toggleNavMob.play() : toggleNavMob.reverse();
          },
        });
      }
      // End: NAV Mobile FadeIn/Out

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
