import { defineStore, type StoreDefinition } from "pinia";
import { useStorage } from '@vueuse/core'

import { VaunchFolder } from "@/models/VaunchFolder"
import type { VaunchFile } from "@/models/VaunchFile";

export const useFolderStore:StoreDefinition = defineStore({
  id: "folder",
  state: () => ({
    rawFolders: useStorage(
      'folders',
      new Map<string, VaunchFolder>(),
      undefined, 
      {
        serializer: {
          read (v:any) {
            let rawData = JSON.parse(v);
            let map = new Map<string, VaunchFolder>();
            for (let folder of rawData) {
              let vaunchFolder = VaunchFolder.parse(folder);
              map.set(vaunchFolder.name, vaunchFolder);
            }
            return map;
          },
          write (v: Map<string, VaunchFolder>) {
            console.log("writing...");
            let storeData:any[] = []; 
            for (let folder of v) {
              storeData.push(folder[1].info())
            }
            return JSON.stringify(storeData);
          },
        },
      },
    ),
  }),
  getters: {
    items: (state: { rawFolders: any; }) => Array.from(state.rawFolders.values()),
    folderNames: (state: { rawFolders: Map<string, VaunchFolder>; }) => Array.from(state.rawFolders.keys()),
    getFolderByName: (state: { rawFolders: any; }) => {
      return (folderName:string) => state.rawFolders.get(folderName)
    }
  },
  actions: {
    add(name:string) {
      let newFolder = new VaunchFolder(name);
      this.rawFolders.set(name, newFolder)
    },
    remove(toDelete:string) {
      this.rawFolders.delete(toDelete)
    },
  },
});
