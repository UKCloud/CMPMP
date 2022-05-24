import { defineStore, type StoreDefinition } from "pinia";
import { useStorage } from '@vueuse/core'

import { VaunchFolder } from "@/models/VaunchFolder"

export const useFolderStore:StoreDefinition = defineStore({
  id: "folder",
  state: () => ({
    rawFolders: useStorage('folders', [] as VaunchFolder[]),
  }),
  getters: {
    items: (state: { rawFolders: any; }) => state.rawFolders,
  },
  actions: {
    add(name:string) {
      let newFolder = new VaunchFolder(name);
      this.rawFolders.push(newFolder);
    },
    remove(toDelete:string) {
      this.rawFolders.forEach((folder, index, object) => {
        if (folder.name == toDelete) {
          object.splice(index,1);
        }
      })
    },
  },
});
