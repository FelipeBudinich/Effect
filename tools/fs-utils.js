//tools/fs-utils.js
'use strict';

import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

export {
    readFile,
    writeFile,
    copyFile,
    mkdir
};
