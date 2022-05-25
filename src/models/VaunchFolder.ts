import { VaunchFile } from "./VaunchFile";
import { VaunchLink } from "./VaunchLink";

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

  getFiles(): VaunchFile[] {
    return Array.from(this.files.values())
  }

  info(): any {
    let fileInfo:any[] = [];
    this.getFiles().forEach((file) => fileInfo.push(file.info()))
    let data = {
      name: this.name,
      files: fileInfo
    }
    return data
  }

  static parse(data:any): VaunchFolder {
    let folder = new VaunchFolder(data.name);
    for (let fileData of data.files) {
      let file:VaunchFile = new VaunchLink(fileData.name, fileData.content);
      folder.createFile(file)
    }
    return folder;
  }
}