// @flow
import Watcher from './Watcher';
import Example from './Example';
import * as fs from './fs';
import * as constants from './constants';
import path from 'path';
import chalk from 'chalk';

type Action = {
  kind: 'add' | 'remove' | 'change',
  filePath: string,
};

type RunnerOpts = {
  cwd: string,
};

export default class Runner {
  cwd: string;
  dirName: string;
  tempDir: string;

  watcher: Watcher;
  examples: Map<string, Example>;
  queue: Array<Action>;

  updating: boolean;
  watching: boolean;
  ready: boolean;

  constructor(opts: RunnerOpts) {
    this.cwd = opts.cwd;
    this.dirName = path.dirname(this.cwd);
    this.tempDir = fs.tempdir();

    this.watcher = new Watcher();
    this.examples = new Map();
    this.queue = [];

    this.updating = false;
    this.watching = false;
    this.ready = false;
  }

  async run(opts: { match: Array<string>, watch: boolean }) {
    if (opts.watch) {
      this.watching = true;
      this.watcher.on('add', this.onAdd);
      this.watcher.on('remove', this.onRemove);
      this.watcher.on('change', this.onChange);
      this.watcher.watch(this.cwd);
    }

    let examplePaths = await fs.findGlobPatterns(this.cwd, [
      constants.DEFAULT_EXAMPLES_GLOB,
      constants.IGNORE_NODE_MODULES_GLOB,
    ]);

    await Promise.all(
      examplePaths.map(async examplePath => {
        await this.addExample(examplePath);
      }),
    );

    this.ready = true;
    this.update();
  }

  async addExample(examplePath: string) {
    let example = new Example({
      cwd: this.cwd,
      tempDir: this.tempDir,
      filePath: examplePath,
    });

    if (this.ready) {
      console.log(chalk.green(`Example: "${example.title}" (added)`));
    } else {
      console.log(chalk.cyan(`Example: "${example.title}"`));
    }

    await fs.mkdirp(example.tempDir);
    await Promise.all([
      fs.writeFile(example.htmlPath, example.htmlContent),
      fs.writeFile(example.jsPath, example.jsContent),
    ]);

    this.examples.set(examplePath, example);
  }

  async removeExample(examplePath: string) {
    let example = this.examples.get(examplePath);
    if (!example) return;
    console.log(chalk.red(`Example: "${example.title}" (removed)`));

    this.examples.delete(examplePath);
    await fs.unlink(example.htmlPath);
    await fs.unlink(example.jsPath);
  }

  async changeExample(examplePath: string) {
    let example = this.examples.get(examplePath);
    if (!example) return;
    console.log(chalk.cyan(`Example: "${example.title}" (changed)`));
  }

  async updateIndex() {
    // ...
  }

  async update() {
    if (!this.ready || this.updating || !this.queue.length) {
      return;
    }

    this.updating = true;
    let queue = this.queue.splice(0);

    for (let action of queue) {
      if (action.kind === 'add') {
        await this.addExample(action.filePath);
      } else if (action.kind === 'remove') {
        await this.removeExample(action.filePath);
      } else if (action.kind === 'change') {
        await this.changeExample(action.filePath);
      }
    }

    await this.updateIndex();
    this.updating = false;

    if (this.queue.length) {
      await this.update();
    }
  }

  onAdd = (filePath: string) => {
    if (this.matches(filePath)) {
      this.queue.push({ kind: 'add', filePath });
      this.update();
    }
  };

  onRemove = async (filePath: string) => {
    if (this.matches(filePath)) {
      this.queue.push({ kind: 'remove', filePath });
      await this.update();
    }
  };

  onChange = async (filePath: string) => {
    if (this.matches(filePath)) {
      this.queue.push({ kind: 'change', filePath });
      await this.update();
    }
  };

  matches(filePath: string) {
    return fs.matchesGlobPatterns(filePath, [
      constants.DEFAULT_EXAMPLES_GLOB,
      constants.IGNORE_NODE_MODULES_GLOB,
    ]);
  }
}
