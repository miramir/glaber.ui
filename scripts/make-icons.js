/* eslint-disable no-console */
//
// This script downloads and generates icons and icon metadata.
//
import commandLineArgs from 'command-line-args';
import copy from 'recursive-copy';
import download from 'download';
import fm from 'front-matter';
import { readFileSync, mkdirSync } from 'fs';
import { stat, readFile, writeFile, rm } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

const { outdir } = commandLineArgs({ name: 'outdir', type: String });
const iconDir = path.join(outdir, '/assets/icons');

const iconPackageData = JSON.parse(readFileSync('./node_modules/bootstrap-icons/package.json', 'utf8'));
let numIcons = 0;

(async () => {
  try {
    const { version } = iconPackageData;
    const srcPath = `./.cache/icons/icons-${version}`;
    const url = `https://github.com/twbs/icons/archive/v${version}.zip`;

    try {
      await stat(`${srcPath}/LICENSE`);
      console.log('Generating icons from cache');
    } catch {
      // Download the source from GitHub (since not everything is published to NPM)
      console.log(`Downloading and extracting Bootstrap Icons ${version} 📦`);
      await download(url, './.cache/icons', { extract: true });
    }

    // Copy icons
    console.log('Copying icons and license');
    await rm(iconDir, { recursive: true, force: true });
    mkdirSync(iconDir, { recursive: true });
    await Promise.all([
      copy(`${srcPath}/icons`, iconDir),
      copy(`${srcPath}/LICENSE`, path.join(iconDir, 'LICENSE')),
      copy(`${srcPath}/bootstrap-icons.svg`, './docs/assets/icons/sprite.svg', { overwrite: true }),
    ]);

    // Generate metadata
    console.log('Generating icon metadata');
    const files = await glob(`${srcPath}/docs/content/icons/**/*.md`);

    const metadata = await Promise.all(
      files.map(async (file) => {
        const name = path.basename(file, path.extname(file));
        const data = fm(await readFile(file, 'utf8')).attributes;
        numIcons++;

        return {
          name,
          title: data.title,
          categories: data.categories,
          tags: data.tags,
        };
      }),
    );

    await writeFile(path.join(iconDir, 'icons.json'), JSON.stringify(metadata, null, 2), 'utf8');

    console.log(`Successfully processed ${numIcons} icons ✨\n`);
  } catch (err) {
    console.error(err);
  }
})();
