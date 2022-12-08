const { readInput } = require('../../utils.js');

class Stacks {
  stacks = {};
  stepSize = 4;

  constructor(stacks) {
    this.stacks = this.generateStacks(stacks);
  }

  generateStacks(blueprint) {
    let stacksObj = {};
    const columns = blueprint[0].length / this.stepSize;

    for (let i = 1; i <= columns; i++) {
      stacksObj[i] = [];
    }

    for (const row of blueprint) {
      for (let i = 0; i < row.length; i += this.stepSize) {
        const cell = row.slice(i, i + this.stepSize);
        const column = i / this.stepSize + 1;
        const crate = cell.replace(/[^a-z]/gi, '');

        if (crate.length > 0) stacksObj[column].push(crate);
      }
    }

    return stacksObj;
  }

  move(order) {
    const [amount, from, to] = order;

    const crates = this.stacks[from].splice(0, parseInt(amount));
    this.stacks[to].unshift(...crates);
  }

  getTopCrates() {
    let topCrates = '';

    for (const key in this.stacks) {
      topCrates += this.stacks[key][0];
    }

    return topCrates;
  }
}

const input = readInput(require.resolve('./input.txt'));
const ordersInput = input.indexOf('move');

const stacksList = input
  .slice(0, ordersInput)
  .trim()
  .split(/\r?\n/)
  .map((row) => row + ' ');

const ordersList = input
  .slice(ordersInput)
  .trim()
  .split(/\r?\n/)
  .map((order) =>
    order
      .replace(/[^0-9 ]/g, '')
      .trim()
      .split('  ')
  );

const stacks = new Stacks(stacksList);

for (const orders of ordersList) {
  stacks.move(orders);
}

console.log(stacks.getTopCrates());
