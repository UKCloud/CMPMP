<script lang="ts">
import { VaunchFile } from "@/models/VaunchFile";
import { defineComponent } from "vue";
import VaunchGuiCommand from "./VaunchGuiCommand.vue";
import { commands } from "@/stores/command";

export default defineComponent({
  name: "VaunchGuiCommands",
  setup() {
    return {
      commands,
    };
  },
  components: {
    VaunchGuiCommand,
  },
});
</script>

<style scoped>
.vaunch-command-folder {
  display: flex;
  flex-direction: column;
  width: 20vw;
  max-width: 20vw;
  width: auto;
  height: 100%;
  backdrop-filter: unset !important;
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
        :parent-folder-name="'commands'"
      />
    </div>
  </div>
</template>
