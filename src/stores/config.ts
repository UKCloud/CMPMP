import { defineStore, type StoreDefinition } from "pinia";
import defaultBg from "@/assets/img/default.png";
import { useStorage} from '@vueuse/core'

export const defaultconfig = {
  background: defaultBg,
  showGUI: true,
  titleCase: true,
  defaultFile: "",
  fuzzy: false,
  color: {
    window: 'var(--color-vaunch-window)',
    text: 'var(--color-vaunch-text)',
    autocomplete: 'var(--color-autocomplete)',
    highlight: 'var(--color-highlight)',
  }
}

export const useConfigStore:StoreDefinition = defineStore({
  id: "config",
  state: () => useStorage('config', defaultconfig,
  undefined,
  {
    serializer: {
      read (v:any) {
        let data = JSON.parse(v);
        console.log(data);
        let config = {
          background: data.background ? data.background : defaultconfig.background,
          showGUI: data.showGUI != undefined ? data.showGUI : defaultconfig.showGUI,
          defaultFile: data.defaultFile ? data.defaultFile : defaultconfig.defaultFile,
          fuzzy: data.fuzzy != undefined ? data.fuzzy : defaultconfig.fuzzy,
          color: data.color ? data.color : defaultconfig.color
        }
        return config;
      },
      write: (v: any) => JSON.stringify(v),
    },
  },),
});
