<script lang="ts">
import { defineComponent } from "vue";
import { useFolderStore } from "@/stores/folder";

export default defineComponent({
  name: "VaunchGui",
  setup() {
    const folders = useFolderStore();
    return {
      folders,
    }
  }
});
</script>

<style scoped>
#vaunch-folder-container {
  position: relative;
  display: flex;
  width: 70vw;
  height: 65vh;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1em;
  font-size: 2rem;
  align-items: center;
  overflow-y: auto;
}

.vaunch-folder {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  width: 30%;
  height: 45%;
}

.folder-title {
  position: relative;
  width: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.1);
  /* border-radius: 5px; */
  border-radius: 5px 5px 0 0 ;
}
</style>

<template>
<div id="vaunch-folder-container" class="vaunch-window">
  <div v-for="folder in folders.items" :key="folder.name" class="vaunch-folder vaunch-window">
    <span class="folder-title">{{ folder.name }}</span>
    <div v-if="folder.getFiles().length > 0">
      <div v-for="file in folder.getFiles()" :key="file.fileName">
        {{ file.fileName }}
      </div>
    </div>
  </div>
</div>
</template>