import { Dirent } from 'fs';

const { readInput } = require('../../utils.js');
const commandList: string[] = readInput(require.resolve('./input.txt'))
  .trim()
  .split('\n');
// const test: string = `$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`;

// const commandList: string[] = test.trim().split('\n');

interface Directory {
  id: string;
  name: string;
  children: string[];
  ancestors: string[];
  files: string[];
  filesize: number;
  size: number;
}

let fileSystem: Directory[] = [];
let currentPath: string[] = [];

function generateId(
  dirname: string = '',
  path: string[] = currentPath
): string {
  if (dirname.length === 0) return path.join('_');

  const currentDir: string = path.length ? `_${dirname}` : dirname;
  return path.join('_') + currentDir;
}

function changeDirectory(dirname: string): void {
  if (dirname === '..') {
    currentPath.pop();
    return;
  }

  const id = generateId(dirname);
  const dir = fileSystem.find((dir) => dir.id === id);

  if (!dir) {
    const ancestors = currentPath.map((dir, index) => {
      return generateId(dir, currentPath.slice(0, index));
    });

    let newDir: Directory = {
      id,
      name: dirname,
      children: [],
      ancestors: [...ancestors],
      files: [],
      filesize: 0,
      size: 0,
    };

    fileSystem.push(newDir);
  }

  if (dirname === '/') currentPath = [];
  currentPath.push(dirname);
}

function populateDirectory(list: string[]): void {
  const dirId = generateId();
  const directory = fileSystem.find((dir) => dir.id === dirId);

  if (
    directory &&
    directory.children.length === 0 &&
    directory.files.length === 0
  ) {
    for (const item of list) {
      const [typeOrSize, name] = item.split(' ');

      if (typeOrSize === 'dir') {
        directory.children.push(generateId(name));
      } else {
        directory.files.push(name);
        directory.filesize += +typeOrSize;
      }
    }
  }
}

function generateFileSystem(): void {
  for (let i = 0; i < commandList.length; i++) {
    if (commandList[i].startsWith('$ ')) {
      const command = commandList[i].replace('$ ', '');

      if (command.includes('cd')) {
        const [_, dir] = command.split(' ');
        changeDirectory(dir);
      } else if (command.includes('ls')) {
        const commandsAfterLs = commandList.slice(i + 1);
        const nextCommandIdx: number = commandsAfterLs.findIndex((line) =>
          line.startsWith('$ ')
        );
        const listEnd =
          nextCommandIdx === -1 ? commandsAfterLs.length : nextCommandIdx;

        populateDirectory(commandsAfterLs.slice(0, listEnd));
      }
    }
  }
}

function calculateDirectorySizes(): void {
  for (const directory of fileSystem) {
    const descendants = fileSystem.filter((dir) =>
      dir.ancestors.includes(directory.id)
    );

    const descendantsSize = descendants.reduce(
      (total, current) => total + current.filesize,
      0
    );

    directory.size = directory.filesize + descendantsSize;
  }
}

generateFileSystem();
calculateDirectorySizes();

const dir100k = fileSystem
  .filter((dir) => dir.size <= 100000)
  .reduce((total, current) => total + current.size, 0);

console.log(dir100k);

export {};
