<script setup lang="ts">
import { useConfigStore } from "@/stores/config";
import VaunchTooltip from "./VaunchTooltip.vue";
import { reactive, ref } from "vue";
import type { VaunchCommand } from "@/models/VaunchCommand";
import { handleResponse } from "@/utilities/response";

const config = useConfigStore();
const data = reactive({
  commandInput:""
});

const props = defineProps(["file", "parentFolderName", "isFuzzy"]);

const commandInputBox = ref();
const hasArgs = props.file.hasArgs();

const execute = (file:VaunchCommand, args:string[]) => {
  file.execute(args).then((response) => {
    handleResponse(response);
  })
  // Clear the input for this command after executing
  if (hasArgs) {
    (commandInputBox.value as HTMLInputElement).value = "";
  }
}

const handleClick = (file: VaunchCommand, args: string[]) => {
  if (hasArgs) {
    (commandInputBox.value as HTMLInputElement).focus();
  } else {
    execute(file, args);
  }
}

</script>

<style scoped>

.command-file {
  min-width: 95%;
  max-width: 95%;
}

.file:hover {
  cursor: pointer;
  background-color: v-bind("config.color.highlight");
}

.command-inner {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-items: center;
  width: 100%;
}

.command-name {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.file-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.command-input-container {
  width: 100%;
  flex: 1;
}

.command-input {
  border: none;
  background: none;
  font-size: 1rem;
  width: 100%;
  flex: 1;
  border-bottom: solid thin v-bind("config.color.text") !important;
  color: v-bind("config.color.text");
}
.command-input:focus {
  outline: none;
}
</style>

<template>
  <div
    :key="file.fileName"
    class="file command-file vaunch-window"
    @click.exact="handleClick(file, [])"
    :id="parentFolderName + '-' + file.getIdSafeName()"
  >
    <div class="command-inner">
      <i class="fa-solid fa-chevron-right file-icon"></i>
      <span class="command-name">{{ file.titleCase() }}</span>
      <input
        v-if="hasArgs"
        class="command-input"
        @keydown.enter.prevent="execute(file, data.commandInput.split(' '))"
        v-model="data.commandInput"
        type="text"
        ref="commandInputBox"
      />
    </div>
    <VaunchTooltip
      v-if="file.getDescription().length > 0"
      :tip-for="'commands-' + file.getIdSafeName()"
      :tip-file="file"
    />
  </div>
</template>
