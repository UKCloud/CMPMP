<script setup lang="ts">
import VaunchInput from "@/components/VaunchInput.vue";
import VaunchGuiFolder from "./components/VaunchGuiFolder.vue";

import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import type { VaunchFolder } from "./models/VaunchFolder";
import type { VaunchFile } from "./models/VaunchFile";
import { reactive, ref } from "vue";
import { useFuzzyStore } from "./stores/fuzzy";
import VaunchFuzzy from "./components/VaunchFuzzy.vue";
import VaunchGuiCommands from "./components/VaunchGuiCommands.vue";
import VaunchMan from "./components/VaunchMan.vue";
import { VaunchLink } from "./models/VaunchLink";

import { useSessionStore } from "@/stores/sessionState";
import type { VaunchResponse } from "./models/VaunchResponse";
import { ResponseType } from "./models/VaunchResponse";
import VaunchGuiResponse from "./components/VaunchGuiResponse.vue";
import VaunchFileOption from "./components/VaunchFileOption.vue";
import type { VaunchUrlFile } from "./models/VaunchUrlFile";

const config = useConfigStore();
const folders = useFolderStore();
const fuzzyFiles = useFuzzyStore();
const sessionConfig = useSessionStore();

const vaunchInput = ref();

let optionFile:VaunchFile = reactive(new VaunchLink("default", "default"));
const data = reactive({
  optionFile,
  optionX: 0,
  optionY: 0,
  showOptions: false,
  prefixName: config.prefix.name,
  prefixClass: config.prefix.class,
  currentResponse: {
    type: ResponseType.Info,
    message: "Vaunch Initialised",
    filetype: "VaunchSystem",
    name: "execute",
  }
});

const executeCommand = (commandArgs: string[], newTab = false) => {
  // Before all else, push this command to Vaunch's history
  sessionConfig.history.unshift(commandArgs.join(" "));
  let operator = commandArgs[0];
  commandArgs.shift();

  // Check if we're running a command, if we find it in commands, execute it
  for (let command of commands) {
    if (command.getNames().includes(operator)) {
      return handleResponse(command.execute(commandArgs));
    }
  }

  // If a fuzzy file has been chosen, let's execute that
  if (fuzzyFiles.items.length > 0 && config.fuzzy) {
    // Also shift this entry off the history, in case it was a qry file
    sessionConfig.history.shift();
    let response =
      fuzzyFiles.items[fuzzyFiles.index].execute(commandArgs);
    return handleResponse(response);
  }

  // If ctrl was held, append _black to commandArgs
  if (newTab) commandArgs.push("_blank");

  // If no command was found, could it be a qry file?
  let file = findQryFile(operator);
  if (file) {
    // If the first parameter was supplied in the same 'word' as the prefix, unshift
    // it into the commandArgs. This deals with a multi ${} file, executed like:
    // prefix:firstArg secondArg
    if (operator.split(":")[1]) commandArgs.unshift(operator.split(":")[1]);
    return handleResponse(file.execute(commandArgs));
  }

  // If no command was found, let's check if we're running a file
  if (operator.includes("/")) {
    let file: VaunchFile = folders.getFileByPath(operator);
    if (file) {
      return handleResponse(file.execute(commandArgs));
    }
  }

  // If the input is a valid URL, navigate to it. Create a temporary VaunchLink with the operator and commandArgs
  // then attempt to run the file. If it isn't a valid URL nothing will happen, if it is, the url is navigated to.
  let urlValue: string = [operator, ...commandArgs].join(" ");
  let tempLink: VaunchLink = new VaunchLink("temp", urlValue);
  if (tempLink.hasValidURL()) {
    return tempLink.execute([]);
  }

  // Failing everything else, pass the input to the default file
  // Push the first word back into commandArgs, as there is no operator
  let defaultFile: string = config.defaultFile;
  if (defaultFile) {
    commandArgs.unshift(operator);
    let file: VaunchFile | undefined = folders.getFileByPath(defaultFile);
    // If the default file is not a filepath, check if it's just the prefix
    if (!file) {
      file = findQryFile(defaultFile);
    }
    // If a default file was found, execute it with the commandArgs, returning the response to vaunchInput
    if (file) {
      return handleResponse(file.execute(commandArgs));
    }
  }
  // If everything fails, i.e no default search, just clear the input
  passInput("");
  let noCommandFoundResp:VaunchResponse = {
    type: ResponseType.Error,
    message: `Command '${operator}' not found.`,
    name: "execute",
    filetype: "VaunchSystem"
  }
  return handleResponse(noCommandFoundResp);
}

const findQryFile = (operator: string): VaunchFile | undefined => {
  if (operator.includes(":")) {
    operator = operator.split(":")[0];
  }
  for (let folder of folders.items as VaunchFolder[]) {
    for (let file of folder.getFiles()) {
      if (file.filetype == "VaunchQuery") {
        if (file.getNames().includes(operator)) {
          return file;
        }
      }
    }
  }
  return undefined;
}

