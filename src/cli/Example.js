// @flow
import path from 'path';
import * as constants from './utils/constants';
import * as fs from './utils/fs';
import stripIndent from 'strip-indent';
import resolveFrom from 'resolve-from';

function basename(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

export type ExampleOpts = {
  cwd: string,
  tempDir: string,
  filePath: string,
};

export default class Example {
  filePath: string;

  relativePath: string;
  relativePathOut: string;

  dirName: string;
  dirNameOut: string;

  baseName: string;
  baseNameOut: string;

  tempDir: string;
  htmlPath: string;
  txtPath: string;
  jsPath: string;

  title: string;

  htmlContent: string;
  jsContent: string;

  constructor(opts: ExampleOpts) {
    this.filePath = opts.filePath;
    this.relativePath = path.relative(opts.cwd, this.filePath);
    this.relativePathOut = this.relativePath
      .split(path.sep)
      .map(part => part.replace(constants.EXAMPLE_PATH_PART_NUMBER, '$2'))
      .join(path.sep);

    this.dirName = path.dirname(this.relativePath);
    this.dirNameOut = path.dirname(this.relativePathOut);

    this.baseName = basename(this.relativePath);
    this.baseNameOut = basename(this.relativePathOut);

    this.tempDir = path.join(opts.tempDir, this.dirNameOut);
    this.htmlPath = path.join(this.tempDir, this.baseNameOut + '.html');
    this.txtPath = path.join(this.tempDir, this.baseNameOut + '.txt');
    this.jsPath = path.join(this.tempDir, this.baseNameOut + '.js');

    let currentDirName = path.basename(opts.cwd);
    let exampleDirName = this.dirNameOut.replace(path.sep, '/');

    this.title = `${currentDirName}/${exampleDirName}/${this.baseNameOut}`;

    let reactImport = resolveFrom(this.filePath, 'react');
    let reactDomImport = resolveFrom(this.filePath, 'react-dom');

    let relativeJsImport = path.relative(this.jsPath, this.filePath);
    let relativeReactImport = path.relative(this.jsPath, reactImport);
    let relativeReactDomImport = path.relative(this.jsPath, reactDomImport);

    this.htmlContent = stripIndent(`
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${this.title}</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/javascript" src="./${this.baseNameOut}.js"></script>
      </body>
      </html>
    `).trim();

    this.jsContent = stripIndent(`
      import React from "${relativeReactImport}";
      import { render } from "${relativeReactDomImport}";
      import Example from "${relativeJsImport}";

      render(React.createElement(Example), document.getElementById("root"));
    `).trim();
  }

  async build() {
    let fileContents = await fs.readFile(this.filePath);
    await fs.mkdirp(this.tempDir);
    await Promise.all([
      fs.writeFile(this.htmlPath, this.htmlContent),
      fs.writeFile(this.txtPath, fileContents),
      fs.writeFile(this.jsPath, this.jsContent),
    ]);
  }

  async delete() {
    await Promise.all([fs.unlink(example.htmlPath), fs.unlink(example.jsPath)]);
  }
}
