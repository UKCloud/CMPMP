import { defineStore, type StoreDefinition } from "pinia";
import { useStorage } from '@vueuse/core'

import { VaunchFolder } from "@/models/VaunchFolder"

export const useFolderStore:StoreDefinition = defineStore({
  id: "folder",
  state: () => ({
    rawFolders: useStorage('folders', new Map<string, VaunchFolder>()),
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
