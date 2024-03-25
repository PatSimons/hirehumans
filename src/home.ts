import './global';

//import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from './global';

//gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  function sortListByNumber(list: string[]): string[] {
    // Define a regular expression pattern to match the number
    const pattern = /_(\d+):/;

    // Sort the list based on the extracted number
    list.sort((a, b) => {
      const numA = extractNumber(a);
      const numB = extractNumber(b);
      if (numA && numB) {
        return parseInt(numA) - parseInt(numB);
      }
      // Handle cases where the numbers cannot be extracted
      return 0;
    });

    return list;
  }

  // Function to extract the number from a string
  function extractNumber(text: string): string | null {
    // Define the regular expression pattern
    const pattern = /_(\d+):/;

    // Use the RegExp.exec() method to find matches in the text
    const matches = pattern.exec(text);

    // If matches are found, extract the number value
    if (matches && matches.length > 1) {
      // Return the matched number as a string
      return matches[1];
    }
    // Return null if no matches are found
    return null;
  }

  function sumLastNumbers(sortedList: string[]): Map<string, number> {
    const sumMap = new Map<string, number>();

    sortedList.forEach((item) => {
      const [name, numberStr] = item.split('_');
      const number = parseInt(numberStr.split(':')[1].trim());

      if (sumMap.has(name)) {
        const currentSum = sumMap.get(name) || 0;
        sumMap.set(name, currentSum + number);
      } else {
        sumMap.set(name, number);
      }
    });

    // Sort the map by values in descending order
    const sortedSumMap = new Map([...sumMap.entries()].sort((a, b) => b[1] - a[1]));

    return sortedSumMap;
  }

  // Example usage:
  const list = [
    'Ruler_42: 1 ',
    'Innocent_04: 2',
    'Lover_27: 2 ',
    'Hero_23: 4 ',
    'Innocent_02: 4 ',
    'Magician_20: 2',
    'Ruler_41: 1 ',
    'Hero_24: 2 ',
    'Creator_48: 4 ',
    'Lover_28: 1 ',
    'Outlaw_13: 3 ',
    'Everyman_35: 3 ',
    'Caregiver_37: 1',
    'Outlaw_15: 3 ',
    'Explorer_09: 4 ',
    'Explorer_12: 4 ',
    'Caregiver_38: 2',
    'Sage_06: 4 ',
    'Magician_19: 3 ',
    'Jester_32: 4 ',
    'Jester_29: 1 ',
    'Caregiver_40: 2',
    'Outlaw_16: 3 ',
    'Sage_05: 3 ',
    'Everyman_34: 3 ',
    'Creator_46: 2 ',
    'Explorer_11: 2',
    'Ruler_43: 1 ',
    'Lover_26: 1 ',
    'Magician_18: 4 ',
    'Jester_30: 3 ',
    'Everyman_36: 2',
    'Sage_07: 4 ',
    'Innocent_01: 1',
    'Ruler_44: 1 ',
    'Lover_25: 2 ',
    'Sage_08: 3 ',
    'Creator_45: 4 ',
    'Explorer_10: 4 ',
    'Innocent_03: 4',
    'Hero_21: 5 ',
    'Creator_47: 5 ',
    'Jester_31: 2 ',
    'Caregiver_39: 1',
    'Outlaw_14: 3 ',
    'Magician_17: 4',
    'Hero_22: 2 ',
    'Everyman_33: 4',
  ];

  const sortedList = sortListByNumber(list);
  //console.log('Sorted List:', sortedList);

  const sumMap = sumLastNumbers(sortedList);
  console.log('Sum Map:', sumMap);
});
