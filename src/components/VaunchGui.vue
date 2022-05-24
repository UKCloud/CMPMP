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
  width: 70vw;
  height: 65vh;
}
</style>

<template>
<div id="vaunch-folder-container" class="vaunch-window">
  <div v-for="folder in folders.items" :key="folder.name">
    {{ folder.name }}
  </div>
</div>
</template>