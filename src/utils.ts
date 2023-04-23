import { readFileSync } from 'fs';

const readInput = (file) => {
  return readFileSync(file, 'utf-8');
};

export { readInput };
