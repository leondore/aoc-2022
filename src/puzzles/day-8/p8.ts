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

function getRowRange(side: string, position: Coordinate): number[] {
  const [x, y] = position;
  const amount = side === 'top' ? y : rows - y - 1;
  const offset = y + 1;

  if (side === 'top') {
    return [...Array(amount).keys()].map((index) => grid[index][x]);
  }

  return [...Array(amount).keys()].map((index) => grid[index + offset][x]);
}

function isVisible(
  side: string,
  treeHeight: number,
  position: Coordinate
): boolean {
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

  return treeHeight > Math.max(...trees);
}

for (let y = 1; y < rows - 1; y++) {
  for (let x = 1; x < columns - 1; x++) {
    if (
      isVisible('top', grid[y][x], [x, y]) ||
      isVisible('right', grid[y][x], [x, y]) ||
      isVisible('bottom', grid[y][x], [x, y]) ||
      isVisible('left', grid[y][x], [x, y])
    ) {
      visibleTrees += 1;
    }
  }
}

console.log(visibleTrees);

export {};
