import {
  FileReadOptions, FileReadResult, FileWriteOptions, FileWriteResult,
} from '@capacitor/core';

class Filesystem {
  private filesystem;

  constructor() {
    this.filesystem = new Map<string, string>();
  }

  public async readFile(options: FileReadOptions): Promise<FileReadResult> {
    const { path } = options;

    const data = this.filesystem.get(path);

    if (!data) {
      throw new Error('File does not exist');
    }

    return { data };
  }

  public async writeFile(options: FileWriteOptions): Promise<FileWriteResult> {
    const { path, data } = options;
    this.filesystem.set(path, data);

    return { uri: path };
  }
}

const FilesystemInstance = new Filesystem();

export default FilesystemInstance;
