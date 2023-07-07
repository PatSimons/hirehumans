import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  // Global Declarations

  const green = '#9ccca1';
  const aqua = '#96c1d4';
  const marine = '#729dad';
  const purple = '#c092b6';
  const pink = '#ea958f';
  const yellow = '#f4d791';

  const originalColors: string[] = [
    '#9ccca1',
    '#96c1d4',
    '#729dad',
    '#c092b6',
    '#ea958f',
    '#f4d791',
  ];
  const colors: string[] = [...originalColors];
  // End: Global Declarations

  // Functions
  function fadeColors(el: any) {
    const logoChildren = Array.from(el.querySelectorAll('[hh-color]'));
    const colors = originalColors;
    logoChildren.forEach((child: any) => {
      const randomColor = getRandomColor(colors)[0];
      child.style.color = randomColor;
    });
  }

  function getRandomColor(colors: string[]): [string, string[]] {
    if (colors.length === 0) {
      colors = [...originalColors];
    }
    const index = Math.floor(Math.random() * colors.length);
    return [colors.splice(index, 1)[0], colors];
  }

  function updateBackgroundColor(el: any, colors: string[]) {
    const [randomColor, remainingColors] = getRandomColor(colors);
    el.style.backgroundColor = randomColor;
    colors = remainingColors;
  }
  function updateLetterColors(letters: string[], colors: string[]) {
    letters.forEach((el: any) => {
      const [randomColor, remainingColors] = getRandomColor(colors);
      el.style.transition = 'color 250ms';
      el.style.color = randomColor;
      colors = remainingColors;
    });
  }

  // End: Functions

  // // Form SetFavColor
  // const formButtons = document.querySelectorAll('.form_radio-icon');
  // const bgColor = document.querySelector('[data-bgcolors]');

  // formButtons.forEach((el: any) => {
  //   el?.addEventListener('click', () => {
  //     const colorAttribute = el.parentElement.getAttribute('hh-color');
  //     const color = green;
  //     switch (colorAttribute) {
  //       case 'aqua':
  //         let color = aqua;
  //         break;
  //       case 'marine':
  //         let color = marine;
  //         break;
  //       case 'purple':
  //         let color = purple;
  //         break;
  //       case 'pink':
  //         let color = pink;
  //         break;
  //       case 'yellow':
  //         let color = yellow;
  //         break;
  //       default:
  //         let color = green;
  //     }
  //     //bgColor?.style.backgroundColor = color;
  //   });
  // });

  // BG Color fades
  const bgColorFades = document.querySelectorAll('[data-bgcolors]');
  bgColorFades.forEach((el: any) => {
    el.style.transition = 'background-color 3s';
    const setBGColorsInt = setInterval(() => updateBackgroundColor(el, colors), 3000);
  });
  // End: BG Color fades

  // Logo Letter Color fades
  const loopLogos = document.querySelectorAll('[hh-colors="loop"]');
  loopLogos.forEach((el: any) => {
    const letters = el.querySelectorAll('[hh-color]');
    const setLetterColorsInt = setInterval(() => updateLetterColors(letters, colors), 1000);
  });
  // End: Logo Letter Color fades
});
