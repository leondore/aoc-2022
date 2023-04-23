import { readInput } from '../../utils';

type Coordinate = [number, number];
type Direction = 'u' | 'r' | 'd' | 'l';
type Move = [Direction, number];

const input = readInput(require.resolve('./input.txt'))
  .trim()
  .split('\n')
  .map((line) => {
    const [dir, amt] = line.split(' ');
    return [dir.toLowerCase(), +amt] as [Direction, number];
  });

const coordinates: { [key: string]: Coordinate } = {
  0: [0, 0],
  1: [0, 0],
  2: [0, 0],
  3: [0, 0],
  4: [0, 0],
  5: [0, 0],
  6: [0, 0],
  7: [0, 0],
  8: [0, 0],
  9: [0, 0],
};
const pointsVisited = new Set();
pointsVisited.add('0,0');

const moveDir = {
  u(coord: Coordinate) {
    coord[1] -= 1;
  },
  r(coord: Coordinate) {
    coord[0] += 1;
  },
  d(coord: Coordinate) {
    coord[1] += 1;
  },
  l(coord: Coordinate) {
    coord[0] -= 1;
  },
};

function checkAndMoveKnot(curr: Coordinate, prev: Coordinate, isTail = false) {
  const diff = Math.max(
    Math.abs(curr[0] - prev[0]),
    Math.abs(curr[1] - prev[1])
  );

  if (diff > 1) {
    const diffX = prev[0] - curr[0];
    const diffY = prev[1] - curr[1];

    curr[0] += Math.abs(diffX) === 2 ? diffX / 2 : diffX;
    curr[1] += Math.abs(diffY) === 2 ? diffY / 2 : diffY;

    isTail && pointsVisited.add(curr.join(','));
  }
}

function makeMove(move: Move): void {
  let [direction, steps] = move;
  steps = +steps;

  for (let step = 0; step < steps; ++step) {
    moveDir[direction](coordinates['0']);

    const knots = Object.keys(coordinates).length;
    for (let knot = 1; knot < knots; ++knot) {
      checkAndMoveKnot(
        coordinates[knot],
        coordinates[knot - 1],
        knot === knots - 1
      );
    }
  }
}

for (const move of input) {
  makeMove(move);
}

console.log(pointsVisited.size);

export {};
