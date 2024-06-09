// tools/loadEntities.js
'use strict';

import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { outputFile } from './fs-utils.js';

// Convert import.meta.url to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entitiesDir = path.resolve(__dirname, '../public/lib/game/entities');
const outputFilePath = path.resolve(__dirname, '../public/lib/weltmeister/entities.js');

const generateEntitiesModule = async () => {
    try {
        const files = await glob('**/*.js', { cwd: entitiesDir });
        const moduleNames = files.map(file => {
            const name = file
                .replace(/^.*[\\/]/, '')
                .replace(/\.js$/, '')
                .replace(/(^|\s+)./g, char => char.toUpperCase())
                .replace(/[\\/]/g, '.')
                .toLowerCase();  // Ensure the module name is in lowercase
            return `game.entities.${name}`;
        });

        const requires = moduleNames.map(name => `'${name}'`).join(',\n    ');
        const content = `ig.module(
    'weltmeister.entities'
)
.requires(
    ${requires}
)
.defines(function(){ "use strict";
});
`;

        await outputFile(outputFilePath, content);
        console.log(`Entities module created at ${outputFilePath}`);
    } catch (error) {
        console.error('Error generating entities module:', error);
    }
};

generateEntitiesModule();
