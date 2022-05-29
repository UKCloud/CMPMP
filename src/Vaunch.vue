<script lang="ts">
import VaunchInput from "@/components/VaunchInput.vue";
import VaunchGui from "./components/VaunchGui.vue";

import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import type { VaunchFolder } from "./models/VaunchFolder";
import type { VaunchFile } from "./models/VaunchFile";
import { defineComponent } from "vue";


export default defineComponent({
  name: "Vaunch",
  components: {
    VaunchInput,
    VaunchGui
},
  setup() {
    // Load config store for Vaunch configuration options, e/.g background image
    const config = useConfigStore();
    return {
      commands,
      config,
    };
  },
  methods: {
    executeCommand(commandArgs: string[]) {
      let operator = commandArgs[0];
      commandArgs.shift();

      // Check if we're running a command, if we find it in commands, execute it
       for (let command of commands) {
        if (command.getNames().includes(operator)) {
          command.execute(commandArgs)
          return
        }
      };

      // If no command was found, could it be a qry file?
      if (operator.includes(':')) {
        let queryPrefixSplit = operator.split(':');
        let queryPrefix = queryPrefixSplit[0]
        // If the first parmeter was supplied in the same 'word' as the prefix, unshift
        // it onto the commandArgs. This deals with a multi ${} file, executed like:
        // prefix:firstArg secondArg
        if (queryPrefixSplit[1]) commandArgs.unshift(queryPrefixSplit[1])

        const folders = useFolderStore();
        for (let folder of (folders.items as VaunchFolder[])) {
          for (let file of folder.getFiles()) {
            if (file.constructor.name == "VaunchQuery") {
              if (file.getNames().includes(queryPrefix)) {
                file.execute(commandArgs);
                return
              }
            }
          }
        }
      }

      // If no command was found, let's check if we're running a file
      if (operator.includes("/")) {
        const folders = useFolderStore()
        let file:VaunchFile = folders.getFileByPath(operator)
        if (file) {
          file.execute(commandArgs);
          return
        }
      }

      // Failing everything else, pass the input to the default file
      // Push the first word back into commandArgs, as there is no operator
      let defaultFile = this.config.defaultFile;
      if (defaultFile) {
        commandArgs.unshift(operator)
        const folders = useFolderStore()
  
        let file:VaunchFile = folders.getFileByPath(defaultFile)
        if (file) {
          file.execute(commandArgs);
          return
        }
      }
    },
    passInput(input:string) {
      (this.$refs['vaunchInput'] as typeof VaunchInput).setInput(input);
    }
  },
});
</script>

<style>
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

main {
  display: flex;
  /* Horizontal ailgnment */
  align-items: center;
  
  /* Vertical alignment */
  justify-content: space-between;
  height: 100vh;
  flex-flow: column;
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
    <VaunchInput v-on:command="executeCommand" ref="vaunchInput"/>
    <VaunchGui v-on:set-input="passInput"/>
  </main>
</template>
