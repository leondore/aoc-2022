const { readInput } = require('../../utils.js');
const input = readInput(require.resolve('./input.txt'))
  .trim()
  .split('\n')
  .map((row: string, index: number) => {
    return [index, row.split('').map((num) => +num)];
  });

type Coordinate = [number, number];

let grid: { [key: string]: number[] } = Object.fromEntries(input);
const columns: number = grid[0].length;
const rows: number = Object.keys(grid).length;
let visibleTrees = columns * 2 + rows * 2 - 4;
let highestScore: number = 0;

function getRowRange(side: string, position: Coordinate): number[] {
  const [x, y] = position;
  const amount = side === 'top' ? y : rows - y - 1;
  const offset = y + 1;

  if (side === 'top') {
    return [...Array(amount).keys()].map((index) => grid[index][x]);
  }

  return [...Array(amount).keys()].map((index) => grid[index + offset][x]);
}

function getSection(side: string, position: Coordinate): number[] {
  const [x, y] = position;
  let trees: number[] = [];

  if (side === 'left' || side === 'right') {
    const start = side === 'left' ? 0 : x + 1;
    const end = side === 'left' ? x : columns;
    trees = grid[y].slice(start, end);
  }

  if (side === 'top' || side === 'bottom') {
    trees = getRowRange(side, position);
  }

  return trees;
}

function isVisible(side: string, position: Coordinate): boolean {
  const [x, y] = position;
  const treeHeight = grid[y][x];
  return treeHeight > Math.max(...getSection(side, position));
}

function calculateScenicScore(side: string, position: Coordinate): number {
  const [x, y] = position;
  const treeHeight = grid[y][x];
  const trees = getSection(side, position);

  if (side === 'top' || side === 'left') trees.reverse();

  const blockPosition = trees.findIndex((tree) => tree >= treeHeight);

  if (blockPosition === -1) {
    return trees.length;
  }

  return blockPosition + 1;
}

function calculateFullScore(position: Coordinate): number {
  const sides = ['top', 'right', 'bottom', 'left'];
  return sides.reduce(
    (total: number, side) => total * calculateScenicScore(side, position),
    1
  );
}

for (let y = 1; y < rows - 1; y++) {
  for (let x = 1; x < columns - 1; x++) {
    // if (
    //   isVisible('top', [x, y]) ||
    //   isVisible('right', [x, y]) ||
    //   isVisible('bottom', [x, y]) ||
    //   isVisible('left', [x, y])
    // ) {
    //   visibleTrees += 1;
    // }

    const score = calculateFullScore([x, y]);
    if (score > highestScore) {
      highestScore = score;
    }
  }
}

console.log(highestScore);

export {};
