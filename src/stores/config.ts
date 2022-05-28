import { defineStore, type StoreDefinition } from "pinia";
import defaultBg from "@/assets/img/default.png";
import { useStorage} from '@vueuse/core'

export const useConfigStore:StoreDefinition = defineStore({
  id: "config",
  state: () => useStorage('config', {
      background: defaultBg,
      showGUI: true,
      titleCase: true,
      color: {
        window: 'var(--color-vaunch-window)',
        text: 'var(--color-vaunch-text)',
        autocomplete: 'var(--color-autocomplete)',
        highlight: 'var(--color-highlight)',
      },
      defaultFile: ""
  }),
});
