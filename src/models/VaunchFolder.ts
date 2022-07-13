import type { VaunchFile } from "./VaunchFile";
import { VaunchLink } from "./VaunchLink";
import { VaunchQuery } from "./VaunchQuery";
import { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchFolder {
  name: string;
  files: Map<string, VaunchFile>;
  icon: string;
  iconClass: string;
  position: number;

  constructor(name: string, icon = "folder", iconClass = "solid", position = -1) {
    this.name = name;
    this.files = new Map<string, VaunchFile>();
    this.icon = icon;
    this.iconClass = iconClass;
    this.position = position;
  }

  public addFile(newFile: VaunchFile): boolean {
    if (this.getFile(newFile.fileName)) return false;
    // Set the new file's position to last
    const nextPos:number = this.getFiles().length + 1;
    newFile.position = nextPos;
    this.files.set(newFile.fileName, newFile);
    return true;
  }

  getIdSafeName(): string {
    return this.name.replace(".", "-");
  }

  titleCase(): string {
    const prettyString = this.name.replace(/[-_]/g, " ");
    return prettyString
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  getFile(fileName: string): VaunchUrlFile | undefined {
    const file = this.files.get(fileName);
    if (file instanceof VaunchUrlFile) {
      return file;
    }
    return undefined;
  }

  getFiles(): VaunchFile[] {
    return Array.from(this.files.values());
  }

  sortFiles(): VaunchFile[] {
    let sortable:VaunchFile[] = [];
    let unsorted:VaunchFile[] = [];
    // Separate out sortable and un-sortable folders
    (this.getFiles() as VaunchFile[]).forEach((x:VaunchFile) => (x.position != -1 ? sortable : unsorted).push(x));
    // Sort the sortable folders by their position value
    sortable = sortable.sort((a, b) => ((a as VaunchFile).position > (b as VaunchFile).position ? 1 : -1));
    let final = [...sortable, ...unsorted]
    return final;
  }

  organiseFiles(semiSortedFiles:VaunchFile[]) {
    // To br ran on semi-sorted arrays, with where items are sorted,
    // but positions may not be in sequence with each other
    for( let [index, file] of semiSortedFiles.entries() ) {
      file.position = index+1;
    }
  }

  setFilePosition(fileName:string, position:number):boolean {
    // Set the folder's position
    let currentFile:VaunchFile|undefined = this.getFile(fileName);
    if (currentFile){

      let positionGoingDown = (position > currentFile.position && currentFile.position != -1);
      currentFile.position = position;
      if (position == -1) return true;
      
      this.fixOrder(fileName, currentFile.position, positionGoingDown);

    } else return false
    // After setting the position, set each folder's position to a 'sensible' order
    let sortOfSorted = this.sortFiles();
    this.organiseFiles(sortOfSorted);
    return true
  }

  fixOrder(filename:string, position:number, movingDown:boolean):void {
      // Recurse through all other folders, if they have this folder's new position, shift it back
      for (let file of (this.getFiles() as VaunchFile[])) {
        if (file.fileName != filename && file.position == position) {
          if (movingDown) {
            file.position = file.position - 1;
            return this.fixOrder(file.fileName, position-1, movingDown);
          } else {
            file.position = file.position + 1;
            return this.fixOrder(file.fileName, position+1, movingDown);
          }
        }
      }
  }

  searchFile(search: string, types: string[] = []): VaunchFile[] {
    const matches: VaunchFile[] = [];
    for (const [fileName, file] of this.files.entries()) {
      if (fileName.includes(search)) {
        if (types.includes(file.filetype)) {
          matches.push(file);
        } else if (types.length == 0) {
          matches.push(file);
        }
      } else if (file.namesStartWith(search)) {
        if (types.includes(file.filetype)) {
          matches.push(file);
        } else if (types.length == 0) {
          matches.push(file);
        }
      }
    }
    return matches;
  }

  removeFile(toDelete: string): boolean {
    return this.files.delete(toDelete);
  }

  setIcon(icon: string, iconClass: string): void {
    this.icon = icon;
    this.iconClass = iconClass;
  }

  info(): any {
    const fileInfo: any[] = [];
    this.getFiles().forEach((file) => fileInfo.push(file.info()));
    const data = {
      name: this.name,
      icon: this.icon,
      iconClass: this.iconClass,
      files: fileInfo,
      position: this.position,
    };
    return data;
  }

  // Parse a VaunchFolder from serialized JSON data
  // Also creates VaunchFiles that belong to the folder
  static parse(data: any): VaunchFolder {
    const folder = new VaunchFolder(data.name, data.icon, data.iconClass, data.position);
    for (const fileData of data.files) {
      let file: VaunchFile | undefined = undefined;
      if (fileData.type == "VaunchLink") {
        file = new VaunchLink(
          fileData.fileName,
          fileData.content,
          folder,
          fileData.icon,
          fileData.iconClass,
          fileData.hits,
          fileData.description,
          fileData.position
        );
      } else if (fileData.type == "VaunchQuery") {
        file = new VaunchQuery(
          fileData.fileName,
          fileData.prefix,
          fileData.content,
          folder,
          fileData.icon,
          fileData.iconClass,
          fileData.hits,
          fileData.description,
          fileData.position
        );
      }
      if (file != undefined) folder.addFile(file);
    }
    return folder;
  }
}
