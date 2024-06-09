//tools/fs-utils.js
'use strict';

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);

const outputFile = async (filePath, data, options) => {
  const dir = path.dirname(filePath);

  try {
    await stat(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await mkdir(dir, { recursive: true });
    } else {
      throw err;
    }
  }

  await writeFile(filePath, data, options);
};

const mkdirs = async (dirPath) => {
  await mkdir(dirPath, { recursive: true });
};

export {
  readFile,
  writeFile,
  copyFile,
  mkdir,
  outputFile,
  mkdirs
};

