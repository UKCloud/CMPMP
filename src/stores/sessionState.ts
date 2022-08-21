import { ResponseType } from "@/models/VaunchResponse";
import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
  // Stores information used in the current session, such as the input prompt value
  // and any responses from commands
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
      showAppOptions: false,
      action: "",
    };
  },
});
