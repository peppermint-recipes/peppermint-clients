import { FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import Filesystem from '../../__mocks__/@capacitor/Filesystem';

class LocalStore<Type> {
  private fileName: string

  constructor(fileNameIn: string) {
    this.fileName = fileNameIn;
  }

  public async read(): Promise<Type[]> {
    const data = await this.readFile();
    if (!data) {
      return [] as Type[];
    }
    return data;
  }

  public async persist(data: Type[]) {
    await this.writeFile(data);
  }

  private async readFile() {
    try {
      const file = await Filesystem.readFile({
        path: this.fileName,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8,
      });

      const parsed = JSON.parse(file.data);

      return parsed;
    } catch (error: any) {
      const fileDoesNotExistErrorMessage = 'File does not exist';

      if (error.message === fileDoesNotExistErrorMessage) {
        await this.writeFile();
      }

      return [] as Type [];
    }
  }

  private async writeFile(data?: Type[]) {
    await Filesystem.writeFile({
      path: this.fileName,
      data: (data !== undefined) ? JSON.stringify(data) : JSON.stringify([]),
      directory: FilesystemDirectory.Documents,
      encoding: FilesystemEncoding.UTF8,
    });
  }
}

export default LocalStore;
