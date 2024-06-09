// tools/baker.js
'use strict';

import { readFile, writeFile } from './fs-utils.js';
import { minify } from 'terser';

class Baker {
  constructor(base = '') {
    this.base = base;
  }

  async bake(inFiles, outFile) {
    let output = '';
    for (const file of inFiles) {
      try {
        const code = await readFile(this.base + file, 'utf8');
        output += code;
      } catch (err) {
        console.error(`ERROR: Couldn't load ${file}`, err);
        throw new Error(`Couldn't load file: ${file}`);
      }
    }

    try {
      const minified = await minify(output, {
        compress: {
          drop_console: true,
          pure_funcs: ['ig.log','ig.assert','ig.show','ig.mark','console.log', 'console.info', 'console.debug', 'console.warn'],
          passes: 3
        },
        mangle: {
          toplevel: true,
        },
        output: {
          comments: false,
          beautify: false
        }
      });

      const finalOutput = `//https://github.com/FelipeBudinich/Effect.git\n${minified.code}`;

      await writeFile(outFile, finalOutput);

      const originalSize = Buffer.byteLength(output, 'utf8');
      const minifiedSize = Buffer.byteLength(finalOutput, 'utf8');
      const reduction = ((originalSize - minifiedSize) / originalSize) * 100;

      console.log(`Baked and minified: ${outFile}`);
      console.log(`Original size: ${originalSize} bytes`);
      console.log(`Minified size: ${minifiedSize} bytes`);
      console.log(`Reduction: ${reduction.toFixed(2)}%`);
    } catch (err) {
      console.error('Error during minification:', err);
      throw new Error('Minification failed');
    }
  }
}

async function runBake() {
  const baker = new Baker();
  const inFiles = ['public/lib/impact/impact.js', 'public/lib/main.js'];
  const outFile = 'public/lib/game.min.js';

  try {
    await baker.bake(inFiles, outFile);
    console.log('Baking and minification successful!');
  } catch (err) {
    console.error('Error during baking:', err);
  }
}

runBake();

export default Baker;