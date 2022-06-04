<script lang="ts">
import { defineComponent } from "vue";
import { useConfigStore } from "@/stores/config";
import { extend } from "@vue/shared";

import VaunchGuiFile from "./VaunchGuiFile.vue";
import { VaunchFolder } from "@/models/VaunchFolder";

export default defineComponent({
    name: "VaunchGuiFolder",
    setup() {
        // Load config store to get Vaunch configuration options
        const config = useConfigStore();
        return {
            config,
        };
    },
    props: {
      folder: {type: extend(VaunchFolder)},
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

<style scoped>
.vaunch-folder {
  display: flex;
  flex-direction: column;
  margin: 0.75rem;
  min-width: 20vw;
  max-width: 30vw;
  height: 27.5vh;
  backdrop-filter: unset !important;
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
  <div class="vaunch-folder vaunch-window">
    <span class="folder-title">
      <i :class="['fa-'+folder.iconClass, 'fa-'+folder.icon]"></i>
      <span v-if="config.titleCase">{{ folder.titleCase() }}</span>
      <span v-if="!config.titleCase">{{ folder.name }}</span>
    </span>
    <div v-if="folder.getFiles().length > 0" class="file-container">
      <VaunchGuiFile v-on:set-input="passInput" v-for="file in folder.getFiles()" :file="file" :parent-folder-name="folder.name" />
    </div>
  </div>
</template>