<script lang="ts">
import VaunchInput from "@/components/VaunchInput.vue";
import VaunchGui from "./components/VaunchGui.vue";

import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";


export default {
  components: {
    VaunchInput,
    VaunchGui
},
  setup() {
    const config = useConfigStore();
    // load folders in
    useFolderStore();

    return {
      commands,
      config
    };
  },
  data() {
    return {
      autocompleteText: "",
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
        }
      })
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
