<script lang="ts">
import { defineComponent } from "vue";
import { commands } from "@/stores/command"
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import { useFolderStore } from "@/stores/folder";

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
  emits: ["command", "fuzzy", "fuzzyIncrement", "set-input-icon", "query-check"],
  props: ["prefixName", "prefixClass"],
  mounted() {
    (this.$refs.inputBox as HTMLInputElement).focus();
  },
  watch: {
    vaunchInput(val: string) {
      // Emit out what we're typing if fuzzy is enabled
      this.$emit('fuzzy', val)

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
        this.autocomplete += this.getAutocompleteFile(lastWord, commands, "command");
      }

      // If command autocomplete did not find anything, search for folders/files
      if (lastWord.length > 0 && this.completeType == "") {
        // If on the second+ word, check folder names/files to autocomplete
        this.autocomplete += this.getAutocompleteFolder(lastWord, this.folders.folderNames);

        let pathSplit = lastWord.split("/")
        let folderName = pathSplit[0];
        let fileName = pathSplit[1]
        // If we havent found anything yet, the last word has a '/' (is a folder path) and a filename is being typed
        if (this.completeType == "" && lastWord.includes("/") && fileName.length > 0) {
          // Search for a file, using fileName as a semi complete filename
          let folder:VaunchFolder = this.folders.getFolderByName(folderName);
          if (folder) {
            this.autocomplete += folderName + "/" + this.getAutocompleteFile(fileName, folder.getFiles());
          }
        }
      }

      // If autocomplete isn't for a file, let Vaunch know VaunchInput thinks the prefix icon should be reset 
      if (this.completeType != "file") {
        this.$emit('set-input-icon', undefined);
      }
      // If the input contains a : check if the current input is a .qry file
      if (val.includes(':')) {
        this.$emit('query-check', val);
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
        this.vaunchInput = this.autocomplete + (this.completeType == "command" ? " ": "");
      }
    },
    sendCommand(newTab:boolean=false) {
      this.$emit("command", this.vaunchInput.split(' '), newTab)
    },
    getAutocompleteFolder(input:string, folders:string[]):string {
      let completeText: string = ""
      let matches: string[] = [];
      for (let folder of folders) {
        if (folder.startsWith(input)) {
          matches.push(folder)
          // We've found at least one matching folder, so we can autocomplete
          this.completeType = "folder";
        }
      }
      // If there's only one potential match, append a slash
      if (matches.length == 1) return matches[0] + "/";
      if (matches.length > 0) completeText = this.getCommonStartString(matches);
      return completeText;
    },
    getAutocompleteFile(input:string, files:VaunchFile[], completeType:string = "file"):string {
      let completeText: string = ""
      let matches: string[] = [];
      let matchedFile:VaunchFile|undefined;
      for (let file of files) {
        for (let ailias of file.getNames()) {
          if (ailias.startsWith(input)) {
            matches.push(ailias)
            // Set the matched file, if ony one match was found
            // this can be used to set the prefix icon
            matchedFile = file;
            // return ailias;
          }
        }
      }

      if (matches.length == 1)  {
        this.completeType = completeType;
        this.$emit('set-input-icon', matchedFile);
        return matches[0];
      }
      if (matches.length > 0) {
        this.completeType = "partial";
        completeText = this.getCommonStartString(matches);
      }
      return completeText;
    },
    incrementFuzzy() {
      this.$emit('fuzzyIncrement', true)
    },
    decrementFuzzy() {
      this.$emit('fuzzyIncrement', false)
    },
    getCommonStartString(matches:string[]){
      let sortedMatches = matches.sort();
      // Get the first and second indx of the sorted match list
      let item1 = sortedMatches[0];
      let item2 = sortedMatches[sortedMatches.length-1];
      let maxLength = item1.length;
      let i= 0;
      // iterate over the charactres in both items, if they match continue
      // else return that substring
      while(i< maxLength && item1.charAt(i) === item2.charAt(i)) i++;
      return item1.substring(0, i);
    }
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
  padding: 0.2em 0.25em;
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
  margin-left: 1.5rem;
  width: 3.5rem;
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
      <i :class="['fa-'+prefixClass, 'fa-'+prefixName, 'input-icon', 'fa-3x']"></i>
    <div id="input-wrapper">
      <input
        id="vaunch-input"
        type="text"
        v-model="vaunchInput"
        @keydown.tab.prevent="complete"
        @keydown.enter.exact.prevent="sendCommand()"
        @keydown.enter.ctrl.exact.prevent="sendCommand(true)"
        @keydown.down.exact.prevent="incrementFuzzy"
        @keydown.up.exact.prevent="decrementFuzzy"
        @keydown.esc.exact.prevent="vaunchInput = ''"
        ref="inputBox"
      />
      <input id="vaunch-autocomplete" type="text" :value="autocomplete" />
    </div>
  </div>
</div>
</template>
