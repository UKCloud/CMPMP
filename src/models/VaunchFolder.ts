import { VaunchFile } from "./VaunchFile";
import { VaunchLink } from "./VaunchLink";
import { VaunchQuery } from "./VaunchQuery";

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

  titleCase(): string {
    return this.name.charAt(0).toUpperCase() + this.name.slice(1)
  }

  getFile(fileName:string): VaunchFile|undefined {
    let file = this.files.get(fileName)
    if (file instanceof VaunchFile) {
      return file;
    }
    return undefined;
  }

  getFiles(): VaunchFile[] {
    return Array.from(this.files.values())
  }

  removeFile(toDelete:string): boolean {
    return this.files.delete(toDelete)
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

  // Parse a VaunchFolder from serialized JSON data
  // Also creates VaunchFiles that belong to the folder
  static parse(data:any): VaunchFolder {
    let folder = new VaunchFolder(data.name);
    for (let fileData of data.files) {
      let file: VaunchFile|undefined = undefined;
      if (fileData.type == "VaunchLink") {
        file = new VaunchLink(fileData.fileName, fileData.content, fileData.icon, fileData.iconClass);
      } else if (fileData.type == "VaunchQuery") {
        file = new VaunchQuery(fileData.fileName, fileData.prefix, fileData.content, fileData.icon, fileData.iconClass);
      }
      if (file != undefined) folder.createFile(file)
    }
    return folder;
  }
}