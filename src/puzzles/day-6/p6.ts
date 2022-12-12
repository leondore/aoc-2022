const { readInput } = require('../../utils.js');

const input: string = readInput(require.resolve('./input.txt')).trim();
const packetMarkerLength: number = 4;
const messageMarkerLength: number = 14;

function hasDuplicates(slice: string): boolean {
  let valuesReviewed: { [key: string]: boolean } = {};

  for (let i = 0; i < slice.length; i++) {
    if (slice[i] in valuesReviewed) return true;

    valuesReviewed[slice[i]] = true;
  }

  return false;
}

function findMarker(input: string, markerLength: number): number {
  for (let i = markerLength; i < input.length; i++) {
    let strSet = input.slice(i - markerLength, i);

    if (!hasDuplicates(strSet)) return i;
  }

  return -1;
}

console.log(findMarker(input, messageMarkerLength));

export {};
