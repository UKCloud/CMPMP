import { defineStore } from "pinia";

export const useFolderStore = defineStore({
  id: "folder",
  state: () => ({
    rawFolders: [],
  }),
  getters: {
    folders: (state) => state.rawFolders,
  }
});
