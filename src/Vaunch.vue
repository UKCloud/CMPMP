<script lang="ts">
import VaunchInput from "@/components/VaunchInput.vue";
import VaunchGui from "./components/VaunchGui.vue";

import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import type { VaunchFolder } from "./models/VaunchFolder";
import type { VaunchFile } from "./models/VaunchFile";


export default {
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
      commands.forEach((command) => {
        if (command.getNames().includes(operator)) {
          command.execute(commandArgs)
          return
        }
      });

      // If no command was found, let's check if we're running a file
      if (operator.includes("/")) {
        const folders = useFolderStore()
        let path:string[] = operator.split("/");
        let folder: VaunchFolder = folders.getFolderByName(path[0])
        if (folder) {
          let file: VaunchFile|undefined = folder.getFile(path[1])
          if (file) {
            file.execute(commandArgs)
            return
          }
        }
      }
    }
  },
};
</script>

<style>
@import "@/assets/base.css";
</style>

<template>
  <main :style="{ 'background-image': 'url(' + config.background + ')' }">
    <VaunchInput v-on:command="executeCommand" />
    <VaunchGui />
  </main>
</template>
