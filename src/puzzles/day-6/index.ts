const { readInput } = require('../../utils.js');

const input: string = readInput(require.resolve('./input.txt')).trim();
const markerLength: number = 4;

function hasDuplicates(slice: string): boolean {
  let valuesReviewed: { [key: string]: boolean } = {};

  for (let i = 0; i < slice.length; i++) {
    if (slice[i] in valuesReviewed) return true;

    valuesReviewed[slice[i]] = true;
  }

  return false;
}

function findMarker(input: string): number {
  for (let i = markerLength; i < input.length; i++) {
    let strSet = input.slice(i - markerLength, i);

    if (!hasDuplicates(strSet)) return i;
  }

  return -1;
}

console.log(findMarker(input));
