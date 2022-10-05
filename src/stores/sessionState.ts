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
      email: "",
      appVersion: String(import.meta.env.VITE_APP_VERSION),
      buildDate: String(import.meta.env.VITE_APP_BUILD_DATE),
      login: new URL('/login', import.meta.env.VITE_APP_BACKEND_URL).href,
      logout: new URL('/logout', import.meta.env.VITE_APP_BACKEND_URL).href,
      users: new URL('/users', import.meta.env.VITE_APP_BACKEND_URL).href,
      backendURL: new URL(import.meta.env.VITE_APP_BACKEND_URL).href,
      showSuccess: Boolean(import.meta.env.VITE_APP_SHOW_SUCCESS || false),
    };
  },
});
