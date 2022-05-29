import type { VaunchFile } from '@/models/VaunchFile'
import { defineStore } from 'pinia'

export const useFuzzyStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      items: ([] as VaunchFile[])
    }
  },
  actions: {
    setFuzzy(files:VaunchFile[]) {
      this.items = files;
    },
    clear() {
      this.items = [];
    }
  }
})
