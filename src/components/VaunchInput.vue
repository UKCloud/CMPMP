<script lang="ts">
import { defineComponent } from "vue";
import { commands } from "@/stores/command"
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import { useFolderStore } from "@/stores/folder";
import { useConfigStore } from "@/stores/config";


export default defineComponent({
  name: "VaunchInput",
  setup() {
    const folders = useFolderStore()
    return {
      commands,
      folders,
    }
  },
  data() {
    return {
      vaunchInput: "",
      autocomplete: "",
      completeType: ""
    };
  },
  emits: ["command", "fuzzy", "fuzzyIncrement"],
  watch: {
    vaunchInput(val: string) {
      // Emit out what we're typing if fuzzy is enabled
      const config = useConfigStore();
      if (config.fuzzy) {
        this.$emit('fuzzy', val)
      }

      // Annoyingly if input overflows autcomplete falls apart, so just disable it after a while...
      if (val.length > 50) {
        this.autocomplete = ""
        return
      }

      this.completeType = "";
      let input = val.split(' ');

      // Get the current word that is being typed 
      // Remove the last word, so it wont be considered in the autocomplete placeholder text
      let lastWord: string = input[input.length - 1]
      input.pop();
      
      // Set autocomplete to go up to the last word (i.e what input is after lastWord was popped of)
      this.autocomplete = input.join(" ");

      // If on the second+ word, prefix the autocomplete text with the previous words
      if (input.length > 0) {
        this.autocomplete += " "; // Add extra space for the to-be-completed word
      }

      // Search through the valid commands to autocomplete this word with
      // Only do this on the first "word", as commands will always be the first word
      if (lastWord.length > 0 && input.length == 0) {
        this.autocomplete += this.getAutocompleteFile(lastWord, commands);
      }
      // If command autocomplete did not find anything, search for folders/files
      if (lastWord.length > 0 && this.completeType == "") {
        // If on the second+ word, check folder names/files to autocomplete
        this.autocomplete += this.getAutocompleteFolder(lastWord, this.folders.folderNames);
        let pathSplit = lastWord.split("/")
        if (this.completeType == "" && lastWord.includes("/") && pathSplit[1].length > 0) {
          // Search for a file, pathSplit[0] is folder, pathSplit[1] is semi-complete filename
          let folder:VaunchFolder = this.folders.getFolderByName(pathSplit[0]);
          if (folder) {
            this.autocomplete += pathSplit[0] + "/" + this.getAutocompleteFile(pathSplit[1], folder.getFiles());
          }
        }
      }
      // If no autocomplete was successful, set it autocomplete text to the current value
      if (this.completeType == "") {
        this.autocomplete = val;
      }
    },
  },
  methods: {
    setInput(input:string) {
      this.vaunchInput = input;
      (this.$refs.inputBox as any).focus()
    },
    complete() {
      // Only complete if there is something to complete
      if (this.autocomplete.length > this.vaunchInput.length) {
        this.vaunchInput = this.autocomplete + (this.completeType == "file" ? " ": "");
      }
    },
    sendCommand() {
      this.$emit("command", this.vaunchInput.split(' '))
      this.vaunchInput = "";
    },
    getAutocompleteFolder(input:string, folders:string[]):string {
      for (let folder of folders) {
        if (folder.startsWith(input)) {
          this.completeType = "folder";
          return folder + "/"
        }
      }
      return ""
    },
    getAutocompleteFile(input:string, commands:VaunchFile[]):string {
      for (let command of commands) {
        for (let ailias of command.getNames()) {
          if (ailias.startsWith(input)) {
            this.completeType = "file";
            return ailias;
          }
        }
      }
      return ""
    },
    incrementFuzzy() {
      this.$emit('fuzzyIncrement', true)
    },
    decrementFuzzy() {
      this.$emit('fuzzyIncrement', false)
    },
  },
});
</script>

<style scoped>
#vaunch-input-container {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
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

  /* color: var(--color-autocomplete); */
  background: none;
}

#input-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#input-wrapper {
  flex: 1;
}

.input-icon {
  padding-left: 1.5em;
  height: 2rem;
}

@media (max-width: 768px) {
  #vaunch-input-container {
    width: 95vw;
  }
}
</style>

<template>
<div id="vaunch-input-container">
  <div class="vaunch-window" id="input-inner">
      <i class="fa-solid fa-chevron-right input-icon"></i>
    <div id="input-wrapper">
      <input
        id="vaunch-input"
        type="text"
        v-model="vaunchInput"
        @keydown.tab.prevent="complete"
        @keydown.enter.prevent="sendCommand"
        @keydown.tab.exact.prevent="incrementFuzzy"
        @keydown.tab.shift.exact.prevent="decrementFuzzy"
        @keydown.down.exact.prevent="incrementFuzzy"
        @keydown.up.exact.prevent="decrementFuzzy"
        ref="inputBox"
      />
      <input id="vaunch-autocomplete" type="text" :value="autocomplete" />
    </div>
  </div>
</div>
</template>
