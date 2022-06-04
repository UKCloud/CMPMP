import type { VaunchFile } from "@/models/VaunchFile";
import { defineStore } from "pinia";

export const useFuzzyStore = defineStore("fuzzy", {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      items: [] as VaunchFile[],
      index: 0,
    };
  },
  actions: {
    setFuzzy(files: VaunchFile[]) {
      this.items = files;
    },
    clear() {
      this.items = [];
    },
  },
});
