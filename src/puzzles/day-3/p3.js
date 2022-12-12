const { readInput } = require('../../utils.js');
const { priorityList } = require('./priorityList.js');

// Array of all rucksacks
const rucksackList = readInput(require.resolve('./input.txt'))
  .trim()
  .split(/\r?\n/);

// Array of rucksacks. Each item is a tuple representing each rucksack compartment
const rucksacksDivided = rucksackList.map((rucksack) => {
  const quantity = rucksack.length / 2;
  return [rucksack.slice(0, quantity), rucksack.slice(quantity)];
});

// Array of groups of 3 rucksacks
const rucksacksGrouped = (() => {
  let groupList = [];

  for (let i = 0; i < rucksackList.length; i += 3) {
    groupList.push(rucksackList.slice(i, i + 3));
  }

  return groupList;
})();

const totalPriority = rucksacksDivided.reduce(
  (total, current) => total + findRepeatGetPriority(current),
  0
);

const badgesPriority = rucksacksGrouped.reduce(
  (total, current) => total + findRepeatGetPriority(current),
  0
);

/**
 * Find the duplicate item and return it's priority.
 * @param rucksack
 * @returns {int}
 */
function findRepeatGetPriority(items) {
  const firstItem = items[0];
  const remainingItems = items.slice(1);

  let repeatItem = null;
  let index = 0;

  while (repeatItem === null) {
    let found = false;

    for (const item of remainingItems) {
      found = item.includes(firstItem[index]);
      if (!found) break;
    }
    if (found) repeatItem = firstItem[index];

    index++;
  }

  return priorityList[repeatItem];
}

console.log(badgesPriority);
