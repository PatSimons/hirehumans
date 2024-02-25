import './global';

import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json

import { gsap } from './global';

////////////////////////////////////////////////////////////////////////////////////

window.Webflow ||= [];
window.Webflow.push(() => {
  //_______________________________________________________________________________________________________ Form Elements

  // Add/remove class on click Form Checkboxes
  const formCheckboxes = gsap.utils.toArray<HTMLElement>('.w-checkbox');
  if (formCheckboxes.length > 0) {
    formCheckboxes.forEach((el) => {
      // Define the event handler function
      function handleCheckboxClick() {
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
      function handleRadioClick() {
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
  // Sortable List
  const sortableLists = document.querySelectorAll<HTMLElement>('[cs-el="sortable-list"]');
  if (sortableLists.length > 0) {
    const sortableClasses = `.ghost { opacity: 0; }, .drag { opacity: 0.1; }`;
    // Then, you can insert this class into a style tag in your HTML document.
    const style = document.createElement('style');
    style.innerHTML = sortableClasses;
    document.head.appendChild(style);

    sortableLists.forEach((list) => {
      const sortable = Sortable.create(list, {
        handle: '.hha_icon-btn',
        ghostClass: 'ghost',
        //dragClass: 'drag',
        animation: 250,
        forceFallback: false,
      });
    });
  }
}); // End: Webflow Push
