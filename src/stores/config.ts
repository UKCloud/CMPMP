import { defineStore, type StoreDefinition } from "pinia";
import defaultBg from "@/assets/img/default.png";
import { useStorage } from "@vueuse/core";

export const defaultconfig = {
  background: defaultBg,
  showGUI: true,
  titleCase: true,
  defaultFile: "",
  fuzzy: false,
  showCommands: true,
  prefix: {
    class: "solid",
    name: "chevron-right",
  },
  color: {
    window: "var(--color-vaunch-window)",
    windowOpaque: "var(--color-vaunch-window-opaque)",
    text: "var(--color-vaunch-text)",
    autocomplete: "var(--color-autocomplete)",
    highlight: "var(--color-highlight)",
  },
};

export const useConfigStore: StoreDefinition = defineStore({
  id: "config",
  state: () =>
    useStorage("config", defaultconfig, undefined, {
      serializer: {
        read(v: any) {
          const data = JSON.parse(v);
          const config = {
            background: data.background
              ? data.background
              : defaultconfig.background,
            showGUI:
              data.showGUI != undefined ? data.showGUI : defaultconfig.showGUI,
            titleCase:
              data.titleCase != undefined
                ? data.titleCase
                : defaultconfig.titleCase,
            defaultFile: data.defaultFile
              ? data.defaultFile
              : defaultconfig.defaultFile,
            fuzzy: data.fuzzy != undefined ? data.fuzzy : defaultconfig.fuzzy,
            showCommands:
              data.showCommands != undefined
                ? data.showCommands
                : defaultconfig.showCommands,
            prefix: data.prefix ? data.prefix : defaultconfig.prefix,
            color: {
              window: data.color.window
                ? data.color.window
                : defaultconfig.color.window,
              windowOpaque: data.color.windowOpaque
                ? data.color.windowOpaque
                : defaultconfig.color.windowOpaque,
              text: data.color.text
                ? data.color.text
                : defaultconfig.color.text,
              autocomplete: data.color.autocomplete
                ? data.color.autocomplete
                : defaultconfig.color.autocomplete,
              highlight: data.color.highlight
                ? data.color.highlight
                : defaultconfig.color.highlight,
            },
          };
          return config;
        },
        write: (v: any) => JSON.stringify(v),
      },
    }),
  getters: {
    currentConfig: (state: any) => state,
  },
  actions: {
    newConfig(newConfig: any) {
      this.background = newConfig.background;
      this.showGUI = newConfig.showGUI;
      this.titleCase = newConfig.titleCase;
      this.defaultFile = newConfig.defaultFile;
      this.fuzzy = newConfig.fuzzy;
      this.showCommands = newConfig.showCommands;
      this.prefix = newConfig.prefix;
      this.color = newConfig.color;
    },
  },
});
