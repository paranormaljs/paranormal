// @flow
import path from 'path';
import * as fs from './utils/fs';
import Example from './Example';
import stripIndent from 'strip-indent';

export type AppOpts = {
  tempDir: string,
};

export default class App {
  tempDir: string;

  indexPath: string;
  entriesPath: string;

  constructor(opts: AppOpts) {
    this.tempDir = opts.tempDir;
    this.indexPath = path.join(this.tempDir, 'index.html');
    this.entriesPath = path.join(this.tempDir, 'entries.html');
  }

  async build(examples: Array<Example>) {
    let EXAMPLES_DATA: ExamplesData = examples.map(example => {
      return {
        title: example.title,
        href: path.relative(this.tempDir, example.htmlPath),
      };
    });

    let links = [];

    links.push(path.relative(this.tempDir, this.indexPath));

    examples.forEach(example => {
      links.push(
        path.relative(this.tempDir, example.htmlPath),
        path.relative(this.tempDir, example.txtPath),
        path.relative(this.tempDir, example.jsPath),
      );
    });

    let indexContent = stripIndent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>👻 Paranormal</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
            window.EXAMPLES_DATA = ${JSON.stringify(EXAMPLES_DATA)};
          </script>
          <script src="${require.resolve('../app/index.js')}"></script>
          <a hidden href="./entries.html"></a>
        </body>
      </html>
    `).trim();

    let entriesContent = stripIndent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>👻 Paranormal</title>
        </head>
        <body>
          <ul>
            ${links
              .map(link => `<li><a href="${link}">${link}</a></li>`)
              .join('')}
          </ul>
        </body>
      </html>
    `).trim();

    await Promise.all([
      fs.writeFile(this.indexPath, indexContent),
      fs.writeFile(this.entriesPath, entriesContent),
    ]);
  }
}
