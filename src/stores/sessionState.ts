import { ResponseType } from "@/models/VaunchResponse";
import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
  state: () => {
    return {
      showHelp: false,
      helpCommand: "",
      history: [] as string[],
      historyIndex: -1,
      showResponse: false,
      currentResponse: {
        type: ResponseType.Info,
        message: "Vaunch Initialised",
        filetype: "VaunchSystem",
        name: "execute",
      },
      vaunchInput: "",
      showFileOptions: false,
      showFolderOptions: false,
    };
  },
});
