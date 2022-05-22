import { defineStore } from "pinia";
import defaultBg from "@/assets/img/bg.jpg";

export const useConfigStore = defineStore({
  id: "config",
  state: () => ({
    background: defaultBg,
  }),
});
