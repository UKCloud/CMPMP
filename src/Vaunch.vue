<script lang="ts">
import { defineComponent } from "vue";
import VaunchInput from "@/components/VaunchInput.vue";

import { useCommandStore } from "@/stores/command";
import { useConfigStore } from "@/stores/config";

export default defineComponent({
  components: {
    VaunchInput,
  },
  setup() {
    const commands = useCommandStore();
    const config = useConfigStore();

    return {
      commands,
      config,
    };
  },
  data() {
    return {
      autocompleteText: "",
    };
  },
  methods: {
    readInput(input: string[]) {
      // Clear autocomplete to start with a clean slate
      this.autocompleteText = "";

      // Get the current word that is being typed 
      let lastWord: string = input[input.length - 1];
      // Remove the last word, so it wont be considered in the autocomplete placeholder text
      input.pop();

      // If on the second+ word, prefix the autocomplete text with the previous words
      if (input.length > 0) {
        this.autocompleteText = input.join(" ");
        this.autocompleteText += " "; // Add extra space for the to-be-completed word
      }

      // Search through the valid commands to autocomplete this word with
      let match = false;
      if (lastWord.length > 0) {
        for (const i in this.commands.available) {
          let command: string = this.commands.available[i];
          if (command.startsWith(lastWord)) {
            match = true;
            this.autocompleteText += command;
            break;
          }
        }
      }
      if (!match) this.autocompleteText += lastWord;
    },
    executeCommand(commandString:string) {
      let commandArgs: string[] = commandString.split(" ");
      let command: string|undefined = commandArgs.shift();
      switch (command) {
        case "mkdir":
          this.commands.mkdir(commandArgs)
          break;
        case "rmdir":
          this.commands.rmdir(commandArgs)
          break;
      
        default:
          break;
      }
    }
  },
});
</script>

<style>
@import "@/assets/base.css";
</style>

<template>
  <main :style="{ 'background-image': 'url(' + config.background + ')' }">
    <VaunchInput 
      v-on:sendInput="readInput"
      v-on:command="executeCommand"
      :autocomplete="autocompleteText" />
  </main>
</template>
