import { defineStore } from "pinia";
import { useFolderStore } from "@/stores/folder";


export const useCommandStore = defineStore({
  id: "command",
  state: () => ({
    available: [
      "mkdir", "rmdir", "touch", "total"
    ],
  }),
  actions: {
    mkdir(folders:string[]) {
      const folder = useFolderStore();
      folders.forEach((newFolder) => {
        folder.add(newFolder);
      })
    },
    rmdir(folders:string[]) {
      const folder = useFolderStore();
      folders.forEach((toDelete) => {
        folder.remove(toDelete);
      })
    }
  }
});
