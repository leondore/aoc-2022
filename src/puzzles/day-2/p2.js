const { readInput } = require('../../utils.js');

const choices = {
  a: 1,
  b: 2,
  c: 3,
  x: 0,
  y: 3,
  z: 6,
};

const strategyGuide = readInput(require.resolve('./input.txt'))
  .trim()
  .split(/\r?\n/)
  .map((match) => match.toLowerCase().trim().split(' '));

const totalScore = strategyGuide.reduce(
  (total, currentMatch) => total + playMatch(currentMatch),
  0
);

function getMyHand(oppHand, result) {
  const possibleResults = {
    a: {
      z: 'b',
      x: 'c',
    },
    b: {
      z: 'c',
      x: 'a',
    },
    c: {
      z: 'a',
      x: 'b',
    },
  };

  if (result === 'y') return choices[oppHand];
  return choices[possibleResults[oppHand][result]];
}

function playMatch(match) {
  const [oppHand, result] = match;

  return choices[result] + getMyHand(oppHand, result);
}

console.log(totalScore);
