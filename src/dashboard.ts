import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json

import { gsapDuration, gsapEaseType } from '$utils/globalvars';
gsap.registerPlugin(Observer, Draggable, Sortable);

////////////////////////////////////////////////////////////////////////////////////

window.Webflow ||= [];
window.Webflow.push(() => {
  //// Form Elements
  // Add/remove class on click Form Checkboxes
  const formCheckboxes = gsap.utils.toArray<HTMLElement>('.w-checkbox');
  if (formCheckboxes.length > 0) {
    formCheckboxes.forEach((el) => {
      // Define the event handler function
      function handleCheckboxClick(event: Event) {
        if (el.classList.contains('is-checked')) {
          el.classList.remove('is-checked');
        } else {
          el.classList.add('is-checked');
        }
      }

      // Add a different event type, such as 'mousedown', to handle the click
      el.addEventListener('mousedown', handleCheckboxClick);
    });
  }

  // Add/remove class on click Form Radio Buttons
  const formRadioBtns = gsap.utils.toArray<HTMLElement>('.w-radio');
  if (formRadioBtns.length > 0) {
    formRadioBtns.forEach((el) => {
      // Define the event handler function
      function handleRadioClick(event: Event) {
        formRadioBtns.forEach((radio) => {
          // Remove the 'is-checked' class from all radio buttons
          radio.classList.remove('is-checked');
        });

        // Add the 'is-checked' class to the clicked radio button
        el.classList.add('is-checked');
      }

      // Add a click event listener to the element
      el.addEventListener('click', handleRadioClick);
    });
  }
  // Sortable List stuff (copy form profileadmin.ts)
  const soratbleClasses = `.ghost { opacity: 0; }, .drag { opacity: 0.1; }`;
  // Then, you can insert this class into a style tag in your HTML document.
  const style = document.createElement('style');
  style.innerHTML = soratbleClasses;
  document.head.appendChild(style);

  const el = document.querySelector('[cs-el="sortable-list"]');
  const sortable = Sortable.create(el, {
    handle: '.hha_icon-btn',
    ghostClass: 'ghost',
    //dragClass: 'drag',
    animation: 250,
    forceFallback: false,
  });

  function init() {} // End: function init()

  window.addEventListener('resize', () => {
    init();
  });
  window.addEventListener('load', () => {
    init();
  });
}); // End: Webflow Push
