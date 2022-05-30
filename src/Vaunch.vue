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

export default defineComponent({
  name: "Vaunch",
  components: {
    VaunchInput,
    VaunchGuiFolder,
    VaunchFuzzy,
    VaunchGuiCommands
},
  setup() {
    // Load config store for Vaunch configuration options, e/.g background image
    const config = useConfigStore();
    // Load folders in to iterate over them and display in GUI if wanted
    const folders = useFolderStore()
    const fuzzyFiles = useFuzzyStore();
    return {
      commands,
      config,
      fuzzyFiles,
      folders,
      prefixName: config.prefix.name,
      prefixClass: config.prefix.class,
    };
  },
  methods: {
    executeCommand(commandArgs: string[]) {
      let operator = commandArgs[0];
      commandArgs.shift();

      // Check if we're running a command, if we find it in commands, execute it
       for (let command of commands) {
        if (command.getNames().includes(operator)) {
          return command.execute(commandArgs)
        }
      };

      // From here on, the folder store is needed
      const folders = useFolderStore()
      // If no command was found, could it be a qry file?
      let file = this.findQryFile(operator)
      if (file) {
        // If the first parmeter was supplied in the same 'word' as the prefix, unshift
        // it into the commandArgs. This deals with a multi ${} file, executed like:
        // prefix:firstArg secondArg
        if (operator.split(':')[1]) commandArgs.unshift(operator.split(':')[1])
        return file.execute(commandArgs);
      }

      // If no command was found, let's check if we're running a file
      if (operator.includes("/")) {
        let file:VaunchFile = folders.getFileByPath(operator)
        if (file) {
          return file.execute(commandArgs);
        }
      }

      // If a fuzzy file has been chosen, let's execute that
      if (this.fuzzyFiles.items.length > 0) {
        this.fuzzyFiles.items[this.fuzzyFiles.index].execute(commandArgs)
      }

      // Failing everything else, pass the input to the default file
      // Push the first word back into commandArgs, as there is no operator
      let defaultFile = this.config.defaultFile;
      if (defaultFile) {
        commandArgs.unshift(operator)
  
        let file:VaunchFile = folders.getFileByPath(defaultFile)
        if (file) {
          return file.execute(commandArgs);
        }
      }
    },
    findQryFile(operator:string):VaunchFile|undefined {
      if (operator.includes(':')) {
        let queryPrefix = operator.split(':')[0]

        const folders = useFolderStore();
        for (let folder of (folders.items as VaunchFolder[])) {
          for (let file of folder.getFiles()) {
            if (file.constructor.name == "VaunchQuery") {
              if (file.getNames().includes(queryPrefix)) {
                return file;
              }
            }
          }
        }
      }
      return undefined
    },
    fuzzy(input:string) {
      if (input.length > 0) {
        // If fuzzy is enabled, search for files matching
        const folders = useFolderStore();
        let matches:VaunchFile[] = folders.findLinkFiles(input);
        this.fuzzyFiles.setFuzzy(this.sortByHits(matches))
        this.setInputIcon(matches[0]);
      } else {
        this.fuzzyFiles.clear();
      }
      this.fuzzyFiles.index = 0;
    },
    sortByHits(files:VaunchFile[]) {
      return files.sort((a, b) => (a.hits < b.hits) ? 1 : -1)
    },
    passInput(input:string) {
      (this.$refs['vaunchInput'] as typeof VaunchInput).setInput(input);
    },
    updateFuzzyIndex(increment:boolean) {
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
    setIconIfQuery(input:string) {
      console.log("looking");
      let file = this.findQryFile(input);
      console.log(file);
      if (file) {
        this.setInputIcon(file);
      }
    },
    setInputIcon(file:VaunchFile|undefined) {
      // Set the prefix icon in VaunchInput. If nothing is passed
      // the icon will stay the same if there are fuzzy files in case
      // VaunchInput thinks it should be reset but fuzzy matches shows otherwise
      if (file) {
        this.prefixName = file.icon
        this.prefixClass = file.iconClass
      } else if (this.fuzzyFiles.items.length == 0 && this.config.fuzzy) {
        this.prefixName = this.config.prefix.name;
        this.prefixClass = this.config.prefix.class;
      }
    }
  },
});
</script>

<style>
@import "@/assets/fontawesome/css/all.css";
@import "@/assets/base.css";

/* Set vaunch-wide colors, defaults to --color-vaunch-window */
.vaunch-window {
  border-radius: 5px;
  background: v-bind('config.color.window');
  color:  v-bind('config.color.text');
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
#vaunch-autocomplete {
  color: v-bind('config.color.autocomplete');
}
::selection {
  background: v-bind('config.color.highlight'); /* WebKit/Blink Browsers */
}
.folder-title {
  background: v-bind('config.color.window');
  filter: contrast(1);
}
.commandInput {
  border-bottom: solid thin v-bind('config.color.text') !important;
}

/* Scrollbar themeing */
::-webkit-scrollbar {
  width: 3px;
}
::-webkit-scrollbar-thumb {
  background: v-bind('config.color.text'); 
  border-radius: 2px;
}
@-moz-document url-prefix() {
  main {
    scrollbar-color: v-bind('config.color.text') v-bind('config.color.window');
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
    ref="vaunchInput"/>

    <div id="bottom-half">
      <VaunchFuzzy v-if="fuzzyFiles.items.length > 0" :fuzzy-matches="fuzzyFiles.items" :current-index="fuzzyFiles.index"/>

      <div v-if="config.showGUI" id="commands-folders-container">
        <div v-if="config.showCommands" id="commands-container">
          <VaunchGuiCommands />
        </div>

        <div v-if="folders.items.length > 0 && config.showGUI" id="vaunch-folder-container">
            <VaunchGuiFolder v-for="folder in folders.items" v-on:set-input="passInput" :folder="folder"/>
        </div>
      </div>

    </div>

  </main>
</template>
