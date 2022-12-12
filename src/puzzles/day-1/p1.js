const { readInput } = require('../../utils.js');

const elves = readInput(require.resolve('./input.txt')).split(/\n\s*\n/);
const totals = elves.map((elf) => sumList(elf)).sort((a, b) => b - a);

const mostCalories = totals.reduce((largest, current) => {
  return current > largest ? current : largest;
}, 0);

const topThree = totals
  .slice(0, 3)
  .reduce((total, current) => total + current, 0);

function sumList(list) {
  const amounts = list.split(/\r?\n/);

  return amounts.reduce((total, current) => total + parseInt(current), 0);
}

console.log(mostCalories, topThree);
