import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json

import { gsapDuration, gsapEaseType } from '$utils/globalvars';
gsap.registerPlugin(Observer, Draggable, Sortable);

window.Webflow ||= [];
window.Webflow.push(() => {
  //HHA ColorPicker
  function customColorPicker(handle: HTMLElement, parent: HTMLElement): string {
    function getParentGradientColor(eventX: number): string {
      const parentWidth = parent.clientWidth;
      const gradientPercentage = (eventX / parentWidth) * 100;
      const computedStyle = window
        .getComputedStyle(parent, null)
        .getPropertyValue('background-image');
      const gradientColors = computedStyle.match(/rgba?\([^)]+\)/g);

      if (!gradientColors || gradientColors.length < 2) {
        throw new Error('Gradient colors not found in background-image.');
      }

      // Calculate the color at the specified percentage along the gradient
      const colorIndex = (gradientColors.length - 1) * (gradientPercentage / 100);
      const startIndex = Math.floor(colorIndex);
      const endIndex = Math.ceil(colorIndex);

      const startColor = gradientColors[startIndex];
      const endColor = gradientColors[endIndex];

      // Calculate the color at the specific point within the gradient
      const color = interpolateColor(startColor, endColor, colorIndex - startIndex);

      return color;
    } // End: function getParentGradientColor()

    function rgbStringToHex(rgbString: string): string {
      // Extract the numeric RGB values from the string using a regular expression
      const match = rgbString.match(/\d+/g);

      if (!match || match.length !== 3) {
        throw new Error("Invalid RGB string format. Use 'rgb(r, g, b)'.");
      }

      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);

      // Ensure that the RGB values are within the valid range (0-255)
      const clamp = (value: number) => Math.min(255, Math.max(0, value));
      const clampedR = clamp(r);
      const clampedG = clamp(g);
      const clampedB = clamp(b);

      // Convert each RGB component to its hexadecimal representation
      const rHex = clampedR.toString(16).padStart(2, '0');
      const gHex = clampedG.toString(16).padStart(2, '0');
      const bHex = clampedB.toString(16).padStart(2, '0');

      // Combine the hexadecimal components to form the final color value
      const hexColor = `#${rHex}${gHex}${bHex}`;

      //return hexColor.toUpperCase(); // Optionally, convert to uppercase
      return hexColor;
    } // End: function rgbStringToHex(

    function interpolateColor(startColor: string, endColor: string, percentage: number): string {
      const startRGB = startColor.match(/\d+/g)?.map(Number);
      const endRGB = endColor.match(/\d+/g)?.map(Number);

      if (!startRGB || !endRGB || startRGB.length !== 3 || endRGB.length !== 3) {
        throw new Error('Invalid color format.');
      }

      const interpolatedRGB = startRGB.map((startChannel, index) =>
        Math.round(startChannel + percentage * (endRGB[index] - startChannel))
      );

      return `rgba(${interpolatedRGB.join(', ')})`;
    } // End: function interpolateColor()

    const hhColorElms = document.querySelectorAll('[hh-color], [hh-link-color]');
    const hhBgColorElms = gsap.utils.toArray('[hh-background-color], [hh-button-color]');
    const selectedColorHex = document.querySelector('[cs-el="hha-color-selected-hex"]');
    let color = '';
    Draggable.create(handle, {
      type: 'x',
      bounds: parent,
      onClick: function () {},
      onDrag: function () {
        color = getParentGradientColor(
          handle.getBoundingClientRect().left - parent.getBoundingClientRect().left
        );
        const hexColor = rgbStringToHex(color);
        selectedColorHex.textContent = hexColor;

        hhColorElms.forEach((el: any) => {
          el.style.color = color;
        });
        hhBgColorElms.forEach((el: any) => {
          el.style.backgroundColor = color;
        });
      },
    }); // End: Draggable

    return color; // Return your color value here or remove the return statement.
  } // End: export function customColorPicker()
  const colorPicker = document.querySelector('[cs-el="hha-colorpicker"]');
  if (colorPicker) {
    const colorPickerGradient = colorPicker.querySelector('[cs-el="hha-colorpicker-gradient"]');
    const colorPickerHandle = colorPicker.querySelector('[cs-el="hha-colorpicker-handle"]');
    customColorPicker(colorPickerHandle, colorPickerGradient);
  }
  // End: HHA ColorPicker

  // HHU Tab/Panel
  const hhuTab = document.querySelector('[cs-el="hhu-admin-tab"]');
  const hhuPanelWidth = '35rem';

  if (hhuTab) {
    const hhuAdminMain = document.querySelector('[cs-el="hhu-admin-main"]');
    const hhuAdminContent = hhuAdminMain?.querySelector('[cs-el="hhu-admin-main-content"]');
    //const hhaMain = document.querySelector('[cs-el="main-wrapper"]');

    let isOpen = false;

    const openPanel = gsap.timeline({ paused: true });
    openPanel.to(hhuAdminMain, { width: hhuPanelWidth, ease: 'Power2.out' });
    //openPanel.to(hhaMain, { paddingLeft: hhaPanelWidth, ease: 'Power2.out' }, '<');
    openPanel.to(hhuAdminContent, { opacity: 1 });
    hhuTab.addEventListener('click', () => {
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

  // HHA Draggable test
  const drag = document.querySelector('[cs-el="hhu-admin-modal"]');
  if (drag) {
    Draggable.create(drag, {});
  }
  // End: HHA Draggable test

  const editables = gsap.utils.toArray('[cs-el="hha_editable"]');
  editables.forEach((el: any) => {
    const tl_hoverEditable = gsap.timeline({ paused: true });
    const tl_openCopyAsist = gsap.timeline({ paused: true });
    const hoverWrap = el.querySelector('[cs-el="hha_editable-hover"]');
    const openCopyAsist = el.querySelector('[cs-el="open-asist"]');
    const closeCopyAsist = el.querySelectorAll('[cs-el="close-asist"]');
    const copyAsist = el.querySelector('[cs-el="asist"]');
    let isOpen = false;

    gsap.set(hoverWrap, { opacity: 0, scale: 1.03 });
    gsap.set(copyAsist, { autoAlpha: 0, scale: 1 });
    gsap.set(openCopyAsist, { color: '#C3bdb7' });
    tl_hoverEditable.to(hoverWrap, {
      opacity: 1,
      scale: 1,
      duration: gsapDuration,
      ease: gsapEaseType,
    });
    tl_openCopyAsist.to(copyAsist, {
      autoAlpha: 1,
      scale: 1,
      duration: gsapDuration,
      ease: gsapEaseType,
    });
    tl_openCopyAsist.to(
      openCopyAsist,
      {
        color: '#70c278',
        duration: gsapDuration,
        ease: gsapEaseType,
      },
      '<'
    );

    el.addEventListener('mouseenter', () => {
      tl_hoverEditable.timeScale(1).play();
    });
    el.addEventListener('mouseleave', () => {
      if (!isOpen) {
        tl_hoverEditable.timeScale(2).reverse();
      }
    });
    openCopyAsist.addEventListener('click', () => {
      tl_openCopyAsist.timeScale(1).play();
      isOpen = true;
    });
    closeCopyAsist.forEach((el: any) => {
      el.addEventListener('click', () => {
        tl_openCopyAsist.timeScale(2).reverse();
        isOpen = false;
      });
    });
    document.addEventListener('click', (event) => {
      if (!el.contains(event.target)) {
        tl_hoverEditable.timeScale(2).reverse();
        if (isOpen) {
          tl_openCopyAsist.timeScale(2).reverse();
        }
      }
    });
  });
  ////////////////////////////////////////////////////////////////////////////////////

  const el = document.querySelector('[cs-el="sortable-list"]');
  const sortable = Sortable.create(el, {
    handle: '.hha_icon-btn',
    ghostClass: 'sortable-ghost',
    animation: 250,
  });

  ////////////////////////////////////////////////////////////////////////////////////

  function init() {} // End: function init()

  window.addEventListener('resize', () => {
    init();
  });
  window.addEventListener('load', () => {
    init();
  });
}); // End: Webflow Push
