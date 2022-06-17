<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { commands } from "@/stores/command";
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import { useFolderStore } from "@/stores/folder";
import { useSessionStore } from "@/stores/sessionState";
import { useConfigStore } from "@/stores/config";

const folders = useFolderStore();
const sessionConfig = useSessionStore();
const config = useConfigStore();
const inputBox = ref();

defineProps(["prefixName", "prefixClass"]);
const emit = defineEmits(["command","fuzzy","fuzzyIncrement","set-input-icon","query-check"]);
const data = reactive({
  vaunchInput: "",
  autocomplete: "",
  isAutocompletePartial: true,
  traversingHistory: false,
});

onMounted(() => {
  (inputBox.value as HTMLInputElement).focus();
});


const getInput = () => sessionConfig.vaunchInput;
watch(getInput, (val: string) => {
  // If traversing history, ignore this input. Otherwise continue on and reset the history index
  if (data.traversingHistory) {
    data.traversingHistory = false;
    return;
  } else sessionConfig.historyIndex = -1;
  // Emit out what we're typing to fuzzy, to build a list of potential files this matches
  if (config.fuzzy) {
    emit("fuzzy", val.trim());
  }

  // Annoyingly if input overflows autocomplete falls apart, so just disable it after a while...
  if (val.length > 50) {
    data.autocomplete = "";
    return;
  }
  // If input is empty, reset the prefix icon
  if (val.length == 0) emit("set-input-icon", undefined);

  // Reset the type of autocompletion this.
  // Commands/files add a space to the end, while folders will not.
  let matches: string[] = [];
  let input = val.split(" ");

  // Get the current word that is being typed, to find an autocomplete for
  // Remove the last word, so it wont be considered in the autocomplete placeholder text
  let lastWord: string = input[input.length - 1];
  input.pop();

  // Set autocomplete to go up to before the half-typed word
  data.autocomplete = input.join(" ");

  // If there's at least one word left after popping the last word off, add a space
  if (input.length > 0) {
    data.autocomplete += " "; // Add extra space for the to-be-completed word
  }

  // Search through the valid commands to autocomplete this word with
  // Only do this on the first "word", as commands will always be the first word
  if (lastWord.length > 0 && input.length == 0) {
    let commandMatches: string[] = getAutocompleteFile(
      lastWord,
      commands
    );
    matches.push(...commandMatches);
  }

  // If command autocomplete did not find anything, search for folders/files
  if (lastWord.length > 0) {
    // If we haven't found anything yet, the last word has a '/' (is a folder path) and a filename is being typed
    if (lastWord.includes("/")) {
      let pathSplit = lastWord.split("/");
      let folderName = pathSplit[0];
      let fileName = pathSplit[1];
      if (fileName.length > 0) {
        // Search for a file, using fileName as a semi complete filename
        let folder: VaunchFolder = folders.getFolderByName(folderName);
        if (folder) {
          let fileMatches: string[] = getAutocompleteFile(
            fileName,
            folder.getFiles(),
            false
          ).map((file:any) => folderName + "/" + file);
          matches.push(...fileMatches);
        }
      }
    } else {
      // If on the second+ word, check folder names/files to autocomplete
      let folderMatches: string[] = getAutocompleteFolder(
        lastWord,
        folders.folderNames
      );
      matches.push(...folderMatches);
    }
  }

  // If the input contains a : check if the current input is a .qry file
  if (val.includes(":")) {
    emit("query-check", val);
  }

  if (matches.length == 1) {
    data.isAutocompletePartial = false;
    data.autocomplete += matches[0];
  } else if (matches.length > 1) {
    // If there were more than one match, this is a partial autocomplete,
    // and more text should be added to this word
    data.isAutocompletePartial = true;
    data.autocomplete += getCommonStartString(matches);
  } else {
    // // If no matches were found, set the autocomplete text to the current input
    data.isAutocompletePartial = false;
    data.autocomplete = val;
  }
  // Check if the final input matches a file, if it does, set the icon to it
  let file = folders.getFileByPath(val.trim());
  if (file) emit("set-input-icon", file);
})

