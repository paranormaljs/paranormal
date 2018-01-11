#!/usr/bin/env node
// @flow
'use strict';
const meow = require('meow');
const path = require('path');
const chalk = require('chalk');
const paranormal = require('./');

function flagsToOptions(flags) {
  let cwd;

  if (typeof flags.cwd === 'undefined') {
    cwd = process.cwd();
  } else if (typeof flags.cwd === 'string') {
    cwd = path.resolve(process.cwd(), flags.cwd);
  } else {
    throw new Error(`The flag \`--cwd <path>\` requires a path`);
  }

  return { cwd };
}

async function main(argv) {
  let start = Date.now();

  let { pkg, flags } = meow({
    argv,
    help: `
      Usage
        $ paranormal <...flags>
    `
  });

  console.error(
    chalk.bold(
      `👻  Paranormal ${pkg.version} (node: ${process.versions.node})`
    )
  );

  let opts = flagsToOptions(flags);

  await paranormal(opts);

  let timing = (Date.now() - start) / 1000;
  let rounded = Math.round(timing * 100) / 100;

  console.error(`💀  Done in ${rounded}s.`);
}

main(process.argv.slice(2)).catch(err => {
  console.error(err);
  process.exit(1);
});
