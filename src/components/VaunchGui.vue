<script lang="ts">
import { defineComponent } from "vue";
import { useFolderStore } from "@/stores/folder";
import { useConfigStore } from "@/stores/config";
import VaunchTooltip from "./VaunchTooltip.vue";

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
        };
    },
    components: { VaunchTooltip }
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
  padding-left: 1em;
  font-size: 1.2rem;
  background-color: rgba(0, 0, 0, 0.1);
}
.file-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding: 1em;
}

.file {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: auto;
  min-width: 30%;
  max-width: 40%;
  padding: 1em;
  box-shadow: none;
  transition: background-color 0.15s ease-in-out;
}

.file:hover {
  cursor: pointer;
  background-color: var(--color-vaunch-window-highlight);
  transition: background-color 0.15s ease-in-out;
}

.file-name, .folder-name {
  padding-left: 0.5rem;
}

</style>

<template>
<div v-if="folders.items.length > 0 && config.showGUI" id="vaunch-folder-container">
  <div v-for="folder in folders.items" :key="folder.name" class="vaunch-folder vaunch-window">
    <span class="folder-title">
      <i class="fa-solid fa-folder"></i><span class="folder-name">{{ folder.name }}</span>
    </span>
    <div v-if="folder.getFiles().length > 0" class="file-container">
      <div v-for="file in folder.getFiles()" :key="file.fileName" class="file vaunch-window" @click="file.execute()" :id="folder.name+'-'+file.prettyName()">
        <i :class="['fa-solid', 'fa-' + file.icon]"></i>
        <span class="file-name">{{ file.displayName() }}</span>
        <VaunchTooltip :tip-for="folder.name+'-'+file.prettyName()" :tip-content="file.getContent()"/>
      </div>
    </div>
  </div>
</div>
</template>