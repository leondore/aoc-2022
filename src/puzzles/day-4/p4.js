const { readInput } = require('../../utils.js');

const list = readInput(require.resolve('./input.txt'))
  .trim()
  .split(/\r?\n/)
  .map((item) => {
    const pair = item.split(',');
    let pairFormatted = [];

    for (const single of pair) {
      pairFormatted.push(single.split('-').map((num) => parseInt(num)));
    }
    return pairFormatted;
  });

function countAllAndCheck(full = false) {
  let count = 0;

  for (const pair of list) {
    const check = full ? fullyContained(pair) : partiallyContained(pair);
    if (check) {
      count++;
    }
  }

  return count;
}

function partiallyContained(pair) {
  const [elf1, elf2] = pair;

  if (elf2[0] <= elf1[1]) {
    if (elf2[1] >= elf1[0]) {
      return true;
    }
  }

  return false;
}

function fullyContained(pair) {
  const [elf1, elf2] = pair;

  if (elf1[0] === elf2[0]) return true;

  let pContained;
  let pContainer;

  if (elf1[0] > elf2[0]) {
    pContained = elf1;
    pContainer = elf2;
  } else {
    pContained = elf2;
    pContainer = elf1;
  }

  if (pContained[1] <= pContainer[1]) return true;
  return false;
}

const allFullyContained = countAllAndCheck();
console.log(allFullyContained);
