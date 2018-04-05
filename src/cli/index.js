// @flow
import meow from 'meow';
import path from 'path';
import chalk from 'chalk';
import Runner from './Runner';

type Opts = {
  cwd: string,
  outDir: string,
  match: Array<string>,
  watch: boolean,
};

function cliToOptions(input, flags): Opts {
  let match = input;
  let cwd;

  if (typeof flags.cwd === 'undefined') {
    cwd = process.cwd();
  } else if (typeof flags.cwd === 'string') {
    cwd = path.resolve(process.cwd(), flags.cwd);
  } else {
    throw new Error(`The flag \`--cwd=<path>\` requires a path`);
  }

  let outDir;
  if (typeof flags.outDir === 'undefined') {
    outDir = path.resolve(process.cwd(), 'dist');
  } else if (typeof flags.outDir === 'string') {
    outDir = path.resolve(process.cwd(), flags.outDir);
  } else {
    throw new Error(`The flag \`--outDir=<path>\` requires a path`);
  }

  let watch;
  if (typeof flags.watch === 'undefined') {
    watch = false;
  } else if (typeof flags.watch === 'boolean') {
    watch = flags.watch;
  } else {
    throw new Error(`The flag \`--watch/-w\` does not accept an argument`);
  }

  return { match, cwd, outDir, watch };
}

export default async function cli(argv: Array<string>) {
  let start = Date.now();

  let { pkg, input, flags } = meow({
    argv,
    help: `
      Usage
        $ paranormal <...globs> <...flags>

      Flags
        --watch, -w      Watch files and update on changes
        --cwd <dir>      Set the current working directory
        --out-dir <dir>   Directory for output structure
    `,
  });

  console.error(
    chalk.bold.cyan(
      `👻  Paranormal ${pkg.version} (node: ${process.versions.node})`,
    ),
  );

  let { cwd, outDir, match, watch } = cliToOptions(input, flags);
  let runner = new Runner({ cwd, outDir });

  await runner.run({ match, watch });

  if (!watch) {
    let timing = (Date.now() - start) / 1000;
    let rounded = Math.round(timing * 100) / 100;

    console.error(chalk.dim(`💀  Done in ${rounded}s.`));
  }
}