const fuzzy = (input: string) => {
  if (input.length > 0) {
    // If fuzzy is enabled, search for files matching
    const folders = useFolderStore();
    let matches: VaunchFile[] = folders.findFiles(input);
    fuzzyFiles.setFuzzy(sortByHits(matches));
    if (config.fuzzy) setInputIcon(matches[0]);
  } else {
    fuzzyFiles.clear();
  }
  fuzzyFiles.index = 0;
}

const sortByHits = (files: VaunchFile[]) => {
  return files.sort((a, b) => (a.hits < b.hits ? 1 : -1));
}

const handleResponse = (response: VaunchResponse) => {
  let newInputValue = "";

  switch (response.type) {
    case ResponseType.Error:
    case ResponseType.Info:
      sessionConfig.showResponse = true;
      break;
    case ResponseType.UpdateInput:
      newInputValue = response.message;
      sessionConfig.showResponse = false;
      break;
    default:
      sessionConfig.showResponse = false;
  }

  data.currentResponse = response;
  passInput(newInputValue);
}

const passInput = (input: string | void) => {
  let newInput: string = input ? input : "";
  sessionConfig.vaunchInput = newInput;
}

const updateFuzzyIndex = (increment: boolean) => {
  if (increment) {
    // If incrementing, check if index is in range
    // If not, loop back to index 0
    if (fuzzyFiles.index + 1 < fuzzyFiles.items.length) {
      fuzzyFiles.index++;
    } else fuzzyFiles.index = 0;
  } else {
    // If decrementing, check if index is in range
    // If not, loop to max index
    if (fuzzyFiles.index - 1 != -1) {
      fuzzyFiles.index--;
    } else fuzzyFiles.index = fuzzyFiles.items.length - 1;
  }
  if (fuzzyFiles.items[fuzzyFiles.index]) {
    setInputIcon(fuzzyFiles.items[fuzzyFiles.index]);
  } else {
    setInputIcon(undefined);
  }
}

const setIconIfQuery = (input: string) => {
  let file = findQryFile(input);
  if (file) {
    setInputIcon(file);
  }
}

const setInputIcon = (file: VaunchFile | undefined) =>  {
  // Set the prefix icon in VaunchInput. If nothing is passed
  // the icon will stay the same if there are fuzzy files in case
  // VaunchInput thinks it should be reset but fuzzy matches shows otherwise
  if (file) {
    data.prefixName = file.icon;
    data.prefixClass = file.iconClass;
  } else if (fuzzyFiles.items.length == 0) {
    data.prefixName = config.prefix.name;
    data.prefixClass = config.prefix.class;
  }
}

const showFileOption = (file:VaunchUrlFile, xPos:number, yPos:number) => {
  data.optionFile = file;
  data.optionX = xPos;
  data.optionY = yPos;
  data.showOptions = true;
}
</script>

<style>
@import "@/assets/fontawesome/css/all.css";
@import "@/assets/base.css";

/* Set vaunch-wide colors, defaults to --color-vaunch-window */
main {
  color: v-bind("config.color.text");
}

.vaunch-window {
  border-radius: 5px;
  background: v-bind("config.color.window");
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
::selection {
  background: v-bind("config.color.highlight");
}
.vaunch-solid-bg {
  background: v-bind("config.color.windowOpaque") !important;
}

/* Scrollbar theming */
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-thumb {
  background: v-bind("config.color.text");
  border-radius: 2px;
}
@-moz-document url-prefix() {
  main {
    scrollbar-color: v-bind("config.color.text") v-bind("config.color.window");
    scrollbar-width: thin;
  }
}
</style>

<template>
  <main :style="{ 'background-image': 'url(' + config.background + ')' }">
    <VaunchInput
      v-on:command="executeCommand"
      v-on:fuzzy="fuzzy"
      v-on:fuzzy-increment="updateFuzzyIndex"
      v-on:set-input-icon="setInputIcon"
      v-on:query-check="setIconIfQuery"
      :prefix-name="data.prefixName"
      :prefix-class="data.prefixClass"
      ref="vaunchInput"
    />

    <VaunchGuiResponse
      v-if="sessionConfig.showResponse"
      :response="data.currentResponse"
    />

    <div id="bottom-half">
      <VaunchFuzzy
        v-if="fuzzyFiles.items.length > 0 && config.fuzzy"
        :fuzzy-matches="fuzzyFiles.items"
        :current-index="fuzzyFiles.index"
      />

      <div v-if="config.showGUI" id="commands-folders-container">
        <div v-if="config.showCommands" id="commands-container">
          <VaunchGuiCommands />
        </div>

        <div
          v-if="folders.items.length > 0 && config.showGUI"
          id="vaunch-folder-container"
        >
          <VaunchGuiFolder
            v-for="folder in folders.sortedItems()"
            :key="folder.name"
            v-on:show-file-option="showFileOption"
            :folder="folder"
          />
        </div>
      </div>
    </div>

    <VaunchMan v-if="sessionConfig.showHelp" :commands="commands" />
    <VaunchFileOption v-if="data.showOptions" v-on:dismiss-self="data.showOptions = false;" 
    v-on:send-response="handleResponse"
    :file="data.optionFile" :x-pos="data.optionX" :y-pos="data.optionY"/>
  </main>
</template>
