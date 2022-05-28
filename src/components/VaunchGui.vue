<script lang="ts">
import { defineComponent } from "vue";
import { useFolderStore } from "@/stores/folder";
import { useConfigStore } from "@/stores/config";
import VaunchGuiFile from "./VaunchGuiFile.vue";

export default defineComponent({
    name: "VaunchGui",
    setup() {
        // Load folders in to iterate over them and display in GUI if wanted
        const folders = useFolderStore()
        // Load config store to get Vaunch configuration options
        const config = useConfigStore();
        return {
            folders,
            config,
        };
    },
    methods: {
      passInput(input:string) {
        this.$emit('set-input', input)
      }
    },
    components: { VaunchGuiFile },
    emits: ['set-input']
});
</script>

<style>
#vaunch-folder-container {
  position: relative;
  display: flex;
  width: 95vw;
  height: 65vh;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1em;
  align-items: top;
  overflow-y: auto;
}

.vaunch-folder {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  min-width: 20%;
  max-width: 30%;
  width: auto;
  height: 45%;
}

.folder-title {
  position: relative;
  width: 100%;
  padding-left: 1em;
  font-size: 1.2rem;
  background-color: rgba(0, 0, 0, 0.1);
}
.file-container {
  display: flex;
  justify-content: center;
  padding: 1em;
  flex-wrap: wrap;
}

.folder-name {
  padding-left: 0.5rem;
}
</style>

<template>
<div v-if="folders.items.length > 0 && config.showGUI" id="vaunch-folder-container">
  <div v-for="folder in folders.items" :key="folder.name" class="vaunch-folder vaunch-window">
    <span class="folder-title">
      <i class="fa-solid fa-folder"></i>
      <span v-if="config.titleCase" class="folder-name">{{ folder.titleCase() }}</span>
      <span v-if="!config.titleCase" class="folder-name">{{ folder.name }}</span>
    </span>
    <div v-if="folder.getFiles().length > 0" class="file-container">
      <VaunchGuiFile v-on:set-input="passInput" v-for="file in folder.getFiles()" :file="file" :parent-folder-name="folder.name" />
    </div>
  </div>
</div>
</template>