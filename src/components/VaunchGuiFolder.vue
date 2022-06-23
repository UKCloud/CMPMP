<script setup lang="ts">
import { useConfigStore } from "@/stores/config";

import VaunchGuiFile from "./VaunchGuiFile.vue";
import type { VaunchUrlFile } from "@/models/VaunchUrlFile";
import { useSessionStore } from "@/stores/sessionState";

const config = useConfigStore();

const props = defineProps(["folder"]);
const emit = defineEmits(["showFileOption", "showFolderOption"]);

const passFileOption = (file: VaunchUrlFile, xPos:number, yPos:number, action:null|string=null) => {
  emit("showFileOption", file, xPos, yPos, action)
}

const toggleOptions = (event:any) => {
  emit('showFolderOption', props.folder, event.clientX, event.clientY);
}

const addFile = () => emit('showFolderOption', props.folder, 0, 0, "add");
const editFolder = () => emit('showFolderOption', props.folder, 0, 0, "edit");
const deleteFolder = () => emit('showFolderOption', props.folder, 0, 0, "delete");
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
  display: flex;
  background: v-bind("config.color.window");
}

.folder-title-name {
  flex: 1;
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
  <div class="vaunch-folder vaunch-window" @click.right.prevent.stop="toggleOptions($event)">
    <span class="folder-title">
      <div class="folder-title-name">
        <i :class="['fa-' + folder.iconClass, 'fa-' + folder.icon]"></i>
        <span v-if="config.titleCase">{{ folder.titleCase() }}</span>
        <span v-if="!config.titleCase">{{ folder.name }}</span>
      </div>
      <div class="mobile-only mobile-actions">
        <i class="fa-solid fa-plus" @click="addFile" />
        <i class="fa-solid fa-pencil" @click="editFolder" />
        <i class="fa-solid fa-trash" @click="deleteFolder" />
      </div>
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
