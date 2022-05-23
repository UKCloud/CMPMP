import { defineStore, type StoreDefinition } from "pinia";
import defaultBg from "@/assets/img/bg.jpg";
import { useStorage} from '@vueuse/core'

export const useConfigStore:StoreDefinition = defineStore({
  id: "config",
  state: () => useStorage('config', {
    config: {
      background: defaultBg,
    }
  }),
});
