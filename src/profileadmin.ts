import './global';
import './human';

import { Draggable } from 'gsap/Draggable';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json

//import { gsapDuration, gsapEaseType } from '$utils/globalvars';
import { gsap } from './global';
gsap.registerPlugin(Draggable);
gsap.registerPlugin(ScrollTrigger);

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

    // // Define the ScrollTrigger
    // const pin = ScrollTrigger.create({
    //   trigger: userAdminHeader,
    //   start: 'top top',
    //   pin: true,
    // });

    openPanel.to(userAdminDrawer, { width: hhuPanelWidth, ease: 'Power.out', duration: 0.375 });
    openPanel.to(userAdminTab, { left: '-2rem', duration: 0.375, ease: 'back.out' });
    openPanel.to([userAdminBackdrop], { autoAlpha: 1, duration: 0.375 }, '<');
    openPanel.from([userAdminHeader, userAdminContent], { opacity: 0, duration: 0.25 });

    userAdminTab?.addEventListener('click', () => {
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
    const selectedColorInput = document.querySelector('[cs-el="hhaColorInput"]');

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
        selectedColorInput.value = hexColor;

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

  //_______________________________________________________________________________________________________ Unsaved Changes Warnings all forms

  // Find all form elements with the attribute cs-el="form"
  const forms = document.querySelectorAll<HTMLFormElement>('[cs-el="form"]');

  forms.forEach((form) => {
    const warningElement = form.querySelector<HTMLElement>('[cs-el="warning"]');
    const tl_showUnsavedChangesWarning = gsap.timeline({ paused: true });
    const inputFields = form.querySelectorAll<HTMLInputElement>('input, select, textarea');

    gsap.set(warningElement, { opacity: 0 });
    tl_showUnsavedChangesWarning.to(warningElement, { opacity: 1 });

    inputFields.forEach((inputField) => {
      inputField.addEventListener('input', () => {
        // Show the warning element
        if (warningElement) {
          tl_showUnsavedChangesWarning.play();
        }
      });
    });
  });

  //_______________________________________________________________________________________________________ Services
  const services = document.querySelector<HTMLElement>('[cs-el="services"]');

  if (services) {
    //_______________________________________________________________________________________________________ Sortable Service Items
    const sortableClasses = `.ghost { opacity: 0; }, .drag { opacity: 0.1; }`;

    // Then, you can insert this class into a style tag in your HTML document.
    const style = document.createElement('style');
    style.innerHTML = sortableClasses;
    document.head.appendChild(style);

    // Setup SortableJS for serviceItems
    const sortable = Sortable.create(services, {
      handle: '[cs-el="sortableHandle"]',
      ghostClass: 'ghost',
      //dragClass: 'drag',
      animation: 250,
      forceFallback: false,
      onEnd: function (evt) {
        const items = evt.from.children;
        for (let i = 0; i < items.length; i++) {
          items[i].setAttribute('data-index', i.toString());
          const inputIndex = items[i].querySelector<HTMLInputElement>('[cs-el="formInputIndex"]');
          if (inputIndex) {
            inputIndex.value = i.toString();
          }
        }
        // STILL WORING ON THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const warningSibling =
          services?.parentNode?.querySelector<HTMLElement>('[cs-el="warning"]');
        if (warningSibling) {
          // Do something with the warning sibling element
          console.log('found');
          gsap.to(warningSibling, { opacity: 1 });
        }
      },
    });

    // Toggle (Enable/disable) serviceItem Function
    const moveElement = (element: HTMLElement, itemStatus: string) => {
      const handleBtn = element.querySelector<HTMLElement>('[cs-el="sortableHandle"]');
      const visibilityBtn = element.querySelector<HTMLElement>('[cs-el="toggleVisibility"]');
      const itemHeader = element.querySelector<HTMLElement>('[cs-el="serviceHeader"]');
      gsap.set(element, { opacity: 0 });
      if (handleBtn && visibilityBtn) {
        let newParent: HTMLElement | null;
        if (itemStatus === 'hide') {
          newParent = document.querySelector('[cs-el="disabledServices"]');
          visibilityBtn?.classList.add('is-off');
          itemHeader?.classList.add('is-off');
          handleBtn.style.display = 'none';
        } else {
          newParent = document.querySelector('[cs-el="services"]');
          visibilityBtn.classList.remove('is-off');
          itemHeader?.classList.remove('is-off');
          handleBtn.style.display = 'block';
        }

        if (newParent) {
          newParent.appendChild(element);

          gsap.to(element, { opacity: 1, duration: 1 });
        }
      }
    };

    const toggleButtons = document.querySelectorAll('[cs-el="toggleVisibility"]');
    toggleButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        // Find parent 'serviceItem' of clicked edit button
        const elementToMove = (event.target as HTMLElement).closest(
          '[cs-el="serviceItem"]'
        ) as HTMLElement;

        // If 'serviceItem' if disabled
        if (elementToMove.classList.contains('is-off')) {
          moveElement(elementToMove, 'show'); // Shouldn't it be 'hide' instead of 'show'?
          elementToMove.classList.remove('is-off'); // Use remove() method to remove a class
        }
        // If 'serviceItem' if enabled
        else {
          moveElement(elementToMove, 'hide');
          elementToMove.classList.add('is-off'); // Use add() method to add a class
        }
      });
    });

    const items = gsap.utils.toArray<HTMLElement>('[cs-el="serviceItem"]');
    let currentItem: number | null = null;

    items.forEach((e, i) => {
      const content = e.querySelector<HTMLElement>('[cs-el="serviceFormInputs"]');
      const openButton = e.querySelector<HTMLElement>('[cs-el="serviceEdit"]');
      if (!content) return;

      const t = gsap.to(content, {
        height: 'auto',
        paddingTop: '0.5rem',
        paused: true,
        duration: 0.35,
      });

      (e as any)._accordionTween = t;

      openButton?.addEventListener('click', () => {
        if (currentItem !== null) {
          items[currentItem].classList.toggle('active');
          if (currentItem === i) {
            currentItem = null;
            return t.timeScale(1.5).reverse();
          }
          (items[currentItem] as any)._accordionTween.reverse();
        }
        e.classList.toggle('active');
        t.timeScale(1).play();
        currentItem = i;
      });

      // Setup listeners for InputChange
      // Find the input element and the text div
      const inputTitle = content.querySelector<HTMLInputElement>('[cs-el="formInputName"]');
      const textDiv = e.querySelector<HTMLElement>('[cs-el="serviceHeader"] > div');
      if (inputTitle && textDiv) {
        // Add an input event listener to the input field
        inputTitle.addEventListener('input', (event) => {
          // Get the value of the input field
          const inputValue = (event.target as HTMLInputElement).value;

          // Update the text content of the text div with the input value
          textDiv.textContent = inputValue;
        });
      }
    });
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
}); // End: Webflow Push
