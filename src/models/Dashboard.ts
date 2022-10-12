import type { VaunchFile } from "./VaunchFile";
import { VaunchFolder } from "./VaunchFolder";

export class Dashboard {
  rawFolders: Map<string, VaunchFolder> = new Map<string, VaunchFolder>();
  name: string;

  constructor(name: string, folders: Map<string, VaunchFolder>) {
    this.name = name;
    this.rawFolders = folders;
  }

  getItems(): VaunchFolder[] {
    return Array.from(this.rawFolders.values());
  }

  getFolderNames(): string[] {
    return Array.from(this.rawFolders.keys());
  }

  getFolderByName(folderName: string): VaunchFolder | undefined {
    return this.rawFolders.get(folderName);
  }

  getFileByPath(path: string): VaunchFile | undefined {
    const folder = this.getFolderByName(path.split("/")[0]);
    return folder?.getFile(path.split("/")[1]);
  }

  addFolder(name: string) {
    const nextPos: number = this.rawFolders.size + 1;
    const newFolder = new VaunchFolder(name);
    newFolder.position = nextPos;
    this.rawFolders.set(name, newFolder);
  }

  insertFolder(folder: VaunchFolder) {
    this.rawFolders.set(folder.name, folder);
  }

  remove(toDelete: string) {
    this.rawFolders.delete(toDelete);
  }

  removeAll() {
    this.rawFolders = new Map<string, VaunchFolder>();
  }

  findFiles(search: string, types: string[] = []) {
    const matchingFiles: VaunchFile[] = [];
    for (const folder of this.rawFolders.values()) {
      matchingFiles.push(...folder.searchFile(search, types));
    }
    return matchingFiles;
  }

  sortedItems() {
    let sortable: VaunchFolder[] = [];
    const unsorted: VaunchFolder[] = [];
    // Separate out sortable and un-sortable folders
    this.getItems().forEach((x: VaunchFolder) =>
      (x.position != -1 ? sortable : unsorted).push(x)
    );
    // Sort the sortable folders by their position value
    sortable = sortable.sort((a, b) =>
      (a as VaunchFolder).position > (b as VaunchFolder).position ? 1 : -1
    );
    const final = [...sortable, ...unsorted];
    return final;
  }

  setPosition(folderName: string, position: number): boolean {
    // Set the folder's position
    const currentFolder = this.getFolderByName(folderName);
    if (currentFolder) {
      const positionGoingDown =
        position > currentFolder.position && currentFolder.position != -1;
      currentFolder.position = position;
      if (position == -1) return true;
      this.fixOrder(folderName, currentFolder.position, positionGoingDown);
    } else return false;

    // After setting the position, set each folder's position to a 'sensible' order
    const sortOfSorted = this.sortedItems();
    this.organisePosition(sortOfSorted);

    return true;
  }

  organisePosition(semiSortedFolders: VaunchFolder[]) {
    // To be ran on semi-sorted arrays, with where items are sorted,
    // but positions may not be in sequence with each other
    // (e.g the order 1, 5, 7, 10 becomes => 1, 2, 3, 4)
    for (const [index, folder] of semiSortedFolders.entries()) {
      folder.position = index + 1;
    }
  }

  private fixOrder(
    foldername: string,
    position: number,
    movingDown: boolean
  ): void {
    // Recurse through all other folders, if they have this folder's new position, shift it back
    for (const folder of this.getItems()) {
      if (folder.name != foldername && folder.position == position) {
        if (movingDown) {
          folder.position = folder.position - 1;
          return this.fixOrder(folder.name, position - 1, movingDown);
        } else {
          folder.position = folder.position + 1;
          return this.fixOrder(folder.name, position + 1, movingDown);
        }
      }
    }
  }
}
