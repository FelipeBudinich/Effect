// tools/createDebug.js
'use strict';

import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, outputFile } from './fs-utils.js';

// Convert import.meta.url to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainFilePath = path.resolve(__dirname, '../public/lib/main.js');
const debugFilePath = path.resolve(__dirname, '../public/lib/game.debug.js');

const generateDebugModule = async () => {
    try {
        // Read the main.js file
        const content = await readFile(mainFilePath, 'utf8');

        // Insert 'impact.debug.debug' into the requires section
        const debugContent = content.replace(
            /(\.requires\s*\(\s*)/,
            `$1'impact.debug.debug',\n    `
        );

        // Write the modified content to game.debug.js
        await outputFile(debugFilePath, debugContent);
        console.log(`Debug module created at ${debugFilePath}`);
    } catch (error) {
        console.error('Error generating debug module:', error);
    }
};

generateDebugModule();