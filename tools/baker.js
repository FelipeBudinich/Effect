import fs from 'fs';
import { minify } from 'terser';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class Baker {
  constructor(base = '') {
    this.base = base;
  }

  async bake(inFiles, outFile) {
    let output = '/*! Built with Effect - https://github.com/FelipeBudinich/Effect.git */\n\n';
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
      const minified = await minify(output);
      await writeFile(outFile, minified.code);
      console.log(`Baked and minified: ${outFile}`);
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