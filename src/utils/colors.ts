import { gsap } from 'gsap';

export const light = '#fffefc';
export const lightGrey = '#eee9e4';
export const grey = '#c3bdb7';
export const darkGrey = '#767676';
export const dark = '#262626';

export const green = '#9ccca1';
export const aqua = '#96c1d4';
export const marine = '#729dad';
export const purple = '#c092b6';
export const red = '#ea958f';
export const yellow = '#f4d791';
export const colorArray: string[] = [green, aqua, marine, purple, yellow, red];

export const colors: { [key: string]: string } = {
  green,
  aqua,
  marine,
  purple,
  yellow,
  red,
  light,
  lightGrey,
  grey,
  darkGrey,
  dark,
};

export function loopLogoLetters(letters: string[]) {
  gsap.utils.shuffle(colorArray);
  gsap.to(letters, { color: gsap.utils.wrap(colorArray), duration: 0.25 });
}
