// @flow
const path = require('path');
const spawn = require('spawndamnit');

const PARCEL_BIN = require.resolve('parcel-bundler/bin/cli.js');

export async function build(entry: string, outDir: string) {
  await spawn(PARCEL_BIN, ['build', entry, '--out-dir', outDir], {
    stdio: 'inherit',
  });
}

export async function serve(entry: string, outDir: string) {
  await spawn(PARCEL_BIN, ['serve', entry, '--out-dir', outDir], {
    stdio: 'inherit',
  });
}
