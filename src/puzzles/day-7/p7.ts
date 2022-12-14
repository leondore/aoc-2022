const { readInput } = require('../../utils.js');
const commandList: string[] = readInput(require.resolve('./input.txt'))
  .trim()
  .split('\n');
const totalSpace = 70000000;
const spaceRequired = 30000000;

interface Directory {
  id: string;
  name: string;
  children: string[];
  ancestors: string[];
  files: string[];
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
        directory.size += +typeOrSize;
      }
    }

    directory.ancestors.forEach((ancestor) => {
      const ancestorDir = fileSystem.find((dir) => dir.id === ancestor);
      if (ancestorDir) ancestorDir.size += directory.size;
    });
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

generateFileSystem();

// Part 1: Find all directories that are at least 100,000 in size and add them together.
const dir100k = fileSystem
  .filter((dir) => dir.size <= 100000)
  .reduce((total, current) => total + current.size, 0);

// Part 2: Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update.
const root = fileSystem[0];
const requiredFolderSize = spaceRequired - (totalSpace - root.size);
const possibleDeletions = fileSystem
  .filter((dir) => dir.size >= requiredFolderSize)
  .map((dir) => dir.size);
const folderToDelete = Math.min(...possibleDeletions);

console.log(folderToDelete);

export {};
