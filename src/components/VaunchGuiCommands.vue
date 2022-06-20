<script setup lang="ts">
import VaunchGuiCommand from "./VaunchGuiCommand.vue";
import { commands } from "@/stores/command";
import { useConfigStore } from "@/stores/config";
const config = useConfigStore();
</script>

<style scoped>
.folder-title {
  background: v-bind("config.color.window");
}
.vaunch-command-folder {
  display: flex;
  flex-direction: column;
  width: 20vw;
  max-width: 20vw;
  width: auto;
  height: 100%;
}
</style>

<template>
  <div class="vaunch-command-folder vaunch-window">
    <span class="folder-title">
      <i class="fa-solid fa-cog"></i>
      <span>Commands</span>
    </span>
    <div class="file-container commands-container">
      <VaunchGuiCommand
        v-for="file in commands"
        :file="file"
        :key="file.fileName"
        :parent-folder-name="'commands'"
      />
    </div>
  </div>
</template>
