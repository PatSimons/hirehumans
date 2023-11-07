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

export function darkenColor(color: string, factor: number): string {
  // Ensure the factor is between 0 and 1
  factor = Math.min(1, Math.max(0, factor));

  // Parse the input color
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  // Darken each channel
  r = Math.round(r * (1 - factor));
  g = Math.round(g * (1 - factor));
  b = Math.round(b * (1 - factor));

  // Convert back to hex format
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  return `#${hexR}${hexG}${hexB}`;
}
