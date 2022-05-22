import { defineStore } from "pinia";

export const useCommandStore = defineStore({
  id: "command",
  state: () => ({
    available: [
      "mkdir", "touch", "total"
    ],
  }),
});
