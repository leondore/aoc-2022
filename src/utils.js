const { readFileSync } = require('fs');

const readInput = (file) => {
  return readFileSync(file, 'utf-8');
};

exports.readInput = readInput;
