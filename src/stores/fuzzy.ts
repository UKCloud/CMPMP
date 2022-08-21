import type { VaunchFile } from "@/models/VaunchFile";
import { defineStore } from "pinia";

export const useFuzzyStore = defineStore("fuzzy", {
  // Store to hold currently matched files from the fuzzy finder
  state: () => {
    return {
      items: [] as VaunchFile[],
      index: 0,
    };
  },
  actions: {
    // Sets the list of found files
    setFuzzy(files: VaunchFile[]) {
      this.items = files;
    },
    // Clears the list of found files
    clear() {
      this.items = [];
    },
  },
});