const complete = () => {
  // Only complete if there is something to complete
  if (data.autocomplete.length > sessionConfig.vaunchInput.length) {
    sessionConfig.vaunchInput = data.autocomplete + (data.isAutocompletePartial || data.autocomplete.endsWith("/") ? "" : " ");
  }
}

const sendCommand = (newTab = false) => {
  let trimmedInput = sessionConfig.vaunchInput.trim();
  emit("command", trimmedInput.split(" "), newTab);
}

const getAutocompleteFolder = (input: string, folders: string[]) => {
  let matches: string[] = [];
  for (let folder of folders) {
    if (folder.startsWith(input)) {
      matches.push(folder);
    }
  }
  // If there's only one potential match, append a slash and return
  if (matches.length == 1) return [matches[0] + "/"];
  return matches;
}

const getAutocompleteFile = ( input: string, files: VaunchFile[], includeAiliases = true) => {
  let matches: string[] = [];
  for (let file of files) {
    if (includeAiliases) {
      for (let alias of file.getNames()) {
        if (alias.startsWith(input)) matches.push(alias);
      }
    } else if (file.fileName.startsWith(input)) matches.push(file.fileName);
  }
  return matches;
}

const downKeyAction = () => {
  // If current input is either blank, or the same as what the current history entry is, go to the previous history entry
  let currentHistoryEntry: string =
    sessionConfig.history[sessionConfig.historyIndex];
  if (
    (sessionConfig.vaunchInput == "" || sessionConfig.vaunchInput == currentHistoryEntry) &&
    sessionConfig.historyIndex != -1
  ) {
    sessionConfig.historyIndex--;
    data.traversingHistory = true;
    if (sessionConfig.historyIndex == -1) {
      sessionConfig.vaunchInput = "";
    } else {
      let wantedEntry =
        sessionConfig.history[sessionConfig.historyIndex];
      sessionConfig.vaunchInput = wantedEntry;
    }
  }
  emit("fuzzyIncrement", true);
}

const upKeyAction = () => {
  // If current input is either blank, or the same as what the current history entry is, go to the next history entry
  let currentHistoryEntry: string =
    sessionConfig.history[sessionConfig.historyIndex];
  if (
    (sessionConfig.vaunchInput == "" || sessionConfig.vaunchInput == currentHistoryEntry) &&
    sessionConfig.historyIndex < sessionConfig.history.length - 1
  ) {
    sessionConfig.historyIndex++;
    data.traversingHistory = true;
    let wantedEntry =
      sessionConfig.history[sessionConfig.historyIndex];
    sessionConfig.vaunchInput = wantedEntry;
  }
  emit("fuzzyIncrement", false);
}

const getCommonStartString =(matches: string[]) => {
  let sortedMatches = matches.sort();
  // Get the first and second indx of the sorted match list
  let item1 = sortedMatches[0];
  let item2 = sortedMatches[sortedMatches.length - 1];
  let maxLength = item1.length;
  let i = 0;
  // iterate over the characters in both items, if they match continue
  // else return that substring
  while (i < maxLength && item1.charAt(i) === item2.charAt(i)) i++;
  return item1.substring(0, i);
}

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
  color: v-bind("config.color.autocomplete");
}
#input-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  backdrop-filter: blur(10px);
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
  #vaunch-autocomplete {
    display: none;
  }
}
</style>

<template>
  <div id="vaunch-input-container">
    <div class="vaunch-window" id="input-inner">
      <i
        :class="[
          'fa-' + prefixClass,
          'fa-' + prefixName,
          'input-icon',
          'fa-3x',
        ]"
      ></i>
      <div id="input-wrapper">
        <input
          id="vaunch-input"
          type="text"
          autocapitalize="none"
          autocomplete="off"
          enterkeyhint="go"
          v-model="sessionConfig.vaunchInput"
          @keydown.tab.prevent="complete"
          @keydown.enter.exact.prevent="sendCommand()"
          @keydown.enter.ctrl.exact.prevent="sendCommand(true)"
          @keydown.down.prevent="downKeyAction"
          @keydown.up.prevent="upKeyAction"
          @keydown.esc.exact.prevent="sessionConfig.vaunchInput = ''"
          ref="inputBox"
        />
        <input
          disabled
          id="vaunch-autocomplete"
          type="text"
          :value="data.autocomplete"
        />
      </div>
    </div>
  </div>
</template>
