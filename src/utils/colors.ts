import { gsap } from 'gsap';

export const green = '#9ccca1';
export const aqua = '#96c1d4';
export const marine = '#729dad';
export const purple = '#c092b6';
export const red = '#ea958f';
export const yellow = '#f4d791';
export const colorArray: string[] = [green, aqua, marine, purple, yellow, red];

export function loopLogoLetters(letters: string[]) {
  gsap.utils.shuffle(colorArray);
  gsap.to(letters, { color: gsap.utils.wrap(colorArray), duration: 0.25 });
}
