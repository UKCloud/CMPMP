<script lang="ts">
import VaunchInput from "@/components/VaunchInput.vue";
import VaunchGuiFolder from "./components/VaunchGuiFolder.vue";

import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import type { VaunchFolder } from "./models/VaunchFolder";
import type { VaunchFile } from "./models/VaunchFile";
import { defineComponent } from "vue";
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

export default defineComponent({
  name: "VaunchApp",
  components: {
    VaunchInput,
    VaunchGuiFolder,
    VaunchFuzzy,
    VaunchGuiCommands,
    VaunchMan,
    VaunchGuiResponse,
    VaunchFileOption,
  },
  data() {
    const config = useConfigStore();
    const optionFile:any = null;
    return {
      optionFile,
      optionX:0,
      optionY:0,
      showOptions:false,
      prefixName: config.prefix.name,
      prefixClass: config.prefix.class,
    }
  },
  setup() {
    // Load config store for Vaunch configuration options, e/.g background image
    const config = useConfigStore();
    // Load folders in to iterate over them and display in GUI if wanted
    const folders = useFolderStore();
    const fuzzyFiles = useFuzzyStore();
    const sessionConfig = useSessionStore();
    let currentResponse: VaunchResponse = {
      type: ResponseType.Info,
      message: "Vaunch Initialised",
      filetype: "none",
      name: "vaunch",
    };
    return {
      commands,
      config,
      sessionConfig,
      fuzzyFiles,
      folders,
      currentResponse,
    };
  },
  methods: {
    executeCommand(commandArgs: string[], newTab = false) {
      // Before all else, push this command to Vaunch's history
      this.sessionConfig.history.unshift(commandArgs.join(" "));
      let operator = commandArgs[0];
      commandArgs.shift();

      // Check if we're running a command, if we find it in commands, execute it
      for (let command of commands) {
        if (command.getNames().includes(operator)) {
          return this.handleResponse(command.execute(commandArgs));
        }
      }

      // If a fuzzy file has been chosen, let's execute that
      if (this.fuzzyFiles.items.length > 0 && this.config.fuzzy) {
        // Also shift this entry off the history, in case it was a qry file
        this.sessionConfig.history.shift();
        let response =
          this.fuzzyFiles.items[this.fuzzyFiles.index].execute(commandArgs);
        return this.handleResponse(response);
      }

      // From here on, the folder store is needed
      const folders = useFolderStore();

      // If ctrl was held, append _black to commandArgs
      if (newTab) commandArgs.push("_blank");

      // If no command was found, could it be a qry file?
      let file = this.findQryFile(operator);
      if (file) {
        // If the first parmeter was supplied in the same 'word' as the prefix, unshift
        // it into the commandArgs. This deals with a multi ${} file, executed like:
        // prefix:firstArg secondArg
        if (operator.split(":")[1]) commandArgs.unshift(operator.split(":")[1]);
        return this.handleResponse(file.execute(commandArgs));
      }

      // If no command was found, let's check if we're running a file
      if (operator.includes("/")) {
        let file: VaunchFile = folders.getFileByPath(operator);
        if (file) {
          return this.handleResponse(file.execute(commandArgs));
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
      let defaultFile: string = this.config.defaultFile;
      if (defaultFile) {
        commandArgs.unshift(operator);
        let file: VaunchFile | undefined = folders.getFileByPath(defaultFile);
        // If the defaultfile is not a filepath, check if it's just the prefix
        if (!file) {
          file = this.findQryFile(defaultFile);
        }
        // If a default file was found, execute it with the commandArgs, returning the response to vaunchInput
        if (file) {
          return this.handleResponse(file.execute(commandArgs));
        }
      }
      // If everything fails, i.e no default search, just clear the input
      this.passInput("");
    },
    findQryFile(operator: string): VaunchFile | undefined {
      if (operator.includes(":")) {
        operator = operator.split(":")[0];
      }
      const folders = useFolderStore();
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
    },
    fuzzy(input: string) {
      if (input.length > 0) {
        // If fuzzy is enabled, search for files matching
        const folders = useFolderStore();
        let matches: VaunchFile[] = folders.findFiles(input);
        this.fuzzyFiles.setFuzzy(this.sortByHits(matches));
        if (this.config.fuzzy) this.setInputIcon(matches[0]);
      } else {
        this.fuzzyFiles.clear();
      }
      this.fuzzyFiles.index = 0;
    },
    sortByHits(files: VaunchFile[]) {
      return files.sort((a, b) => (a.hits < b.hits ? 1 : -1));
    },
    handleResponse(response: VaunchResponse) {
      let newInputValue = "";

      switch (response.type) {
        case ResponseType.Error:
        case ResponseType.Info:
          this.sessionConfig.showResponse = true;
          break;
        case ResponseType.UpdateInput:
          newInputValue = response.message;
          this.sessionConfig.showResponse = false;
          break;
        default:
          this.sessionConfig.showResponse = false;
      }

      this.currentResponse = response;
      this.passInput(newInputValue);
    },
    passInput(input: string | void) {
      let newInput: string = input ? input : "";
      (this.$refs["vaunchInput"] as typeof VaunchInput).setInput(newInput);
    },
    updateFuzzyIndex(increment: boolean) {
      if (increment) {
        // If incrementing, check if index is in range
        // If not, loop back to index 0
        if (this.fuzzyFiles.index + 1 < this.fuzzyFiles.items.length) {
          this.fuzzyFiles.index++;
        } else this.fuzzyFiles.index = 0;
      } else {
        // If decrementing, check if index is in range
        // If not, loop to max index
        if (this.fuzzyFiles.index - 1 != -1) {
          this.fuzzyFiles.index--;
        } else this.fuzzyFiles.index = this.fuzzyFiles.items.length - 1;
      }
      if (this.fuzzyFiles.items[this.fuzzyFiles.index]) {
        this.setInputIcon(this.fuzzyFiles.items[this.fuzzyFiles.index]);
      } else {
        this.setInputIcon(undefined);
      }
    },
    setIconIfQuery(input: string) {
      let file = this.findQryFile(input);
      if (file) {
        this.setInputIcon(file);
      }
    },
    setInputIcon(file: VaunchFile | undefined) {
      // Set the prefix icon in VaunchInput. If nothing is passed
      // the icon will stay the same if there are fuzzy files in case
      // VaunchInput thinks it should be reset but fuzzy matches shows otherwise
      if (file) {
        this.prefixName = file.icon;
        this.prefixClass = file.iconClass;
      } else if (this.fuzzyFiles.items.length == 0) {
        this.prefixName = this.config.prefix.name;
        this.prefixClass = this.config.prefix.class;
      }
    },
    showFileOption(file:VaunchUrlFile, xPos:number, yPos:number) {
      this.optionFile = file;
      this.optionX = xPos;
      this.optionY = yPos;
      this.showOptions = true;
    }
  },
});
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
#vaunch-autocomplete {
  color: v-bind("config.color.autocomplete");
}
::selection {
  background: v-bind("config.color.highlight"); /* WebKit/Blink Browsers */
}
.folder-title {
  background: v-bind("config.color.window");
}
.commandInput {
  border-bottom: solid thin v-bind("config.color.text") !important;
  color: v-bind("config.color.text");
}
.edit-input {
  border-bottom: solid thin v-bind("config.color.text") !important;
  color: v-bind("config.color.text");
}
.vaunch-solid-bg {
  background: v-bind("config.color.windowOpaque") !important;
}

/* Scrollbar themeing */
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
      :prefix-name="prefixName"
      :prefix-class="prefixClass"
      ref="vaunchInput"
    />

    <VaunchGuiResponse
      v-if="sessionConfig.showResponse"
      :response="currentResponse"
    />

    <div id="bottom-half">
      <VaunchFuzzy
        v-if="fuzzyFiles.items.length > 0 && config.fuzzy"
        :fuzzy-matches="fuzzyFiles.items"
        :current-index="fuzzyFiles.index"
        v-on:set-input="passInput"
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
            v-on:set-input="passInput"
            v-on:show-file-option="showFileOption"
            :folder="folder"
          />
        </div>
      </div>
    </div>

    <VaunchMan v-if="sessionConfig.showHelp" :commands="commands" />
    <VaunchFileOption v-if="showOptions" v-on:dismiss-self="showOptions = false;" 
    v-on:set-input="passInput"
    v-on:send-response="handleResponse"
    :file="optionFile" :x-pos="optionX" :y-pos="optionY"/>
  </main>
</template>
