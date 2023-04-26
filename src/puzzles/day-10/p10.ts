import { readInput } from '../../utils';

type Ops = 'addx' | 'noop';

const input = readInput(require.resolve('./test.txt'))
  .trim()
  .split('\n')
  .map((line) => {
    const [func, val] = line.split(' ');
    return [func, +val] as [Ops, number];
  });

class Device {
  cycles: number;
  registerX: number;
  cache: Map<number, number>;

  constructor() {
    this.cycles = 0;
    this.registerX = 1;
    this.cache = new Map([[0, 1]]);
  }

  addx(value: number) {
    this.cycles++;
    this.cache.set(this.cycles, this.registerX);

    this.cycles++;
    this.cache.set(this.cycles, this.registerX);
    this.registerX += value;
  }

  noop() {
    this.cycles++;
    this.cache.set(this.cycles, this.registerX);
    return;
  }

  run() {
    for (let [func, val] of input) {
      this[func](val);
    }
  }

  getSignalStrength(cycle: number) {
    const registerX = this.cache.get(cycle) || 0;
    return cycle * registerX;
  }
}

const device = new Device();
device.run();

const cycles = [20, 60, 100, 140, 180, 220];
const strengths = cycles
  .map((cycle) => device.getSignalStrength(cycle))
  .reduce((acc, curr) => acc + curr, 0);

console.log(device.cache);

export {};