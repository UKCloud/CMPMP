import { VaunchFile } from "./VaunchFile";

export class VaunchFolder {
  name: string;
  files: Map<string, VaunchFile>

  constructor(name: string) {
    this.name = name;
    this.files = new Map<string, VaunchFile>();
  }

  public createFile(newFile:VaunchFile): void {
    this.files.set(newFile.fileName, newFile);
  }

  getFile(fileName:string): VaunchFile|null {
    let file = this.files.get(fileName)
    if (file instanceof VaunchFile) {
      return file;
    }
    return null;
  }

  getFiles(): IterableIterator<VaunchFile> {
    return this.files.values()
  }
}