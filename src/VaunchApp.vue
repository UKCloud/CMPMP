<script setup lang="ts">
import VaunchInput from "@/components/VaunchInput.vue";
import VaunchGuiFolder from "./components/VaunchGuiFolder.vue";

import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
import { useDashboardStore } from "@/stores/dashboard";
import { VaunchFolder } from "./models/VaunchFolder";
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
import VaunchFolderOption from "./components/VaunchFolderOption.vue";
import VaunchAppOption from "./components/VaunchAppOption.vue";
import type { VaunchUrlFile } from "./models/VaunchUrlFile";
import { handleResponse } from "./utilities/response";
import Login from "./components/Login.vue";
import type { Dashboard } from "./models/Dashboard";


const config = useConfigStore();
const dashboardStore = useDashboardStore();
const fuzzyFiles = useFuzzyStore();
const sessionConfig = useSessionStore();

const vaunchInput = ref();
const folderOption = ref();

let optionFile:VaunchFile = reactive(new VaunchLink("default", "default"));
let optionFolder:VaunchFolder = reactive(new VaunchFolder("default", ""));
const data = reactive({
  optionFile,
  optionFolder,
  optionX: 0,
  optionY: 0,
  guiContext: "",
  prefixName: config.prefix.name,
  prefixClass: config.prefix.class,
});

