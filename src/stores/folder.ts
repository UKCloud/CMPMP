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
    },
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
  },
});
