import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => {
    return {
      showHelp: false,
      helpCommand: "",
      history: ([] as string[]),
    }
  }
})
