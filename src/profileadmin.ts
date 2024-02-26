import './global';
import './human';

import { Draggable } from 'gsap/Draggable';

//import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json
//import { gsapDuration, gsapEaseType } from '$utils/globalvars';
import { gsap } from './global';
gsap.registerPlugin(Draggable);
//gsap.registerPlugin(Sortable);

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ User Admin Drawer
  const userAdmin = document.querySelector('[cs-el="userAdmin"]');

  if (userAdmin) {
    const userAdminTab = document.querySelector('[cs-el="userAdminTab"]');
    if (userAdminTab) {
      const tl_hoverTab = gsap.timeline({ paused: true });
      tl_hoverTab.to(userAdminTab, { width: '+=0.5rem', paddingLeft: '0.5rem' });
      userAdminTab.addEventListener('mouseenter', () => {
        tl_hoverTab.timeScale(1).play();
      });
      userAdminTab.addEventListener('mouseleave', () => {
        tl_hoverTab.timeScale(2).reverse();
      });
    }
    const hhuPanelWidth = '45rem';
    const userAdminDrawer = userAdmin.querySelector('[cs-el="userAdminDrawer"]');
    const userAdminHeader = userAdminDrawer?.querySelector('[cs-el="userAdminHeader"]');
    const userAdminContent = userAdminDrawer?.querySelector('[cs-el="userAdminMain"]');
    const userAdminBackdrop = userAdmin?.querySelector('[cs-el="userAdminBackdrop"]');
    const userCloseDrawer = userAdmin?.querySelector('[cs-el="adminCloseDrawer"]');

    let isOpen = false;

    const openPanel = gsap.timeline({ paused: true });

    openPanel.to(userAdminDrawer, { width: hhuPanelWidth, ease: 'Power.out', duration: 0.375 });
    openPanel.to(userAdminTab, { opacity: 0, duration: 0.375 }, '<');
    openPanel.to([userAdminBackdrop], { autoAlpha: 1, duration: 0.375 }, '<');
    openPanel.from([userAdminHeader, userAdminContent], { opacity: 0, duration: 0.25 });

    userAdminTab.addEventListener('click', () => {
      if (isOpen) {
        isOpen = false;
        openPanel.timeScale(1.5).reverse();
      } else {
        isOpen = true;
        openPanel.timeScale(1).play();
      }
    });
    // Close Drawer Const
    const closeDrawer = () => {
      if (isOpen) {
        isOpen = false;
        openPanel.timeScale(1.5).reverse();
      }
    };

    userAdminBackdrop.addEventListener('click', closeDrawer);
    userCloseDrawer.addEventListener('click', closeDrawer);
  }
  //_______________________________________________________________________________________________________ ColorPicker Main function
  function customColorPicker(handle: HTMLElement, parent: HTMLElement): string {
    // ColorPicker function: Return color from Background
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

    // ColorPicker function: Convert RGB to HEX
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

    // ColorPicker function: interpolate color
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

    // Array of all elements that have dynamic text color
    const hhColorElms = gsap.utils.toArray<HTMLElement>(
      '[hh-color="text"], [hh-color="textDark"], [hh-color="textLight"], [hh-color="link"]'
    );

    // Array of all elements that have dynamic background color
    const hhBgColorElms = gsap.utils.toArray<HTMLElement>(
      '[hh-color="background"], [hh-color="backgroundDark"], [hh-color="backgroundLight"], [hh-color="button"]'
    );

    // Text field that displays the selected Hex value
    const selectedColorHex = document.querySelector('[cs-el="hha-color-selected-hex"]');

    // Drag handle function
    let color = '';
    Draggable.create(handle, {
      type: 'x',
      bounds: parent,
      //onClick: function () {},
      onDrag: function () {
        color = getParentGradientColor(
          handle.getBoundingClientRect().left - parent.getBoundingClientRect().left
        );
        const hexColor = rgbStringToHex(color);
        selectedColorHex.textContent = hexColor;

        hhColorElms.forEach((el: HTMLElement) => {
          el.style.color = color;
        });
        hhBgColorElms.forEach((el: HTMLElement) => {
          el.style.backgroundColor = color;
        });
      },
    }); // End: Draggable

    return color; // Return your color value here or remove the return statement.
  } // End Colorpicker Main function: export function customColorPicker()

  // Run
  const colorPicker = document.querySelector('[cs-el="hha-colorpicker"]');
  if (colorPicker) {
    const colorPickerGradient = colorPicker.querySelector('[cs-el="hha-colorpicker-gradient"]');
    const colorPickerHandle = colorPicker.querySelector('[cs-el="hha-colorpicker-handle"]');

    // Run main colorpicker function
    customColorPicker(colorPickerHandle, colorPickerGradient);
  }

  //_______________________________________________________________________________________________________ On Page Editables
  // const editables = gsap.utils.toArray('[cs-el="hha_editable"]');
  // editables.forEach((el: any) => {
  //   const tl_hoverEditable = gsap.timeline({ paused: true });
  //   const tl_openCopyAsist = gsap.timeline({ paused: true });
  //   const hoverWrap = el.querySelector('[cs-el="hha_editable-hover"]');
  //   const openCopyAsist = el.querySelector('[cs-el="open-asist"]');
  //   const closeCopyAsist = el.querySelectorAll('[cs-el="close-asist"]');
  //   const copyAsist = el.querySelector('[cs-el="asist"]');
  //   let isOpen = false;

  //   gsap.set(hoverWrap, { opacity: 0, scale: 1.03 });
  //   gsap.set(copyAsist, { autoAlpha: 0, scale: 1 });
  //   gsap.set(openCopyAsist, { color: '#C3bdb7' });
  //   tl_hoverEditable.to(hoverWrap, {
  //     opacity: 1,
  //     scale: 1,
  //     duration: gsapDuration,
  //     ease: gsapEaseType,
  //   });
  //   tl_openCopyAsist.to(copyAsist, {
  //     autoAlpha: 1,
  //     scale: 1,
  //     duration: gsapDuration,
  //     ease: gsapEaseType,
  //   });
  //   tl_openCopyAsist.to(
  //     openCopyAsist,
  //     {
  //       color: '#70c278',
  //       duration: gsapDuration,
  //       ease: gsapEaseType,
  //     },
  //     '<'
  //   );

  //   el.addEventListener('mouseenter', () => {
  //     tl_hoverEditable.timeScale(1).play();
  //   });
  //   el.addEventListener('mouseleave', () => {
  //     if (!isOpen) {
  //       tl_hoverEditable.timeScale(2).reverse();
  //     }
  //   });
  //   openCopyAsist.addEventListener('click', () => {
  //     tl_openCopyAsist.timeScale(1).play();
  //     isOpen = true;
  //   });
  //   closeCopyAsist.forEach((el: any) => {
  //     el.addEventListener('click', () => {
  //       tl_openCopyAsist.timeScale(2).reverse();
  //       isOpen = false;
  //     });
  //   });
  //   document.addEventListener('click', (event) => {
  //     if (!el.contains(event.target)) {
  //       tl_hoverEditable.timeScale(2).reverse();
  //       if (isOpen) {
  //         tl_openCopyAsist.timeScale(2).reverse();
  //       }
  //     }
  //   });
  // });

  //_______________________________________________________________________________________________________ Sortable Items
  // const sortableClasses = `.ghost { opacity: 0; }, .drag { opacity: 0.1; }`;

  // // Then, you can insert this class into a style tag in your HTML document.
  // const style = document.createElement('style');
  // style.innerHTML = sortableClasses;
  // document.head.appendChild(style);

  // const el = document.querySelector('[cs-el="sortable-list"]');
  // const sortable = Sortable.create(el, {
  //   handle: '.hha_icon-btn',
  //   ghostClass: 'ghost',
  //   //dragClass: 'drag',
  //   animation: 250,
  //   forceFallback: false,
  // });
}); // End: Webflow Push
