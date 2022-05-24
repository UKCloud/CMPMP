<script lang="ts">
import { defineComponent } from "vue";
import { commands } from "@/stores/command"
import type { VaunchFile } from "@/models/VaunchFile";


export default defineComponent({
  name: "VaunchInput",
  setup() {
    return {
      commands,
    }
  },
  data() {
    return {
      vaunchInput: "",
      autocomplete: "",
    };
  },
  // props: ["autocomplete"],
  emits: ["command"],
  watch: {
    vaunchInput(val: string) {

      let input = val.split(' ');
      // Clear autocomplete to start with a clean slate
      this.autocomplete = "";

      // Get the current word that is being typed 
      let lastWord: string = input[input.length - 1];
      // Remove the last word, so it wont be considered in the autocomplete placeholder text
      input.pop();

      // If on the second+ word, prefix the autocomplete text with the previous words
      if (input.length > 0) {
        this.autocomplete = input.join(" ");
        this.autocomplete += " "; // Add extra space for the to-be-completed word
      }

      // Search through the valid commands to autocomplete this word with
      // Only do this on the first "word", as commands will always be the first word
      if (lastWord.length > 0 && input.length == 0) {
        this.autocomplete += this.getAutocomplete(lastWord, commands);
      }
    },
  },
  methods: {
    complete() {
      this.vaunchInput = this.autocomplete + " ";
    },
    sendCommand() {
      this.$emit("command", this.vaunchInput.split(' '))
      this.vaunchInput = "";
    },
    getAutocomplete(input:string, commands:VaunchFile[]):string {
      for (let command of commands) {
        for (let ailias of command.getNames()) {
          if (ailias.startsWith(input)) {
            return ailias
          }
        }
      }
      return input
    }
  },
});
</script>

<style scoped>
#vaunch-input-container {
  position: relative;
  width: 75vw;
}

/* Common styles for both inputs */
#vaunch-input-container input {
  font-size: 3rem;
  width: 100%;
  padding: 0.2em 0.75em;
  border: none;
}

#vaunch-input-container input:focus {
  outline: none;
}

#vaunch-input {
  background: none;
  z-index: 2;
  color: inherit;
}

#vaunch-autocomplete {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  opacity: 0.8;

  color: var(--color-autocomplete);
  background: none;
}
</style>

<template>
  <div id="vaunch-input-container" class="vaunch-window">
    <input
      id="vaunch-input"
      type="text"
      v-model="vaunchInput"
      @keydown.tab.prevent="complete"
      @keydown.enter.prevent="sendCommand"
    />
    <input id="vaunch-autocomplete" type="text" :value="autocomplete" />
  </div>
</template>
