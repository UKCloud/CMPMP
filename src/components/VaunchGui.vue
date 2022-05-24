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

<template>
<div class="vaunch-window">
  <div v-for="folder in folders.items" :key="folder.name">
    {{ folder.name }}
  </div>
</div>
</template>