import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import Sortable from 'sortablejs'; // Added "esModuleInterop": true to tsconfig.json

import { gsapDuration, gsapEaseType } from '$utils/globalvars';
gsap.registerPlugin(Observer, Draggable, Sortable);

////////////////////////////////////////////////////////////////////////////////////

window.Webflow ||= [];
window.Webflow.push(() => {}); // End: Webflow Push
