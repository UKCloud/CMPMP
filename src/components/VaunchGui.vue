<script lang="ts">
import { defineComponent } from "vue";
import { useFolderStore } from "@/stores/folder";
import { useConfigStore } from "@/stores/config";


export default defineComponent({
  name: "VaunchGui",
  setup() {
    // Load folders in to iterate over them and display in GUI if wanted
    const folders = useFolderStore();
    // Load config store to get Vaunch configuration options
    const config = useConfigStore();
    return {
      folders,
      config,
    }
  }
});
</script>

<style scoped>
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
  width: auto;
  height: 45%;
}

.folder-title {
  position: relative;
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  background-color: rgba(0, 0, 0, 0.1);
  /* border-radius: 5px; */
  border-radius: 5px 5px 0 0 ;
}
</style>

<template>
<div v-if="folders.items.length > 0 && config.showGUI" id="vaunch-folder-container">
  <div v-for="folder in folders.items" :key="folder.name" class="vaunch-folder vaunch-window">
    <span class="folder-title">{{ folder.name }}</span>
    <div v-if="folder.getFiles().length > 0">
      <div v-for="file in folder.getFiles()" :key="file.fileName">
        {{ file.displayName() }}
      </div>
    </div>
  </div>
</div>
</template>