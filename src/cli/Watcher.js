// @flow
import EventEmitter from 'events';
import * as fs from './utils/fs';

export default class Watcher extends EventEmitter {
  watch(dirPath: string) {
    let watcher = fs.watchDirectory(dirPath);

    watcher.on('add', (filePath: string) => {
      this.emit('add', filePath);
    });

    watcher.on('unlink', (filePath: string) => {
      this.emit('remove', filePath);
    });

    watcher.on('change', (filePath: string) => {
      this.emit('change', filePath);
    });
  }
}
