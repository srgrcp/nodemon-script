import { copyFile } from 'fs/promises';
import * as nodemon from 'nodemon';
import { platform } from 'os';
import { join } from 'path';

const slash = platform() === 'win32' ? '\\' : '/';
const packagesFolder = 'TrikoPackage';
const defaultProjectFolder = 'TrikoWork';

let selectedProjectFolder = defaultProjectFolder;

if (process.argv.length > 2) {
  selectedProjectFolder = process.argv[2];
}

let parentRoot = join(__dirname, '../');
if (platform() === 'win32') {
  // Nodemon obtiene las unidades de disco en minúsculas
  parentRoot = parentRoot[0].toLowerCase() + parentRoot.slice(1);
}
console.log(parentRoot);

const settings: nodemon.Settings = {
  watch: [`../${packagesFolder}/*/`],
  ignore: [`../${packagesFolder}/**/node_modules`],
  exec: "echo Watching for changes ...",
  ext: "js,jsx,ts,tsx,json",
};

nodemon(settings);

nodemon.on('restart', files => {
  console.log('Change detected!');

  for (const file of files) {
    let target = file.replace(parentRoot + packagesFolder + slash, '');
    target = join(parentRoot, selectedProjectFolder, 'node_modules/@triko-llc', target);

    console.log('copying', file.split(slash).pop(), 'to', target);

    copyFile(file, target).then(() => {
      console.log('done!');
    }).catch(err => {
      console.log(err);
    });
  }
});
