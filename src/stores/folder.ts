import { defineStore, type StoreDefinition } from "pinia";
import { useStorage } from "@vueuse/core";

import { VaunchFolder } from "@/models/VaunchFolder";
import type { VaunchFile } from "@/models/VaunchFile";

export const useFolderStore: StoreDefinition = defineStore({
  id: "folder",
  state: () => ({
    rawFolders: useStorage(
      "folders",
      new Map<string, VaunchFolder>(),
      undefined,
      {
        serializer: {
          read(v: any) {
            const rawData = JSON.parse(v);
            const map = new Map<string, VaunchFolder>();
            for (const folder of rawData) {
              const vaunchFolder = VaunchFolder.parse(folder);
              map.set(vaunchFolder.name, vaunchFolder);
            }
            return map;
          },
          write(v: Map<string, VaunchFolder>) {
            const storeData: any[] = [];
            for (const folder of v) {
              storeData.push(folder[1].info());
            }
            return JSON.stringify(storeData);
          },
        },
      }
    ),
  }),
  getters: {
    items: (state: { rawFolders: any }) =>
      Array.from(state.rawFolders.values()),
    folderNames: (state: { rawFolders: Map<string, VaunchFolder> }) =>
      Array.from(state.rawFolders.keys()),
    getFolderByName: (state: { rawFolders: any }) => {
      return (folderName: string) => state.rawFolders.get(folderName);
    },
    getFileByPath: (state: { rawFolders: any }) => {
      return (path: string) =>
        (state.rawFolders.get(path.split("/")[0]) as VaunchFolder)?.getFile(
          path.split("/")[1]
        );
    }
  },
  actions: {
    add(name: string) {
      const newFolder = new VaunchFolder(name);
      this.rawFolders.set(name, newFolder);
    },
    insert(folder: VaunchFolder) {
      this.rawFolders.set(folder.name, folder);
    },
    remove(toDelete: string) {
      this.rawFolders.delete(toDelete);
    },
    removeAll() {
      this.rawFolders = new Map<string, VaunchFolder>();
    },
    findFiles(search: string, types: string[] = []) {
      const matchingFiles: VaunchFile[] = [];
      for (const folder of this.rawFolders.values()) {
        matchingFiles.push(...folder.searchFile(search, types));
      }
      return matchingFiles;
    },
    sortedItems() {
      let sortable:VaunchFolder[] = [];
      let unsorted:VaunchFolder[] = [];
      // Separate out sortable and un-sortable folders
      (this.items as VaunchFolder[]).forEach((x:VaunchFolder) => (x.position != -1 ? sortable : unsorted).push(x));
      // Sort the sortable folders by their position value
      sortable = sortable.sort((a, b) => ((a as VaunchFolder).position > (b as VaunchFolder).position ? 1 : -1));
      let final = [...sortable, ...unsorted]
      return final;
    },
    organisePosition(semiSortedFolders:VaunchFolder[]) {
      // To br ran on semi-sorted arrays, with where items are sorted,
      // but positions may not be in sequence with each other
      for( let [index, folder] of semiSortedFolders.entries() ) {
        folder.position = index+1;
      }
    },
    setPosition(folderName:string, position:number):boolean {
      // Set the folder's position
      let currentFolder:VaunchFolder = this.getFolderByName(folderName);
      if (currentFolder){
        let positionGoingDown = (position > currentFolder.position && currentFolder.position != -1);
        currentFolder.position = position;
        if (position == -1) return true;
        this.fixOrder(folderName, currentFolder.position, positionGoingDown)
      } else return false;

      // After setting the position, set each folder's position to a 'sensible' order
      let sortOfSorted = this.sortedItems();
      this.organisePosition(sortOfSorted);

      return true;
    },
    fixOrder(foldername:string, position:number, movingDown:boolean):void {
      // Recurse through all other folders, if they have this folder's new position, shift it back
      for (let folder of (this.items as VaunchFolder[])) {
        if (folder.name != foldername && folder.position == position) {
          if (movingDown) {
            folder.position = folder.position - 1;
            return this.fixOrder(folder.name, position-1, movingDown);
          } else {
            folder.position = folder.position + 1;
            return this.fixOrder(folder.name, position+1, movingDown);
          }
        }
      }
    }
  },
});
