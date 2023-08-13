import { join } from 'node:path';

export class Path {
  private _paths: string[];

  get paths() {
    return this._paths;
  }

  get lastPath() {
    return this.paths[this.paths.length - 1];
  }

  constructor(...paths: string[]) {
    this._paths = paths;
  }

  public concatPath(path: string) {
    this.paths.push(path);
  }

  public toString() {
    return join(...this.paths);
  }
}
