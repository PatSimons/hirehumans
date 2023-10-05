import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);
gsap.registerPlugin(Draggable);

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

        function interpolateColor(
          startColor: string,
          endColor: string,
          percentage: number
        ): string {
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
