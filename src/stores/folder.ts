import { defineStore } from "pinia";

import { Folder } from "@/models/Folder"

export const useFolderStore = defineStore({
  id: "folder",
  state: () => ({
    rawFolders: [] as Folder[],
  }),
  getters: {
    folders: (state) => state.rawFolders,
  },
  actions: {
    add(name:string) {
      let newFolder = new Folder(name);
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
