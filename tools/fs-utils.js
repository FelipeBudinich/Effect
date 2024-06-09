// tools/fs-utils.js
'use strict';

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

const mkdirs = async (dirPath) => {
  await mkdir(dirPath, { recursive: true });
};

const outputFile = async (filePath, data, options) => {
  const dir = path.dirname(filePath);

  try {
    await stat(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdirs(dir);
    } else {
      throw err;
    }
  }

  await writeFile(filePath, data, options);
};

export {
  readFile,
  writeFile,
  copyFile,
  mkdir,
  outputFile,
  mkdirs
};
