<script setup lang="ts">
import { useConfigStore } from "@/stores/config";

import VaunchGuiFile from "./VaunchGuiFile.vue";
import type { VaunchUrlFile } from "@/models/VaunchUrlFile";
import { useSessionStore } from "@/stores/sessionState";

const config = useConfigStore();
const sessionConfig = useSessionStore();

const props = defineProps(["folder"]);
const emit = defineEmits(["showFileOption", "showFolderOption"]);

const passFileOption = (file: VaunchUrlFile, xPos:number, yPos:number) => {
  emit("showFileOption", file, xPos, yPos)
}

const toggleOptions = (event:any) => {
  if (!sessionConfig.showFileOptions) {
    emit('showFolderOption', props.folder, event.clientX, event.clientY)
  }
}
</script>

<style scoped>
.vaunch-folder {
  display: flex;
  flex-direction: column;
  margin: 0.75rem;
  min-width: 20vw;
  max-width: 30vw;
  height: 27.5vh;
}

.folder-title {
  background: v-bind("config.color.window");
}

/* Medium devices (tablets, 768px and up) */
@media (max-width: 768px) {
  .vaunch-folder {
    max-width: 40%;
    min-width: 40%;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (max-width: 576px) {
  .vaunch-folder {
    min-width: 100%;
    max-width: 100%;
  }
}
</style>

<template>
  <div class="vaunch-folder vaunch-window" @click.right.prevent="toggleOptions($event)">
    <span class="folder-title">
      <i :class="['fa-' + folder.iconClass, 'fa-' + folder.icon]"></i>
      <span v-if="config.titleCase">{{ folder.titleCase() }}</span>
      <span v-if="!config.titleCase">{{ folder.name }}</span>
    </span>
    <div v-if="folder.getFiles().length > 0" class="file-container">
      <VaunchGuiFile
        v-on:show-file-option="passFileOption"
        v-for="file in folder.sortFiles()"
        :file="file"
        :key="file.fileName"
        :parent-folder-name="folder.name"
      />
    </div>
  </div>
</template>