const executeCommand = (commandArgs: string[], newTab = false) => {
  const currentDashboard:Dashboard = dashboardStore.currentDashboard;

  // Before all else, push this command to Vaunch's history
  sessionConfig.history.unshift(commandArgs.join(" "));
  let operator = commandArgs[0];
  commandArgs.shift();

  // Check if we're running a command, if we find it in commands, execute it
  for (let command of commands) {
    if (command.getNames().includes(operator)) {
      return command.execute(commandArgs).then(response => {
        handleResponse(response);
      })
    }
  }

  // If a fuzzy file has been chosen, let's execute that
  if (fuzzyFiles.items.length > 0 && config.fuzzy) {
    // Also shift this entry off the history, in case it was a qry file
    sessionConfig.history.shift();
    const fuzzyFile = fuzzyFiles.items[fuzzyFiles.index];
    return fuzzyFile.execute(commandArgs).then((response) => {
      handleResponse(response);
    })
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
    return file.execute(commandArgs).then((response) => {
      return handleResponse(response);
    })
  }

  // If no command was found, let's check if we're running a file
  if (operator.includes("/")) {
    let file: VaunchFile|undefined = currentDashboard.getFileByPath(operator);
    if (file) {
      return file.execute(commandArgs).then((response) => {
        return handleResponse(response);
      })
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
    let file: VaunchFile | undefined = currentDashboard.getFileByPath(defaultFile);
    // If the default file is not a filepath, check if it's just the prefix
    if (!file) {
      file = findQryFile(defaultFile);
    }
    // If a default file was found, execute it with the commandArgs, returning the response to vaunchInput
    if (file) {
      return file.execute(commandArgs).then((response) => {
        handleResponse(response);
      });
    }
  }
  // If everything fails, i.e no default search, just clear the input
  sessionConfig.vaunchInput = "";
  let noCommandFoundResp:VaunchResponse = {
    type: ResponseType.Error,
    message: `Command '${operator}' not found.`,
    name: "execute",
    filetype: "VaunchSystem"
  }
  return handleResponse(noCommandFoundResp);
}

const findQryFile = (operator: string): VaunchFile | undefined => {
  const currentDashboard:Dashboard = dashboardStore.currentDashboard;
  if (operator.includes(":")) {
    operator = operator.split(":")[0];
  }
  for (let folder of currentDashboard.getItems()) {
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
    const dashboards = useDashboardStore();
    let matches: VaunchFile[] = [];
    dashboards.allDashboards.forEach((dashboard:Dashboard) => {
       matches.push(...dashboard.findFiles(input));
    });
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
  // After updating the fuzzy index, set the input prompt icon to the selected file's icon
  // Otherwise, set it to the default
  if (fuzzyFiles.items[fuzzyFiles.index]) {
    setInputIcon(fuzzyFiles.items[fuzzyFiles.index]);
  } else {
    setInputIcon(undefined);
  }
}

const setIconIfQuery = (input: string) => {
  // Checks if the input string matches a VaunchQuery prefix,
  // and set's the input prompts' icon to a matching file
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

// TODO: Implement a way to improve opening/closing of context menus.
// currently these functions are called through a series of emits from child components.
// this should be able to be re-written to use an exported function, similar to handleResponse()
const showFileOption = (file:VaunchUrlFile, xPos:number, yPos:number, action:string|null=null) => {
  // Opens a file's context menu. Sets the target file to display options for, and set the position
  // on screen for the component
  data.optionFile = file;
  data.optionX = xPos;
  data.optionY = yPos;
  if (file.parent) data.guiContext = file.parent.context;
  if (action) sessionConfig.action = action;
  // TODO: this could be improved, only having one context menu component which can adapt its content
  // rather than the file context menu closing all other context menu types
  sessionConfig.showFolderOptions = false;
  sessionConfig.showAppOptions = false;
  sessionConfig.showFileOptions = true;
}
const showFolderOption = (folder:VaunchFolder, xPos:number, yPos:number, action:string|null=null) => {
   // Opens a folder's context menu, closing any other open context menu
  data.optionFolder = folder;
  data.optionX = xPos;
  data.optionY = yPos;
  data.guiContext= folder.context;
  if (action) sessionConfig.action = action;
  sessionConfig.showFileOptions = false;
  sessionConfig.showAppOptions = false;
  sessionConfig.showFolderOptions = true;
}
const showAppOption = (xPos:number, yPos:number, action:string|null=null, context:string|null=null) => {
  // Opens the main Vaunch context menu, closing any other open context menu
  data.optionX = xPos;
  data.optionY = yPos;
  if (action) sessionConfig.action = action;
  if (context) data.guiContext = context;
  sessionConfig.showFileOptions = false;
  sessionConfig.showFolderOptions = false;
  sessionConfig.showAppOptions = true;
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

#option-buttons-container {
  width: 100vw;
}

.app-option-buttons {
  width: 100%;
  height: 2.5rem;
  border-radius: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-top: solid thin rgba(0, 0, 0, 0.25);
  margin-top: 1rem;
}

.option-icon {
  padding-right: 0.5em;
  width: 1.5rem;
}

.app-option {
  height: 100%;
  background: v-bind("config.color.window");
  border-left: solid thin rgba(0, 0, 0, 0.25);
  border-right: solid thin rgba(0, 0, 0, 0.25);
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
  transition: background-color 0.15s;
}

.app-option:hover {
  background: v-bind("config.color.highlight");
  cursor: pointer;
}

.dashboard {
  width: 100%;
}

.dashboard-container {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
}

.dashboard-heading {
  margin: 0 0.75rem;
  font-size: 1.2rem;
  padding: 0 0.75rem;
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
  <main id="main-container" :style="{ 'background-image': 'url(' + config.background + ')' }">
    <Login :context="dashboardStore.context" />
    <VaunchInput
      v-on:command="executeCommand"
      v-on:fuzzy="fuzzy"
      v-on:fuzzy-increment="updateFuzzyIndex"
      v-on:set-input-icon="setInputIcon"
      v-on:query-check="setIconIfQuery"
      :prefix-name="data.prefixName"
      :prefix-class="data.prefixClass"
      ref="vaunchInput"
      v-if=sessionConfig.email
    />

    <VaunchGuiResponse
      v-if="sessionConfig.showResponse"
      :response="sessionConfig.currentResponse"
    />

    <div id="bottom-half" v-if=sessionConfig.email>
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
          v-if="config.showGUI"
          id="vaunch-folder-container"
        >

        <div class="dashboard" v-for="dashboard in (dashboardStore.allDashboards as Dashboard[])"
          :key="dashboard.name"
          @click.right.prevent="showAppOption($event.clientX, $event.clientY, null, dashboard.name)">
          <div class="vaunch-window dashboard-heading">
            <i :class="['fa-solid', 'fa-bars-staggered']"></i>
            {{dashboard.name}}
          </div>
          <div class="dashboard-container" v-if="dashboard.rawFolders.size > 0">
  
            <VaunchGuiFolder
              v-for="folder in dashboard.sortedItems()"
              :key="folder.name"
              v-on:show-file-option="showFileOption"
              v-on:show-folder-option="showFolderOption"
              :folder="folder"
            />
          </div>
        </div>

        </div>
      </div>
      <div class="mobile-only" id="option-buttons-container">
        <div class="app-option-buttons">
          <div class="app-option" @click="showAppOption(0, 0, 'edit')">
            <span><i class="fa-solid fa-pencil option-icon" />Vaunch Settings</span>
          </div>
          <div class="app-option" @click="showAppOption(0, 0, 'add')">
            <span><i class="fa-solid fa-plus option-icon" />Add Folder</span>
          </div>
        </div>
      </div>
    </div>

    <VaunchMan v-if="sessionConfig.showHelp" :commands="commands" />

    <!-- Context menu components are at the app root to ensure there will be only one open at any one time -->
    <VaunchFileOption v-if="sessionConfig.showFileOptions" :context="data.guiContext" :file="data.optionFile" :x-pos="data.optionX" :y-pos="data.optionY"/>
    <VaunchFolderOption ref="folderOption" v-if="sessionConfig.showFolderOptions" :folder="data.optionFolder" :context="data.guiContext" :x-pos="data.optionX" :y-pos="data.optionY" />
    <VaunchAppOption v-if="sessionConfig.showAppOptions" :x-pos="data.optionX" :y-pos="data.optionY" :context="data.guiContext"/>
  </main>
</template>


