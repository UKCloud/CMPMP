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
        this.commands.available.forEach((command) => {
          if (command.startsWith(lastWord)) {
            match = true;
            this.autocompleteText += command;
          }
        });
      }
      if (!match) this.autocompleteText += "";
    },
  },
});
</script>

<style>
@import "@/assets/base.css";
</style>

<template>
  <main :style="{ 'background-image': 'url(' + config.background + ')' }">
    <VaunchInput v-on:sendInput="readInput" :autocomplete="autocompleteText" />
  </main>
</template>
